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

## CSS表格如何适应屏幕宽度, 不会出现横向滚动条

``` 

table{
    width:100%;
    word-break:break-all;//文字内容超过直接换行
}

```

## CSS3硬件加速

https://www.cnblogs.com/kunmomo/p/13691633.html

``` 
x,y坐标要写具体的位置，不能是百分比这种，触发不了硬件加速
transform:translate(x,y)
```

## CSS自动添加兼容性前缀

https://www.jianshu.com/p/feafeb24ea1c?utm_campaign=maleskine&utm_content=note&utm_medium=seo_notes&utm_source=recommendation

## 图片懒加载

https://juejin.cn/post/6903774214780616718

elementUI也有提供懒加载的组件

## 块级元素和行内元素的性质

* 块级元素：自身占一行，能设置宽高，如果不设置宽度，那么宽度将默认变为父级的 100%

* 行级元素：与其他行内元素并排，不能设置宽高，默认宽度就是文字的宽度

### CSS 中让元素脱离文档流的手段

* 浮动
* 绝对定位
* 固定定位

### 为什么图片既具有行内元素的特性，又能像块级元素一样设置宽高

#### 置换元素(也叫替换元素)

一个内容不受 CSS 视觉格式化模型控制，CSS 渲染模型不考虑对其内容的渲染，且元素本身一般拥有固有尺寸（宽度，高度，宽高比）的元素，被称之为置换元素。

浏览器会根据元素的标签和属性，来决定置换元素的具体显示内容。

它们所具有的特征为：在不使用 css 修饰时，元素的标签和属性也会影响元素的显示。

例如，浏览器会根据 `<img>` 标签的 src 属性的值来读取图片信息并显示出来，而如果查看(x)html 代码，则看不到图片的实际内容； `<input>` 标签的 type 属性决定是显示输入框，还是单选按钮等。

html(5)中的置换元素有 `<img>、<input>、<textarea>、<select>、<object>、<iframe> 和 <canvas>` 等。

#### 非置换元素

html 的大多数元素是非置换元素，除置换元素之外，所有的元素都是非置换元素。非置换元素内容直接表现给浏览器。

例如： `<label>label 中的内容</label>` 标签 `<label>` 是一个非置换元素，文字“label 中的内容”将全被显示。

## CSS 各种 position 的区别

https://www.cnblogs.com/ypppt/p/13149924.html

1、static（静态定位）：
这个是元素的默认定位方式，元素出现在正常的文档流中，会占用页面空间。也就是按照文档的书写布局自动分配在一个合适的地方，这种定位方式用 margin 来改变位置， 不能使用 top，bottom，left，right 和 z-index。 这种定位不脱离文档流；

设计坞https://www.wode007.com/sites/73738.html

2、relative 定位（相对定位）：
该定位是一种相对的定位，相对于其父级元素（无论父级元素此时为何种定位方式）进行定位，**准确地说是相对于其父级元素所剩余的未被占用的空间进行定位**（在父元素由多个相对定位的子元素时可以看出），且会占用该元素在文档中初始的页面空间，即在使用 top，bottom，left，right 进行移动位置之后依旧不会改变其所占用空间的位置。可以使用 **z-index 进行在 z 轴方向上的移动。这种定位不脱离文档流**；

3、absolute 定位（绝对定位）：
绝对定位方式，脱离文档流，不会占用页面空间。以最近的不是 static 定位的父级元素作为参考进行定位，如果其所有的父级元素都是 static 定位，那么此元素最终则是以当前窗口作为参考进行定位。可以使用 top，bottom，left，right 进行位置移动，亦可使用 z-index 在 z 轴上面进行移动。当元素为此定位时，如果该元素为内联元素，则会变为块级元素，即可以直接设置其宽和高的值；如果该元素为块级元素，则其宽度会由初始的 100%变为 auto。
注意：当元素设置为绝对定位时，在没有指定 top，bottom，left，right 的值时，他们的值并不是 0，这几个值是有默认值的，默认值就是该元素设置为绝对定位前所处的正常文档流中的位置。（可能我没有描述的很清楚，建议自己写个示例看看效果）。在没有父元素的条件下，它的参照为 body。

4、fixed（固定定位）：
这种定位方式是相对于整个文档的，只需设置它相对于各个方向的偏移值，就可以将该元素固定在页面固定的位置，通常用来显示一些提示信息，脱离文档流；

5、inherit 定位：
这种方式规定该元素继承父元素的 position 属性值。

注释：脱离文档流指元素跳出正常的文档流，该元素原先的位置被其它元素填充。

## 脱离文档流

>float方式： 节点使用float脱流时，会让其跳出正常文档流，其他节点会忽略该节点并填补其原先空间。但是该节点文本可不参与这个脱流效果，却会认同该节点所占据的空间并围绕它布局，这个就是常说的文字环绕效果的原理。

一句话概括：节点参与浮动布局后，自身脱流但其文本不脱流

>position方式：节点使用position脱流时(只有absolute和fixed)，会让其及其文本一起跳出正常文档流，其他节点会忽略该节点并填补其原先空间。absolute绝对定位是相对往上遍历第一个包含position:relative的祖先节点定位，若无此节点则相对`<body>`定位；fixed固定定位是相对浏览器窗口定位。

一句话概括：节点参与定位布局后，自身及其文本一起脱流。
