# redux

按照我的理解, redux 是 大型 react 项目里面状态管理的一种方式，是一种状态机的概念，有着 default state,然后接受 VIEW 层传递的 action({type:xxxx, payload:xxxx})，在 redux 里面的状态机处理函数 reducer，进行状态变更，返回新的 state。

```
redux

        store.dispatch(action)
action -------------------> store = createStore(reducer)----> reducer---> new State
                                                              reducer = (state= defaultState, action)=> newState
```

所以在项目结构中，redux 文件夹的结构为:

```
--redux
  --api.ts //(存放各种请求后台接口的文件)
  --action.ts //(存放各种action的文件，确保每个函数最终的返回值均为dispatch({type:xxx, payload: xxx}))
  --reducer.ts // (存放各种处理器reducer)
```

因为 action 是一个{type: xxxx, payload:xxx}这样类型的对象，而 payload 的作用是为了更新 state，一般均为接口返回值。所以请求接口那一层，一般在 action 做完。

而实际项目中，一般会把接口请求处理成，接口请求时，接口请求成功，接口请求失败三种状态。所以 action 层也要处理接口请求的三种状态，返回相应的 payload 和 type 到 reducer 函数进行处理，更新 state。

一般的格式如下：

```js
import api from "./api.ts";

const fetchRequestRequsetd = () => ({
  type: ActionType.fetchRequestRequsetd,
  payload: null,
});

const fetchRequestSuccess = (data) => ({
  type: ActionType.fetchRequestSuccess,
  payload: data,
});

const fetchRequestError = (error) => ({
  type: ActionType.fetchRequestError,
  payload: error,
});
export const fetchRequset = (params: any) => async (dispatch) => {
  dispatch(fetchRequestRequsetd());
  try {
    const res = await api.fetchSomething(params);
    if (res.code === code.Success) {
      dispatch(fetchRequestSuccess(res.body));
    }
    dispatch(fetchRequestError(res.error));
  } catch (error) {
    dispatch(fetchRequestError(error));
  }
};
```

## 中间件

而我们知道 store.dispatch({type:xxx,payload:xxx})方法接受应该是一个对象作为参数，而如果要 dispatch 接受一个函数作为参数的话，需要借助中间件 thunk.

```ts
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import reducer from "./reducers";

// Note: this API requires redux@>=3.1.0
const store = createStore(reducer, applyMiddleware(thunk));
// createStore可以接受 reducer, defaultState, 和 applyMiddleware()函数作为参数，添加中间件
```

## UI 组件和业务组件

UI 组件：只负责 UI 的呈现，不带有业务逻辑，没有状态，所有的数据来源于 props，不使用 redux 的 API。

业务组件：负责管理数据和业务逻辑，不负责 UI 的呈现，带有内部状态，使用 redux 的 api

## connect()

React-Redux 提供 connect 方法，用于从 UI 组件生成业务组件。其完整 API 如下：

```ts
import { connect } from "react-redux";

const VisibleTodoList = connect(mapStateToProps, mapDispatchToProps)(TodoList);
```

connect 方法接受两个参数：mapStateToProps 和 mapDispatchToProps。它们定义了 UI 组件的业务逻辑：

- mapStateToProps 负责输入逻辑，将 state 映射到 UI 组件的参数（props）
- mapDispatchToProps 负责输出逻辑，即将用户对 UI 组件的操作映射成 Action

示例代码：

```ts
const mapStateToProps = (state) => ({
  poemInfo: state.getIn(["poem", "poemInfo"]),
  authorInfo: state.getIn(["poem", "authorInfo"]),
  like: state.getIn(["poem", "like"]),
  collect: state.getIn(["poem", "collect"]),
});

const mapDispatchToProps = (dispatch) => {
  return {
    getPoem(poem_id, category) {
      return dispatch(getPoemInfo(poem_id, category)); // dispatch Action Creator
    },
    getAuthor(author_id, category) {
      dispatch(getAuthorInfo(author_id, category));
    },
    getAudio(poem_id, category) {
      return dispatch(getAudioInfo(poem_id, category));
    },
    getDynamic(poem_id, category) {
      dispatch(getDynamicInfo(poem_id, category));
    },
    changeLikeStatus(status) {
      dispatch(changeLike(status));
    },
    changeCollectStatus(status) {
      dispatch(changeCollect(status));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Poem));
```

从中可以看出，本来的 poem 组件只是一个单纯的 UI 组件，但是经过了 connect(),让这个 UI 组件通过 mapStateToProps，从 state 中获取到数据映射到 props，而用户对 UI 组件的操作，需要改动到对应的 state，则是通过 mapDispatchToProps 获取到对应的 dispatch 方法，映射到 props 中。

connect(mapStateToProps, mapDispatchToProps)(ComponentFuc))方法让一个 UI 组件获取到了业务组件中能够获取 state 和操作修改 state,
并映射到 props 中

connect 是一个高阶函数，首先传入 mapStateToProps、mapDispatchToProps，然后返回一个生产 Component 的函数(wrapWithConnect)，然后再将真正的 Component 作为参数传入 wrapWithConnect，这样就生产出一个经过包裹的 Connect 组件，该组件具有如下特点:

- 通过 props.store 获取祖先 Component 的 store
- props 包括 stateProps、dispatchProps、parentProps,合并在一起得到 nextState，作为 props 传给真正的 Component
- componentDidMount 时，添加事件 this.store.subscribe(this.handleChange)，实现页面交互 shouldComponentUpdate 时判断是否有避免进行渲染，提升页面性能，并得到 nextState
- componentWillUnmount 时移除注册的事件 this.handleChange

```ts
export default function connect(mapStateToProps, mapDispatchToProps, mergeProps, options = {}) {
  return function wrapWithConnect(WrappedComponent) {
    class Connect extends Component {
      constructor(props, context) {
        // 从祖先Component处获得store
        this.store = props.store || context.store
        this.stateProps = computeStateProps(this.store, props)
        this.dispatchProps = computeDispatchProps(this.store, props)
        this.state = { storeState: null }
        // 对stateProps、dispatchProps、parentProps进行合并
        this.updateState()
      }
      shouldComponentUpdate(nextProps, nextState) {
        // 进行判断，当数据发生改变时，Component重新渲染
        if (propsChanged || mapStateProducedChange || dispatchPropsChanged) {
          this.updateState(nextProps)
            return true
          }
        }
        componentDidMount() {
          // 改变Component的state
          this.store.subscribe(() = {
            this.setState({
              storeState: this.store.getState()
            })
          })
        }
        render() {
          // 生成包裹组件Connect
          return (
            <WrappedComponent {...this.nextState} />
          )
        }
      }
      Connect.contextTypes = {
        store: storeShape
      }
      return Connect;
    }
  }
```

引用： [connect 原理解析](https://juejin.cn/post/6844903505191239694)

## provider 组件

connect 方法生成容器组件以后，需要让容器组件拿到 state 对象，才能生成 UI 组件的参数。

一种解决方法是将 state 对象作为参数，传入容器组件。但是，这样做比较麻烦，尤其是容器组件可能在很深的层级，一级级将 state 传下去就很麻烦。

React-Redux 提供 Provider 组件，可以让容器组件拿到 state。

```ts
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import todoApp from './reducers'
import App from './components/App'

let store = createStore(todoApp);

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
```

上面代码中，Provider 在根组件外面包了一层，这样一来，App 的所有子组件就默认都可以拿到 state 了。它的原理是 React 组件的 context 属性。
