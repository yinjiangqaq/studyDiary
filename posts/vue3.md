## vue2.x 和 vue3 对于 tolist 组件配置的区别

## vue 2.x 针对组件的一些配置

```js
export default {
  name: "test",
  components: {},
  props: {},
  data() {
    return {};
  },
  created() {},
  mounted() {},
  watch: {},
  methods: {},
};
```

## vue 3.x

在 vue3.x 中也可以适配，对应的相关的生命周期方法也可以正常执行，但是 vue3.x 的一大核心是引入了`vue Composition API`(组合式 API)这使得组件的大部分内容都可以通过 `setup()`方法进行配置，同时 vue compisition API 在 vue2.x 也可以使用的，需要通过安装@vue/composition-api 来使用：

```js
npm install @vue/composition-api
...
import VueCompositionApi from '@vue/composition-api';

Vue.use(VueCompositionApi);
```

下面只要介绍一下采用`Vue Composition API`来改造采用 2.x 开发的 todoList 项目时的新老代码对比。

### 如何创建一个 vue3.0 项目

首先，安装 vue cli 的最新版本，一般是 vue cli 4，安装成功后，调用：

```
vue create myapp
```

创建一个基于 Vue2.x 的项目，然后进入项目的根目录，执行：

```
vue add vue-next
```

然后就会自动安装`vue-cli-plugin-vue-next[5]`插件，完毕之后，myapp 项目就会变成一个基于`Vue3.0Beta`版本的项目框架。

### 根实例初始化

在 2.x 中通过`new Vue()`的方法来初始化：

```js
import App from "./App.vue";
new Vue({
  store,
  render: (h) => h(App),
}).$mount("#app");
```

在 3.x 中 Vue 不再是一个构造函数，通过 createApp 方法初始化：

```js
import App from "./App.vue";
createApp(App).use(store).mount("#app");
```

### ref 或者 reactive 代替 data 中的变量

在 2.x 中通过组件 data 的方法来定义一些当前组件的数据：

```js
...
data() {
  return {
    name: 'test',
    list: [],
  }
},
...
```

在 3.x 中通过 ref 或者 reactive 创建响应式对象：

```js
import {ref,reactive} from 'vue'
...
setup(){
  const name = ref('test')
  const state = reactive({
    list: []
  })
  return {
      name,
      state
  }
}
...
```

ref 将给定的值创建一个响应式的数据对象并赋值初始值（int 或者 string），reactive 可以直接定义复杂响应式对象。

### methods 中定义的方法也可以写在 setup()中

```js
...
methods: {
  fetchData() {

  },
}
...
```

在 3.x 中直接在`setup`方法中定义并 return：,3.0 都是用 setup 这个方法，然后里面关于变量方法都是写成变量的形式，然后统一成一个变量来返回的

```js
...
setup(){
  const fetchData = ()=>{
      console.log('fetchData')
  }

  return {
      fetchData
  }
}
...
```

### 无法使用 eventBus

在 2.x 中通过 EventBus 的方法来实现组件通信：

```js

var EventBus = new Vue()
Vue.prototype.$EventBus = EventBus
...
this.$EventBus.$on()  this.$EventBus.$emit()
```

在 3.x 中移除了`$on, $off`等方法（参考`rfc[6]`），而是推荐使用`mitt[7]`方案来代替：

```js
import mitt from "mitt";
const emitter = mitt();
// listen to an event
emitter.on("foo", (e) => console.log("foo", e));
// fire an event
emitter.emit("foo", { a: "b" });
```

由于 3.x 中不再支持`prototype`的方式给 Vue 绑定静态方法，可以通过`app.config.globalProperties.mitt = () => {}`方案。

### event bus

VUE 中 `eventBus` 可以用来进行任何组件之间的通信，我们可以把 `eventBus` **当成一个管道**，这个管道两端可以接好多组件，两端的任何一个组件都可以进行通信。其实这个管道就是 Vue 实例，实例中的`$on, $off, $emit` 方法来实现此功能。还是老样子，先通过简单例子看看 `eventBus` 怎么用。

event bus 的实现原理其实是发布订阅设计模式的原理。

```js
class Bus {
  constructor() {
    this.callbacks = {};
  }
  $on(name, fn) {
    this.callbacks[name] = this.callbacks[name] || [];
    this.callbacks[name].push(fn);
  }
  $emit(name, args) {
    if (this.callbacks[name]) {
      //存在遍历所有callback
      this.callbacks[name].forEach((cb) => cb(args));
    }
  }
}
```

