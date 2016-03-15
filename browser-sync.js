var gulp = require('gulp');
var browserSync = require('browser-sync');
var tasks = require('./manifest');

var config = module.exports = {
    src: [
        'craft/templates/**/*.twig',
        tasks.config.publicDir + '**/*',
        '!' + tasks.config.publicDir + '**/*.css',
        '!' + tasks.config.publicDir + '**/*.map'
    ],
    settings: {
        proxy: tasks.config.domain,
        reloadDebounce: 2000,
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
