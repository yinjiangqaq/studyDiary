## CSS 垂直水平居中方案

### 水平居中

- 行内元素：text-align:center;
- flex 布局：display:flex; justify-content:center;
- 常用(前提：已设置 width 值)：margin-left:auto; margin-right:auto; margin:0 auto;
- 不定宽块状元素水平居中: 改变块状元素的 dispaly 属性为 inline， 然后给父级设置 text-aline：center 来实现水平居中， 这种方法的缺点是不能再给元素设置宽高了

### 垂直居中

- height line-height
- table-cell
- display:flex; align-items:center

- 父元素相对定位，子元素绝对定位，然后加负外边距

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

- 父元素相对定位，子元素绝对定位加 margin:auto

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

- 定位+margin:auto

```CSS
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

- 定位+margin-left+margin-top

```css
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

- 定位+transform

```css
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

- flex:display: flex; justify-content:center; align-items:center;

```css
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

- 移动端首选 flex+margin:auto

```css
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

- 形成 table-cell 子元素设置 display：inline-block

```css
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

- line-height+text-align:center+display:inline

```css
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

- 文档根元素（<html>）；
- position 值为 absolute（绝对定位）或 relative（相对定位）且 z-index 值不为 auto 的元素；
- position 值为 fixed（固定定位）或 sticky（粘滞定位）的元素（沾滞定位适配所有移动设备上的浏览器，但老的桌面浏览器不支持）；
- flex (flexbox) 容器的子元素，且 z-index 值不为 auto；
- grid (grid) 容器的子元素，且 z-index 值不为 auto；
- opacity 属性值小于 1 的元素（参见 the specification for opacity）；
- mix-blend-mode 属性值不为 normal 的元素；
- 以下任意属性值不为 none 的元素：

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

## vue 引入 css 文件

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

## vue 的 template 不能加 class 类选择器和其他绑定事件之类，也就是不把它当场是一个元素

## elementui 的 input 输入框的 icon 图标可以通过 font-size 控制大小

## 文字省略号

https://blog.csdn.net/zhumengzj/article/details/80801556

## 如何让固定高度的页头页尾在中间层太短的时候，页头页尾也要一个在头部，一个在尾部

```html
<div class="container">
  <div class="header"></div>
  <div class="content"></div>
  <div class="footer"></div>
</div>
```

通过 flex 布局，纵列布局可以实现，整个 container 要占满屏幕，然后剩下的给 content 自适应

```css
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

## CSS 表格如何适应屏幕宽度, 不会出现横向滚动条

```

table{
    width:100%;
    word-break:break-all;//文字内容超过直接换行
}

```

## CSS3 硬件加速

https://www.cnblogs.com/kunmomo/p/13691633.html

```
x,y坐标要写具体的位置，不能是百分比这种，触发不了硬件加速
transform:translate(x,y)
```

## CSS 自动添加兼容性前缀

https://www.jianshu.com/p/feafeb24ea1c?utm_campaign=maleskine&utm_content=note&utm_medium=seo_notes&utm_source=recommendation

## 图片懒加载

https://juejin.cn/post/6903774214780616718

elementUI 也有提供懒加载的组件

## 块级元素和行内元素的性质

- 块级元素：自身占一行，能设置宽高，如果不设置宽度，那么宽度将默认变为父级的 100%

- 行级元素：与其他行内元素并排，不能设置宽高，默认宽度就是文字的宽度

### CSS 中让元素脱离文档流的手段

- 浮动
- 绝对定位
- 固定定位

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

> float 方式： 节点使用 float 脱流时，会让其跳出正常文档流，其他节点会忽略该节点并填补其原先空间。但是该节点文本可不参与这个脱流效果，却会认同该节点所占据的空间并围绕它布局，这个就是常说的文字环绕效果的原理。

一句话概括：节点参与浮动布局后，自身脱流但其文本不脱流

> position 方式：节点使用 position 脱流时(只有 absolute 和 fixed)，会让其及其文本一起跳出正常文档流，其他节点会忽略该节点并填补其原先空间。absolute 绝对定位是相对往上遍历第一个包含 position:relative 的祖先节点定位，若无此节点则相对`<body>`定位；fixed 固定定位是相对浏览器窗口定位。

一句话概括：节点参与定位布局后，自身及其文本一起脱流。

## 移动端适配中出现的 CSS 问题

`Android4.x` 的系统浏览器用的是旧版本的 `chromium`.然后当在伪元素 `before` 和 `after` 里面使用动画的时候，会引起 `webview` 奔溃

```css
@-webkit-keyframes crashChrome {
  0% {
    -webkit-transform: translateX(0rem);
  }
}

.anim:before {
  content: '';
  width: 3rem;
  height: 3rem;
  border-radius: 3rem;
  position: absolute;
  left: 5rem;
  top: 5rem;
  background-color: #06839f;

  -webkit-animation: crashChrome;
}
```

```html
<div class="anim"></div>
```

