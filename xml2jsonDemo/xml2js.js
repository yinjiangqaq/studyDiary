const xml2jsConvert = require("xml2js");
const fs = require("fs");
// const transformNode = require("./transformNode");
const transformNodeV2 = require("./transformNode");
/**
 * 这些处理器后续可以作为处理JSON字段不正确的case,大小写纠正，驼峰纠正, 目前可以做为告警
 */
// const attrNameProcessor = require("./attrNameProcessor");
// const valueProcessor = require("./valueProcessor");
// const demoXml = fs.readFileSync("./demo.xml", "utf-8");

// xml2jsConvert.parseString(
//   demoXml,
//   {
//     explicitArray: false,
//     explicitChildren: true,
//     preserveChildrenOrder: true,
//     // attrNameProcessors: [attrNameProcessor],
//     // valueProcessors: [valueProcessor],
//   },
//   (err, result) => {
//     if (err) {
//       console.log("error============", err);
//     }
//     const root = result.dbl.layout;
//     const rawResult = JSON.stringify(root, null, 2);
//     fs.writeFileSync("./xml2jsRawResult.json", rawResult);
//     // console.log("===========root", root)
//     const resultNode = transformNodeV2(result.dbl.layout);
//     const resultStr = JSON.stringify(resultNode, null, 2);
//     fs.writeFileSync("./xml2jsResult.json", resultStr);
//   }
// );

/**
 * 读取demo2.xml 并将作为layout的内容填补进index.json里面的layout字段
 */

const originalJson = fs.readFileSync("./index.json", "utf-8");
const originJsonObj = JSON.parse(originalJson);
// console.log("======originalJson", originJsonObj);
const demoXML2 = fs.readFileSync("./demo2.xml", "utf-8");
xml2jsConvert.parseString(
  demoXML2,
  {
    explicitArray: false,
    explicitChildren: true,
    preserveChildrenOrder: true,
  },
  (err, result) => {
    if (err) {
      console.log("error============", err);
    }

    const root = result.layout;
    const resultNode = transformNodeV2(root);
    // console.log("===========resultNode", resultNode);
    originJsonObj.root.layout = resultNode;
    originJsonObjString = JSON.stringify(originJsonObj, null, 2);
    // console.log("============originalJsonObj", originJsonObj);
    fs.writeFileSync("./index.json", originJsonObjString);
    // 同步复制到桌面
    fs.copyFileSync("./index.json", "../../../Desktop/index.json");
  }
);
