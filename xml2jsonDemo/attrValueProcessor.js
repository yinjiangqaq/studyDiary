const transformXMLFileIntoJson = require("./xml2js");

const attrNamesSupportImportTemplate = ["cellTemplate"];

function attrValueProcessor(value, name) {
  /**
   * 解析组件xml文件引用
   */
  if (attrNamesSupportImportTemplate.includes(name)) {
    const compImportRex = /import\(['"](.+?)['"]\)/;
    const match = value.match(compImportRex);
    if (match && match[1]) {
      console.log("============ component path", match[1]);
      value = transformXMLFileIntoJson(match[1]);
      // console.log("=============value,", value)
    }
  }
  /**
   * value 的boolean值转换
   */
  if (value === "true") {
    value = true;
  }

  if (value === "false") {
    value = false;
  }
  return value;
}

module.exports = attrValueProcessor;
