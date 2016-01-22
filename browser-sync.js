var gulp = require('gulp');
var browserSync = require('browser-sync');
var tasks = require('./manifest');

var config = module.exports.config = {
    src: [
        'craft/templates/**/*.twig',
        'public/img/**/*',
        'public/js/**/*'
    ],
    settings: {
        proxy: 'dev.caferio.com',
        open: false
    }
};

gulp.task('browserSync', function() {
    browserSync.init(config.settings);
    gulp.watch(config.src, ['browserSync:reload']);
});

gulp.task('browserSync:reload', function() {
    browserSync.reload();
});

tasks.watch.push('browserSync');
