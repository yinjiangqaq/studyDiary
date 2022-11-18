## 接口请求

写接口请求的时候

```ts
export const fetchA = async () => {
  const res = await post(url, {
    params,
  });

  if (res.status === "error") {
    //FIXME: 上报错误
    return {
      code,
      error,
      errMsg,
    }; //  错误处理好格式发出去
  }
  return res;
};

// 然后使用useRequest包住请求的时候

const {data} = React.useRequest<Record<string,any>,RequestType>(fetchA})
```
