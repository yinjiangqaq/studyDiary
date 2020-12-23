# egg.js+vue实战项目

## 前言

最近实习，组内用的技术栈并不是纯H5前端开发，还涉及到node后台，其中后台用的框架是 `egg.js` 这是阿里的一个node后台框架，框架的成熟性已经像官方文档说的，得到了双十一、双十二的考验。所以技术已经算是相对比较稳定和成熟了。

需要的一些前期准备：

1. node相关知识的了解
2. [egg.js](https://eggjs.org/zh-cn/intro/quickstart.html)
3. [sequelize](https://www.sequelize.com.cn/)
4. 数据库的，后端的一些概念

## 项目开始

### server端

server主要使用 `Egg.js` 、 `mysql`

### 初始化

``` 

mkdir egg-example && cd egg-example
npm init egg --type=simple
npm i
```

此时项目的目录结构如下：

![project.png](./assets/imgs/project.png)

### 安装相关的依赖

``` 

npm i  egg-cors jsonwebtoken await-stream-ready cheerio cross-env egg-multipart egg-mysql egg-onerror egg-validate iconv-lite md5 nanoid stream-wormhole -S

```

### 区分开发、测试、生产环境

在正常的项目开发都需要进行环境区分，常常分成： `local` 开发环境， `test` 测试环境还有 `prod` 生产环境

在 `package.json` 文件下新增这几个 `scripts` ：

``` json
  "scripts": {
    "server:local": "cross-env EGG_SERVER_ENV=local egg-bin debug",
    "server:test": "cross-env EGG_SERVER_ENV=test egg-bin debug",
    "server:prod": "cross-env EGG_SERVER_ENV=prod egg-bin debug",
    "start:dev": "cross-env EGG_SERVER_ENV=dev egg-scripts start --daemon --title=egg-server-wx-admin ",
    "start:test": "cross-env EGG_SERVER_ENV=test egg-scripts start --daemon --title=egg-server-wx-admin ",
    "start:prod": "egg-scripts start --daemon --title=egg-server-wx-admin ",
    "stop": "egg-scripts stop --title=egg-server-wx-admin "
  },

```

使用 `cross-env` ，主要是在 `winodw` 和 `mac` 系统下可以区分环境变量 `EGG_SERVER_ENV` 。

使用 `EGG_SERVER_ENV` 需要注意个问题， `EGG_SERVER_ENV=local` 时(默认 `local` )，热更新才可以使用，设置为其他的参数热更新会失效。

在 `config` 目录下新增对应环境的 `config` ， `config.default.js` 的配置是默认的，对应环境的 `config` 会覆盖 `config.default` 的配置

config.default.js(默认配置的开发环境配置的例子)

``` js
'use strict';

module.exports = appInfo => {
    const config = exports = {};
    config.keys = appInfo.name + '_1568685835614_3976';
    // 全局常量
    config.CONST = {
        ROOT: '',
        UPLOAD_URL: 'http://127.0.0.1:7001',
        BOOK_SOURCE_MAP: {
            1: {
                url: 'https://www.qidian.com', // 主要是爬起点的免费章节，后续可以加入其它网站源
                name: '起点',
            },
        },
    };
    const userConfig = {
        // myAppName: 'egg',
    };
    config.cluster = {
        listen: {
            port: 7001,
            hostname: '0.0.0.0', // 不建议设置 hostname 为 '0.0.0.0'，它将允许来自外部网络和来源的连接，请在知晓风险的情况下使用
            // path: '/var/run/egg.sock',
        },
    };
    config.mysql = {
        // 单数据库信息配置
        client: {
            // host
            host: '127.0.0.1',
            // 端口号
            port: '3306',
            // 用户名
            user: 'root',
            // 密码
            password: '1234567890',
            // 数据库名
            database: 'wx',
        },
        // 是否加载到 app 上，默认开启
        app: true,
        // 是否加载到 agent 上，默认关闭
        agent: false,
    };

    // 报错处理
    config.onerror = {
        errorPageUrl: (err, ctx) => ctx.errorPageUrl || '/500',
        json: (err, ctx) => {
            ctx.body = {
                code: err.status,
                msg: err.message,
            };
        },
    };
    // 中间件
    config.middleware = ['httpError', 'verLogin'];
    config.httpError = {
        match: '/',
    };
    config.verLogin = {
        match: '/token',
    };
    // 跨域配置
    config.cors = {
        origin: ['*'],
        allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS',
        credentials: true,
    };
    config.security = {
        // csrf: false,
        csrf: {
            enable: false, // 前后端分离，post请求不方便携带_csrf
            ignoreJSON: true,
            headerName: 'authorization',
        },
        methodnoallow: {
            enable: false,
        },

    };
    // 上传文件
    config.multipart = {
        mode: 'stream',
    };

    return {
        ...config,
        ...userConfig,
    };
};
```

测试环境配置 ( `config.test.js` )默认配置相同的部分，会被测试环境配置文件覆盖

``` js
'use strict';
module.exports = () => {
    const config = exports = {};
    config.CONST2 = 'const2';
    config.mysql = {
        // 单数据库信息配置
        client: {
            // host
            host: 'xx.xxx.xxx.xxx',
            // 端口号
            port: '3306',
            // 用户名
            user: 'root',
            // 密码
            password: 'xxxxxxx',
            // 数据库名
            database: 'wx',
        },
        // 是否加载到 app 上，默认开启
        app: true,
        // 是否加载到 agent 上，默认关闭
        agent: false,
    };
    return {
        ...config,
    };
};
```
