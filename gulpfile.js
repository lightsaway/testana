'use strict';

const documentation = require('./build/documentation');
const instrument = require('./build/instrument-coverage');
const lint = require('./build/lint');
const lintTests = require('./build/lint-tests');
const test = require('./build/test.js');
const gulp = require('gulp');

gulp.task('docs', documentation);
gulp.task('lint-lib', lint);
gulp.task('lint-tests', lintTests);
gulp.task('lint', ['lint-lib', 'lint-tests']);
gulp.task('instrument-coverage', instrument);
gulp.task('test', ['instrument-coverage'], test);
gulp.task('default', ['docs', 'lint', 'test']);