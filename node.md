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

- 小程序
- Hybrid App 开发
- React Native (混合开发，输出的是一个 js 文件，需要编译之后才能调用原生之类的组件，效率比较低)
- flutter 原生 app 开发，编译出来的是原生代码，而且是一套代码解决安卓和 ios 的两端代码

* electron 桌面应用开发

2. web 技术

首先，后端开发工程师需要完成整个软件的逻辑处理过程，涉及到大量资源的整合、计算、存储等操作，另外后端工程师还需要考虑业务处理的性能问题、安全问题、并发问题、扩展性问题、稳定性问题等等

## node.js 怎么新建线程，开启多线程

https://juejin.im/post/6844903808330366989

## Node.js 框架的 express 与 koa 对比分析

https://juejin.im/entry/6844903573755527176

偏向于使用 koa 的原因是 express 对异步的处理没有 koa 那么优雅,尽管 express 的生态很好

**express 中间件是一个接一个的顺序执行 koa 中间件是按照圆圈循环进行，即从外层到内层，又从内层回到外层来结束。**

koa2 的中间件是通过 async await 实现的，中间件执行顺序是“洋葱圈”模型。
中间件之间通过 next 函数联系,当一个中间件调用 next() 后，会将控制权交给下一个中间件, 直到下一个中间件不再执行 next() 后, 将会沿路折返,将控制权依次交换给前一个中间件。
与 koa2 中间件不同的是，express 中间件一个接一个的顺序执行, 通常会将 response 响应写在最后一个中间件中
主要特点：
`app.use` 用来注册中间件
遇到 http 请求，根据 path 和 method 判断触发哪些中间件
实现 next 机制，即上一个中间件会通过 next 触发下一个中间件

## new Vue()的时候发生了什么

主要做一些初始化的工作，比如通过 `lifecycleMixin` 方法来初始化生命周期。同时看到 Vue 只能通过 new 关键字初始化，然后会调用 `this._init` 方法，该方法为 Vue 原型上的方法，接着我们追踪至`_init` 函数。 该方法在 `src/core/instance/init.js` 中定义。

```js
export function initMixin (Vue: Class<Component>) {
  Vue.prototype._init = function (options?: Object) {
    const vm: Component = this
    // a uid
    vm._uid = uid++
...
    // expose real self
    vm._self = vm
    initLifecycle(vm)// 初始化生命周期
    initEvents(vm)// 初始化事件中心
    initRender(vm) // 初始化渲染
    callHook(vm, 'beforeCreate')
    initInjections(vm) // resolve injections before data/props
    initState(vm)// 初始化 data、props、computed、watcher 等等
    initProvide(vm) // resolve provide after data/props
    callHook(vm, 'created')
...
 /* mount 为将数据模型vdom挂载到真实dom上 */
    if (vm.$options.el) {
      vm.$mount(vm.$options.el)
    }
  }
}
```

Vue 初始化主要就干了几件事情，合并配置，初始化生命周期，初始化事件中心，初始化渲染，初始化 `data、props、computed、watcher` 等等，最后初始化完成检测到如果有 el 属性，则调用 `vm.$mount` 方法挂载 vm，挂载的目标就是把模板渲染成最终的 DOM；此过程我们重点关注`initState`以及 最后执行的`mount`。
