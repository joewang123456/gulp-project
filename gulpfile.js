var gulp = require('gulp');
var glob = require('glob');
var es = require('event-stream');
var clean = require('gulp-clean');
var connect = require('gulp-connect');
var spritesmith = require('gulp.spritesmith');
var buffer = require('vinyl-buffer');
var imagemin = require('gulp-imagemin');
var csso = require('gulp-csso');
var merge = require('merge-stream');
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

/**
 * 图片精灵合成css样式生成
 */
gulp.task('sprits:clean', function () {
    return gulp.src(`${buildPath}sprits/`)
        .pipe(clean({
            force: true
        }));
});
gulp.task('imageSprit', ['sprits:clean'], function () {
    function zoom(str) {
        return str.replace(/(\d+)/g, (m) => {
            return m / 2;
        })
    };
    let styleFormatType = 'css';
    var spriteData = gulp.src(srcPath + 'images/sprits/*.png') //需要合并的图片地址
        .pipe(spritesmith({
            imgName: 'sprite.png',
            cssName: `sprite.${styleFormatType}`,
            padding: 10, //合并时两个图片的间距
            imgPath: '../../images/sprite/sprite.png', //css中url中引用的地址
            algorithm: 'binary-tree',
            cssFormat: 'css',
            //模板字符串函数
            // cssTemplate: (data) => {
            //     // data为对象，保存合成前小图和合成打大图的信息包括小图在大图之中的信息
            //     let arr = [],
            //         width = data.spritesheet.px.width,
            //         height = data.spritesheet.px.height,
            //         url = data.spritesheet.image
            //     // console.log(data)
            //     data.sprites.forEach(function (sprite) {
            //         arr.push(
            //             ".icon-" + sprite.name +
            //             "{" +
            //             "background: url('" + url + "') " +
            //             "no-repeat " +
            //             sprite.px.offset_x + " " + sprite.px.offset_y + ";" +
            //             "background-size: " + width + " " + height + ";" +
            //             "width: " + sprite.px.width + ";" +
            //             "height: " + sprite.px.height + ";" +
            //             "}\n"
            //         )
            //     })
            //     // return "@fs:108rem;\n"+arr.join("")
            //     return arr.join("")
            // }
            //模板字符串文件
            cssTemplate: `${srcPath}images/sprits/${styleFormatType}.template.handlebars`,
            //2倍图片路径
            // retinaSrcFilter: [srcPath + '/sprite/images/2x/*@2x.png'],
            //2倍图片名称
            // retinaImgName: 'sprite@2x.png',

        }))

    var imgStream = spriteData.img
        .pipe(buffer())
        .pipe(imagemin())
        .pipe(gulp.dest(buildPath + 'sprits'));

    // Pipe CSS stream through CSS optimizer and onto disk
    var cssStream = spriteData.css
        // .pipe(csso())
        .pipe(gulp.dest(buildPath + '/sprits'));

    // Return a merged stream to handle both `end` events
    return merge(imgStream, cssStream);
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