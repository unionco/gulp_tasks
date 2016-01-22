var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var tasks = require('./manifest');

var config = {
    src: ['assets/img/icons/*.svg'],
    output: 'public/img',
    settings: {
        min: {
            plugins: [{
                removeAttrs: {
                    attrs: '(id|class)'
                }
            }, {
                removeStyleElement: true
            }, {
                collapseGroups: true
            }]
        },
        store: {
            inlineSvg: true
        }
    }
};

gulp.task('icons', function() {
    return gulp.src(config.src)
        .pipe($.svgmin(config.settings.min))
        .pipe($.svgstore(config.settings.store))
        .pipe(gulp.dest(config.output));
});

gulp.task('icons:watch', ['icons'], function() {
    gulp.watch(config.src, ['icons']);
});

tasks.default.push('icons');
tasks.watch.push('icons:watch');
