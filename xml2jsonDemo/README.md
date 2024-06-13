# XML 转 JSON

## 开始使用

1. 安装yarn之后，yarn install.

2. yarn dev

3. 修改对应的demo2.xml文件，会自动转换成对应的json，并且放置在index.json文件里


## 功能更新

1. 利用xml2js这个库，支持将XML转化成json

2. 新增对xml中的boolean值的转换，利用atrrValueProcessor，将string类型的true 和false转换成对应的boolean值

3. 支持组件属性引入对应的子组件模版，也是利用atrrValueProcessor，会去识别到对应的路径，读取对应的子组件xml文件，并将其转化成JSON返回。

例如:

```xml
<layout>
    <list cellTemplate="import('./components/listItem.xml')"></list>
  </layout>
```

4. 支持在xml编写中，使用自定义的子组件xml tag名字.