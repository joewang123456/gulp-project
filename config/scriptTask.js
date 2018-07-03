var es = require('event-stream');
var connect = require('gulp-connect');
var concat = require('gulp-concat');
const babel = require('gulp-babel');
var uglify = require('gulp-uglify');
var gutil = require('gulp-util');
var watch = require('gulp-watch');
var buildPath = './build/';
var srcPath = './src/';

var scriptTask = function (gulp) {
    this.gulp = gulp;
    this.libPath = [
        `${srcPath}js/lib/*.js` //这样处理的前提，是每个js之间不会有依赖关系，如果存在依赖关系，要按顺序合并
    ]
    //将处理lib目录的js之外全部编译到build/js下
    this.jsPath = [
        `${srcPath}js/**`, `!${srcPath}js/lib`, `!${srcPath}js/lib/**`
    ]
    this.watchPath = `${srcPath}js/**/**`;
    this.watch();
}

scriptTask.prototype.compileJs = function (path, mergeName, reCompile) {
    //获取js后目录名称,处理多目录js的生成路径
    var folder = /js(\/.*)\//g.exec(path[0]);
    var stream = this.gulp.src(path)
    if (mergeName) {
        stream = stream.pipe(concat('libs.js')) //合并到index.js文件中
    }
    stream.pipe(babel())
        .pipe(uglify()) //压缩
        .on('error', function (err) {
            gutil.log(gutil.colors.red('[Error]'), err.toString());
        })
        .pipe(this.gulp.dest(`${buildPath}js${(folder&&folder[1]!=='/lib')?folder[1]:''}`)) //输出
    if (reCompile) {
        stream = stream.pipe(connect.reload());
    }
    return stream;
}

scriptTask.prototype.getLibJsStream = function () {
    return this.compileJs(this.libPath, 'libs.js');
}

scriptTask.prototype.getJsStream = function () {
    return this.compileJs(this.jsPath);
}

scriptTask.prototype.getAllJsStream = function () {
    return es.merge.apply(es, [this.getLibJsStream(), this.getJsStream()]);
}

scriptTask.prototype.reCompileLibJs = function () {
    return this.compileJs(this.libPath, 'libs.js', true);
}

scriptTask.prototype.reCompileJs = function (path) {
    path = path || this.jsPath;
    return this.compileJs(path, null, true);
}

scriptTask.prototype.watch = function () {
    return watch(this.watchPath, (event) => {
        var filePath = event['history'];
        console.log(`${filePath} ${event.event}`);
        if (/js\/lib/.test(filePath)) {
            this.reCompileLibJs();
        } else {
            this.reCompileJs(filePath);
        }
    });
}

module.exports = scriptTask;