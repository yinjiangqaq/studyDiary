## ReactHooks

reactHooks 是 react16.7.0-alpha 版本推出的新特性。**reactHooks 要解决的问题是状态共享**，是继**渲染道具(render-props)**和**高阶分量(higher-order components)**之后的第三种状态共享方案，**不会产生 JSX 嵌套地狱问题**。这个状态指的是状态逻辑，所以称为状态逻辑拓扑会更合适，因为只共享数据处理逻辑，不会共享数据本身。

先上下面一段 renderProps 代码：

```js
function App() {
    return ( <
        Toggle initial = {
            false
        } > {
            ({
                on,
                toggle
            }) => ( <
                Button type = "primary"
                onClick = {
                    toggle
                } > Open Modal < /Button> <
                Modal visible = {
                    on
                }
                onOk = {
                    toggle
                }
                onCancel = {
                    toggle
                }
                />
            )
        } <
        /Toggle>
    )
}
```

react hooks 的形式：

```js
function App() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button type="primary" onClick={() => setOpen(true)}>
        Open Modal{" "}
      </Button>{" "}
      <Modal
        visible={open}
        onOk={() => setOpen(false)}
        onCancel={() => setOpen(false)}
      />{" "}
    </>
  );
}
```

可以看到， `React Hooks` 就像一个内置的打平 `renderProps` 库，我们可以随时创建一个值，与修改这个值的方法。看上去像 `function` 形式的 `setState` ，其实这等价于依赖注入，与使用 `setState` 相比，这个组件是没有状态的。

## reactHooks 的特点

1. 多个状态不会产生嵌套，写法还是平铺的（renderProps 可以通过 compose 解决，可不但使用略为繁琐，而且因为强制封装一个新对象而增加了实体数量）。
2. Hooks 可以引用其他 Hooks。
3. 更容易将组件的 UI 与状态分离。

## hooks 和 class component 的区别

https://www.jianshu.com/p/e22f941c1439

1. 函数组件和类组件
2. class 需要我们对 this 的指向很了解，当业务增多，组件越来越复杂时，这样的 class 组件很难拆分，组件复用状态的话，得通过高阶组件或者 render props，像 redux 中 connect 或者 react-route 中的 withRouter，这些高阶组件设计的目的就是为了状态的复用。

一、简化代码

声明一个简单的组件只要简单的几行代码；

二、容易上手

对于初学者来说，相对复杂的 class 的声明周期，hooks 的钩子函数更好理解；

三、简化业务

充分利用组件化的思想把业务拆分成多个组件，便于维护；

四、方便数据管理

相当于三种的提升，各个组件不用通过非常复杂的 props 多层传输，解耦操作；

五、便于重构

业务改变或者接手别人的代码，代码都是比较容易读懂；

## hooks 如何引用其他 hooks

```js
import { useState, useEffect } from "react";

// 底层 Hooks, 返回布尔值：是否在线
function useFriendStatusBoolean(friendID) {
  const [isOnline, setIsOnline] = useState(null);

  function handleStatusChange(status) {
    setIsOnline(status.isOnline);
  }
  //首次渲染进行的
  useEffect(() => {
    ChatAPI.subscribeToFriendStatus(friendID, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(friendID, handleStatusChange);
    };
  }, []); //后面加[]只是为了执行一次

  return isOnline; //返回是否在线的boolean值
}

// 上层 Hooks，根据在线状态返回字符串：Loading... or Online or Offline
function useFriendStatusString(props) {
  //直接调用底层的useFriendStatusBoolean拿到用户在线状态
  const isOnline = useFriendStatusBoolean(props.friend.id);

  if (isOnline === null) {
    return "Loading...";
  }
  return isOnline ? "Online" : "Offline";
}

// 使用了底层 Hooks 的 UI，根据用户在线状态，显示用户在线和非在线的UI，渲染组件，返回的是JSX
function FriendListItem(props) {
  const isOnline = useFriendStatusBoolean(props.friend.id);

  return (
    <li
      style={{
        color: isOnline ? "green" : "black",
      }}
    >
      {" "}
      {props.friend.name}{" "}
    </li>
  );
}

// 使用了上层 Hooks 的 UI
function FriendListStatus(props) {
  const status = useFriendStatusString(props);

  return <li> {status} </li>;
}
```

这个例子中，有两个 ` Hooks` `：useFriendStatusBoolean` 与 `useFriendStatusString` , `useFriendStatusString` 是利用 `useFriendStatusBoolean` 生成的新 `Hook` ，这两个 Hook 可以给不同的 UI： `FriendListItem` 、 `FriendListStatus` 使用，而因为两个 Hooks 数据是联动的，因此两个 UI 的状态也是联动的。 顺带一提，这个例子也可以用来理解 对 React Hooks 的一些思考 一文的那句话：“有状态的组件没有渲染，有渲染的组件没有状态”：

- `useFriendStatusBoolean` 与 `useFriendStatusString` 是有状态的组件（使用 useState），没有渲染（返回非 UI 的值），这样就可以作为` Custom Hooks` 被任何 UI 组件调用。
- `FriendListItem `与 `FriendListStatus` 是有渲染的组件（返回了 JSX），没有状态（没有使用 `useState`），这就是一个纯函数 UI 组件，

