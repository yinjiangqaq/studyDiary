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
