## CSS 垂直水平居中方案

### 水平居中

* 行内元素：text-align:center; 
* flex 布局：display:flex; justify-content:center; 
* 常用(前提：已设置 width 值)：margin-left:auto; margin-right:auto; margin:0 auto; 
* 不定宽块状元素水平居中: 改变块状元素的 dispaly 属性为 inline， 然后给父级设置 text-aline：center 来实现水平居中， 这种方法的缺点是不能再给元素设置宽高了

### 垂直居中

* height line-height
* table-cell
* display:flex; align-items:center

* 父元素相对定位，子元素绝对定位，然后加负外边距

``` 

//html
<div class="main">
  <div class="middle"></div>
</div>

//css
.main {
  width: 60px;
  height: 10%;
  background: #dddddd;
  position: relative;//父元素设为相对定位
}
.middle{
  position: absolute;//设为绝对定位
  top: 50%;//top值为50%
  margin-top: -25%;//设margin-top为元素高度的一半
  width: 60px;
  height: 50%;
  background: red;
}

```

* 父元素相对定位，子元素绝对定位加 margin:auto

``` 

//html
<div class="main">
  <div class="middle"></div>
</div>

//css
.main {
  width: 60px;
  height: 10%;
  background: #dddddd;
  position: relative;//父元素设为相对定位
}
.middle{
  width: 30%;
  height: 50%;
  position: absolute;//设为绝对定位
  top: 0;
  bottom: 0;//top、bottom设0即可，
  left: 0;//如果left、right也设为0则可实现水平垂直都居中
  right: 0;
  margin:auto;
  background: red;
}

```

### 垂直水平居中

* 定位+margin:auto

``` CSS
.container {
    position: relative;
    width: 300px;
    height: 300px;
    background: yellow;
}

.box {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    width: 100px;
    height: 100px;
    background: red;
}
```

* 定位+margin-left+margin-top

``` css
.container {
    position: relative;
    width: 300px;
    height: 300px;
    background: yellow;
}

.box {
    position: absolute;
    left: 50%;
    top: 50%;
    margin-left: -50px;
    margin-top: -50px;
    width: 100px;
    height: 100px;
    background: red;
}
```

* 定位+transform

``` css
.container {
    position: relative;
    width: 300px;
    height: 300px;
    background: yellow;
}

.box {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 100px;
    height: 100px;
    background: red;
}
```

这种兼容性不好，只支持 IE9+的浏览器

* flex:display: flex; justify-content:center; align-items:center; 

``` css
.container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 300px;
    height: 300px;
    background: yellow;
}

.box {
    width: 100px;
    height: 100px;
    background: red;
}
```

* 移动端首选 flex+margin:auto

``` css
.container {
    display: flex;
    width: 300px;
    height: 300px;
    background: yellow;
}

.box {
    margin: auto;
    width: 100px;
    height: 100px;
    background: red;
}
```

移动端首选

* 形成 table-cell 子元素设置 display：inline-block

``` css
.container {
    display: table-cell;
    vertical-align: middle;
    text-align: center;
    width: 300px;
    height: 300px;
    background: yellow;
}

.box {
    display: inline-block;
    width: 100px;
    height: 100px;
    background: red;
}
```

* line-height+text-align:center+display:inline

``` css
.container {
    display: inline;
    line-height: 300px;
    text-align: center;
    width: 300px;
    height: 300px;
    background: yellow;
}

.box {
    display: inline-block;
    width: 100px;
    height: 100px;
    background: red;
}
```

## flex 各个属性

https://segmentfault.com/a/1190000017362497

flex 是 `flex-grow` , `flex-shrink` , `flex-basis` 的缩写

flex 布局的默认值是 `0 1 auto`

当 flex 取值为 none 时，则计算值为 0 0 auto

当 flex 取值为 auto，则计算值为 1 1 auto

当 flex 取值为一个非负数字，**则该数字为 flex-grow 值**，flex-shrink 取 1，flex-basis 取 0%