## 利用 useState 创建 Redux

**Redux 的精髓就是 `Reducer` **，而利用 react Hooks 可以轻松创建一个 Redux 机制

### 什么是 Redux

redux 是 JavaScript 状态容器，提供可预测化的状态管理

redux 的设计思想很简单，就两句话：

1. web 应用是一个状态机，视图与状态一一对应
2. 所有状态都保存在一个对象里面

redux 有三大准则：

1. 单一数据源。

   整个应用状态，都应该被存储在单一 store 的对象树中。

2. 只读状态.

   唯一可以修改状态的方式，就是发送（dispatch）一个动作（Action），通俗来讲，就是说只有 getter，没有 setter。

3. 使用纯函数去修改状态，（纯函数是指 不依赖于且不改变它作用域之外的变量状态 的函数，也就是说， 纯函数的返回值只由它调用时的参数决定 ，它的执行不依赖于系统的状态（比如：何时、何处调用它）。纯函数保障了状态的稳定性，不会因不同环境导致应用程序出现不同情况

redux 的几个概念：

- Action

Action 是唯一可以改变状态的途径，服务器的各种推送、用户自己做的一些操作，最终都会转换成一个个的 Action，而且这些 Action 会按顺序执行，这种简单化的方法用起来非常的方便。Action 是一个对象。其中的 type 属性是必须的，表示 Action 的名称：

```js
const action = {
    type: 'login',
    payload: ...,
    ...
}
```

- store

  Store 管理着整个应用的状态，store 可以理解为一个存储数据的仓库，一个应用就这么一个仓库，但本质上这个 store 是一个对象。 `Redux` 通过 `createStore` 这个函数，来生成 `store` 对象：

```js
import { createStore } from "redux";
const store = createStore(fn);
```

store 提供了一个方法 dispatch，这个就是用来发送一个动作，去修改 store 里面的状态

```js
//store.dispatch(action)
store.dispatch({
    type: 'login',
    payload: ...,
})
```

然后通过 getState 方法来重新获得最新的状态，也就是 state

```js
import { createStore } from "redux";
const store = createStore(fn);
const state = store.getState();
```

redux 规定：**一个 state 对应一个 view**，只要 state 相同，view 就相同。简单来说 `getState()` 会返回**当前的 state 树**。state 是当前的状态

- reducer

  当 `dispatch` 之后，getState 的状态发生了改变， `Reducer` 就是用来**修改状态**的。**Reducer 是一个函数，它接受 Action 和当前 State 作为参数，返回一个新的 State。**

### 如何做 store 的全局绑定

首先我们能想到的是在根文件 index.js 中 createStore()创建一个 store 对象，然后绑定在全局上下文里面。

具体如何实现呢

```js
//./index.js
// import React from 'react';
import ReactDOM from "react-dom";
import App from "./App";
import React from "react";
import makeStore from "./store/index";
import { StoreContext } from "redux-react-hook"; //为了全局保存store

const store = makeStore(); //创建store对象，然后StoreContext全局保存
ReactDOM.render(
  <StoreContext.Provider value={store}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </StoreContext.Provider>,
  document.getElementById("root")
);
```

其他组件如何获取到全局的 store 对象呢

```js
//baseHeader.js
import React, { useEffect, useCallback, useContext, useState } from "react";

import { useDispatch, useMappedState, StoreContext } from "redux-react-hook";

const store = useContext(StoreContext); //拿到全局的store
```

### redux 总结

通过 store 对象来存储各个 state(各种状态)，组件通过 `store.dispatch(action)` 方法通知 store 对象修改相应的状态。而真正修改状态的是 `reducer` 。而 `reducer` 是一个函数它接受 `Action` 和当前 `State` 作为参数，返回一个新的 `State。` 然后组件通过 `store.getState()` 拿到新的状态，从而渲染新的 view

> 要知道，redux 只是一个状态管理工具，只是暂时性储存状态信息，只是一个内存的概念，并不能拿来做缓存，不像 localstorage 和 cookie，redux 是页面一刷新，就重新初始化的一个东西，不适合拿来做缓存。

```js
// 这就是 Redux
function useReducer(reducer, initialState) {
  const [state, setState] = useState(initialState);

  function dispatch(action) {
    const nextState = reducer(state, action);
    setState(nextState);
  }

  return [state, dispatch];
}
```

## React.memo

React 16.6.0 正式发布了！这次主要更新了两个新的重要功能：

- `React.memo()`: 控制何时重新渲染组件
- `React.lazy()`: 使用 `React Suspense` 进行代码拆分和懒加载

### React.memo() 是什么？

`React.memo()` 和 `PureComponent` 很相似，它帮助我们控制何时重新渲染组件。

> 组件仅在**它的 props 发生改变的时候进行重新渲染**。通常来说，在组件树中 React 组件，只要有变化就会走一遍渲染流程。但是通过 PureComponent 和 React.memo()，我们可以仅仅让某些组件进行渲染。

