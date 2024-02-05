const fs = require("fs");

const filePath = "js/apmsId.txt";
const outPutPath = "js/apmsIdUTF8.txt";
fs.readFile(filePath, (err, data) => {
  if (err) {
    console.error("读取文件出错", err);
    return;
  }
  const binaryData = Buffer.from(data, 'binary');
  const text = binaryData.toString('utf8');
  console.log("转换之后的明文文本", text);
  fs.writeFile(outPutPath, text, (err) => {
    if (err) {
      console.error("写文件出错", err);
      return;
    }
  });
});
