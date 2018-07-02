var gulp = require('gulp');
var glob = require('glob');
var es = require('event-stream');
var clean = require('gulp-clean');
var connect = require('gulp-connect');
var Util = require('./config/util.js');
var {
    buildPath,
    srcPath,
    port,
    host
} = require('./config/constant.js');

//style处理
var styleTask = require('./config/styleTask.js');
styleTask = new styleTask(gulp);
gulp.task('comiple:scss', [], function () {
    return styleTask.getAllScssStream();
});

//js处理
var scriptTask = require('./config/scriptTask.js');
scriptTask = new scriptTask(gulp);
gulp.task('comiple:js', [], function () {
    return scriptTask.getAllJsStream();
});

//图片处理
var imageTask = require('./config/imageTask.js');
imageTask(gulp);

//html处理
var injectTask = require('./config/injectTask.js');
injectTask = injectTask(gulp);

//删除build目录
gulp.task('clean:build', function () {
    return gulp.src(buildPath)
        .pipe(clean({
            force: true
        }));
});

gulp.task('inject', ['comiple:js', 'comiple:scss', 'images'], function () {
    var stream = injectTask.injectFun(glob.sync(`${srcPath}pages/*.html`));
    return es.merge.apply(es, stream);
});

gulp.task('serve', ['inject'], function () {
    connect.server({
        root: [buildPath],
        port: port,
        livereload: true,
        middleware: function (connect, opt) {
            return Util.getProxies();
        }
    });
});

gulp.task('default', ['clean:build'], function () {
    gulp.start('serve');
});