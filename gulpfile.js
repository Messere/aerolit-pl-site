const gulp = require("gulp");
const browserify = require("browserify");
const source = require("vinyl-source-stream");
const tsify = require("tsify");

const exorcist = require("exorcist");
const path = require("path");

const paths = {
    pages: ["src/Web/*.html"],
    destinationDir: "dist",
    entryPoint: "src/Web/Bootstrap.ts"
};

gulp.task("copy-html", function () {
    return gulp.src(paths.pages)
        .pipe(gulp.dest(paths.destinationDir));
});

gulp.task("default", ["copy-html"], function () {
    return browserify({
        basedir: ".",
        debug: true,
        entries: [paths.entryPoint],
        cache: {},
        packageCache: {}
    })
    .plugin(tsify)
    .transform('uglifyify')
    .bundle()
    .pipe(exorcist(path.join(paths.destinationDir, "bundle.js.map")))
    .pipe(source("bundle.js"))
    .pipe(gulp.dest(paths.destinationDir));
});
