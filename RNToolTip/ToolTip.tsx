import React from "react";
import {
  View,
  Text,
  TouchableWithoutFeedback,
  Animated,
  StyleSheet,
  GestureResponderEvent,
  Dimensions,
  findNodeHandle,
  UIManager,
} from "react-native";

// Styles
import { Mixins, Colors } from "@shopeepay-rn/styles";

type Props = {
  /**
   * Text to display on tooltip bubble
   */
  text: string;
  /**
   * Tooltip will auto disappear after the given time
   * @default 3000
   */
  stayTime?: number;
  /**
   * Whether tooltip will auto disappear
   * @default true
   */
  autoDismiss?: boolean;

  /**
   * callback to trigger the change of the showTip, this props together with the showTip props
   */
  onShowToolTip?: React.Dispatch<React.SetStateAction<boolean>>;
  /**
   * whether to show the toolTip
   */
  showToolTip?: boolean;
  /**
   * maximum width of the tooltip bubble
   */
  maxWidth?: number;
  /**
   * Style of the tooltip bubble
   */
  displayType?: "normal" | "emphasized";
  /**
   * Position of the pointer in vertical
   */
  pointerStyle?: "top" | "bottom";
  /**
   * Function triggered after pressing
   */
  onPress?: (event: GestureResponderEvent) => void;
  /**
   * Data for clicking tracking
   */
  targetData?: any;
  /**
   *  the children Node inside the Tooltip
   */
  children: React.ReactNode;
};

interface Layout {
  width: number;
  height: number;
}

interface ValueXY {
  x: number;
  y: number;
}

const stopDuration = 167;
const bounceDistance = 2.3;
const bounceDuration = 500;
const WINDOW_WIDTH = Dimensions.get("window").width;
// const BORDER_MARGIN = 4;
const TooltipGray = Colors.black65;
// const ANDROID_Y_OFFSET = Platform.OS === 'android' ? 6 : 0;

/**
 * A tooltip display a text label identifying an element or describing its function.
 * It helps to attract users' attention or provide extra explanations to the element pointed at.
 */