让需要重新渲染的组件重新渲染，所以这是一个性能提升

```js
const ToBeBetterComponent = React.memo(function MyComponent(props) {
  // only renders if props have changed
});
```

`PureComponent` 要依靠 `class` 才能使用。而 `React.memo()` 可以和 `functional component` (函数式组件 F) 一起使用。

```js
import React from "react";

const MySnowyComponent = React.memo(function MyComponent(props) {
  // only renders if props have changed!
});

// can also be an es6 arrow function
const OtherSnowy = React.memo((props) => {
  return <div> my memoized component </div>;
});

// and even shorter with implicit return
const ImplicitSnowy = React.memo((props) => (
  <div> implicit memoized component </div>
));
```

由于 ` React.memo()` 是一个高阶组件，你可以使用它来包裹一个已有的 `functional component` ：

```js
const RocketComponent = (props) => (
  <div> my rocket component. {props.fuel}! </div>
);

// create a version that only renders on prop changes
const MemoizedRocketComponent = React.memo(RocketComponent);
```

### 为什么称为 memo

> 在计算机领域，**记忆化**是一种主要用来提升计算机程序速度的优化技术方案。它将开销较大的函数调用的返回结果存储起来，当同样的输入再次发生时，则返回缓存好的数据，以此提升运算效率。

## Vuex

vuex 包括这几个部分， `module` ， `state` ， `mutation` ， `action` ， `getters` (计算属性)

module：vuex 可以拆分出很多个模块，每个 `module` 包括 `state` ， `mutation` ， `action` ，然后再 export 出去，在 `store文件夹` ，统一把所有的 `module` `import` 进来，包装成统一的一个 vuex 状态管理机。

state: 顾名思义，状态，一个储存状态的对象。

mutation：真正改变状态的一个东西，

```js
//一个mutation例子
const state = {
  userInfo: null,
};
const mutations = {
  UPDATE_USERINFO(state, val) {
    state.userInfo = val;
  },
};
```

action: 可以支持异步操作逻辑的，但是最后需要改变状态的话，需要通过 commit(mutation，val)传给 mutation 改变相应的状态

```js
//一个actions例子,更新用户信息

export default {
  async getAndUpdateUserInfo({ state, commit, dispatch, rootstate }) {
    const res = await getUserInfo();
    if (!res || res.code !== 0) {
      commit("UPDATE_USERINFO", null);
    }

    if (res.data) {
      commit("UPDATE_USERINFO", res.data);
    }
  },
};
```

然后在开发过程中，如果需要更新用户状态，需要通过 `dispatch` , 来调用对应的 `action` ，相应的 `commit` 到对应的 `mutations` ，更新到对应的状态，然后再 `get` 到对应的状态。

```js
//例如在router.beforeEach(async (to,from,next)=>{})函数中调用
router.app.$options.store.dispatch("userInfo/getAndUpdateUserInfo");
```

## React 中 backgroundImage 引入图片

```js
import Image from "../../assets/imgs/IU.jpeg";

export default function () {
  return (
    <div
      className="to-change-background-of"
      style={{ backgroundImage: `url(${Image})` }}
    />
  );
}
```

## antd 中，form 表单的 input 组件如果改造了，像在 input 组件里面加按钮，怎么解决 form 实例读不到 input 输入的值，最终那个字段一直是 undefined

这种情况，需要在外层加一个 row 和 col,才能让 antd 识别到这个字段，并且读到 input 中的值

```

     <Form.Item
            name="verifycode"
            rules={[
              {
                required: true,
                message: '请输入邮箱验证码',
              },
            ]}
          >
            <Row>
              <Col style={{ width: `100%` }}>
                <Input placeholder="请输入邮箱验证码" size="large" />
                <Button
                  type="default"
                  disabled={!checkEmail}
                  className="verifyCodeButton"
                  onClick={getVerifyCode}
                >
                  获取邮箱验证码
                </Button>
              </Col>
            </Row>
          </Form.Item>
```

## styled-components 很强大， styled-components 创建的组件可以传 props

https://www.cnblogs.com/suihang/p/9971890.html

```ts
import React, { Component, Fragment } from "react";
//引入styled-components
import styled from "styled-components";

//props传递参数（根据参数的值设置样式）
// 有传递值字体会变为红色
// 无传递值会默认取蓝色
interface IButtonProps {
  inputColor: string;
}
const Button = styled.button`
  padding: 0.5em;
  margin: 0.5em;
  color: ${(props: IButtonProps) => props.inputColor || "blue"};
  background: papayawhip;
  border: none;
  border-radius: 3px;
`;

class App extends Component {
  render() {
    return (
      <Fragment>
        <Button inputColor="red">红牛啊</Button>
      </Fragment>
    );
  }
}
export default App;
```

## useEffect hook 里面的函数参数不能 写 async 声明

至于需要在 useEffect 里面执行异步请求的，可以采取如下的方式，通过在里面再包一层立即执行函数，对这个立即执行函数进行异步操作