解决方案：使用 content 为空的 div 来代替伪元素

## js 动画和 CSS 动画的区别

### js 动画(逐帧动画)

首先，在 js 动画是逐帧动画，是在时间帧上逐帧绘制帧内容，由于是一帧一帧的话，所以他的可操作性很高，几乎可以完成任何你想要的动画形式。但是由于逐帧动画的帧序列内容不一样，会增加制作负担，且资源占有比较大。但它的优势也很明显：因为它相似与电影播放模式，很适合于表演很细腻的动画，如 3D 效果、人物或动物急剧转身等等效果。但是，如果帧率过低的话，会帧与帧之间的过渡很可能会不自然、不连贯。

js 是单线程的脚本语言，当 js 在浏览器主线程运行时，主线程还有其他需要运行的 js 脚本、样式、计算、布局、交互等一系列任务，对其干扰线程可能出现阻塞，造成丢帧的情况。

其次，js 在做动画的时候，其复杂度是高于 css3 的，需要考虑一些计算，操作等方便问题。

但是正是由于 js 对动画的操作复杂度比较高，能对动画有一个**比较好的控制**，如开始、暂定、回放、终止、取帧等，可以很精确的做到。因此可以 js 可以通过操作 DOM 和 BOM 来做一些酷炫的动态效果，以及爆炸特效，且兼容性比较好。

### css 动画(补帧动画)

制作方法简单方便。只需确定第一帧和最后一帧的关键位置即可，两个关键帧之间帧的内容由 `Flash` 自动生成，不需要人为处理。当然也可以多次添加关键帧的位置。而且 CSS 动画可以开启硬件加速，用 GPU 来渲染，而不是 CPU(但是只限制在部分的效果)。

transition 属性用的是首尾两帧，animation 用的是关键帧

具体二者的区别可以看下面这篇
https://blog.csdn.net/CCCCt1/article/details/82743631?utm_medium=distribute.pc_relevant_t0.none-task-blog-BlogCommendFromMachineLearnPai2-1.channel_param&depth_1-utm_source=distribute.pc_relevant_t0.none-task-blog-BlogCommendFromMachineLearnPai2-1.channel_param

### transition 栗子 opacity: 0 和 1

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>动态按钮用transition来过渡</title>
    <style>
      .button {
        border: none;
        background-color: red;
        color: white;
        padding: 15px 20px;
        font-size: 15px;
        cursor: pointer;
        border-radius: 5px;
        width: 150px;
      }

      .button span {
        position: relative;
        display: inline-block;
        transition: 0.5s;
      }

      .button span::after {
        content: '»';
        opacity: 0;
        right: -20px;
        position: absolute;
      }

      .button:hover span {
        padding-right: 25px;
      }

      .button:hover span:after {
        opacity: 1;
        right: 0;
        transition: 0.5s;
      }
    </style>
  </head>

  <body>
    <button class="button"><span>我是按钮</span></button>
  </body>
</html>
```

### animation 栗子

- 动画是一帧一帧的绘制的
- 可绘制复杂动画
- 需要配合@keyframes 来使用

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>变色</title>
    <style>
      div {
        width: 100px;
        height: 100px;
        background: red;
        animation: myfirst 3s;
      }

      @keyframes myfirst {
        0% {
          background: red;
        }

        25% {
          background: yellow;
        }

        50% {
          background: blue;
        }

        100% {
          background: green;
        }
      }
    </style>
  </head>

  <body>
    <div></div>
  </body>
</html>

​ ​
```

因为只设置几个关键帧的位置，所以在进行动画控制的时候时比较弱的。不能够在半路暂停动画，或者在动画过程中不能对其进行一些操作等。

css3 在实现一些简单的滑动，翻转等特效的时候会很方便，但是想要做到一些酷炫的效果的时候，其操作往往可能会比 js 操作有更多的冗余。

css3 在做动画的时候，浏览器可以对其进行一些优化，会比 js 使用更少的占用 cpu 资源，但是效果足够流畅。

## 从打字机效果的 N 种实现看 JS 定时器机制和前端动画效果

在 Web 应用中，实现动画效果的方法比较多，`JavaScript` 中可以通过定时器 `setTimeout` 来实现，css3 可以使用 `transition` 和 `animation` 来实现，html5 中的 `canvas` 也可以实现。除此之外，html5 还提供一个专门用于请求动画的 API，即 `requestAnimationFrame（rAF）`，顾名思义就是 “请求动画帧”

### setTimeout() 记得定时器要清除

`setTimeout` 版本的实现很简单，只需把要展示的文本进行切割，使用定时器不断向 `DOM` 元素里追加文字即可，同时，使用`::after` 伪元素在 DOM 元素后面产生光标闪烁的效果。代码和效果图如下：

