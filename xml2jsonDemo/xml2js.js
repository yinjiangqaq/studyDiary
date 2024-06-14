const fs = require("fs");
const xml2jsConvert = require("xml2js");
// const transformNodeV2 = require("./transformNode");

function transformXMLFileIntoJson(filePath, dependencies, transformNodeFunc) {
  const { attrValueProcessors = [] } = dependencies || {};

  const originXML = fs.readFileSync(filePath, "utf-8");
  let resultJSON;
  xml2jsConvert.parseString(
    originXML,
    {
      explicitArray: false,
      explicitChildren: true,
      preserveChildrenOrder: true,
      attrValueProcessors,
    },
    (err, result) => {
      if (err) {
        console.log("error============", err);
      }

      const root = result.layout;
      const resultNode = transformNodeFunc(root);
      resultJSON =  JSON.stringify(resultNode, null, 2);
    }
  );
  return resultJSON;
}

module.exports = transformXMLFileIntoJson;
