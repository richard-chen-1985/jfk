var path = require('path');

// 扩展fis的一些基础事情
var jfk = module.exports = require('fis3');
jfk.require.prefixes.unshift('jfk');
jfk.configName = 'jfk-conf';
jfk.cli.name = 'jfk';
jfk.cli.info = require('./package.json');
jfk.cli.version = require('./lib/logo');

// alias
Object.defineProperty(global, 'jfk', {
    enumerable: true,
    writable: false,
    value: jfk
});

// 添加全局忽略
jfk.set('project.ignore', jfk.get('project.ignore').concat(['{README,readme}.md', 'jfk-conf.js', '*.iml', '_docs/**']));

// 默认捆绑 jfk 的服务器。
// fis3 server start 可以不指定 type.
jfk.set('server.type', 'jfk');

// 获取用户当前的media
var currentMedia;

jfk.init = function(cfg, callback) {
    // 读取默认配置文件
    var config = require('./lib/config');

    currentMedia = jfk.project.currentMedia();

    // 合并传入配置
    jfk.util.merge(config, cfg);

    initDefault(config);

    initGlobal(config);

    initPackage(config);

    initMapJson(config);

    initProd(config);

    callback && callback(config);
};

// 默认配置
function initDefault(config) {
    // 读取release额外参数
    config.cdn = jfk.get('--domain') ? true : config.cdn;
    config.packed = jfk.get('--pack') ? true : config.packed;

    jfk.set('namespace', '');
    // 静态资源目录与版本号绑定
    jfk.set('statics', '/static' + (!!config.version ? '/' + config.version : ''));
    // 模板文件目录
    jfk.set('templates', !!config.templates ? config.templates : '/WEB-INF/views');

    // 开启模块化插件
    switch(config.loader) {
        case 'requirejs':
            jfk.hook('amd');
            break;
        case 'seajs':
            jfk.hook('cmd');
            break;
        case 'modjs':
            jfk.hook('commonjs');
            break;
    }
}

// 全局配置
function initGlobal(config) {
    // 默认配置
    jfk
        // 以下划线开头的不发布
        .match('**/_*', {
            release: false
        }, true)

        // 脚本也是。
        .match('**.{sh,bat}', {
            release: false
        })

        // 开发环境，cdn可配置开关
        .match('*', {
            domain: currentMedia === 'prod' ? config.cdnUrl : (config.cdn ? config.cdnUrl : '')
        })
        .match('*.{vm,html}', {
            domain: ''
        })

        // 静态资源加md5
        .match('*.{css,scss,js,png,jpg,gif}', {
            useHash: config.useHash
        })

        // 对 sass 文件支持
        .match('*.{sass,scss}', {
            parser: fis.plugin('sass', {
                outputStyle: 'expanded'
            }),
            rExt: '.css'
        })

        // 对 vm 进行语言识别
        .match('*.vm', {
            preprocessor: fis.plugin('extlang')
        })

        // 所有文件默认放 static 目录下面。
        // 后续会针对部分文件覆盖此配置。
        .match('**', {
            release: '${statics}/${namespace}/$0'
        })

        // static 下面的文件直接发布到 $statics 目录。
        // 为了不多一层目录 static。
        .match('/static/(**)', {
            release: '${statics}/${namespace}/$1'
        })

        // 标记 page 和 widget 目录下面的 js 都是模块。
        .match('/{page,widget}/**.js', {
            isMod: true
        })

        // test 目录原封不动发过去。
        .match('/test/(**)', {
            release: '/test/${namespace}/$1',
            isMod: false,
            useCompile: false
        })

        .match('/widget/**.{jsp,vm,html}', {
            url: '$0',
            release: '${templates}/${namespace}/$0',
            isMod: true
        })

        .match('/page/**.{jsp,vm,html}', {
            isMod: true,
            url: '$0',
            release: '${templates}/${namespace}/$0',
            extras: {
                isPage: true
            }
        })

        .match('{map.json,${namespace}-map.json}', {
            release: '/WEB-INF/config/$0'
        })

        // 注意这类文件在多个项目中都有的话，会被最后一次 release 的覆盖。
        .match('{fis.properties,server.conf}', {
            release: '/WEB-INF/$0'
        })
        .match('server.conf', {
            release: '/WEB-INF/server${namespace}.conf'
        })
        .match('VM_global_library.vm', {
            release: '/${templates}/VM_global_library.vm'
        })
}

// 配置打包规则
function initPackage(config) {
    // 打包配置，默认为null无打包配置
    // media('dev')环境只在config.packed为true时打包
    // media('prod')默认打包
    // @example
    //   {
    //     '/widget/**.css': {
    //       packTo: '/widget/widget_pkg.css'
    //     }
    //   }
    config.package && (function(packConfig) {
        if(currentMedia === 'prod' || config.packed) {
            for(kv in packConfig) {
                jfk.match(kv, packConfig[kv]);
            }
        }
    })(config.package);
}

// 产出map.json
function initMapJson(config) {
    jfk
        // 自动产出 map.json
        .match('::package', {
            postpackager: function(ret) {
                var util = jfk.util;
                var root = jfk.project.getProjectPath();
                var ns = jfk.get('namespace');
                var mapFile = ns ? (ns + '-map.json') : 'map.json';
                var map = jfk.file.wrap(path.join(root, mapFile));
                var mapContent = {
                    name: config.name,
                    version: config.version,
                    combo: config.combo,
                    cdnUrl: currentMedia === 'prod' ? config.cdnUrl : (config.cdn ? config.cdnUrl : ''),
                    loader: config.loader,
                };
                util.merge(mapContent, ret.map);
                map.setContent(JSON.stringify(mapContent, null, map.optimizer ? null : 4));
                ret.pkg[map.subpath] = map;
            }
        });
}

// 在 prod 环境下，开启各种压缩和打包。
function initProd(config) {
    jfk
        .media('prod')

        // 各种压缩
        .match('*.{js,vm:js,html:js}', {
            optimizer: fis.plugin('uglify-js')
        })
        .match('*.{scss,css,vm:css,vm:scss,html:css,html:scss}', {
            optimizer: fis.plugin('clean-css')
        })
        .match('*.png', {
            optimizer: fis.plugin('png-compressor')
        })
}