```
//初始化操作
    useEffect( ()=>{
      (
        async ()=>{
          let token = getToken('token');
          let res = await baseGet({},'user',{'x-blackcat-token':token})
          console.log(res)//拿到用户信息
        }
      )()

    // let {id ,...extraDetail}=res
    // setUserDetail(res)
  },[])
```

## 一些常用的 hooks

### useState

```js
const [state, setState] = useState(initialState);
```

返回一个 state，以及更新 state 的函数。

在初始渲染期间，返回的状态 (state) 与传入的第一个参数 (initialState) 值相同。

setState 函数用于更新 state。它接收一个新的 state 值并将组件的一次重新渲染加入队列。

> 与 class 组件中的 setState 方法不同，useState 不会自动合并更新对象。你可以用函数式的 setState 结合展开运算符来达到合并更新对象的效果。useReducer 是另一种可选方案，它更适合用于管理包含多个子值的 state 对象

```js
const [state, setState] = useState({});
// 使用回调的方式，是因为React中的setState无法确保组件执行更新的时候，能够每次都能及时拿到更新之后的值，所以useState中的setState还提供了一种回调的方式，setState((preState)=>{xxx; return {new State}})
setState((prevState) => {
  // 也可以使用 Object.assign
  return { ...prevState, ...updatedValues };
});

//也就是h函数式组件里面的useState中的set方法更新的只是单纯这个state，不像class组件，setState方法，会自动把更新的这个对象，更新合并到这个组件全局的state里面。
```

#### 惰性初始 state,初始值需要做相关的运算

initialState 参数只会在组件的初始渲染中起作用，后续渲染时会被忽略。如果初始 state 需要通过复杂计算获得，则可以传入一个函数，在函数中计算并返回初始的 state，**此函数只在初始渲染时被调用：**

```
const [state, setState] = useState(() => {
  const initialState = someExpensiveComputation(props);
  return initialState;
});

```

#### 对 ant design 的表单做操作的时候衍生出来的一些思考和尝试

因为`useEffect`没法监听到 form 表单的更新，因为`useForm()`拿到的 form 表单的对象其实是像`ref`的一个东西，**没法监听到他的更新**的。所以如果想要触发更新，拿到最新的 form 表单对象，其实可以通过一种旁门左道哈。就是 hack 一个 state，

```
import React from 'react';

export default () => {
  const [, setState] = React.useState({});
  return () => setState({});
};
```

每次`setFormFieldsValue`之后，调用这个 hook 触发**组件的的更新**, 进行重新渲染，这时候就能针对 form 表单对象的变化而做出 UI 上的变化了，对于一些没有被 ant design 表单元素包含的一些组件，可以通过这种方法来触发他的更新

而这里有触发了对 useState 的重新思考，我们只有 set 了一个跟**之前不一样**的值，才会**触发组件的更新**，而 useEffect 来说，只是因为 setState 了一个跟之前不同的值，**而此时 useEffect 中的依赖项又有相应的 state 值，才会触发 use Effect 回调的再次执行**，如果没有 useEffect 依赖中**没有相应的依赖项 state**，就算 state 变化，也是不会触发 useEffect 的再次执行的

```ts
import React from "react";
import "antd/dist/antd.css";
import "./index.css";
import { Button, Checkbox, Form, Input } from "antd";

const App = () => {
  const [, setTrueOrFalse] = React.useState(false);
  const onFinish = (values) => {
    console.log("Success:", values);
    setTrueOrFalse(true); // 这里只会触发两次打印 xxxxx，第一次式刚进来的时候，第二次是因为从false 被设为 true了，后续都不会打印了，因为没有更新了
  };
  console.log("xxxxxx ");
  React.useEffect(() => {
    console.log("xxxxx run useEffect"); //这里只会执行一次，因为依赖项里没有trueOrFalse这个state
    // setTrue(false) //如果这句话执行
  }, []);
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <Form
      name="basic"
      labelCol={{
        span: 8,
      }}
      wrapperCol={{
        span: 16,
      }}
      initialValues={{
        remember: true,
      }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item
        label="Username"
        name="username"
        rules={[
          {
            required: true,
            message: "Please input your username!",
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[
          {
            required: true,
            message: "Please input your password!",
          },
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        name="remember"
        valuePropName="checked"
        wrapperCol={{
          offset: 8,
          span: 16,
        }}
      >
        <Checkbox>Remember me</Checkbox>
      </Form.Item>

      <Form.Item
        wrapperCol={{
          offset: 8,
          span: 16,
        }}
      >
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default App;
```

### useEffect

**在函数组件主体内（这里指在 React 渲染阶段）改变 DOM、添加订阅、设置定时器、记录日志以及执行其他包含副作用的操作都是不被允许的**，因为这可能会产生莫名其妙的 bug 并破坏 UI 的一致性。

使用 useEffect 完成副作用操作。赋值给 useEffect 的函数会在组件渲染到屏幕之后执行。你可以把 effect 看作从 React 的纯函数式世界通往命令式世界的逃生通道。

默认情况下，**effect 将在每轮渲染结束后执行，但你可以选择让它 在只有某些值改变的时候 才执行**。

