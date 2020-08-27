 function selfVue(options) {
  var self = this;
  this.vm = this;
  this.data = options.data;
  this.methods = options.methods;
  Object.keys(this.data).forEach(function (key) {
    self.proxyKeys(key);
  });
  observe(this.data);
  new Compile(options.el, this);
  options.mounted.call(this);
}
selfVue.prototype = {
  proxyKeys: function (key) {
    var self = this;
    Object.defineProperty(this, key, {
      enumerable: false,
      configurable: true,
      get: function proxyGetter() {
        return self.data[key];
      },
      set: function proxySetter(newVal) {
        self.data[key] = newVal;
      },
    });
  },
};