我们知道作用其实是在任何两个兄弟组件之间，**都引入一个新的 vue 实例**，然后通过分别调用这个实例的事件触发和监听来实现通信和参数传递。

看一个栗子：

比如，我们这里有三个组件，main.vue、click.vue、show.vue。click 和 show 是父组件 main 下的兄弟组件，而且 click 是通过 v-for 在父组件中遍历在了多个列表项中。这里要实现，click 组件中触发点击事件后，由 show 组件将点击的是哪个 dom 元素 console 出来。

首先我们给 click 组件添加点击事件

```html
<div class="click" @click.stop.prevent="doClick($event)"></div>
```

想要 在 doClick()方法中，实现对 show 组件的通信，我们需要新建一个 js 文件，来创建出我们的 eventBus，我们把它命名为 bus.js

```

import Vue from 'vue';
export default new Vue();
```

这样我们就创建了一个新的 vue 实例。接下来我们在 click 组件和 show 组件中 import 它。

```
import Bus from 'common/js/bus.js';
```

接下来 ，我们在 doClick 方法中，来触发一个事件：

```js
methods: {
   doClick(event) {
   Bus.$emit('getTarget', event.target);
   }
}
```

这里我们在 click 组件中每次点击，都会在 bus 中触发这个名为'getTarget'的事件，并将点击事件的 event.target 顺着事件传递出去。

接着，我们要在 show 组件中的 created()钩子中调用 bus 监听这个事件，并接收参数：

```js
created() {
        Bus.$on('getTarget', target => {
            console.log(target);
        });
}
```

这样，在每次 click 组件的点击事件中，就会把 event.target 传递到 show 中，并 console 出来。

### setup()中使用 props 和 this:

在 2.x 中，组件的方法中可以通过 this 获取到当前组件的实例，并执行 data 变量的修改，方法的调用，组件的通信等等，但是在 3.x 中，`setup()`在 `beforeCreate` 和 `created` 时机就已调用，无法使用和 2.x 一样的 this，但是可以通过接收 `setup(props,ctx)`的方法，获取到当前组件的实例和 `props：`

```js
export default {
  props: {
    name: String,
  },
  setup(props, ctx) {
    console.log(props.name);
    ctx.emit("event");
  },
};
```

注意 ctx 和 2.x 中 this 并不完全一样，而是选择性地暴露了一些 property，主要有`[attrs,emit,slots]`。

### watch 来监听对象改变

2.x 中，可以采用 watch 来监听一个对象属性是否有改动：

```js
...
data(){
  return {
    name: 'a'
  }
},
watch: {
  name(val) {
    console.log(val)
  }
}
...
```

3.x 中，在 setup()中，可以使用 watch 来监听：

```js
...
import {watch} from 'vue'
setup(){
  let state = reactive({
    name: 'a'
  })
  watch(
    () => state.name,
    (val, oldVal) => {
      console.log(val)
    }
  )
  state.name = 'b'
  return {
      state
  }
}
...
```

在 3.x 中，如果 watch 的是一个数组`array`对象，那么如果调用`array.push()`方法添加一条数据，并不会触发`watch`方法，必须重新给 array 赋值：

```js
let state = reactive({
  list: [],
});
watch(
  () => state.list,
  (val, oldVal) => {
    console.log(val);
  }
);

state.list.push(1); // 不会触发watch

state.list = [1]; // 会触发watch
```

### computed 计算属性

2.x 中

```js
...
computed: {
    storeData () {
      return this.$store.state.storeData
    },
},
...
```

3.x 中

```js
...
import {computed} from 'vue'
setup(){
  const storeData = computed(() => store.state.storeData)

  return {
      storeData
  }
}
...
```

# Vue2.x

## Vue

### vue v-if 和 v-show 的区别

相同点：两者都是条件渲染

不同点：

- v-if 在条件切换的时候，都会对标签进行适当的创建和销毁，而 v-show 则仅在初始化时候加载一次，因此 v-if 的开销会更大一些
- v-if 是惰性的，只有当条件为真时才会真正渲染标签；如果初始条件不为真，则 v-if 不会去渲染标签。v-show 则无论初始条件是否成立，都会渲染标签，它仅仅做的只是简单的 CSS 切换

### watch 和 computed 的区别

- computed

