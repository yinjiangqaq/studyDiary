const xml2jsConvert = require("xml2js");
const fs = require("fs");
const transformXMLFileIntoJson = require("./xml2js");
const transformNodeV2 = require("./transformNode");
const attrValueProcessor = require("./attrValueProcessor");
/**
 * 这些处理器后续可以作为处理JSON字段不正确的case,大小写纠正，驼峰纠正, 目前可以做为告警
 */
// const attrNameProcessor = require("./attrNameProcessor");
// const valueProcessor = require("./valueProcessor");

/**
 * 读取demo2.xml 并将作为layout的内容填补进index.json里面的layout字段
 */

const originalJson = fs.readFileSync("./index.json", "utf-8");
const originJsonObj = JSON.parse(originalJson);
// console.log("======originalJson", originJsonObj);

const resultJSON = transformXMLFileIntoJson(
  "./demo2.xml",
  {
    attrValueProcessors: [attrValueProcessor],
  },
  transformNodeV2
);
const resultNode = JSON.parse(resultJSON);
originJsonObj.root.layout = resultNode;
originJsonObjString = JSON.stringify(originJsonObj, null, 2);
// console.log("============originalJsonObj", originJsonObj);
fs.writeFileSync("./index.json", originJsonObjString);
// 同步复制到桌面
fs.copyFileSync("./index.json", "../../../Desktop/index.json");
