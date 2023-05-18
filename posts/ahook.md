## useRequest

```js
useRequest(apiFunction,{
    onSuccess(data){

    },
    onError(err){

    },
    manual: true; //是否手动触发，否则的话，默认初始化的时候会触发一次
})
```

### manual 属性

useRequest 的 manual 属性设置为 true 的话，初始化的时候就不会发出请求，只有代码自己去执行 run 函数才会执行。 而 manual 设置为 true 的话，一开始的 apiLoading 就是为 false 的，如果 manual 为 false 的话，初始化的时候就会发起请求，apiLoading 就是 true 的。
