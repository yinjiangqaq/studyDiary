## setNativeProps

React Native 中做出像 web 端那样修改 DOM 元素的操作，可以使用 setNativeProps，这种可以不用使用 state/props 来触发整个子树的重新渲染，性能更好一些

## RN 里绘制三角形

设置左边的 border 宽度 50，背景透明；
设置右边的 border 宽度 50，背景透明；
设置底部的 border 宽度 100，背景颜色自定义，也就是最终显示的颜色；
所以就好办了，我们想让箭头在上，就设置左右宽度低一点，底部大一点。同理，设置箭头在左，就设置上下少，右边多。

```
{
    borderLeftWidth: 6;
    borderRightWidth: 6,
    borderBottomWidth: 12,
    borderLeftColor: transparent,
    borderRightColor: transparent,
    borderBottomColor: red,
}

```

## react native 中 Animated.Value 建议放在 useRef 里面

```ts
// recommend
const opacity = React.useRef<Animated.Value>(0);
// 不建议, 因为设置成const 常量，会导致，这个值会受到组件重新渲染的影响，如果组件重新渲染，opacity就会重新创建，被重新赋值为初始值
const opacity = Animated.Value(0);
```

## SVG

SVG： 可伸缩矢量图，图像在放大或改变尺寸的情况下其图形质量不会有所损失,跟 GIF 和 JPEG 比起来，尺寸更小。

SVG 绘制一个长方形，对于开发者来说SVG提供了特定图形的绘制
```html
<?xml version="1.0" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">

<svg
  width="100%"
  height="100%"
  version="1.1"
  xmlns="http://www.w3.org/2000/svg"
>
  <rect
    x="20"
    y="20"
    rx="20"
    ry="20"
    width="250"
    height="100"
    style="fill:red;stroke:black;
stroke-width:5;opacity:0.5"
  />
</svg>
```

对一些复杂的图形，我们采用的是SVG的path属性进行绘制，但是太复杂的不建议使用代码开发，建议还是使用专门绘制SVG的平台进行绘制，然后转换成SVG图形

path标签的一些定义路径数据的命令

|  name   | description   |
|  ----  | ----  |
| M  | moveto |
| L  | lineto  |
| H  | horizontal lineto |
| V  | vertical lineto  |
| C  | curveto  |
| S  | smooth curveto  |
| Q  | quadratic Belzier curve  |
| T  |  smooth quadratic Belzier curveto  |
| A  | elliptical Arc |
| Z  | closepath  |


使用path绘制一个三角形
```html
<?xml version="1.0" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" 
"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">

<svg width="100%" height="100%" version="1.1"
xmlns="http://www.w3.org/2000/svg">

<path d="M250 150 L150 350 L350 350 Z" />

</svg>
```