```
<!-- 样式 -->
<style type="text/css">
  /* 设置容器样式 */
  #content {
    height: 400px;
    padding: 10px;
    font-size: 28px;
    border-radius: 20px;
    background-color: antiquewhite;
  }
  /* 产生光标闪烁的效果 */
  #content::after{
      content: '|';
      color:darkgray;
      animation: blink 1s infinite;
  }
  @keyframes blink{
      from{
          opacity: 0;
      }
      to{
          opacity: 1;
      }
  }
</style>

<body>
  <div id='content'></div>
  <script>
    (function () {
    // 获取容器
    const container = document.getElementById('content')
    // 把需要展示的全部文字进行切割
    const data = '最简单的打字机效果实现'.split('')
    // 需要追加到容器中的文字下标
    let index = 0
    function writing() {
      if (index < data.length) {
        // 追加文字
        container.innerHTML += data[index ++]
        let timer = setTimeout(writing, 200)
        console.log(timer) // 这里会依次打印 1 2 3 4 5 6 7 8 9 10
      }
    }
    writing()
  })();
  </script>
</body>
```

### setInterval() 同样记得清除定时器

实现原理跟 setTimeout 差不多，可以当成上面的 setTimeout 是 setInterval 的实现方法

```
(function () {
  // 获取容器
  const container = document.getElementById('content')
  // 把需要展示的全部文字进行切割
  const data = '最简单的打字机效果实现'.split('')
  // 需要追加到容器中的文字下标
  let index = 0
  let timer = null
  function writing() {
    if (index < data.length) {
      // 追加文字
      container.innerHTML += data[index ++]
      // 没错，也可以通过，clearTimeout取消setInterval的执行
      // index === 4 && clearTimeout(timer)
    } else {
      clearInterval(timer)
    }
    console.log(timer) // 这里会打印出 1 1 1 1 1 ...
  }
  // 使用 setInterval 时，结束后不要忘记进行 clearInterval
  timer = setInterval(writing, 200)
})();

```

### requestAnimationFrame()

在动画的实现上，`requestAnimationFrame` 比起 `setTimeout` 和 `setInterval` 来无疑更具优势。我们先看看打字机效果的 `requestAnimationFrame` 实现：

```js
(function () {
  const container = document.getElementById('content');
  const data = '与 setTimeout 相比，requestAnimationFrame 最大的优势是 由系统来决定回调函数的执行时机。具体一点讲就是，系统每次绘制之前会主动调用 requestAnimationFrame 中的回调函数，如果系统绘制率是 60Hz，那么回调函数就每16.7ms 被执行一次，如果绘制频率是75Hz，那么这个间隔时间就变成了 1000/75=13.3ms。换句话说就是，requestAnimationFrame 的执行步伐跟着系统的绘制频率走。它能保证回调函数在屏幕每一次的绘制间隔中只被执行一次，这样就不会引起丢帧现象，也不会导致动画出现卡顿的问题。'.split(
    ''
  );
  let index = 0;
  function writing() {
    if (index < data.length) {
      container.innerHTML += data[index++];
      requestAnimationFrame(writing);
    }
  }
  writing();
})();
```

与 `setTimeout` 相比，`requestAnimationFrame` 最大的优势是由**系统来决定回调函数的执行时机**。具体一点讲，如果屏幕刷新率是 60Hz,那么回调函数就每 16.7ms 被执行一次，如果刷新率是 75Hz，那么这个时间间隔就变成了 1000/75=13.3ms，换句话说就是，requestAnimationFrame 的步伐跟着系统的刷新步伐走。**它能保证回调函数在屏幕每一次的刷新间隔中只被执行一次，这样就不会引起丢帧现象，也不会导致动画出现卡顿的问题**。

联系 setTimeout 的概念，**一定时间后**执行对应的回调。可能前面有阻塞导致不一定在原定的时间点执行。所以会出现卡帧现象

### CSS3

除了以上三种 JS 方法之外，其实只用 CSS 我们也可以实现打字机效果。大概思路是借助 CSS3 的@keyframes 来不断改变包含文字的容器的宽度，超出容器部分的文字隐藏不展示。

```
<style>
  div {
    font-size: 20px;
    /* 初始宽度为0 */
    width: 0;
    height: 30px;
    border-right: 1px solid darkgray;
    /*
    Steps(<number_of_steps>，<direction>)
    steps接收两个参数：第一个参数指定动画分割的段数；第二个参数可选，接受 start和 end两个值，指定在每个间隔的起点或是终点发生阶跃变化，默认为 end。
    */
    animation: write 4s steps(14) forwards,
      blink 0.5s steps(1) infinite;
      overflow: hidden;
  }

  @keyframes write {
    0% {
      width: 0;
    }

    100% {
      width: 280px;
    }
  }

  @keyframes blink {
    50% {
      /* transparent是全透明黑色(black)的速记法，即一个类似rgba(0,0,0,0)这样的值。 */
      border-color: transparent; /* #00000000 */
    }
  }
</style>

<body>
  <div>
    大江东去浪淘尽，千古风流人物
  </div>
</body>
```

### 参考

https://segmentfault.com/a/1190000038915675