1. 支持缓存，只有依赖数据发生改变，才会重新进行计算
2. 不支持异步，当 computed 内有异步操作时无效，无法监听数据的变化
3. computed 属性值会默认走缓存，计算属性是基于它们的响应式依赖进行缓存的，也就是基于 data 中声明过或者父组件传递的 props 中的数据通过计算得到的值
4. 如果一个属性是由其他属性计算而来的，这个属性依赖其他属性，是一个多对一或者一对一，一般用 computed
5. 如果 computed 属性属性值是函数，那么默认会走 get 方法；函数的返回值就是属性的属性值；在 computed 中的，属性都有一个 get 和一个 set 方法，当数据变化时，调用 set 方法。

- watch

1. 不支持缓存，数据变，直接会触发相应的操作；
2. watch 支持异步；
3. 监听的函数接收两个参数，第一个参数是最新的值；第二个参数是输入之前的值；
4. 当一个属性发生变化时，需要执行对应的操作；一对多；
5. 监听数据必须是 data 中声明过或者父组件传递过来的 props 中的数据，当数据变化时，触发其他操作，函数有两个参数，

   immediate：组件加载立即触发回调函数执行，

   deep: 深度监听，为了发现对象内部值的变化，复杂类型的数据时使用，例如数组中的对象内容的改变，注意监听数组的变动不需要这么做。注意：deep 无法监听到数组的变动和对象的新增，参考 vue 数组变异, 只有以响应式的方式触发才会被监听到。

## Vue.mixin( mixin )

接受的参数是一个 mixin 对象

用法：
全局注册一个混入，影响注册之后所有创建的每个 Vue 实例。插件作者可以使用混入，向组件注入自定义的行为。不推荐在应用代码中使用。

它会影响当前创造的 vue 实例，相当于很多类似公用的操作可以独立开，然后封装成一个 mixin，然后当需要的时候导入，不用在重复写逻辑

```js
// 为自定义的选项 'myOption' 注入一个处理器。
Vue.mixin({
    created: function() {
        var myOption = this.$options.myOption;
        if (myOption) {
            console.log(myOption);
        }
    },
});

new Vue({
    myOption: "hello!",
});
// => "hello!"
//另外一种方式
export default {
    name: "auth-user",
    mixins: [common],
    props: {},
};
//common
export default {
    data() {
        return {
            authCode,
            formData: {},
            appId: -1,
            appList: [],
            // 资源，rbac
            typeValue: "default",
            // codeDesc: 0,
            resourceTypeList: [],
            resourceList: [],
            rbacPlusLoading: false,
            resourceId: 0, // 资源id 废弃
            resourceCode: "",
        };
    },
    ...
};
```

## vue keep-alive

https://cn.vuejs.org/v2/guide/components-dynamic-async.html#%E5%9C%A8%E5%8A%A8%E6%80%81%E7%BB%84%E4%BB%B6%E4%B8%8A%E4%BD%BF%E7%94%A8-keep-alive

我们之前曾经在一个多标签的界面中使用 is attribute 来切换不同的组件：

```html
<component v-bind:is="currentTabComponent"></component>
```

当在这些组件之间切换的时候，你有时会想保持这些组件的状态，以避免反复重渲染导致的性能问题。

重新创建**动态组件**的行为通常是非常有用的，但是在这个案例中，我们更希望那些标签的组件实例能够被在它们第一次被创建的时候缓存下来。为了解决这个问题，我们可以用一个 `<keep-alive>` 元素将其**动态组件**包裹起来。

```html
<!-- 失活的组件将会被缓存！-->
<keep-alive>
  <component v-bind:is="currentTabComponent"></component>
</keep-alive>
```

`<keep-alive>` 包裹动态组件时，**会缓存不活动的组件实例，而不是销毁它们**。和 `<transition>` 相似， `<keep-alive>` 是一个抽象组件：它**自身不会渲染一个 DOM 元素**，也不会出现在组件的父组件链中。

当组件在 `<keep-alive>` 内被切换，它的 activated 和 deactivated 这两个生命周期钩子函数将会被对应执行。

注意， `<keep-alive>` 是用在其一个直属的子组件被开关的情形。如果你在其中有 v-for 则不会工作。如果有上述的多个条件性的子元素， `<keep-alive>` 要求同时**只有一个子元素**被渲染。

