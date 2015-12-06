// 各种配置及开关
module.exports = {
    // 项目名称
    name: 'jfk project',
    // 项目版本号
    version: '0.0.1',
    // 是否将静态资源进行combo合并
    combo: false,
    // 是否开启cdn
    cdn: false,
    // cdn前缀地址
    cdnUrl: '',
    // 是否开启md5后缀
    useHash: false,
    // 模块化加载器[requirejs|seajs|modjs]
    loader: '',
    // 打包开关，默认为false
    // 可以手动设置为true，也可以fk release -p设置为true
    packed: false,
    // 打包配置，默认为null无打包配置
    // media('dev')环境只在config.packed为true时打包
    // 其它media默认打包
    // @example
    //   {
    //     '/widget/**.css': {
    //       packTo: '/widget/widget_pkg.css'
    //     }
    //   }
    package: null
};