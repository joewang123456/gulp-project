1. npm init -y
2. npm install --global gulp
3. npm install --save-dev gulp
4. 在项目根目录下创建一个名为 gulpfile.js 的文件
5. babel转义
    npm install --save-dev gulp-babel babel-core babel-preset-env
    const gulp = require('gulp');
    const babel = require('gulp-babel');
    gulp.task('default', () =>
        gulp.src('src/app.js')
            .pipe(babel({
                presets: ['env']
            }))
            .pipe(gulp.dest('dist'))
    );
    //ES7相关插件安装
    1. 支持生成器
        npm install --save-dev babel-plugin-transform-runtime
        babel({
            presets: ['env'],
            plugins: ['transform-runtime']
        })
    2. 类的转义,比如类中属性定义语法等
        npm install --save-dev babel-plugin-transform-class-properties
        "plugins": [
            ["transform-class-properties", { "spec": true }]
        ]
    3. 支持类定义和装饰器定义
        npm install --save-dev babel-plugin-transform-decorators-legacy
        babel({
            presets: ['env'],
            "plugins": ["transform-decorators-legacy"]
        })
        //注意transform-class-properties一定要放在transform-decorators-legacy前
    ...其他插件

    综上所述，babel转义配置项如下：
    babel({
        presets: ['env'],
        "plugins": [
            "transform-decorators-legacy",
            ["transform-class-properties", { "spec": true }],
            ["transform-runtime", {
                "helpers": false, 
                "polyfill": false, 
                "regenerator": true, 
                "moduleName": "babel-runtime"
            }
            ]
        ]
    })
    或者在.babelrc文件中配置如下：
    {
        "presets": ["env"],
        "plugins": [
            ["transform-class-properties", { "spec": true }],
            "transform-decorators-legacy",
            ["transform-runtime", {
                "helpers": false, 
                "polyfill": false, 
                "regenerator": true, 
                "moduleName": "babel-runtime"
            }
            ]
        ]
    }
     