```html
<!-- 基本 -->
<keep-alive>
  <component :is="view"></component>
</keep-alive>

<!-- 多个条件判断的子组件 -->
<keep-alive>
  <comp-a v-if="a > 1"></comp-a>
  <comp-b v-else></comp-b>
</keep-alive>

<!-- 和 `<transition>` 一起使用 -->
<transition>
  <keep-alive>
    <component :is="view"></component>
  </keep-alive>
</transition>
```

## vue 的转换器

常见的时间转换器

```vue
<div>
{{time | dateFormat}}
</div>

import moment from 'moment'; export default { filters: { const dateFormat =
timeStamp => { return moment(timeStamp * 1000).format('YYYY-MM-DD HH:mm:ss'); };
} }
```

## new Vue()的时候发生了什么

主要做一些初始化的工作，比如通过 `lifecycleMixin` 方法来初始化生命周期。同时看到 Vue 只能通过 new 关键字初始化，然后会调用 `this._init` 方法，该方法为 Vue 原型上的方法，接着我们追踪至 `_init` 函数。 该方法在 `src/core/instance/init.js` 中定义。

```js
export function initMixin(Vue: Class < Component > ) {
    Vue.prototype._init = function(options ? : Object) {
        const vm: Component = this
        // a uid
        vm._uid = uid++
            ...
            // expose real self
            vm._self = vm
        initLifecycle(vm) // 初始化生命周期
        initEvents(vm) // 初始化事件中心
        initRender(vm) // 初始化渲染
        callHook(vm, 'beforeCreate')
        initInjections(vm) // resolve injections before data/props
        initState(vm) // 初始化 data、props、computed、watcher 等等
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

Vue 初始化主要就干了几件事情，合并配置，初始化生命周期，初始化事件中心，初始化渲染，初始化 `data、props、computed、watcher` 等等，最后初始化完成检测到如果有 el 属性，则调用 `vm.$mount` 方法挂载 vm，挂载的目标就是把模板渲染成最终的 DOM；此过程我们重点关注 `initState` 以及 最后执行的 `mount` 。

## vue 生命周期

- beforeCreate：是 new Vue()之后触发的第一个钩子，在当前阶段 data、methods、computed 以及 watch 上的数据和方法都不能被访问。
- created：在实例创建完成后发生，当前阶段已经完成了数据观测，也就是可以使用数据，更改数据，在这里更改数据不会触发 updated 函数。可以做一些初始数据的获取，在当前阶段无法与 Dom 进行交互，如果非要想，可以通过 vm.$nextTick 来访问 Dom。
- beforeMount：发生在挂载之前，在这之前 template 模板已导入渲染函数编译。而当前阶段虚拟 Dom 已经创建完成，即将开始渲染。在此时也可以对数据进行更改，不会触发 updated。
- mounted：在挂载完成后发生，在当前阶段，真实的 Dom 挂载完毕，数据完成双向绑定，可以访问到 Dom 节点，使用$refs 属性对 Dom 进行操作。
- beforeUpdate：发生在更新之前，也就是响应式数据发生更新，虚拟 dom 重新渲染之前被触发，你可以在当前阶段进行更改数据，不会造成重渲染。
- updated：发生在更新完成之后，当前阶段组件 Dom 已完成更新。要注意的是避免在此期间更改数据，因为这可能会导致无限循环的更新。
- beforeDestroy：发生在实例销毁之前，在当前阶段实例完全可以被使用，我们可以在这时进行善后收尾工作，比如清除计时器。
- destroyed：发生在实例销毁之后，这个时候只剩下了 dom 空壳。组件已被拆解，数据绑定被卸除，监听被移出，子实例也统统被销毁。

## 为什么组件的 data 必须是一个函数

一个组件可能在很多地方使用，也就是会创建很多个实例，如果 data 是一个对象的话，对象是引用类型，一个实例修改了 data 会影响到其他实例，所以 data 必须使用函数，为每一个实例创建一个属于自己的 data，使其同一个组件的不同实例互不影响。

## 组件间通信

父子组件通信
父组件 -> 子组件：prop

子组件 -> 父组件：$on/$emit

获取组件实例：使用$parent/$children，

$refs.xxx，获取到实例后直接获取属性数据或调用组件方法

兄弟组件通信

Event Bus：每一个Vue实例都是一个Event Bus，都支持$on/$emit，可以为兄弟组件的实例之间new一个Vue实例，作为Event Bus进行通信。

Vuex：将状态和方法提取到Vuex，完成共享

跨级组件通信使用provide/inject

Event Bus：同兄弟组件Event Bus通信

Vuex：将状态和方法提取到Vuex，完成共享
