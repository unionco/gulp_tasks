var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync');
var cssnano = require('gulp-cssnano');
var gulp = require('gulp');
var notify = require('gulp-notify');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var tasks = require('./manifest');

var config = module.exports = {
    srcDir: tasks.config.resourceDir + 'sass/',
    output: tasks.config.publicDir + 'css/',
    settings: {}
};

gulp.task('styles', function() {
    return gulp.src(config.srcDir + '**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass(config.settings))
        .pipe(autoprefixer({
            browsers: ['last 2 versions']
        }))
        .pipe(cssnano())
        .pipe(sourcemaps.write('.'))
        .pipe(browserSync.stream({match: '**/*.css'}))
        .pipe(notify({
            title: tasks.config.name,
            message: "Sass compiled",
            icon: tasks.config.icon,
            onLast: true
        }))
        .pipe(gulp.dest(config.output));
});

gulp.task('styles:watch', ['styles'], function() {
    gulp.watch(config.srcDir + '**/*.scss', ['styles'])
});

tasks.default.push('styles');
tasks.watch.push('styles:watch');
