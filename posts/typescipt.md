# typescript

## type & interface https://zhuanlan.zhihu.com/p/92906055

用法基本差不多，但是 interface 支持 extends implement,type 不支持

对象自变量式的结构定义

```interface Foo {
    a: string
}
```

和

```
type Foo {
    a: string
}
```

函数类型

函数类型其实由两个部分构成，参数类型和返回值类型。

```
interface Foo {
    (a: string): string
}
```

和

```
type Foo = (a: string) => string
```

## javascript 和 typescript 对于对象键值的写法

在 JavaScript 中你可以这样写

```js
const a = {
  test1: "xxx",
  test2: "xxxxx",
};

for (let i in a) {
  a[i] = "xxxxx";
}
```

但是在ts中，你不能这么写，tslint会报错说，i的类型是string，不能用于**索引类型**.只能这么写

```ts
const a = {
  test1: "xxx",
  test2: "xxxxx",
};

for (let i in a) {
  a[i as keyof typeof a] = "xxxxx";
}
```