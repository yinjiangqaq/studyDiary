# View

View vs Fragment

View 在包裹子组件的时候，会创建额外的 DOM 节点，但是 Fragment 在包裹子节点的时候不会创建额外的 DOM 节点，Fragment 不是一个标准的 DOM 元素，不拥有 style 等属性。

## ZIndex

React Native 的 zIndex 只有在兄弟节点之间比较才有效，如果是下面的情况, DOM B 和DOM C并不是同级的兄弟节点，无论B的zindex设置多大，DOM C的层级一直都在B的上边的。

```tsx
return (
  <View>
    <A>
      <B zIndex={10000}/>
    </A>
    <C/>
  </View>
);
```
