var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var browserSync = require('browser-sync');
var tasks = require('./manifest');

var config =  {
    src: ['assets/sass/**/*.scss'],
    output: 'public/css',
    settings: {}
};

gulp.task('sass', function() {
    return gulp.src(config.src)
        .pipe($.sourcemaps.init())
        .pipe($.sass(config.settings))
        .pipe($.autoprefixer())
        .pipe($.cssnano())
        .pipe($.sourcemaps.write('.'))
        .pipe(browserSync.stream({match: '**/*.css'}))
        .pipe(gulp.dest(config.output));
});

gulp.task('sass:watch', ['sass'], function() {
    gulp.watch(config.src, ['sass'])
});

tasks.default.push('sass');
tasks.watch.push('sass:watch');
