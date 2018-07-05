/**
 * 自定义兼容性处理
 */
//IE不支持for ...of...遍历
//promise不兼容，通过引入bluebird.js文件兼容

//Array.include做兼容性处理
if (!Array.prototype.includes) {
    Array.prototype.includes = function (value) {
        var result = false;
        for (var i = 0; i < this.length; i++) {
            if (this[i] === value) {
                result = true;
                break;
            }
        }
        return result;
    }
}