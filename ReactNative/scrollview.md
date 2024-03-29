# scrollview

## scrollview 和 flatList 的区别

FlatList 和 scrollView 的区别在于，FlatList 相比较 scrollView 更适合展示长列表，因为 FlatLIst 有做优化，只展示出现在视窗的列表，而 scrollView 会一开始全展示

## 如何给 scrollView 制作自定义的滚动条

首先隐藏默认的滚动条，在增加一个放置自动义滚动条的 view。 思路是这样的，首先我们需要一个固定长度的总滚动条和一个跟当前视窗长度/总 scroll view 长度 \* 固定长度滚动条的实际滚动条(也就是 scroll indicator size）。然后固定长度滚动条-实际长度滚动条，就是剩余长度滚动，也就是 difference。 而让这个自定义的滚动条动起来的原来，实际上还是 transform 动画，根据 scroll 事件，计算现在实际滚动条的位置，然后 transformX。 在 react native 里面动画需要用特定的 view: Animated.View 来声明，

```js
onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollIndicator } } }],
            { useNativeDriver: false }
          )}
```

这个函数是监听当前滚动的偏移量，然后`实际滚动条的偏移量 * 固定长度滚动条的总滚动条长度 /总scroll View的长度 = 实际的偏移量`,然后 transFormX 对应的值就是这个实际的偏移量。

实现案例：

```js
//react native
const SCROLL_BAR_WIDTH = 28; // whole scroll bar size
const [completeScrollBarWidth, setCompleteScrollBarWidth] = React.useState(1); //all scroll item size
const [visibleScrollBarWidth, setVisibleScrollBarWidth] = React.useState(0); // visible scroll item size
const scrollIndicatorSize =
  completeScrollBarWidth > visibleScrollBarWidth
    ? (SCROLL_BAR_WIDTH * visibleScrollBarWidth) / completeScrollBarWidth
    : SCROLL_BAR_WIDTH; // scroll indicator size
const scrollIndicator = React.useRef(new Animated.Value(0)).current;
const difference =
  SCROLL_BAR_WIDTH > scrollIndicatorSize
    ? SCROLL_BAR_WIDTH - scrollIndicatorSize
    : 1;
// compute now scroll indicator position
const scrollIndicatorPosition = Animated.multiply(
  scrollIndicator,
  SCROLL_BAR_WIDTH / completeScrollBarWidth
).interpolate({
  inputRange: [0, difference],
  outputRange: [0, difference],
  extrapolate: "clamp",
});
<ScrollView
  horizontal={true}
  showsHorizontalScrollIndicator={false}
  onContentSizeChange={(contentWidth) => {
    setCompleteScrollBarWidth(contentWidth);
  }}
  onLayout={({
    nativeEvent: {
      layout: { width },
    },
  }) => {
    setVisibleScrollBarWidth(width);
  }}
  onScroll={Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollIndicator } } }],
    { useNativeDriver: false }
  )}
  scrollEventThrottle={16}
>
  ...
</ScrollView>;
```

## 如何使用 scrollView 来创建一个每次滑动只滑动一个 item 的滚动组件，而且每个 item 的长度小于视窗长度.

使用 `scrollView`中的 `onScrollEndDrag` 监听这个事件，用户手指停止滚动的时候触发的回调函数。这个函数跟 onscroll 事件的函数参数一样，接受一个 nativeEvent 事件作为参数，因为我们是水平滚动组件，所以只需要获取到 x 轴的偏移量就可以了.

首先我们需要获取到这个前提的量.

- 第一个是用户滑动的方向，是向右滑动还是向左滑动。
- 第二个是用户滑动到的此时是第几个 item,有没有滑动超过一半，如果超过一半，则控制 scrollView 组件执行 scrollTo 事件，滑动到下一个 item，如果没有超过一半，则回到当前的 item。

第一个量通过设置一个`preOffset`的变量来存储上一次滑动的最终位置。然后根据触发 `onScrollEndDrag`事件获取到的此时的偏移量，两者比较大小可以得到当前用户是往右滑动还是往回滑动。

第二个量是通过计算得到的，因为每一 item 的长度的是固定的，我们可以通过计算得到，此时用户滑动到哪个 item，而且有没有超过一半。

通过这两个量，我们可以来了计算每户每次 scroll 事件最终 scrollView 执行 scrollTo 事件的时候，会到哪里去。

实现代码：

```js
//react
const MULTI_BANNER_WIDTH = 300;
const scrollIndicator = new Animated.Value(0);
const [preOffset_x, setPreOffset_x] = React.useState(0); // record pre x-offset
const scrollView = React.useRef < ScrollView > null;
const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
  // console.log(event.nativeEvent.contentOffset.x, preOffset_x); //scroll offset
  const NumOfBanner = getNumOfBanner(
    event.nativeEvent.contentOffset.x,
    event.nativeEvent.contentOffset.x > preOffset_x
  );
  if (NumOfBanner.upHalf) {
    scrollView.current?.scrollTo({
      x: (MULTI_BANNER_WIDTH + 12) * NumOfBanner.num,
      animated: true,
    });
    setPreOffset_x((MULTI_BANNER_WIDTH + 12) * NumOfBanner.num);
  } else {
    if (NumOfBanner.num > 1) {
      scrollView.current?.scrollTo({
        x: (MULTI_BANNER_WIDTH + 12) * (NumOfBanner.num - 1),
        animated: true,
      });
      setPreOffset_x((MULTI_BANNER_WIDTH + 12) * (NumOfBanner.num - 1));
    } else {
      scrollView.current?.scrollTo({
        x: 0,
        animated: true,
      });
      setPreOffset_x(0);
    }
  }
};
const getNumOfBanner = (offset: number, isRight: boolean) => {
  let x = 1;
  const difference = Math.abs(offset - preOffset_x);
  while (offset > MULTI_BANNER_WIDTH) {
    x++;
    offset -= MULTI_BANNER_WIDTH;
  }
  if (isRight && offset > MULTI_BANNER_WIDTH / 4) {
    return {
      num: x,
      upHalf: true,
    };
  } else if (!isRight && difference > MULTI_BANNER_WIDTH / 4) {
    return {
      num: x - 1,
      upHalf: true,
    };
  } else {
    return {
      num: x,
      upHalf: false,
    };
  }
};

//jsx

<ScrollView
  horizontal={true}
  showsHorizontalScrollIndicator={false}
  onScrollEndDrag={handleScroll}
  scrollEventThrottle={16}
  ref={scrollView}
>
  ...
</ScrollView>;
```

## Animated 动画

RN 在设置动画的时候，尽量不要，少编写 setState 的代码，因为会导致页面重新渲染，会让页面的性能很差。如果要增加的话，就给 setState 的代码增加防抖

```tsx
const [isFolded, setIsFolded] = React.useState(false);
const stateKeys = React.useRef<{
  scrollPosition: number;
  animatedScrollPosition: Animated.Value;
  folded: boolean;
}>({
  scrollPosition: 0,
  animatedScrollPosition: new Animated.Value(0),
  folded: false,
});

// 需要给setIsFolded 设置防抖，避免频繁更新setState,导致页面刷新
const updateIsFolded = useDebouncedCallback(
  (folded: boolean) => setIsFolded(folded),
  100,
  {
    leading: false,
    trailing: true,
  }
);

const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
  const scrollPosition = event.nativeEvent.contentOffset.y;
  const previousScrollPosition = stateKeys.current.scrollPosition;

  setShouldCloseSubwalletHandler(true);

  if (scrollPosition < 0) {
    return;
  }

  if (
    (previousScrollPosition < scrollPosition && !stateKeys.current.folded) ||
    scrollPosition >= 50
  ) {
    updateIsFolded(true);
    stateKeys.current.folded = true;
  }

  if (scrollPosition < 50 && stateKeys.current.folded) {
    updateIsFolded(false);
    stateKeys.current.folded = false;
  }

  stateKeys.current.scrollPosition = scrollPosition;
};

// 滑动时间也需要增加相应的节流
const onScrollEvent = Animated.event(
  [
    {
      nativeEvent: {
        contentOffset: { y: stateKeys.current.animatedScrollPosition },
      },
    },
  ],
  {
    listener: onScroll,
    useNativeDriver: false,
  }  const foldedOpacityValue = stateKeys.current.animatedScrollPosition.interpolate(
    {
      inputRange: [0, 25, 50],
      outputRange: [1, 0.5, 0],
      extrapolate: 'clamp',
    }
  );
);
// 动画还可以添加插值
  const foldedOpacityValue = stateKeys.current.animatedScrollPosition.interpolate(
    {
      inputRange: [0, 25, 50],
      outputRange: [1, 0.5, 0],
      extrapolate: 'clamp',
    }
  );
<Animated.ScrollView onScroll={onScrollEvent} scrollEventThrottle={1}>
  <A />
  <B />
</Animated.ScrollView>;
```


## ReactNative 的ScrollView 当 refreshControl设置成true的时候，点击事件没有触发。

当下拉刷新触发refresh的逻辑的时候，因为refresh control本身是有动画的，**动画会导致scrollView的高度发生改变，高度发生改变的这个过程中，点击scroll view 中的可点击元素，其实是触发不了onPress事件的**，可能触发的是别的事件。 


如果你把API请求的持续时间设置长一些，让refresh control暂时维持loading的状态，你会发现这时候scrollView里面的元素其实是可以点击的。因为这时候scroll view的高度没有改变。