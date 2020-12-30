# egg.js+vue 实战项目

## 前言

最近实习，组内用的技术栈并不是纯 H5 前端开发，还涉及到 node 后台，其中后台用的框架是 `egg.js` 这是阿里的一个 node 后台框架，框架的成熟性已经像官方文档说的，得到了双十一、双十二的考验。所以技术已经算是相对比较稳定和成熟了。

需要的一些前期准备：

1. node 相关知识的了解
2. [egg.js](https://eggjs.org/zh-cn/intro/quickstart.html)
3. [sequelize](https://www.sequelize.com.cn/)
4. 数据库的，后端的一些概念
5. vue 框架

## 项目开始

### server端, client端

server 主要使用 `Egg.js` 、 `mysql`

client主要使用 `vue`

### Egg Vue SSR Webpack 如何构建, 与普通 Webpack 构建有何区别？

Vue 服务端渲染构建是需要构建两份 JSBundle 文件。SSR 模式开发时，SSR 运行需要 Webapck 单独构建 target: node 和 target: web 的JSBundle，主要的差异在于 Webpack需要处理 require 机制以及磨平 Node 和浏览器运行环境的差异。服务端的JSBundle用来生产HTML，客户端的JSBundle需要script到文档，用来进行事件绑定等操作，也就是 Vue 的 hydrate 机制。

![eggvueWebpack.png](./assets/imgs/eggvueWebpack.png)

### Webpack 本地开发构建文件是放到内存中，SSR 如何读取文件进行渲染？

在进行 Egg + Vue 进行 SSR 模式开发时，运行 npm run dev 后你会看到如下界面， 启动了两个 Webpack 构建实例：Node 模式 和 Web 模式。具体实现见 [egg-webpack 代码实现](https://github.com/easy-team/egg-webpack)。

* 本地开发启动 Webpack 构建, 默认配置文件为项目根目录 webpack.config.js 文件。 SSR 需要配置两份 Webpack 配置，所以构建会同时启动两个 Webpack 构建服务。web 表示构建 JSBundle 给前端用，构建后文件目录 public, 默认端口 9000; node 表示构建 JSBundle 给服务端用，构建后文件目录 app/view, 默认端口 9001.
* **本地构建是 Webpack 内存构建，文件不落地磁盘**，所以 `app/view` 和 `public` 在本地开发时，是看不到文件的。 只有发布模式(`npm run build`)才能在这两个目录中看到构建后的内容。

### 初始化

```

mkdir egg-example && cd egg-example
npm i egg-init -g
egg-init
```

- 选择`Simple egg app boilerplate project`初始化 egg 项目
- 新建 `${app_root}/app/view` 目录(`egg view`规范目录)，并添加`.gitkeep`文件，保证该空目录被 git 提交到仓库
- 新建 `${app_root}/app/view/layout.html` 文件，用于服务端渲染失败后，采用客户端渲染
  此时项目的目录结构如下：

![project.png](./assets/imgs/project.png)

### 安装相关的依赖

- 服务端渲染依赖

vue 没有内置在 egg-view-vue-ssr 里面，项目需要显式安装依赖

```
npm i vue vuex axios egg-view-vue-ssr egg-scripts --save

```

- 构建开发依赖

```
npm i egg-bin cross-env easywebpack-cli easywebpack-vue egg-webpack egg-webpack-vue --save-dev
```

```
npm i vue-template-compiler --save-dev
```

### 区分开发、测试、生产环境

在正常的项目开发都需要进行环境区分，常常分成： `local` 开发环境， `test` 测试环境还有 `prod` 生产环境

在 `package.json` 文件下新增这几个 `scripts` ：

```json
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

- 添加 `${app_root}/config/config.default.js` 配置

(默认配置的开发环境配置的例子)

```js
/* eslint valid-jsdoc: "off" */

"use strict";
const fs = require("fs");
const path = require("path");

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = (appInfo) => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = (exports = {});

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + "_1608725246223_8546";

  // add your middleware config here
  //全局配置的middleware,也就是每次router映射到相应的controller都会经过的middleware
  config.middleware = [];

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };
  // config.mysql = {
  //   // 单数据库信息配置
  //    //直接在model文件夹下面写相应的表就行了
  //   client: {
  //     // host
  //     host: 'localhost',
  //     // 端口号
  //     port: '3306',
  //     // 用户名
  //     user: 'root',
  //     // 密码
  //     password: 'myshard',
  //     // 数据库名
  //     database: 'eggTest',
  //   },
  //   // 是否加载到 app 上，默认开启
  //   app: true,
  //   // 是否加载到 agent 上，默认关闭
  //   agent: false,
  // };

  config.sequelize = {
    dialectOptions: {
      connectTimeout: 60000,
      requestTimeout: 999999,
    },
    datasources: [
      //多数据库配置
      {
        delegate: "dbEggTest", // load all models to app.adminModel and ctx.adminModel
        baseDir: "model/dbEggTest", // load models from `app/admin_model/*.js`
        dialect: "mysql",
        database: "eggTest",
        host: "localhost",
        port: 3306,
        username: "root",
        password: "myshard",
        dbtype: "myshard",
        define: {
          timestamps: false,
          freezeTableName: true,
        },
      },
    ],
  };

  // 跨域配置
  // config.cors = {
  //   origin: ['*'],
  //   allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS',
  //   credentials: true,
  // };
  config.vuessr = {
    layout: path.join(appInfo.baseDir, "app/web/view/layout.html"),
    renderOptions: {
      basedir: path.join(appInfo.baseDir, "app/view"),
    },
    afterRender(html) {
      return html.replace(/__BASE_URL__/g, "");
    },
  };
  config.security = {
    // csrf: false,
    csrf: {
      enable: false, // 前后端分离，post请求不方便携带_csrf
      ignoreJSON: true,
      headerName: "authorization",
    },
    methodnoallow: {
      enable: false,
    },
  };
  return {
    ...config,
    ...userConfig,
  };
};
```

- 测试环境配置 ( `config.test.js` )默认配置相同的部分，会被测试环境配置文件覆盖

```js
"use strict";
module.exports = () => {
  const config = (exports = {});
  config.CONST2 = "const2";
  config.mysql = {
    // 单数据库信息配置
    client: {
      // host
      host: "xx.xxx.xxx.xxx",
      // 端口号
      port: "3306",
      // 用户名
      user: "root",
      // 密码
      password: "xxxxxxx",
      // 数据库名
      database: "wx",
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

- 添加`${app_root}/config/plugin.local.js` 配置

```js
exports.webpack = {
  enable: true,
  package: "egg-webpack",
};

exports.webpackvue = {
  enable: true,
  package: "egg-webpack-vue",
};
```

- 添加 `${app_root}/config/plugin.js` 配置

```js
exports.vuessr = {
  enable: true,
  package: "egg-view-vue-ssr",
};
```

- 添加 `easywebpack-cli` 配置文件` ${app_root}/webpack.config.js`

```js
module.exports = {
  egg: true,
  framework: "vue", // 使用 easywebpack-vue 构建解决方案
  entry: {
    "home/index": "app/web/page/home/index.js",
  },
};
```

- 添加` ${app_root}/.babelrc` 文件

```
{
  "presets": [["env",{ "modules": false }]],
  "plugins": [
    "transform-object-rest-spread",
    "syntax-dynamic-import",
    "transform-object-assign"
  ],
  "comments": false
}
```

安装 babel 相关依赖

```
npm i babel-core@6  babel-loader@7  --save-dev
```

```
npm i babel-preset-env babel-plugin-syntax-dynamic-import babel-plugin-transform-object-assign babel-plugin-transform-object-rest-spread --save-dev
```

- 添加`${app_root}/postcss.config.js` 文件

```js
module.exports = {
  plugins: [require("autoprefixer")],
};
```

- 安装 autoprefixer 依赖

```
npm i autoprefixer  --save-dev
```

- 添加`${app_root}/.gitignore` 配置

```
.DS_Store
.happypack/
node_modules/
npm-debug.log
.idea/
dist
static
public
private
run
*.iml
*tmp
_site
logs
.vscode
config/manifest.json
app/view/*
!app/view/layout.html
!app/view/.gitkeep
package-lock.json
```

### 前端代码

- 编写 vue 服务端公共入口 `${app_root}/app/web/framework/vue/entry/server.js`

```js
import Vue from "vue";
export default function render(options) {
  if (options.store && options.router) {
    return (context) => {
      options.router.push(context.state.url);
      const matchedComponents = options.router.getMatchedComponents();
      if (!matchedComponents) {
        return Promise.reject({ code: "404" });
      }
      return Promise.all(
        matchedComponents.map((component) => {
          if (component.preFetch) {
            return component.preFetch(options.store);
          }
          return null;
        })
      ).then(() => {
        context.state = options.store.state;
        return new Vue(options);
      });
    };
  }
  return (context) => {
    const VueApp = Vue.extend(options);
    const app = new VueApp({ data: context.state });
    return new Promise((resolve) => {
      resolve(app);
    });
  };
}
```

- 编写 vue 客户端公共入口 `${app_root}/app/web/framework/vue/entry/client.js`

```js
import Vue from "vue";
export default function (options) {
  Vue.prototype.$http = require("axios");
  if (options.store) {
    options.store.replaceState(window.__INITIAL_STATE__ || {});
  } else if (window.__INITIAL_STATE__) {
    options.data = Object.assign(
      window.__INITIAL_STATE__,
      options.data && options.data()
    );
  }
  const app = new Vue(options);
  app.$mount("#app");
}
```

- 新建`${app_root}/app/web/page/home/home.js`页面文件

```js
import Home from "./home.vue";
import serverRender from "~/app/web/framework/vue/entry/server.js";
import clientRender from "~/app/web/framework/vue/entry/client.js";
export default EASY_ENV_IS_NODE
  ? serverRender({ ...Home })
  : clientRender({ ...Home });
```

### Node 端代码

通过 `egg-view-vue-ssr` 插件 `render` 方法实现

```js
module.exports = (app) => {
  return class HomeController extends app.Controller {
    async server() {
      const { ctx } = this;
      // home/index.js 对应 webpack entry 的 home/index, 构建后文件存在 app/view 目录
      await ctx.render("home/index.js", {
        message: "egg vue server side render",
      });
    }

    async client() {
      const { ctx } = this;
      // renderClient 前端渲染，Node层只做 layout.html和资源依赖组装，渲染交给前端渲染。与服务端渲染的差别你可以通过查看运行后页面源代码即可明白两者之间的差异
      await ctx.renderClient("home/index.js", {
        message: "egg vue client render render",
      });
    }
  };
};
```

- 添加路由配置

```
app.get('/', app.controller.home.server);
app.get('/client', app.controller.home.client);
```

### 本地运行

```
npm run dev
```

npm run dev 做的三件事:

- 首先启动 egg 应用，本地开发启动 webpack(egg-webpack) 构建, 默认 webpack 配置文件为项目根目录 webpack.config.js 文件。 SSR 需要配置两份 Webpack 配置，所以构建会同时启动两个 Webpack 构建服务。web 表示构建 JSBundle 给前端用，构建后文件目录 public, 默认端口 9000; node 表示构建 JSBundle 给前端用，构建后文件目录 app/view, 默认端口 9001.
- 本地构建是 Webpack 内存构建，文件不落地磁盘，所以 app/view 和 public 在本地开发时，是看不到文件的。 只有发布模式(npm run build)才能在这两个目录中看到构建后的内容。
- 构建完成，Egg 应用正式可用，自动打开浏览器
