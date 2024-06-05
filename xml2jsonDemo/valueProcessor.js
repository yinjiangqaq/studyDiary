const componentTypeKey = ["layout", "list", "image", "text", "frame"];
// 标签名 和 value处理

/**
 * 这些处理器后续可以作为处理JSON字段不正确的case,大小写纠正，驼峰纠正, 目前可以做为告警
 */
function valueProcessor(value, name) {
  console.log("=======name, value", name, value);
  if (!componentTypeKey.includes(name)) {
    throw new Error(`invalid tag name = ${name}`);
  }
}

module.exports = valueProcessor;
