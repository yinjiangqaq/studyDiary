const convert = require("xml-js");
const fs = require("fs");

const jsonStr = fs.readFileSync("./demo.json", "utf-8");

const result = convert.json2xml(jsonStr, { compact: true, spaces: 4 });

fs.writeFileSync("./result.xml", result);
// console.log(result);