#### 清除 effect

通常，组件卸载时需要清除 effect 创建的诸如订阅或计时器 ID 等资源。要实现这一点，useEffect 函数需`返回一个清除函数`。以下就是一个创建订阅的例子：

```js
useEffect(() => {
  const subscription = props.source.subscribe();
  return () => {
    // 清除订阅
    subscription.unsubscribe();
  };
});
```

**为防止内存泄漏，清除函数会在组件卸载前执行**。另外，如果组件多次渲染（通常如此），则在执行下一个 effect 之前，上一个 effect 就已被清除。在上述示例中，意味着组件的每一次更新都会创建新的订阅。

#### effect 的执行时机

与 `componentDidMount`、`componentDidUpdate` 不同的是，传给 `useEffect` 的函数**会在浏览器完成布局与绘制之后**，**在一个延迟事件**中被调用。这使得它适用于许多常见的副作用场景，比如设置订阅和事件处理等情况，因为绝大多数操作不应阻塞浏览器对屏幕的更新。

然而，并非所有 effect 都可以被延迟执行。例如，**一个对用户可见的 DOM 变更就必须在浏览器执行下一次绘制前被同步执行，这样用户才不会感觉到视觉上的不一致。**（概念上类似于被动监听事件和主动监听事件的区别。）React 为此提供了一个额外的 useLayoutEffect Hook 来处理这类 effect。它和 useEffect 的结构相同，区别只是调用时机不同。

虽然 useEffect 会在浏览器绘制后延迟执行，但会保证在任何新的渲染前执行。在开始新的更新前，React 总会先清除上一轮渲染的 effect。

#### effect 的条件执行

默认情况下，effect 会在每轮组件渲染完成后执行。这样的话，一旦 effect 的依赖发生变化，它就会被重新创建。

然而，在某些场景下这么做可能会矫枉过正。比如，在上一章节的订阅示例中，我们不需要在每次组件更新时都创建新的订阅，而是仅需要在 source prop 改变时重新创建。

要实现这一点，可以给 useEffect 传递**第二个参数，它是 effect 所依赖的值数组。**更新后的示例如下：

```js
useEffect(() => {
  const subscription = props.source.subscribe(); //这边建立了定时器，订阅事件
  return () => {
    subscription.unsubscribe(); //需要return一个函数，取消订阅这个事件，取消订阅这个定时器
  };
}, [props.source]); //依赖项
```

此时，只有当 props.source 改变后才会重新创建订阅。

> 如果想执行只运行一次的 effect（仅在组件挂载和卸载时执行），可以传递一个空数组（[]）作为第二个参数。这就告诉 React 你的 effect 不依赖于 props 或 state 中的任何值，所以它永远都不需要重复执行。这并不属于特殊情况 —— 它依然遵循输入数组的工作方式。
>
> 如果你传入了一个空数组（[]），effect 内部的 props 和 state 就会一直持有其初始值。尽管传入 [] 作为第二个参数有点类似于 componentDidMount 和 componentWillUnmount 的思维模式，但我们有 更好的 方式 来避免过于频繁的重复调用 effect。除此之外，请记得 React 会等待浏览器完成画面渲染之后才会延迟调用 useEffect，因此会使得处理额外操作很方便。

### useContext

```js
const value = useContext(MyContext);
```

接收一个 context 对象（`React.createContext` 的返回值）并返回该 `context` 的当前值。当前的 `context` 值由上层组件中距离当前组件最近的 `<MyContext.Provider>` 的 value prop 决定。

当组件上层最近的 `<MyContext.Provider>` 更新时，该 Hook 会触发重渲染，并使用最新传递给 `MyContext provider` 的 `context value` 值。即使祖先使用 `React.memo` 或 `shouldComponentUpdate`，也会在组件本身使用 `useContext` 时重新渲染。

别忘记 useContext 的参数必须是 context 对象本身

- 正确： useContext(MyContext)
- 错误： useContext(MyContext.Consumer)
- 错误： useContext(MyContext.Provider)

> 如果你在接触 Hook 前已经对 context API 比较熟悉，那应该可以理解，useContext(MyContext) 相当于 class 组件中的 static contextType = MyContext 或者 `<MyContext.Consumer>`。
>
> useContext(MyContext) 只是让你能够读取 context 的值以及订阅 context 的变化。你仍然需要在上层组件树中使用 `<MyContext.Provider>` 来为下层组件提供 context。

```js
const themes = {
  light: {
    foreground: "#000000",
    background: "#eeeeee",
  },
  dark: {
    foreground: "#ffffff",
    background: "#222222",
  },
};

const ThemeContext = React.createContext(themes.light);

function App() {
  return (
    <ThemeContext.Provider value={themes.dark}>
      <Toolbar />
    </ThemeContext.Provider>
  );
}

function Toolbar(props) {
  return (
    <div>
      <ThemedButton />
    </div>
  );
}

function ThemedButton() {
  const theme = useContext(ThemeContext);
  return (
    <button style={{ background: theme.background, color: theme.foreground }}>
      I am styled by theme context!
    </button>
  );
}
```

