# eslint (typescript 用tslint)

> ESLint 是在 ECMAScript/JavaScript 代码中识别和报告模式匹配的工具，它的目标是保证代码的一致性和避免错误

## eslint 配置项说明
* root：限定配置文件的使用范围。
* parser：指定 eslint 的解析器。
* parserOptions：设置解析器选项。
* extends：指定 eslint 规范。
* plugins：引用第三方的插件。
* env：指定代码运行的宿主环境。
* rules：启用额外的规则或覆盖默认的规则。
* globals：声明在代码中的自定义全局变量。

rule 属性值:
* off 或 0 - 关闭规则。
* warn 或 1 - 将规则视为一个警告（不会影响退出码）。
* error 或 2 - 将规则视为一个错误（退出码为 1）。


## 使用教程

### 初始化

[npx教程]( https://www.ruanyifeng.com/blog/2019/02/npx.html)
```
npx eslint init
然后进行一些配置项的配置，就会在项目本地生成一个eslintrc文件，然后配置package.json的script脚本，"lint":"eslint --fix ./" 然后就可以在在控制台跑npm run lint的命令了 
```