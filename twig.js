var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var tasks = require('./manifest');

var config = {
    src: ['assets/templates/**/*.twig', '!assets/templates/**/_*.twig'],
    watch: 'assets/templates/**/*',
    output: 'public/builds',
    settings: {}
};

gulp.task('twig', function() {
    return gulp.src(config.src)
        .pipe($.twig(config.settings))
        .pipe(gulp.dest(config.output));
});

gulp.task('twig:watch', ['twig'], function() {
    gulp.watch(config.watch, ['twig'])
});

tasks.default.push('twig');
tasks.watch.push('twig:watch');