### useReducer

```js
const [state, dispatch] = useReducer(reducer, initialArg, init);
```

`useState` 的替代方案。它接收一个形如 `(state, action) => newState 的 reducer`，并返回当前的 state 以及与其配套的 dispatch 方法。（如果你熟悉 Redux 的话，就已经知道它如何工作了。）

在某些场景下，useReducer 会比 useState 更适用，例如 state 逻辑较复杂且包含多个子值，或者下一个 state 依赖于之前的 state 等。并且，使用 useReducer 还能给那些会触发深更新的组件做性能优化，因为你可以向子组件传递 dispatch 而不是回调函数 。

以下是用 reducer 重写 useState 一节的计数器示例：

```js
const initialState = { count: 0 };

function reducer(state, action) {
  switch (action.type) {
    case "increment":
      return { count: state.count + 1 };
    case "decrement":
      return { count: state.count - 1 };
    default:
      throw new Error();
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <>
      Count: {state.count}
      <button onClick={() => dispatch({ type: "decrement" })}>-</button>
      <button onClick={() => dispatch({ type: "increment" })}>+</button>
    </>
  );
}
```

#### 惰性初始化

你可以选择惰性地创建初始 state。为此，需要将 init 函数作为 useReducer 的第三个参数传入，这样初始 state 将被设置为 init(initialArg)。

这么做可以将用于计算 state 的逻辑提取到 reducer 外部，这也为将来对重置 state 的 action 做处理提供了便利：

```js
function init(initialCount) {
  return { count: initialCount };
}

function reducer(state, action) {
  switch (action.type) {
    case "increment":
      return { count: state.count + 1 };
    case "decrement":
      return { count: state.count - 1 };
    case "reset":
      return init(action.payload);
    default:
      throw new Error();
  }
}

function Counter({ initialCount }) {
  const [state, dispatch] = useReducer(reducer, initialCount, init);
  return (
    <>
      Count: {state.count}
      <button
        onClick={() => dispatch({ type: "reset", payload: initialCount })}
      >
        Reset
      </button>
      <button onClick={() => dispatch({ type: "decrement" })}>-</button>
      <button onClick={() => dispatch({ type: "increment" })}>+</button>
    </>
  );
}
```

### useCallback

```js
const memoizedCallback = useCallback(() => {
  doSomething(a, b);
}, [a, b]);
```

返回一个 memoized 回调函数。

把内联回调函数及依赖项数组作为参数传入 useCallback，**它将返回该回调函数的 memoized 版本(是一个函数)**，该回调函数仅在某个依赖项改变时才会更新。当你把回调函数传递给经过优化的并使用引用相等性去避免非必要渲染（例如 shouldComponentUpdate）的子组件时，它将非常有用。

`useCallback(fn, deps)` 相当于 `useMemo(() => fn, deps)`。

### useMemo

```js
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
```

返回一个 memoized 值

把“创建”函数和依赖项数组作为参数传入 useMemo，它仅会在某个依赖项改变时才重新计算 memoized 值。这种优化有助于避免在每次渲染时都进行高开销的计算。(相当于 vue 中的 computed)

记住，传入 useMemo 的函数会在**渲染期间执行**。请**不要在这个函数内部执行与渲染无关的操作**，诸如副作用这类的操作属于 useEffect 的适用范畴，而不是 useMemo。

这种效果就类似于 vue 中的 computed，只能在依赖值发生变化的时候，重新更新计算一下这个值，而不能做改变 UI 相关的异步操作，例如异步请求等等。

如果没有提供依赖项数组，useMemo 在每次渲染时都会计算新的值。（跟 useEffect 一样，如果不传入数组，每次渲染都会执行，useEffect 传入空数组会让这个函数只执行一次）

**你可以把 useMemo 作为性能优化的手段，但不要把它当成语义上的保证**。将来，React 可能会选择“遗忘”以前的一些 memoized 值，并在下次渲染时重新计算它们，比如为离屏组件释放内存。先编写在没有 useMemo 的情况下也可以执行的代码 —— 之后再在你的代码中添加 useMemo，以达到优化性能的目的。

### useRef

```js
const refContainer = useRef(initialValue);
```

useRef 返回一个可变的 ref 对象，其 `.current` 属性被初始化为（initialValue）。返回的 ref 对象在组件的整个生命周期内持续存在。

react FC 中如果对 UI state 没有影响的，都可以放在 ref 里面

一个常见的用例便是命令式地访问子组件：

```js
function TextInputWithFocusButton() {
  const inputEl = useRef(null);
  const onButtonClick = () => {
    // `current` 指向已挂载到 DOM 上的文本输入元素
    inputEl.current.focus();
  };
  return (
    <>
      <input ref={inputEl} type="text" />
      <button onClick={onButtonClick}>Focus the input</button>
    </>
  );
}
```

本质上，`useRef` 就像是可以在其 `.current` 属性中保存一个可变值的“盒子”。

