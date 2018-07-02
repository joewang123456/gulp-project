var gulp = require('gulp');
var glob = require('glob');
var es = require('event-stream');
var clean = require('gulp-clean');
var inject = require('gulp-inject');
var connect = require('gulp-connect');
var proxy = require('http-proxy-middleware');
var watch = require('gulp-watch');
var styleTask = require('./config/styleTask.js');
var scriptTask = require('./config/scriptTask.js');
var Util = require('./config/util.js');
var {
    buildPath,
    srcPath,
    port,
    host
} = require('./config/constant.js');
//图片处理
var imageTask = require('./config/imageTask.js');
imageTask(gulp);

//scss处理对象创建
styleTask = new styleTask(gulp);
//注册style任务
gulp.task('comiple:scss', [], function () {
    return styleTask.getAllScssStream();
});

//js处理对象
scriptTask = new scriptTask(gulp);
gulp.task('comiple:js', [], function () {
    return scriptTask.getAllJsStream();
});

gulp.task('clean:build', function () {
    return gulp.src(buildPath)
        .pipe(clean({
            force: true
        }));
});

//js,css文件注入到html
gulp.task('inject', ['comiple:js', 'comiple:scss', 'images'], function () {
    var files = glob.sync(`${srcPath}pages/*.html`);
    var stream = files.map((file) => {
        let target = gulp.src(file);
        let fileName = Util.getFileName(file);
        let sources = gulp.src([
            `${buildPath}js/libs.js`,
            `${buildPath}js/${fileName}.js`,
            `${buildPath}css/common.css`,
            `${buildPath}css/${fileName}.css`
        ], {
            read: false
        });
        return target.pipe(inject(sources, {
                ignorePath: 'build'
            }))
            .pipe(gulp.dest(`${buildPath}pages`));
    });
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