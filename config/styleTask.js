var sass = require('gulp-sass');
var concat = require('gulp-concat');
var es = require('event-stream');
var connect = require('gulp-connect');
var watch = require('gulp-watch');
var buildPath = './build/';
var srcPath = './src/';

function styleTask(gulp) {
    this.gulp = gulp;
    this.commonScssPath = [
        `${srcPath}style/common/reset.css`,
        `${srcPath}style/common/common.scss`
    ]
    this.scssPath = `${srcPath}style/*.scss`;
    this.watchPath = `${srcPath}style/**/**`;
    this.watch();
}

styleTask.prototype.compileScssTask = function (srcPath, mergeName, reCompile) {
    let stream = this.gulp.src(srcPath);
    //文件合并
    if (mergeName) {
        stream = stream.pipe(concat(mergeName))
    }
    stream = stream.pipe(sass()).pipe(this.gulp.dest(`${buildPath}css`));
    //重新编译
    if (stream) {
        stream = stream.pipe(connect.reload());
    }
    return stream;
}

styleTask.prototype.getCommonScssStream = function () {
    return this.compileScssTask(this.commonScssPath, 'common.css');
}

styleTask.prototype.getScssStream = function () {
    return this.compileScssTask(this.scssPath);
}

styleTask.prototype.getAllScssStream = function () {
    return es.merge.apply(es, [this.getCommonScssStream(), this.getScssStream()]);
}

styleTask.prototype.reCompileCommonScss = function () {
    this.compileScssTask(this.commonScssPath, 'common.css', true);
}

styleTask.prototype.reCompileScss = function (path) {
    this.compileScssTask(path, null, true);
}

styleTask.prototype.watch = function () {
    return watch(this.watchPath, (event) => {
        var filePath = event['history'];
        console.log(`${filePath} ${event.event}`);
        if (/style\/common/.test(filePath)) {
            this.reCompileCommonScss();
        } else {
            this.reCompileScss(filePath);
        }
    });
}

module.exports = styleTask;