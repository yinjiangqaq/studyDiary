function defineReactive(data, key, val) {
  observe(val);
  var dep = new Dep();
  Object.defineProperty(data, key, {
    enumerable: true,
    configurable: true,
    get: function () {
      if (Dep.target) {
        dep.addSub(Dep.target); //在watcher方法缓存的watcher实例
      }
      return val;
    },
    set: function (newVal) {
      if (val === newVal) {
        return;
      }
      val = newVal;
      console.log(
        "属性" + key + "已经被监听了，现在值为：“" + newVal.toString() + "”"
      );
      dep.notify();
    },
  });
}
function observe(data) {
  if (!data || typeof data !== "object") {
    return;
  }
  //遍历所有子属性
  Object.keys(data).forEach(function (key) {
    defineReactive(data, key, data[key]);
  });
}
//依赖存储器，存储watcher实例的
function Dep() {
  this.subs = [];
}
Dep.prototype = {
  addSub: function (sub) {
    this.subs.push(sub);
  },
  notify: function () {
    this.subs.forEach(function (sub) {
      sub.update();
    });
  },
};
