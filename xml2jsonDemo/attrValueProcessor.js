const transformXMLFileIntoJson = require("./xml2js");

function attrValueProcessor(value, name) {
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
