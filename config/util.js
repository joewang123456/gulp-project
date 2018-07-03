var {
    buildPath,
    srcPath,
    port,
    host
} = require('./constant.js');
var glob = require('glob');
var proxy = require('http-proxy-middleware');
var Util = {
    //通过路径获取文件名称
    getFileName: (filePath) => {
        var result = /\/([^\/]+)\./.exec(filePath || '');
        return result ? result[1] : null;
    },
    //获取文件类型
    getFileType: (filePath) => {
        var result = /\.(\w+)$/.exec(filePath || '');
        return result ? result[1] : null;
    },
    //获取文件名称和缀名
    getFile: function (filePath) {
        return this.getFileName(filePath) + '.' + this.getFileType(filePath);
    },
    getProxies: function () {
        //多入口文件映射
        var files = glob.sync(`${buildPath}pages/*.html`);
        var pageProxy = {};
        files.map((file) => {
            let fileName = this.getFileName(file);
            pageProxy[`^/proxyPage\/${fileName}.*`] = `/pages/${fileName}.html`;
        });
        return [
            //api代理
            proxy('/chat', {
                target: 'http://joe.test.ximalaya.com:8081',
                changeOrigin: true
            }),
            //页面重定向代理,次吃proxyPage不能设置为page或者pages，否则页面映射不成功
            proxy('/proxyPage', {
                target: `${host}:${port}`,
                changeOrigin: true,
                pathRewrite: pageProxy
            })
        ]
    }
}
module.exports = Util;