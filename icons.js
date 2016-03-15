var gulp = require('gulp');
var svgmin = require('gulp-svgmin');
var svgstore = require('gulp-svgstore');
var tasks = require('./manifest');

var config = module.exports = {
    srcDir: tasks.config.resourceDir + 'img/icons/',
    output: tasks.config.publicDir + 'img/',
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
    return gulp.src(config.srcDir + '*.svg')
        .pipe(svgmin(config.settings.min))
        .pipe(svgstore(config.settings.store))
        .pipe(gulp.dest(config.output));
});

gulp.task('icons:watch', ['icons'], function() {
    gulp.watch(config.srcDir + '*.svg', ['icons']);
});

tasks.default.push('icons');
tasks.watch.push('icons:watch');
