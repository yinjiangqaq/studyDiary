const componentTypeKey = [
  "layout",
  "list",
  "image",
  "text",
  "button",
  "loop",
  "flow",
];
const attrNamesSupportImportTemplate = ["cellTemplate"];

const componentTypeSupportImportTemplate = ["list"];
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
 *
 * node.$代表的是这个节点上面的属性attribute
 * node.$$代表的是这个节点里的children  node
 * 一个节点如果没有$，也没有$$，说明就是一个简单的节点例如<layout/>
 * @param {*} node
 * @returns
 */
function transformNodeV2(node) {
  let newNode = {};
  /**
   * 处理自定义节点
   */
  if (node["#name"] && !componentTypeKey.includes(node["#name"])) {
    newNode = transformCustomComponentNode(node);
    return newNode;
  }
  /**
   * 处理支持import Template的节点
   */
  if (
    node["#name"] &&
    componentTypeSupportImportTemplate.includes(node["#name"]) &&
    node?.$?.cellTemplate
  ) {
    node.$.cellTemplate = transformListNodeWithCellTemplate(node);
  }
  if (node.$) {
    // 处理当前节点属性
    newNode = {
      ...newNode,
      ...node.$,
      widgetType: node["#name"] || "layout", // 使用 #name 作为 widgetType
    };
  }

  // 如果当前节点有子节点，但是没有其他多余的属性放置在$的话,也需要把#name放入节点中，无论如何，只要是节点，name总是用的
  if (!node.$ && node.$$) {
    newNode.widgetType = node["#name"];
  }

  // 处理当前节点的子节点
  if (node.$$) {
    newNode.children = node.$$.map((child) => transformNodeV2(child));
  }

  // 处理当前节点文本内容
  if (node._) {
    newNode.src = node._;
  }

  // 处理当前节点特定的回调或动作
  if (node.$?.onClick) {
    newNode.callbacks = [
      {
        widgetType: "onClick",
        actions: JSON.parse(node.$.onClick).actions,
      },
    ];
    // 需要删除onClick
    delete newNode.onClick;
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

/**
 * 处理自定义的组件节点
 * @param {*} node 当前节点
 */
function transformCustomComponentNode(node) {
  console.log("=========== custom Node", node);
  // 读取对应的自定义组件xml
  const transformXMLFileIntoJson = require("./xml2js");
  const attrValueProcessor = require("./attrValueProcessor");
  const fileSrc = node?.$?.src;
  if (!fileSrc) {
    throw new Error("custom component tag need the src attribute");
  }
  console.log("=============file path", fileSrc, node);
  let customComponentNode;
  const customComponentNodeJson = transformXMLFileIntoJson(
    fileSrc,
    {
      attrValueProcessors: [attrValueProcessor],
    },
    transformNodeV2
  );
  customComponentNode = JSON.parse(customComponentNodeJson);
  // 将自定义组件的节点树对象返回
  return customComponentNode;
}

function transformListNodeWithCellTemplate(node) {
  /**
   * 解析组件xml文件引用
   */
  const transformXMLFileIntoJson = require("./xml2js");
  const attrValueProcessor = require("./attrValueProcessor");
  const cellTemplate = node.$.cellTemplate;
  const compImportRex = /import\(['"](.+?)['"]\)/;
  const match = cellTemplate.match(compImportRex);
  if (match && match[1]) {
    // console.log("============ component path", match[1]);
    return transformXMLFileIntoJson(
      match[1],
      {
        attrValueProcessors: [attrValueProcessor],
      },
      transformNodeV2
    );
    // console.log("=============value,", value)
  } else {
    throw Error(
      'cellTemplate attribute value error, the value is like cellTemplate="import("./xxxxxx")'
    );
  }
}

module.exports = transformNode;

module.exports = transformNodeV2;
