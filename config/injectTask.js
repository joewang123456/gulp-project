var inject = require('gulp-inject');
var es = require('event-stream');
var glob = require('glob');
var connect = require('gulp-connect');
var watch = require('gulp-watch');
var {
    buildPath,
    srcPath,
    port,
    host
} = require('./constant.js');
var Util = require('./util.js');
module.exports = function (gulp, deps) {
    function injectFun(srcPath, reInject) {
        var stream = srcPath.map((file) => {
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
            target = target.pipe(inject(sources, {
                    ignorePath: 'build'
                }))
                .pipe(gulp.dest(`${buildPath}pages`));
            if (reInject) {
                target = target.pipe(connect.reload());
            }
            return target;
        });
        return stream;
    }

    watch(`${srcPath}pages/**`, (event) => {
        var filePath = event['history'];
        console.log(`${filePath} ${event.event}`);
        injectFun(filePath, true);
    });

    return {
        injectFun
    };
}