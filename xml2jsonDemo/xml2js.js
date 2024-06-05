const xml2jsConvert = require("xml2js");
const fs = require("fs");
const transformNode = require("./transformNode");
const transformNodeV2 = require("./transformNode");
/**
 * 这些处理器后续可以作为处理JSON字段不正确的case,大小写纠正，驼峰纠正, 目前可以做为告警
 */
// const attrNameProcessor = require("./attrNameProcessor");
// const valueProcessor = require("./valueProcessor");
const demoXml = fs.readFileSync("./demo.xml", "utf-8");

xml2jsConvert.parseString(
  demoXml,
  {
    explicitArray: false,
    explicitChildren: true,
    preserveChildrenOrder: true,
    // attrNameProcessors: [attrNameProcessor],
    // valueProcessors: [valueProcessor],
  },
  (err, result) => {
    if (err) {
      console.log("error============", err);
    }
    const root = result.dbl.layout;
    const rawResult = JSON.stringify(root, null, 2);
    fs.writeFileSync("./xml2jsRawResult.json", rawResult);
    // console.log("===========root", root)
    const resultNode = transformNodeV2(result.dbl.layout);
    const resultStr = JSON.stringify(resultNode, null, 2);
    fs.writeFileSync("./xml2jsResult.json", resultStr);
  }
);
