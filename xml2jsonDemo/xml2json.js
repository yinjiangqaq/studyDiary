const convert = require("xml-js");
const fs = require("fs");

const xmlStr = fs.readFileSync("./demo.xml", "utf-8");

const result = convert.xml2json(xmlStr, { compact: true });

fs.writeFileSync("./result.json", result);
