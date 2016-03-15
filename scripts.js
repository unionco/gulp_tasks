var browserify = require('browserify');
var buffer = require('vinyl-buffer');
var filter = require('gulp-filter');
var gulp = require('gulp');
var notify = require('gulp-notify');
var rename = require('gulp-rename');
var source = require('vinyl-source-stream');
var sourcemaps = require('gulp-sourcemaps');
var tasks = require('./manifest');
var uglify = require('gulp-uglify');
var watchify = require('watchify');

var config = module.exports = {
    srcDir: tasks.config.resourceDir + 'js/',
    output: tasks.config.publicDir + 'js/',
    rootFile: 'app.js'
};

var bundleExec;

function compile(watch) {
    var bundler = browserify(config.srcDir + config.rootFile, { debug: true })
        .transform("babelify", { presets: ["es2015", "react"] })
        .transform('browserify-shim', { global: true });

    function rebundle() {
        bundler.bundle()
            .on('error', function (err) {
                console.error(err);
                this.emit('end');
            })
            .pipe(source(config.rootFile))
            .pipe(buffer())
            .pipe(sourcemaps.init({loadMaps: true}))
            .pipe(sourcemaps.write('.'))
            .pipe(gulp.dest(config.output))
            .pipe(filter('**/*.js'))
            .pipe(uglify())
            .pipe(rename(function (path) {
                path.basename += '-min';
            }))
            .pipe(notify({
                title: tasks.config.name,
                message: function() {
                    var diff = process.hrtime(bundleExec);
                    var diffMs = diff[0] * 1000 + Math.round(diff[1] / 1000000);
                    return 'Javascript compiled after ' + diffMs + 'ms';
                },
                icon: tasks.config.icon,
                onLast: true
            }))
            .pipe(gulp.dest(config.output));
    }

    if (watch) {
        watchify(bundler).on('update', function() {
            bundleExec = process.hrtime();
            console.log('[%s] Starting \'scripts\'...', new Date().toLocaleTimeString().substr(0, 8));
            rebundle();
        });
    }

    bundleExec = process.hrtime();
    rebundle();
}

gulp.task('scripts', function() {
    compile();
});

gulp.task('scripts:watch', function() {
    compile(true);
});

tasks.default.push('scripts');
tasks.watch.push('scripts:watch');
