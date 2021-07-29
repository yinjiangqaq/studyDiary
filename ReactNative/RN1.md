# React Native 基础组件学习

## View
> View组件是构建UI的最基本的容器组件，它支持flexbox、style、一些触摸处理和可访问性控件的布局。


<iframe loading="lazy" src="https://snack.expo.dev/embedded?iframeId=n2n0wbs8lx&amp;preview=true&amp;platform=web&amp;supportedPlatforms=ios,android,web&amp;name=View Function Component Example&amp;description=Example usage&amp;theme=light&amp;waitForData=true" height="100%" width="100%" frameborder="0" data-snack-iframe="true" style="display: block;"></iframe>

### style属性

####  Flexbox

* flexDirection

* justifyContent

* alignItems

* alignContent

* flexWrap

http://liuwangshu.cn/rn/primer/4-flexbox.html

http://www.ruanyifeng.com/blog/2015/07/flex-grammar.html?utm_source=tuicool

#### shadow(仅ios平台能使用)

| 样式名| 取值|说明 |
---|:--:|---:
|shadowColor | color | 设置阴影颜色|
|shadowOffset |{width: number, height: number} | 设置阴影位移值|
|shadowOpacity | number |设置阴影透明度 |
|shadowRadius | number |设置阴影模糊半径 |

#### elevation (Android) 原生效果远不如shadow，所以一般采用第三方库`react-native-shadow`

elevation取值为number。Android平台没有shadow来设置阴影，但是，可以用elevation属性来间接的设置阴影。它使用Android原生的 elevation API来设置组件的高度，这样就会在界面上呈现出阴影的效果，此属性仅支持Android 5.0及以上版本。  

```js
import React, {Component} from 'react';
import {AppRegistry, StyleSheet, View} from 'react-native';
class ViewApp extends Component {
    render() {
        return (
             <View style={{flex: 1,        justifyContent: 'center',
                   alignItems:'center',backgroundColor:'white'}}>
                   <View style={styles.shadow}/>
             </View>
        );
    }
}
const styles = StyleSheet.create({
    shadow: {
        height: 120,
        width: 120,
        backgroundColor: 'black',
        elevation: 20,
        shadowOffset: {width: 0, height: 0},
        shadowColor: 'black',
        shadowOpacity: 1,
        shadowRadius: 5
    }
});
AppRegistry.registerComponent('ViewSample', () => ViewApp);
```
#### border

borderStyle的取值为 enum(‘solid’, ‘dotted’, ‘dashed’)，用来设置边框的风格，三个值分别对应着实线边框、点状边框和虚线边框，默认值为solid。

除了可以设置边框的风格，还可以用定义边框的颜色和边框的圆角。边框的颜色设置有borderColor、borderTopColor 、borderRightColor 、borderBottomColor 、borderLeftColor，取值都为string，通常情况下用borderColor就足够了。
边框的圆角设置有borderRadius 、borderTopLeftRadius 、borderTopRightRadius 、borderBottomLeftRadius 、borderBottomRightRadius，取值为number

#### transform 

transform的取值为：
```
[{perspective: number}, 
{rotate: string},
{rotateX: string},
{rotateY: string},
{rotateZ: string},
{scale: number},
{scaleX: number}, 
{scaleY: number},
{translateX: number},
{translateY: number}, 
{skewX: string},
{skewY: string}]
```
transform的取值总的来说，共分为四种类型：translate、scale、rotate和skew，分别用来设置View组件的平移、缩放、旋转和倾斜。

#### overflow (ios)

overflow取值为enum(‘visible’, ‘hidden’)。它用来定义当View组件的子组件的宽高超过View组件宽高时的行为，默认值为hidden，即隐藏超出的部分。overflow只在iOS平台有效，在Android平台即使设置overflow为visible，呈现的还会是hidden的效果。

#### backgroundColor

backgroundColor取值为string。它用来设定背景颜色，默认的颜色为非常浅的灰色，只有Text和TextInput组件继承了父组件的背景颜色，其他的组件都要设置自己的背影颜色。

#### opacity

opacity 的取值为0到1，当值为0时，表示组件完全透明，而值为1时，则表示组件完全不透明。

### props
#### 触摸事件回调函数

触摸事件回调函数用来处理用户的触摸屏幕操作，一般情况下，触摸事件都是在其他组件中完成的。关于触摸事件是一个比较大的知识点，这里只介绍这些触摸事件回调函数的作用。

onStartShouldSetResponder： 触摸事件为touchDown时，是否申请成为事件响应者，接收触摸事件。如果返回true，则表示组件需要成为事件响应者。

onStartShouldSetResponderCapture：触摸事件为touchDown时，是否要拦截此事件，阻止子组件接收该事件，如果返回true，则表示要进行拦截。

