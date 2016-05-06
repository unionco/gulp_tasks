var browserSync = require('browser-sync');
var gulp = require('gulp');
var autoprefixer = require('gulp-autoprefixer');
var cssnano = require('gulp-cssnano');
var notify = require('gulp-notify');
var postcss = require('gulp-postcss');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var reporter = require('postcss-reporter');
var scss = require('postcss-scss');
var stylelint = require("stylelint");
var tasks = require('./manifest');

var config = module.exports = {
    srcDir: tasks.config.resourceDir + 'sass/',
    output: tasks.config.publicDir + 'css/',
    linting: {
        extends: 'stylelint-config-standard',
        rules: {
            'at-rule-empty-line-before': [ 'always', {
                except: [ 'blockless-group', 'first-nested' ],
                ignore: [ 'after-comment', 'all-nested' ]
            } ],
            'block-closing-brace-newline-after': 'always',
            'block-closing-brace-newline-before': 'always-multi-line',
            'block-opening-brace-newline-after': 'always-multi-line',
            'block-opening-brace-space-after': 'always-single-line',
            'block-opening-brace-space-before': 'always',
            'color-no-invalid-hex': true,
            'declaration-block-no-duplicate-properties': [ true, {
                ignore: [ 'consecutive-duplicates' ]
            } ],
            'declaration-block-no-ignored-properties': true,
            'declaration-block-properties-order': 'alphabetical',
            'indentation': 4,
            'max-nesting-depth': 3,
            'number-max-precision': 4,
            'number-zero-length-no-unit': true,
        }
    }
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

function lint(src) {
    return gulp.src(src)
        .pipe(
            postcss([
                stylelint(config.linting),
                reporter({
                    clearMessages: true
                })
            ], {
                syntax: scss
            })
        );
}

gulp.task('styles:lint', function() {
    lint([config.srcDir + '**/*.scss', '!' + config.srcDir + '_templates/*']);
});

gulp.task('styles:watch', ['styles:lint', 'styles'], function() {
    gulp.watch(config.srcDir + '**/*.scss', ['styles'])
        .on('change', function(file) {
            if (file && file.path && file.type === 'changed') {
                lint(file.path);
            }
        });
});

tasks.default.push('styles');
tasks.lint.push('styles:lint');
tasks.watch.push('styles:watch');
