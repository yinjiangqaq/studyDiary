// TODO: 创建一个iframe，接收参数

// TODO: precheck logic

let createIframe = function (width = 300, height = 300, style = "border:none") {
  var container = document.createElement("div");
  container.style =
    "height:100vh;width: 100%; display: flex; justify-content: center; align-item:center; background: rgb(0,0,0,0.1)";
  var iframe = document.createElement("iframe");
  iframe.src = "./demo.html";
  iframe.width = width;
  iframe.height = height;
  iframe.style = style;
  container.appendChild(iframe);
  document.body.appendChild(container);
};

var tinyWindow = {};
tinyWindow.init = createIframe; // 初始化函数
// 监听具体的iframe信息推送
