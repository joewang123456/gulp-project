'use strict';;
(function () {
    /**
     * 测试gulp-babel
     */
    let x = [1, 2, 3];
    let [y, ...z] = x;
    console.log(y, z);

    /**
     * 测试生成器转义 babel-plugin-transform-decorators-legacy
     */
    function decorateArmour(target, key, descriptor) {
        const method = descriptor.value;
        let moreDef = 100;
        let ret;
        descriptor.value = (...args) => {
            args[0] += moreDef;
            ret = method.apply(target, args);
            return ret;
        }
        return descriptor;
    }

    class Man {
        constructor(def = 2, atk = 3, hp = 3) {
            this.init(def, atk, hp);
        }

        @decorateArmour
        init(def, atk, hp) {
            this.def = def; // 防御值
            this.atk = atk; // 攻击力
            this.hp = hp; // 血量
        }
        toString() {
            return `防御力:$,攻击力:$,血量:$`;
        }
    }
    var tony = new Man();
    /************************************************************************* */

    /**
     * 测试babel-plugin-transform-class-properties插件转义
     */
    class Bork {
        //Property initializer syntax
        instanceProperty = "bork";
        boundFunction = () => {
            return this.instanceProperty;
        }

        //Static class properties
        static staticProperty = "babelIsCool";
        static staticFunction = function () {
            return Bork.staticProperty;
        }
    }
    /************************************************************************* */
})();