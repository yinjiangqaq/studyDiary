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

## hooks 如何引用其他 hooks

```js
import { useState, useEffect } from "react";

// 底层 Hooks, 返回布尔值：是否在线
function useFriendStatusBoolean(friendID) {
  const [isOnline, setIsOnline] = useState(null);

  function handleStatusChange(status) {
    setIsOnline(status.isOnline);
  }

  useEffect(() => {
    ChatAPI.subscribeToFriendStatus(friendID, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(friendID, handleStatusChange);
    };
  });

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

### redux 总结

通过 store 对象来存储各个 state(各种状态)，组件通过 `store.dispatch(action)` 方法通知 store 对象修改相应的状态。而真正修改状态的是 `reducer` 。而 `reducer` 是一个函数它接受 `Action` 和当前 `State` 作为参数，返回一个新的 `State。` 然后组件通过 `store.getState()` 拿到新的状态，从而渲染新的 view

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