onMoveShouldSetResponder ： 触摸事件为TouchMove时，是否申请成为事件响应者，接收触摸事件。如果返回true，则表示组件需要成为事件响应者。

onMoveShouldSetResponderCapture ：触摸事件为TouchMove时，是否要拦截此事件，阻止子组件接收该事件。
onResponderGrant： 申请成为事件响应者成功，组件开始接收触摸事件 。

onResponderReject： 申请成为事件响应者失败，其他组件正在进行事件处理 。

onResponderMove：触摸手指移动的事件（TouchMove）。
onResponderTerminationRequest：在组件成为事件响应者期间，其他组件申请成为响应者，返回为true，则表示同意释放响应者角色。

onResponderTerminate：如果组件释放响应者角色，会回调该函数，通知组件事件响应处理被终止了。这个回调也会发生在系统直接终止组件的事件处理，例如用户在触摸操作过程中，突然来电话的情况。

onResponderRelease：表示触摸完成（touchUp）的时候的回调，表示用户完成了本次的触摸交互。

#### pointerEvents

pointerEvents的取值为enum(‘box-none’, ‘none’, ‘box-only’, ‘auto’) 。它用来控制当前视图是否可以作为触控事件的目标。

在开发中，很多组件是被布局到手机界面上的，其中一些组件会遮盖住它的位置下方的组件，有一些场景需要被遮盖住的组件来处理事件。比如一个地图组件上覆盖了一个图像组件用来显示信息，但是我们不想这个图像组件影响用户的手指拖动地图的操作，这时就可以使用图像组件从View组件继承得到的pointerEvents属性来解决这个问题。

pointerEvents的取值含义如下所示：

none：组件自身不能作为触控事件的目标，交由父组件处理。
box-none：组件自身不能作为触控事件的目标，但其子组件可以。

box-only：组件自身可以作为触控事件的目标，但其子组件不能。

auto：组件可以作为触控事件的目标。

#### removeClippedSubviews

removeClippedSubviews的取值为bool。它的一个特殊的与性能优化相关的属性，通常在ListView和ScrollView中使用，当组件有很多子组件不在屏幕显示范围时，可以将removeClippedSubviews设置为true，允许释放不在显示范围子组件，从而优化了性能。需要注意的是，要想让此属性生效，要确保overflow属性为默认的hidden。

####  动画相关
needsOffscreenAlphaCompositing (Android)
needsOffscreenAlphaCompositing的取值为bool，是Android平台独有的属性。它用来决定视图是否要先离屏渲染再进行半透明度处理，来确保颜色和混合效果正确。为了正确的显示透明表现而进行离屏渲染会带来极大的开销，对于非原生开发者来说很难调试，因此，它的默认值为false。

renderToHardwareTextureAndroid (Android)
renderToHardwareTextureAndroid的取值为bool，同样是是Android平台独有的属性。它用来决定视图是否要把它本身（以及所有的子视图）渲染到一个GPU上的硬件纹理中。
在Android平台上，这对于只修改透明度、旋转、位移和缩放的动画和交互是很有用的：视图不必每次都重新绘制，显示列表也不需要重新执行，纹理可以被重用于不同的参数。负面作用是这会大量消耗显存，所以当交互/动画结束后应该把此属性设置回false。

shouldRasterizeIOS (iOS)
shouldRasterizeIOS的取值为bool，是iOS平台独有的属性。它决定视图是否需要在被混合之前绘制到一个位图上。
这对于动画和交互来说是有很有用的，它不会修改这个组件的尺寸和它的子组件。举例来说，当我们移动一个静态视图的位置的时候，栅格化允许渲染器重用静态视图的缓存位图，并快速合成。

栅格化会导致离屏的绘图传递，位图会消耗内存。所以使用此属性需要进行充分的测试和评估。


## Text

> 一个展示文本的 react component，支持**嵌套，样式和事件绑定**


<iframe loading="lazy" src="https://snack.expo.dev/embedded?iframeId=f5046cn21c&amp;preview=true&amp;platform=web&amp;supportedPlatforms=ios,android,web&amp;name=Text Functional Component Example&amp;description=Example usage&amp;theme=light&amp;waitForData=true" height="100%" width="100%" frameborder="0" data-snack-iframe="true" style="display: block;"></iframe>

值得关注的点是： 在react native里面，你必须把所有文本节点包装在一个`<Text>`组件里面,你不能直接放在`<View>`组件里

```
// BAD: will raise exception, can't have a text node as child of a <View>
<View>
  Some text
</View>

// GOOD
<View>
  <Text>
    Some text
  </Text>
</View>
```