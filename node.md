## 后端做的事情

1. 路由监控
2. restful API(系统的业务逻辑相关)
3. 数据持久化，联系数据库(ORM)，建立数据模型
4. 解决高并发，以及安全相关问题

## 关于大前端

![bigfrontEnd.png](assets/imgs/bigfrontEnd.png)

现在的前端做的事情不只是做客户端页面这么简单，有部分后端内容也是可以给前端做的。例如服务端渲染，数据缓存，接受客户端请求，合并接口请求，这样相当于充当一个中间层的作用

大前端的特征：

1. 泛客户端开发

* 小程序
* Hybrid App 开发
* React Native (混合开发，输出的是一个 js 文件，需要编译之后才能调用原生之类的组件，效率比较低)
* flutter 原生 app 开发，编译出来的是原生代码，而且是一套代码解决安卓和 ios 的两端代码

* electron 桌面应用开发

2. web 技术

首先，后端开发工程师需要完成整个软件的逻辑处理过程，涉及到大量资源的整合、计算、存储等操作，另外后端工程师还需要考虑业务处理的性能问题、安全问题、并发问题、扩展性问题、稳定性问题等等

## node.js 怎么新建线程，开启多线程

https://juejin.im/post/6844903808330366989

## Node.js 框架的 express 与 koa 对比分析

https://juejin.im/entry/6844903573755527176

偏向于使用 koa 的原因是 express 对异步的处理没有 koa 那么优雅, 尽管 express 的生态很好

**express 中间件是一个接一个的顺序执行 koa 中间件是按照圆圈循环进行，即从外层到内层，又从内层回到外层来结束。**

koa2 的中间件是通过 async await 实现的，中间件执行顺序是“洋葱圈”模型。
中间件之间通过 next 函数联系, 当一个中间件调用 next() 后，会将控制权交给下一个中间件, 直到下一个中间件不再执行 next() 后, 将会沿路折返, 将控制权依次交换给前一个中间件。
与 koa2 中间件不同的是，express 中间件一个接一个的顺序执行, 通常会将 response 响应写在最后一个中间件中
主要特点：
`app.use` 用来注册中间件
遇到 http 请求，根据 path 和 method 判断触发哪些中间件
实现 next 机制，即上一个中间件会通过 next 触发下一个中间件

## node 中台

关于中台这个概念，因为前端工作人员的产出不应该只是造页面，与后端联调，解决性能化等问题，在node.js出来之后，前端人员也可以参与到后端，node层一般认为是中间层，做路由转发，数据处理，但是不亲自参与到读写 `redis db` 。这边的node中台工作流主要是：

这种模式主要面对那种企业内部，交互压力并不是很大的，因为node作为后台语言并没有Java和c++那么久，还没有那么成熟，所以常规的应用，toC的系统，更多的是采用常规的客户端服务器规格，真正写后台的是Java和C++，node并不参与其中。因为他们更能支撑起高并发等等这些用户量大起来所产生出来的压力。

``` 
        ssr(服务端渲染)            联系        读写redis db(自己维护一个表)
frontEnd<------------->node中台<--------->  java 后台(通过读取你的表，写接口)
                                            c++ 后台 (通过读取你的表，写接口)
```

## nrm

这个东西相当于维护一个npm registry也就是npm 源的一个hash table

``` 
# 安装
npm install -g nrm
 
# 添加一个名为taobao的仓库，地址为私有仓库地址
 nrm  add taobao http://registry.npm.taobao.org/
 
# 查看现有的仓库，出现 taobao项说明添加成功
nrm ls
#-> * npm ---- https://registry.npmjs.org/
      cnpm --- http://r.cnpmjs.org/
      taobao - https://registry.npm.taobao.org/
      nj ----- https://registry.nodejitsu.com/
      rednpm - http://registry.mirror.cqupt.edu.cn/
      npmMirror  https://skimdb.npmjs.com/registry/
      edunpm - http://registry.enpmjs.org/
    

## 切换到taobao源

nrm use taobao

 
# 安装项目依赖
npm install
```
