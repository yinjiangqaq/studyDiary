const componentTypeKey = ["layout", "list", "image", "text", "frame"];

/**
 * 处理节点树 打开了 explicitArray: false, mergeAttrs: true, preserveChildrenOrder: true
 * @param {*} node 节点
 * @param {*} type 节点的类型
 * @returns
 */
function transformNode(node, type) {
  // 创建新节点，并根据原始节点的类型设置 widgetType
  const newNode = { widgetType: type || "layout" };
  // 初始化子节点数组
  let children = [];
  // 复制所有原始属性到新节点，除了那些将被转换为子节点的属性
  typeof node === "object" &&
    Object.keys(node).forEach((key) => {
      if (type === "text" && key === "_") {
        newNode.src = node[key];
        return;
      }
      if (!["layout", "image", "text", "list"].includes(key)) {
        newNode[key] = node[key];
      }
      /**
       * 递归处理key name是子节点
       */
      // 递归处理layout
      if (key === "layout") {
        if (Array.isArray(node.layout)) {
          children = children.concat(
            node.layout.map((child) => transformNode(child, "layout"))
          );
        } else {
          children.push(transformNode(node.layout, "layout"));
        }
      }
      //  递归处理image
      if (key === "image") {
        if (Array.isArray(node.image)) {
          children = children.concat(
            node.image.map((child) => transformNode(child, "image"))
          );
        } else {
          children.push(transformNode(node.image, "image"));
        }
      }

      //递归处理text
      if (key === "text") {
        if (Array.isArray(node.text)) {
          children = children.concat(
            node.text.map((child) => transformNode(child, "text"))
          );
        } else {
          children.push(transformNode(node.text, "text"));
        }
      }

      // 递归处理list
      if (key === "list") {
        children.push(transformNode(node.list, "list"));
      }
    });

  if (typeof node === "string" && type === "text") {
    newNode.src = node;
  }

  // 递归处理 layout 属性
  if (node.layout) {
  }

  // 递归处理 image 属性
  if (node.image) {
  }

  // 递归处理 text 属性
  if (node.text) {
  }

  // 递归处理 list 属性
  if (node.list) {
  }

  // 如果存在子节点，添加到新节点的 children 属性中
  if (children.length > 0) {
    newNode.children = children;
  }

  return newNode;
}

/**
 * 为了保持节点树的顺序，打开了 explicitArray: false, explicitChildren: true, preserveChildrenOrder: true 
 * 所以整个节点树会变成了新的结构，transformV2方法就是为了处理这个结构的节点树
 * @param {*} node 
 * @returns 
 */
function transformNodeV2(node) {
  let newNode = {};
  // 处理当前节点属性
  if (node.$) {
    newNode = {
      ...newNode,
      ...node.$,
      widgetType: node["#name"] || "layout", // 使用 #name 作为 widgetType
    };
    // // 特殊处理背景图片和颜色
    // if (newNode.background) {
    //   newNode.background = newNode.background.replace("tpl_", "");
    // }
    // if (newNode.backgroundColor) {
    //   newNode.backgroundColor = newNode.backgroundColor.replace("tpl_", "");
    // }
  }

  // 处理当前节点的子节点
  if (node.$$) {
    newNode.children = node.$$.map((child) => transformNodeV2(child));
  }

  // 处理当前节点文本内容
  if (node._) {
    newNode.src = node._;
  }

  // 处理单独的文本和图像属性（如果存在）
  // if (node.text) {
  //   newNode.text = transform(node.text);
  // }
  // if (node.image) {
  //   newNode.image = transform(node.image);
  // }

  // 处理当前节点特定的回调或动作
  if (node.$?.onClick) {
    newNode.callbacks = [
      {
        widgetType: "onClick",
        actions: JSON.parse(node.$.onClick).actions,
      },
    ];
  }

  // 如果当前节点有子节点，但是没有其他多余的属性放置在$的话,也需要把#name放入节点中，无论如何，只要是节点，name总是用的
  if (!node.$ && node.$$) {
    newNode.widgetType = node["#name"];
  }

  // 处理叶子节点，终点
  if (!node.$ && !node.$$) {
    const { _: src, $$: children, "#name": name, ...otherParams } = node;
    newNode = {
      ...newNode,
      ...otherParams,
      widgetType: node["#name"] || "layout",
    };
  }

  return newNode;
}
module.exports = transformNode;

module.exports = transformNodeV2;
