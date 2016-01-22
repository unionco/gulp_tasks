var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var tasks = require('./manifest');

var config = {
    src: ['assets/img/**/*'],
    output: 'public/img',
    settings: {
        svgoPlugins: [{
            removeUselessDefs: false
        }]
    }
};

function compile(src) {
    return gulp.src(src, {base: 'assets/img'})
        .pipe($.imagemin(config.settings))
        .pipe(gulp.dest(config.output));
}

gulp.task('images', function() {
    return compile(config.src);
});

gulp.task('images:watch', ['images'], function() {
    gulp.watch(config.src).on('change', function(file) {
        compile(file.path);
    });
});

tasks.default.push('images');
tasks.watch.push('images:watch');