当 flex 取值为两个非负数字，则分别视为 flex-grow 和 flex-shrink 的值，flex-basis 取 0%

当 flex 取值为一个非负数字和一个长度或百分比，则分别视为 flex-grow 和 flex-basis 的值，flex-shrink 取 1

## 层叠上下文

层叠上下文是 HTML 元素的三维概念，这些 HTML 元素在一条假想的相对于面向（电脑屏幕的）视窗或者网页的用户的 z 轴上延伸，HTML 元素依据其自身属性按照优先级顺序占用层叠上下文的空间。

所以一个页面中往往不仅仅只有一个层叠上下文(因为有很多种方式可以生成层叠上下文)，在一个层叠上下文内，我们按照层叠水平的规则来堆叠元素。

我们可以把触发层叠上下文的条件分为三大类:

### 默认创建层叠上下文

* 文档根元素（<html>）；
* position 值为 absolute（绝对定位）或 relative（相对定位）且 z-index 值不为 auto 的元素；
* position 值为 fixed（固定定位）或 sticky（粘滞定位）的元素（沾滞定位适配所有移动设备上的浏览器，但老的桌面浏览器不支持）；
* flex (flexbox) 容器的子元素，且 z-index 值不为 auto；
* grid (grid) 容器的子元素，且 z-index 值不为 auto；
* opacity 属性值小于 1 的元素（参见 the specification for opacity）；
* mix-blend-mode 属性值不为 normal 的元素；
* 以下任意属性值不为 none 的元素：

1. transform
2. filter
3. perspective
4. clip-path
5. mask / mask-image / mask-border
6. isolation 属性值为 isolate 的元素；
7. -webkit-overflow-scrolling 属性值为 touch 的元素；
8. will-change 值设定了任一属性而该属性在 non-initial 值时会创建层叠上下文的元素（参考这篇文章）；
9. contain 属性值为 layout、paint 或包含它们其中之一的合成值（比如 contain: strict、contain: content）的元素。

在层叠上下文中，子元素同样也按照上面解释的规则进行层叠。 重要的是，其子级层叠上下文的 z-index 值只在父级中才有意义。子级层叠上下文被自动视为父级层叠上下文的一个独立单元。

## vue引入css文件

``` 

<style lang="scss">
@import "../scss/base/base.scss";

</style>
//2
<script>
import '../scss/base/base.scss'
</script>

//base.scss做vw移动端适配
//实际开发在具体的vue组件中，例如85px要写成vw(85),因为引用了下面这个函数

@import './variable.scss';
@function vw($px) {
  @return ($px / $vwBase) * 100vw;
}

// 处理elementui多个massage消息并存
.el-message {
  top: 20px !important;
  transition: none;
}

//variable.scss
$primary: #1966FF;

$themeColor: #089cfd;
$btnColor: #1966FF;
$btnHover: #1979FF;
$btnActive: #1442CC;

$menuTextColor: #6A6A73;
$menuActiveAfter: #FFFFFF;
$menuActiveTextColor: #FFFFFF;

$vwBase: 750; // 设计稿宽750px
```

## vue的template不能加class类选择器和其他绑定事件之类，也就是不把它当场是一个元素

## elementui 的 input输入框的 icon图标可以通过font-size 控制大小

## 文字省略号

https://blog.csdn.net/zhumengzj/article/details/80801556

## 如何让固定高度的页头页尾在中间层太短的时候，页头页尾也要一个在头部，一个在尾部

``` html
<div class="container">
    <div class="header"></div>
    <div class="content"></div>
    <div class="footer"></div>
</div>
```

通过flex布局，纵列布局可以实现，整个container要占满屏幕，然后剩下的给content自适应

``` css
.container {
    display: flex;
    flex-direction: column;
    min-height: 100vh; //设置最小高度
}

//假设页头页尾已经固定高度
.content {
    flex: 1 0 auto;
}
```

## CSS表格如何适应屏幕宽度,不会出现横向滚动条

``` 
table{
    width:100%;
    word-break:break-all;//文字内容超过直接换行
}

```
