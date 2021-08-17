# typescript  

## type & interface https://zhuanlan.zhihu.com/p/92906055


用法基本差不多，但是interface支持extends implement,type不支持

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