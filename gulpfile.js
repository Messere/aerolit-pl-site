var gulp = require("gulp");
var browserify = require("browserify");
var source = require('vinyl-source-stream');
var tsify = require("tsify");
var destinationDir = "dist";
var exorcist = require('exorcist');
var path = require('path');

var paths = {
    pages: ['src/Web/*.html']
};

gulp.task("copy-html", function () {
    return gulp.src(paths.pages)
        .pipe(gulp.dest(destinationDir));
});

gulp.task("default", ["copy-html"], function () {
    return browserify({
        basedir: '.',
        debug: true,
        entries: ['src/Web/bootstrap.ts'],
        cache: {},
        packageCache: {}
    })
    .plugin(tsify)
    .bundle()
    .pipe(exorcist(path.join(destinationDir, 'bundle.js.map')))
    .pipe(source('bundle.js'))
    .pipe(gulp.dest(destinationDir));
});