export const ToolTip = (props: Props) => {
  const [bubbleWidth, setBubbleWidth] = React.useState(0);
  const [bubbleHeight, setBubbleHeight] = React.useState(0);
  const [isDisplayed, setIsDisplayed] = React.useState(true);
  const [size, setSize] = React.useState<Layout>({ width: 0, height: 0 });
  const [position, setPostion] = React.useState<ValueXY>({ x: 0, y: 0 });
  const translationValue = React.useRef<Animated.Value>(
    new Animated.Value(0)
  ).current;
  const fadeAnimation = React.useRef<Animated.Value>(
    new Animated.Value(0)
  ).current;
  const bounceAnimation = React.useRef<
    Animated.CompositeAnimation | undefined
  >();
  const timer = React.useRef<any>();
  // create parentRef
  const parentRef = React.useRef<any>();

  const {
    autoDismiss: isAutoDismiss = true,
    displayType = "normal",
    pointerStyle = "top",
    showToolTip,
    onPress,
    maxWidth,
    text,
    targetData,
  } = props;

  const fadeIn = () => {
    Animated.timing(fadeAnimation, {
      toValue: 1,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      if (isAutoDismiss) {
        displayTimer();
      }
    });
  };

  const displayTimer = () => {
    timer.current = setTimeout(() => {
      fadeOut();
    }, props.stayTime || 3000);
  };

  const fadeOut = () => {
    Animated.timing(fadeAnimation, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      setIsDisplayed(false);
      // manually set showToolTip into false
      if (props.onShowToolTip) props.onShowToolTip(false);
    });
  };

  const bounce = async () => {
    bounceAnimation.current = Animated.sequence([
      Animated.timing(translationValue, {
        toValue: -bounceDistance,
        duration: bounceDuration,
        useNativeDriver: true,
        isInteraction: false,
      }),
      Animated.delay(stopDuration),
      Animated.timing(translationValue, {
        toValue: 0,
        useNativeDriver: true,
        isInteraction: false,
        duration: bounceDuration,
      }),
      Animated.delay(stopDuration),
    ]);
    await new Promise((res) => {
      translationValue.stopAnimation(res);
    });
    Animated.loop(bounceAnimation.current).start();
  };

  const resetAnimation = () => {
    translationValue.setValue(0);
  };

  React.useEffect(() => {
    fadeIn();
    if (displayType === "emphasized") {
      bounce();
    }
    return () => {
      resetAnimation();
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  React.useEffect(() => {
    if (displayType === "emphasized") {
      bounce();
    } else {
      resetAnimation();
    }

    if (showToolTip) {
      fadeIn();
    }
  }, [displayType, showToolTip]);

  // measure bubble layout
  const onLayout = (event: any) => {
    const { width, height } = event.nativeEvent.layout;
    setBubbleWidth(width);
    setBubbleHeight(height);
  };

  const onParentLayout = (event: any) => {
    const { width, height } = event.nativeEvent.layout; // 测量出包裹的节点的宽高
    measure(); // 测量出包裹的节点的各种数据
    setSize({
      width,
      height,
    });
  };

  // calculate the left offset of the toolTip
  const calcLeftOffset = () => {
    const leftOffset = (position.x * (props.maxWidth || 0)) / WINDOW_WIDTH;
    return leftOffset;
  };

  const measure = async () => {
    if (parentRef.current) {
      const node = findNodeHandle(parentRef.current);
      if (node === null) return;
      const { x, y, width, height, pageX, pageY } = await new Promise(
        (resolve) => {
          UIManager.measure(node, (x, y, width, height, pageX, pageY) => {
            resolve({ x, y, width, height, pageX, pageY });
          });
        }
      );
      // 设置包裹的节点，也就是parentView的x,y
      setPostion({ x: pageX, y: pageY });
      console.log(
        "x,y,width, height, pageX, pageY,WINDOW_WIDTH",
        x,
        y,
        width,
        height,
        pageX,
        pageY,
        WINDOW_WIDTH
      );
    }
  };

  const isEmphasized = displayType === "emphasized";
  const isBottomPointer = pointerStyle === "bottom";
  const BubbleColor = isEmphasized ? Colors.primary : TooltipGray;

  return (
    <View onLayout={onParentLayout} ref={parentRef}>
      {/* toolTip */}
      {showToolTip ?? isDisplayed ? (
        <Animated.View
          onLayout={onLayout}
          // eslint-disable-next-line react-native/no-inline-styles
          style={{
            // flex: 1,
            backgroundColor: "transparent",
            position: "absolute",
            width: maxWidth,
            // 计算 bubble的位置
            left:
              (maxWidth || 0) + position.x > WINDOW_WIDTH
                ? -calcLeftOffset()
                : 0,
            // 根据指针位置的不同，计算出不同的top
            top: pointerStyle === "top" ? size.height : -bubbleHeight,
            zIndex: 100,
            backfaceVisibility: "hidden",
            opacity: fadeAnimation,
            transform: [
              {
                translateY: translationValue,
              },
            ],
          }}
        >
          {!isBottomPointer && (
            <View
              style={[
                styles.arrow,
                // eslint-disable-next-line react-native/no-inline-styles
                {
                  position: "relative",
                  borderBottomColor: bubbleWidth ? BubbleColor : "transparent",
                  borderBottomWidth: 6,
                  // 用拿到的parentView的size，换算出箭头具体的位置
                  // 需要判断偏左还是偏右,而且需要考虑到bubble的width 和包裹元素的width，谁大谁小，指针的位置也会不同
                  left:
                    (maxWidth || 0) + position.x > WINDOW_WIDTH
                      ? (maxWidth || bubbleWidth) - calcLeftOffset() >
                        size.width
                        ? calcLeftOffset() + size.width / 2 - 5
                        : ((maxWidth || bubbleWidth) + calcLeftOffset()) / 2 - 5
                      : (maxWidth || bubbleWidth) > size.width
                      ? size.width / 2 - 5
                      : (maxWidth || bubbleWidth) / 2 - 5,
                  // alignSelf: 'flex-start',
                  // marginLeft: pointerPosition + pointerOffset,
                },
                bubbleWidth && isEmphasized ? styles.shadow : null,
              ]}
            />
          )}
          <TouchableWithoutFeedback
            onPress={onPress}
            targetData={targetData}
            targetType="Tooltip"
          >
            <View
              style={[
                isEmphasized ? styles.bubbleEmphasized : styles.bubble,
                // eslint-disable-next-line react-native/no-inline-styles
                {
                  backgroundColor: bubbleWidth ? BubbleColor : "transparent",
                  minWidth: isEmphasized ? 60 : 40,
                  maxWidth: Number(maxWidth) || 300,
                },
                bubbleWidth && isEmphasized ? styles.shadow : null,
              ]}
            >
              <Text
                numberOfLines={2}
                style={[
                  isEmphasized ? styles.buttonTextBold : styles.buttonText,
                  // eslint-disable-next-line react-native/no-inline-styles
                  {
                    backgroundColor: "transparent",
                    color: bubbleWidth ? Colors.white : "transparent",
                  },
                ]}
              >
                {text}
              </Text>
            </View>
          </TouchableWithoutFeedback>
          {isBottomPointer && (
            <View
              style={[
                styles.arrow,
                // eslint-disable-next-line react-native/no-inline-styles
                {
                  borderTopColor: bubbleWidth ? BubbleColor : "transparent",
                  marginTop: 0,
                  borderTopWidth: 6,
                  // 用拿到的parentView的size，换算出箭头具体的位置
                  // 需要判断偏左还是偏右,而且需要考虑到bubble的width 和包裹元素的width，谁大谁小，指针的位置也会不同
                  left:
                    (maxWidth || 0) + position.x > WINDOW_WIDTH
                      ? (maxWidth || bubbleWidth) - calcLeftOffset() >
                        size.width
                        ? calcLeftOffset() + size.width / 2 - 5
                        : ((maxWidth || bubbleWidth) + calcLeftOffset()) / 2 - 5
                      : (maxWidth || bubbleWidth) > size.width
                      ? size.width / 2 - 5
                      : (maxWidth || bubbleWidth) / 2 - 5,
                },
                bubbleWidth && isEmphasized ? styles.shadow : null,
              ]}
            />
          )}
        </Animated.View>
      ) : (
        <View />
      )}

      <View>{props.children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  bubble: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 8,
    zIndex: 99,
  },
  bubbleEmphasized: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 45,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  shadow: {
    shadowColor: "#BC0118",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.62,
    elevation: 4,
  },
  buttonTextBold: {
    ...Mixins.R14Bold,
    textAlign: "center",
  },
  buttonText: {
    ...Mixins.R14,
    textAlign: "center",
  },
  arrow: {
    borderRightWidth: 6,
    borderLeftWidth: 6,
    width: 12,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
  },
});
