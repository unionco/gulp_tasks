var gulp = require('gulp');
var notify = require('gulp-notify');
var imagemin = require('gulp-imagemin');
var tasks = require('./manifest');

var config = module.exports = {
    srcDir: tasks.config.resourceDir + 'img/',
    output: tasks.config.publicDir + 'img/',
    settings: {
        svgoPlugins: [
            { removeAttrs: false },
            { removeUselessDefs: false }
        ]
    }
};

function compile(src) {
    return gulp.src(src, {base: config.srcDir})
        .pipe(imagemin(config.settings))
        .pipe(notify({
            title: tasks.config.name,
            message: 'Images compiled',
            icon: tasks.config.icon,
            onLast: true
        }))
        .pipe(gulp.dest(config.output));
}

gulp.task('images', function() {
    compile(config.srcDir + '**/*.{gif,jpg,png,svg}');
});

gulp.task('images:watch', function() {
    gulp.watch(config.srcDir + '**/*', function(file) {
        if (file) {
            compile(file.path);
        }
    });
});

tasks.default.push('images');
tasks.watch.push('images:watch');