你应该熟悉 ref 这一种访问 DOM 的主要方式。如果你将 ref 对象以 `<div ref={myRef} />` 形式传入组件，则无论该节点如何改变，React 都会将 ref 对象的 .current 属性设置为相应的 DOM 节点

然而，useRef() 比 ref 属性更有用。它可以很方便地保存任何可变值，其类似于在 class 中使用实例字段的方式。也就是说 useRef()不仅仅是为了拿来访问 DOM 元素的。还能保持一个可变值，也就是 useRef()创建一个实例对象，**(这个实例对象的引用一直会被保留，后面修改都是这个 ref 对象)**。

这是因为它创建的是一个普通 Javascript 对象。而 useRef() 和自建一个 {current: ...} 对象的唯一区别是，**useRef 会在每次渲染时返回同一个 ref 对象**。

**请记住，当 ref 对象内容发生变化时，useRef 并不会通知你。变更 .current 属性不会引发组件重新渲染。**如果想要在 React 绑定或解绑 DOM 节点的 ref 时运行某些代码，则需要使用回调 ref 来实现。

### useImperativeHandle \*\*

```js
useImperativeHandle(ref, createHandle, [deps]);
```

`useImperativeHandle` 可以让你在使用 `ref` 时自定义暴露给父组件的实例值。在大多数情况下，应当避免使用 ``ref` 这样的命令式代码。`useImperativeHandle` 应当与 `forwardRef` 一起使用：

```js
function FancyInput(props, ref) {
  const inputRef = useRef();
  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current.focus();
    }
  }));
  return <input ref={inputRef} ... />;
}
FancyInput = forwardRef(FancyInput);
```

在本例中，渲染 `<FancyInput ref={inputRef} />` 的父组件可以调用 inputRef.current.focus()。

### forwardRef

https://juejin.cn/post/6844903734644834312

## useState

```
const [count, setCount] = useState(0);

setCount(count+1);
//这里声明的count是一个常量，让count+1的操作，我们并不推荐使用 setCount(count++)或者setCount(++count)来更改count。因为这样会更改到count的值。不符合常量的设定

++count是返回 count原先的值，但是count会加一，++count是返回加一之后的count
```

## Redux

redux 是状态管理库，与其他框架如 react 是没有直接关系，所以 redux 可以脱离 react 在别的环境下使用。由于没有和 react 相关逻辑耦合，所以 redux 的源码很纯粹，目的就是把如何数据管理好。而真正在 react 项目中使用 redux 时，是需要有一个 react-redux 当作连接器，去连接 react 和 redux

### compose

compose 的实现

```js
export default function compose(...funcs) {
  if (funcs.length == 0) {
    return (arg) => arg;
  }
  if (funcs.length == 1) {
    return funcs[0];
  }
  return funcs.renduce(
    (a, b) =>
      (...args) =>
        a(b(...args))
  );
}
```

其实 compose 函数做的事就是把 `var a = fn1(fn2(fn3(fn4(x))))` 这种嵌套的调用方式改成 `var a = compose(fn1,fn2,fn3,fn4)(x)` 的方式调用。

而按照 redux-compose 官方文档的的定义介绍，`compose(...funcs)(x)`里面的每个参数都是函数，每个函数只会接受一个参数，最右边的函数的执行结果，会作为它上一个函数的参数，以此类推。而 `compose(...funcs)`本身也是一个函数，返回的函数的参数会作为 compose 函数中函数参数列表的最右边的函数的参数。

## useState

```js
const [count, setCount] = useState(0);//首先这么声明useState，表示count是一个常量，唯一改变count的值得方式只要有setCount

submit(){
  setCount(count + 1);
} // 而为什么不设置 setCount(count++)或者setCount(++count)呢，因为后面这两种都会改变count的值，不符合常量的设定。而++count返回的是更改之后的count值，也就是先加，count++是先返回原先值，再加上去，也就是后加

//如果submit方法是在表单提交的时候调用，本身没有任何依赖的话，会导致每次取到的count都是第一次渲染时的count,也就是0。

   render 1
   count_render_1 = 0
   submit_render_1()//执行setCount(count+1),使count 为1，count改变，进入到render2
    ||
    render 2
    count_render_2 = 1
    submit_render_2()//执行setCount(count+1),此时拿到的count依旧是0，count+1,使count为1，跟现在的count_render_2没区别，不会进行下一次render，结束


    //因为React永远都不会创建新值，只会拷贝副本，一开始submit_render_1()的执行使count发生改变，进入render2，render2拷贝的是count=1的副本，count_render_2 = 1,拷贝的submit_render_2()是从render_1中的submit_render_1()拷贝的，里面依赖的count还是原先的count，所以导致后面执行的时候还是从setCount(0+1)

    //两种方式可以使setCount生效，一种是 setCount(count=>count+1) 这种每次执行的时候都会去拿最新的count

    //一种是 submit函数加上useCallback，然后依赖是count
```

## useImperativeHandle 结合 forwardRef 在函数组件中实现父组件调用子组件的属性和方法

我们知道在 hook 中有 react.useRef()来创建一个 ref，对于类组件来说，可以直接赋值在 ref 属性上

```ts
class A {
  return(
    <div ref={props.ARef}></div>
  )
}

