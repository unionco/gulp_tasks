var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var browserSync = require('browser-sync');
var tasks = require('./manifest');

var config = {
    src: 'assets/sass/**/*.scss',
    output: 'public/css',
    settings: {}
};

gulp.task('styles', function() {
    return gulp.src(config.src)
        .pipe($.sourcemaps.init())
        .pipe($.sass(config.settings))
        .pipe($.autoprefixer())
        .pipe($.cssnano())
        .pipe($.sourcemaps.write('.'))
        .pipe(browserSync.stream({match: '**/*.css'}))
        .pipe($.notify({
            title: tasks.config.name,
            message: "Sass compiled",
            icon: tasks.config.icon,
            onLast: true
        }))
        .pipe(gulp.dest(config.output));
});

gulp.task('styles:watch', ['styles'], function() {
    gulp.watch(config.src, ['styles'])
});

tasks.default.push('styles');
tasks.watch.push('styles:watch');
