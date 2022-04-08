// TODO: 创建一个iframe，接收参数

// TODO: precheck logic

let createIframe = function (width = 300, height = 300, style = "border:none") {
  var container = document.createElement("div");
  var iframe = document.createElement("iframe");
  iframe.src = "/Users/juntao.lin/projects/studyDiary/tinyWindow/demo.html";
  iframe.width = width;
  iframe.height = height;
  iframe.style = style;
  document.body.appendChild(iframe);
};

var tinyWindow = {};
tinyWindow.init = createIframe; // 初始化函数
