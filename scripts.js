var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var watchify = require('watchify');
var tasks = require('./manifest');

var config = {
    src: 'assets/js/app.js',
    output: 'public/js'
};

var bundler;
function compile(watch) {
    if (bundler) return;
    bundler = browserify(config.src, { debug: true }).transform("babelify", {presets: ["es2015", "react"]});

    function rebundle() {
        bundler.bundle()
            .on('error', function(err) { console.error(err); this.emit('end'); })
            .pipe(source('app.js'))
            .pipe(buffer())
            .pipe($.sourcemaps.init({ loadMaps: true }))
            .pipe($.sourcemaps.write('.'))
            .pipe(gulp.dest(config.output))
            .pipe($.filter('**/*.js'))
            .pipe($.uglify())
            .pipe($.rename(function(path) {
                path.basename += '-min';
            }))
            .pipe($.notify({
                title: tasks.config.name,
                message: "Javascript compiled",
                icon: tasks.config.icon,
                onLast: true
            }))
            .pipe(gulp.dest(config.output));
    }

    if (watch) {
        watchify(bundler).on('update', function() {
            console.log('-> bundling...');
            rebundle();
        });
    }

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