const B = (props)=>{
  const ARef = React.useRef()
  return(
    <A ref={ARef}></A>
  )
}
```

但是如果 A 组件是一个函数式组件的话，就不能直接给它赋值 ref 属性，因为函数式组件不支持。所以函数式组件要使用 ref 属性，就要使用`forwardRef`。

`forwardRef`的作用是什么呢？

> forwardRef 是一个高阶函数，会创建一个 React 组件，这个组件能够将其接收的 ref 属性转发到其组件树下面的另一个组件中。其目的就是希望在封装组建的时候，外层组件可以通过 ref 直接控制内层组建的或元素的行为

所以如果 A 组件是一个函数组件的话，就用通过这样的方式来声明组件才能支持 ref

```ts
const A = React.forwardRef((props, ref) => {
  return <div ref={props.ARef}></div>;
});
```

下面可以详细看一个具体的例子：

```ts
import React, { useRef, forwardRef } from "react";

const SonComponent = forwardRef((props, refparams) => {
  return (
    <>
      <div>
        <input type="text" defaultValue={props.value} ref={refparams} />
        <button onClick={() => console.log(refparams.current)}>
          点击打印ref
        </button>
      </div>
    </>
  );
});

const FatherComponent = () => {
  const sonRef = useRef();
  return (
    <>
      <SonComponent ref={sonRef} value="这是子组件的value值" />
    </>
  );
};
```

分析： 在父组件 FatherComponent 中设置 sonRef 并传给了子组件的 ref 属性，在定义子组件时用 forwardRef 包裹渲染函数并传入 props，refparamas 两个参数，refparamas 对应的是子组件的 ref 属性，并且 SonComponent 组件将 ref 转发给其内部的 input 框，此时，点击按钮就可以获取到这个 input 框；

### useImperativeHandle ---> 父组件调用子组件的属性和方法的钩子函数

这个 hook 接受三个参数：

1. 父组件传过来的 ref
2. 处理函数，函数的返回值就是传给父组件的方法和属性
3. 依赖项，表示只要依赖项发生改变，才会把最新的属性和方法传给父组件；如果没有依赖项，表示只要子组件 render 都会把属性和方法传给父组件

所以把 forwardRef 和 useImrativeHandle 结合起来就是：

```ts
import React,{useRef,forwardRef} from 'react'

const SonComponent = forwardRef((props, refparams) => {
useImperativeHandle(refparams, () => {
    return {
      logSon: () => {
        console.log('测试');
      }
    }
  },[])

    return (
        <>
            <div>
                <input type="text" defaultValue={props.value} ref={refparams} />
                <button onClick={() => console.log(refparams.current)}>点击打印ref</button>
            </div>
        </>

    )
})

const FatherComponent = () => {
    const sonRef = useRef()

    useEffect(()=>{
          sonRef.current.logSon()  ----测试
    },[])

    return (
        <>
            <SonComponent ref={sonRef} value='这是子组件的value值' />
        </>
    )
}

```

## Effect 里面最好不要做异步操作.

如果 effect 里面是有异步请求的，很可能会导致整个数据流发生混乱，导致拿到的还是上一次的值

所以一般 effect 里面**不让执行异步操作**

## useState

所以不建议用下面的方式进行 useState 的初始化

```ts
useState(func());
func(); // 会执行多次，但是useState的初始化用的初始化值，只会用第一次func()执行的结果
```

如何用让 useState 里面的函数只执行一次呢,下面是推荐写法

```ts
const funcA = () => a;
const [A, setA] = React.useState(funcA); // 传入一个函数，这样子funcA只会在useState初始化执行的时候，执行一次
```

## 当 useEffect 使用 useRef 作为依赖时，useRef 的值更新，不会触发 useEffect，但是如果此时有一个 useState 的值发生了更新，就会触发 useRef 的这个 useEffect 的那个 hook

示例:

```ts
import { useState, useEffect, useRef } from "react";

export default () => {
  const [count, setCount] = useState(0);
  const countRef = useRef(0);

  // 取名为useEffect1
  useEffect(() => {
    console.log("count", count);
  }, [count]);

  // 取名为useEffect2
  useEffect(() => {
    console.log("countRef", countRef);
  }, [countRef.current]);

  return (
    <div>
      <p>{count}</p>
      <button onClick={() => setCount((c) => c + 1)}>button1</button>
      <button onClick={() => (countRef.current += 1)}>button2</button>
    </div>
  );
};
```
* 点击 button1 时，会触发 useEffect1

* 点击 button2 时，不会触发 useEffect2

* 再次点击 button1 时，会触发 useEffect1 和 useEffect2

原因： useRef出来的countRef.current是一个基本类型， countRef的对象是不会认为是一个state，如果它更新并不会触发Effect2的更新。但是再次点击button1的时候，会触发setState,导致组件更新，这时候页面所有的hook都是重新执行，判断依赖更新，因为countRef.current是一个基础类型，检查到值发生了变化,Effect2就会触发更新