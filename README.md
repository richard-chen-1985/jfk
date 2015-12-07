# jfk
front-end solution based on fis3 for java（基于FIS3的JAVA Velocity前端工程化解决方案）

# 使用方法
首先需要安装`nodejs`和`npm`，然后`npm install -g jfk`安装`jfk`工具。

* `jfk server start` 开启本地服务器
* `jfk release` 发布本地测试代码到本地服务器

查看本解决方案的demo请到[https://github.com/richard-chen-1985/jfk-demo](https://github.com/richard-chen-1985/jfk-demo)

# 1. 工程化目标
* 开发时
    * 组件化/模块化开发（分治）
    * 一行代码引用组件/模块（资源管理）
* 运行时
    * 按需加载
    * 请求合并
    * 首屏内嵌
    * CSS在头部，JS在尾部
    * 收集页面脚本置底

### 组件化/模块化开发

```
root
  └ widgets
    ├ header
    │  ├ header.js
    │  ├ header.css
    │  ├ header.html
    │  └ logo.png
    ├ tab
    ├ list
    └ footer
```

### 一句话引用组件/模块
* 前端模板：

```html
<!DOCTYPE html>
<html>
    <head>
        <!--STYLE_PLACEHOLDER-->
    </head>
    <body>
        <div class="main">
            #widget('header')
        </div>
        <!--SCRIPT_PLACEHOLDER-->
    </body>
</html>
```

* 服务器渲染过后：

```html
<!DOCTYPE html>
<html>
    <head>
        <link rel="stylesheet" href="/widgets/header/header.css">
    </head>
    <body>
        <div class="main">
            <div class="header">...</div>
        </div>
        <script src="/widgets/header/header.js"></script>
    </body>
</html>
```

### 按需加载

* 前端模板：

```html
<!DOCTYPE html>
<html>
    <head>
        <!--STYLE_PLACEHOLDER-->
    </head>
    <body>
        <div class="main">
            #widget('header')
            #widget('nav')
            #widget('list')
            #widget('footer')
        </div>
        <!--SCRIPT_PLACEHOLDER-->
    </body>
</html>
```

* 服务器渲染过后：

```html
<!DOCTYPE html>
<html>
    <head>
        <link rel="stylesheet" href="/widgets/header/header.css">
        <link rel="stylesheet" href="/widgets/nav/nav.css">
        <link rel="stylesheet" href="/widgets/list/list.css">
        <link rel="stylesheet" href="/widgets/footer/footer.css">
    </head>
    <body>
        <div class="main">
            <div class="header">...</div>
            <div class="nav">...</div>
            <div class="list">...</div>
            <div class="footer">...</div>
        </div>
        <script src="/widgets/header/header.js"></script>
        <script src="/widgets/nav/nav.js"></script>
        <script src="/widgets/list/list.js"></script>
    </body>
</html>
```

### 请求合并
```html
<!DOCTYPE html>
<html>
    <head>
        <link rel="stylesheet" href="/widgets/??header/header.css,nav/nav.css,list/list.css,footer/footer.css">
    </head>
    <body>
        <div class="main">
            <div class="header">...</div>
            <div class="nav">...</div>
            <div class="list">...</div>
            <div class="footer">...</div>
        </div>
        <script src="/widgets/??header/header.js,nav/nav.js,list/list.js"></script>
    </body>
</html>
```

### 首屏CSS内嵌

```html
<!DOCTYPE html>
<html>
    <head>
        <style type="text/css">
            .header { ... }
            .nav { ... }
        </style>
        <link rel="stylesheet" href="/widgets/??list/list.css,footer/footer.css">
    </head>
    <body>
        <div class="main">
            <div class="header">...</div>
            <div class="nav">...</div>
            <div class="list">...</div>
            <div class="footer">...</div>
        </div>
        <script src="/widgets/??header/header.js,nav/nav.js,list/list.js"></script>
    </body>
</html>
```

### CSS在头部，JS在尾部

* 前端模板：

```html
<!DOCTYPE html>
<html>
    <head>
        <!--STYLE_PLACEHOLDER-->
    </head>
    <body>
        <div class="main">
            #widget('header')
            #widget('nav')
            #widget('list')
            #widget('footer')
        </div>
        <!--SCRIPT_PLACEHOLDER-->
    </body>
</html>
```

* 服务器渲染过后：

```html
<!DOCTYPE html>
<html>
    <head>
        <style type="text/css">
            .header { ... }
            .nav { ... }
        </style>
        <link rel="stylesheet" href="/widgets/??list/list.css,footer/footer.css">
    </head>
    <body>
        <div class="main">
            <div class="header">...</div>
            <div class="nav">...</div>
            <div class="list">...</div>
            <div class="footer">...</div>
        </div>
        <script src="/widgets/??header/header.js,nav/nav.js,list/list.js"></script>
    </body>
</html>
```

### 收集页面脚本置底

* 前端模板：

```html
<!DOCTYPE html>
<html>
    <head>
        <!--STYLE_PLACEHOLDER-->
    </head>
    <body>
        <div class="main">
            #widget('header')
            #script()
                var a = 123;
                console.log(a);
            #end
            #widget('nav')
            #widget('list')
            #widget('footer')
        </div>
        <!--SCRIPT_PLACEHOLDER-->
    </body>
</html>
```

* 服务器渲染过后：

```html
<!DOCTYPE html>
<html>
    <head>
        <style type="text/css">
            .header { ... }
            .nav { ... }
        </style>
        <link rel="stylesheet" href="/widgets/??list/list.css,footer/footer.css">
    </head>
    <body>
        <div class="main">
            <div class="header">...</div>
            <div class="nav">...</div>
            <div class="list">...</div>
            <div class="footer">...</div>
        </div>
        <script src="/widgets/??header/header.js,nav/nav.js,list/list.js"></script>
        <script>
            var a = 123;
            console.log(a);
        </script>
    </body>
</html>
```

# 2. 基于表的资源管理
```js
require.config({
    "name": "projct name",
    "version": "1.0.0",
    "combo": true,
    "cdnUrl": "//misc.360buyimg.com",
    "loader": "seajs",
    "res": {
        "page/home/index.vm": {
            "uri": "/home/index.vm",
            "type": "vm",
            "extras": {
                "isPage": true,
                "async": [
                    "jquery",
                    "bootstrap"
                ]
            }
        },
        "widgets/header/header.js": {
            "uri": "/widgets/header/header.js",
            "type": "js",
            "deps": [
                "widgets/header/header.css"
            ]
        },
        "widgets/header/header.css": {
            "uri": "/widgets/header/header.css",
            "type": "css"
        },
        "widgets/nav/nav.js": {
            "uri": "/widgets/nav/nav.js",
            "type": "js",
            "deps": [
                "widgets/nav/nav.css"
            ]
        },
        "widgets/nav/nav.css": {
            "uri": "/widgets/nav/nav.css",
            "type": "css"
        }
    },
    "pkg": {
        "p0": {
            "uri": "/widget/widget_pkg.css",
            "type": "css",
            "has": [
                "widget/header/header.css",
                "widget/nav/nav.css",
                "widget/footer/footer.css"
            ]
        },
        "p1": {
            "uri": "/widget/widget_pkg.js",
            "type": "js",
            "has": [
                "widget/header/header.js",
                "widget/nav/nav.js",
                "widget/footer/footer.js"
            ]
        }
    }
});
```


# 3. 自定义模板指令

* `#html()`、`#head()`、`#body()`主要用于输出HTML结构骨架，这样JFK才知道收集到的JS和CSS集中在什么地方输出。

    ```
    #html()
        #head() #end
        #body() #end
    #end
    ```

    会产出如下代码：

    ```
    <html>
        <head>
            <!--FIS_STYLE_PLACEHOLDER-->
        </head>
        <body>
            <!--FIS_FRAMEWORK_CONFIG--><!--FIS_SCRIPT_PLACEHOLDER-->
        </body>
    </html>
    ```

* `#extends()`、`#block()`、`#parent()`主要用于模板的继承，源自于`smarty`模板引擎的思想。

    layout.vm

    ```
    <!DOCTYPE html>
    #html()
        #head()
            <meta charset="utf-8"/>
            <meta content="" name="description">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <title>Demo</title>
        #end
        #body()
            <div id="wrapper">
                #block("body_content")
                    This is body.
                #end
            </div>
        #end
    #end
    ```

    以上示例通过`#block()`定义了一个区域`body_content`，那么在子模板中，就可以像以下方式填充它

    ```
    #extends("layout.vm")
        #block("body_content")
            <h1>Hello Demo</h1>
        #end
    #end
    ```

* `#require('资源ID')` 用来加载某一静态资源，当该资源被加载的同时，所有其依赖的资源也应当被加载。
    ```
    #require('static/libs/lib.js')
    #require('static/scss/global.scss')
    ```

* `#uri` 用来获取某一资源的最终产出路径
    ```
    <div data-image="#uri('static/img/bg.png')"></div>
    ```

* `#script() some js code #end` 与HTML中的`<script></script>`类似，通过此语法加载的`script`会被收集到队列中，无论在模板的什么位置使用，最终都会被合并在页面页脚处统一输出，自动性能优化。
    ```
    <p>xxx<p>
    #script()
    var $ = require('/widget/jquery/jquery.js');
    $(function() {
        alert('ready');
    });
    #end
    ```

* `#style() some css code #end` 用来处理内嵌CSS，与 `#script() #end` 处理方式一致

* `#widget('组件ID')` 类似于各种模板引擎的`include`功能， 应当支持以下功能：
    * 支持局部变量传递
        * `with` 将指定变量下面的所有属性作为widget中的局部变量使用
        * `var` 设置widget中局部变量

        ```
        #set($pageNav="home")
        #widget("widget/header/header.vm" "with:$pageNav" "var:literal=字面量")
        ```

    * 自动加载模板中的依赖的资源

    ```
    #if(!$Auth.guest())
        widget('widget/userinfo/userinfo.vm')
    #end
    ```

* `<!--XXX_PLACEHOLDER-->` 后端框架需要把收集到的js和css统一输出，同时为了支持模块化开发，还需要输出前端框架资源路径以及异步js模块资源表信息，具体占位符如下：
    * `<!--FIS_STYLE_PLACEHOLDER-->` 用来控制收集到的js输出位置
    * `<!--FIS_SCRIPT_PLACEHOLDER-->` 用来控制收集到的 css 输出位置，一般都放在 head 前面。
    * `<!--FIS_FRAMEWORK_CONFIG-->` 用来控制异步 js 模块资源表输出位置。

# 4. 页面重定向
服务器除了能够直接页面预览之外，还应当支持页面重定向功能，用来实现线上地址模拟。如：当访问`http://ip:port/user`的时候，可以重定向到`http://ip:port/page/user/index.vm`页面。

用户可以通过配置项目根目录的`server.conf`文件来设置重定向规则。

示例：
```
# 重定向 / => /page/home.vm
rewrite \/$ /page/home.vm

# 重定向用户查看页面
# /user/1 => /page/user/view?id=1
rewrite ^\/user\/(\d*)$ /page/user/view.vm?id=$1

# redirect /jump /page/about.vm
redirect \/jump /page/about.vm
```

语法规则为

```
指令名称 匹配规则（用来匹配原始请求地址） 目标地址
```

* 指令 应当至少支持以下两种指令：
    * rewrite 重定向页面，浏览器地址栏不会发生变化。
    * redirect 跳转页面，浏览器地址栏发生变化。
* 匹配规则 统一使用正则来配置，应当支持分组。如：\/user\/(\d+)$。
* 目标地址 可以是服务器内任意资源路径或者访问路径，可以通过 $数字 来获取正则规则中分组的捕获。

# 5. 数据模拟
假数据主要包括模板数据和 ajax 异步数据两部分。

#### 1. 模板数据

对于动态的模板页面，需要支持结合用户提供的假数据完成简单预览功能。

假数据应该支持两种形式：

* 静态`json`数据，以`xxx.json`文件提供。数据内容用`json`格式存放。

    ```json
    {
      "title": "用户列表",
      "desc": "页面描述"
    }
    ```

* 根据后端选型，通过一种特定脚本支持动态数据。如：`xxx.jsp` 或者 `xxx.php`。

    ```jsp
    <%

        // 支持动态逻辑，甚至去线上拉取真实数据。
        // 或者去 api 文档平台拉取数据。

        response.getWriter().write(new Date());
    %>
    ```

模板页面中模板数据应当根据`假数据`存放规范自动加载相应的`假数据`文件，并完成绑定。

如下示例，在模板中的 title 变量应该被自动赋值为 `用户列表`。

假定后端模板引擎就是纯 jsp

```jsp
<title><% response.getWriter().write(title) %></title>
```

页面预览时，标题应该输出为“用户列表”。

假定`假数据文件`全部存放在`test`文件夹下面，页面文件全部存放在`page`目录下面，那么当访问 `page/a/b/c.vm` 页面时，应当按以下顺序尝试加载 `假数据`，并将所有数据按顺序合并起来，后加载的数据覆盖先加载的数据，采用类似 `jQuery.extend` 的合并策略。

* /mock/global.json
* /mock/page.json
* /mock/page/a.json
* /mock/page/a/b.json
* /mock/page/a/b/c.json

动态`假数据`文件（通过动态脚本提供的数据文件）应当也有同样的加载策略。

如果`静态假数据`和`动态假数据`文件都同时存在，应当都同时加载，且 `动态假数据` 后加载，使其数据优先级更高。

`假数据`存放目录规则除了能按页面在项目中的路径来之外，还需支持按该页面的访问地址来存放。

举个例子，如上面例子中的页面 `page/a/b/c.vm` 如果用户配置了 url rewrite.

```
rewrite \/clean\/url$ /page/a/b/c.vm
```

那么当页面通过 `http://ip:port/clean/url` 访问的时候，应当除了按页面存放路径规则的`假数据`被加载外，还需额外按同样的策略加载以下`假数据`。

* /mock/clean.json
* /mock/clean/url.json

之所以把`假数据`能按各种目录存放，主要是考虑到，页面与页面之间的公用的`假数据`，用户可以根据公用程度选择存放在不同的文件。

#### 2. ajax 数据

可以结合 url rewrite 和静态 json 文件，完全模拟异步 ajax 数据。

如：/mock/ajax/user/list.json

```json
{
"data": [
  {
    "id": 1,
    "name": "foo"
  }
],
"status": 0,
"message": "ok"
}
```

/server.conf

```
rewrite ^\/user\/list /mock/ajax/user/list.json
```

当用户请求 `http://ip:port/user/list` 时，返回的是 list.json 中的 json 静态数据。

除了 url rewrite 和 静态 json 文件结合外，还需支持 url rewrite 和动态脚本结合，满足动态数据模拟的需求。

/ server.conf

```
rewrite ^\/api\/now /mock/ajax/api/now.php
```
/mock/ajax/api/now.php

```php
{
"data": <?php echo time();?>,
"status": 0,
"message": "ok"
}
```

当然如果是动态脚本，返回的数据类型可以由脚本编写者定，可以是 `xml` 也可以是 `jsonp` 等等。

# 6. 目录规范
```
├── page
│   └── index.vm
├── static
│   ├── css
│   ├── img
│   └── js
├── widget
│   ├── nav
│   └── sidebar
├── test
│   └── sample.json
├── server.conf
└── fis-conf.js
```

* page 目录用来存放页面入口模板文件。
* static 目录用来存放各种静态资源，如 css、图片、swf、fonts 和 js 等等。(PS: js 目录主要用来存放非模块化的 js，模块化 js 主要存放在 widget 目录。)
* widget 目录存放各类组件，组件中 js 都采用模块化方式开发。
* test 用来存放各种假数据模拟文件。
* server.conf 页面重定向配置规则文件。
* jfk-conf.js 项目编译配置文件。

# 后端使用

为了让 velocity 能正常渲染模板，需要设置模板目录，以及将 jfk 提供的自定义 diretives 启动。 配置内容如下：

```
<bean id="velocityConfigurer" class="org.springframework.web.servlet.view.velocity.VelocityConfigurer">
    <property name="resourceLoaderPath" value="/WEB-INF/views/"/>
    <property name= "velocityProperties">
        <props>
            <prop key="input.encoding">utf-8</prop>
            <prop key="output.encoding">utf-8</prop>
            <!--启用 jfk 提供的自定义 diretives 启动-->
            <prop key="userdirective">com.baidu.fis.velocity.directive.Html, com.baidu.fis.velocity.directive.Head, com.baidu.fis.velocity.directive.Body, com.baidu.fis.velocity.directive.Require, com.baidu.fis.velocity.directive.Script, com.baidu.fis.velocity.directive.Style, com.baidu.fis.velocity.directive.Uri, com.baidu.fis.velocity.directive.Widget, com.baidu.fis.velocity.directive.Block, com.baidu.fis.velocity.directive.Extends</prop>
        </props>
    </property>
</bean>
```

为了让 fis 自定义的 directive 能够正常读取 map.json 文件，需要添加一个 bean 初始化一下。

```
<!--初始 fis 配置-->
<bean id="fisInit" class="com.baidu.fis.velocity.spring.FisBean" />
```

默认 map json 文件是从 /WEB-INF/config 文件夹下读取的，如果有修改存放地址，则需要添加一个 fis.properties 文件到 /WEB-INF/ 目录。 内容如下：

```
# 相对与 WEB-APP 根目录。
mapDir = /velocity/config
```

View Resolver 推荐配置

```
<bean id="viewResolver" class="org.springframework.web.servlet.view.velocity.VelocityViewResolver">
    <property name="cache" value="true"/>
    <property name="prefix" value=""/>
    <property name="suffix" value=".vm"/>
    <property name="cacheUnresolved" value="false" />
    <property name="exposeSpringMacroHelpers" value="true"/>
    <property name="contentType" value="text/html;charset=UTF-8" />
    <property name="requestContextAttribute" value="request" />
    <property name="exposeSessionAttributes" value="true" />
    <property name="attributesMap">
        <map>
            <entry key="esc"><bean class="org.apache.velocity.tools.generic.EscapeTool"/></entry>
            <entry key="render"><bean class="org.apache.velocity.tools.generic.RenderTool" /></entry>
            <entry key="link"><bean class="org.apache.velocity.tools.generic.LinkTool" /></entry>
            <entry key="context"><bean class="org.apache.velocity.tools.generic.ContextTool"/></entry>

            <entry key="jello"><bean class="com.baidu.fis.velocity.tools.JelloTool" /> </entry>
        </map>
    </property>
</bean>
```
> 注意
> cacheUnresolved一定要设置成false，否则会影响前端分开部署。
> 另外这里只启用了部分 velocity tools, 其他 tools 请根据自己需求配置。

web.xml 配置

```
<listener>
    <listener-class>com.baidu.fis.servlet.MapListener</listener-class>
</listener>
```

# 感谢
感谢[@云龙大大](https://github.com/fouber)在前端工程化方面的分享，以及[FIS团队](https://github.com/fex-team)的好工具，可以让自己搭建适合于自己的前端开发解决方案。
