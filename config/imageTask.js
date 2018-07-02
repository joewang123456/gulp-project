var clean = require('gulp-clean');
var watch = require('gulp-watch');
var connect = require('gulp-connect');
var {
    buildPath,
    srcPath,
    port,
    host
} = require('./constant.js');
var Util = require('./util.js');

module.exports = function (gulp) {
    gulp.task('images', function () {
        return gulp.src(`${srcPath}images/**`)
            .pipe(gulp.dest(`${buildPath}images`))
    });

    watch(`${srcPath}images/**`, (event) => {
        var filePath = event['history'];
        console.log(`${filePath} ${event.event}`);
        var deleteFilePath = filePath.map((file) => {
            return `${buildPath}images/${Util.getFile(file)}`
        });
        console.log(deleteFilePath);
        if (event.event === 'unlink') {
            gulp.src(deleteFilePath)
                .pipe(clean({
                    force: true,
                    read: false
                })).pipe(connect.reload());
        }
        if (event.event === 'add') {
            gulp.src(filePath)
                .pipe(gulp.dest(`${buildPath}images`))
                .pipe(connect.reload());
        }
    });
}