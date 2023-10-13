# Image

## 当Image的resize mode传 center， IOS同一个设备，本地的图片分辨率和 PFB情况下不同

https://github.com/facebook/react-native/issues/28670


## 图片如何实现预加载

using the `Image.prefetch` to realize the prefetch ability.

```
import React from 'react';
import { View, Image } from 'react-native';

const MyComponent = () => {
  const imageUrl = 'https://example.com/image.jpg';

  const prefetchImage = () => {
    Image.prefetch(imageUrl);
  };

  return (
    <View>
      {/* Trigger the prefetch when needed */}
      <Image source={{ uri: imageUrl }} onLoad={prefetchImage} />
    </View>
  );
};

export default MyComponent;

```


## React Native 