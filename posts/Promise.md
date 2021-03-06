# Promise

## Promise 出现的原因

在 promise 出现以前，我们处理多个异步请求嵌套时，代码往往是这样的：

```js
let fs = require("fs");

fs.readFile("./name.txt", "utf8", function (err, data) {
  fs.readFile(data, "utf8", function (err, data) {
    fs.readFile(data, "utf8", function (err, data) {
      console.log(data);
    });
  });
});
```

为了拿到回调的结果，我们必须一层一层的嵌套，可以说是相当恶心了。而且基本上我们还要对每次请求的结果进行一系列的处理，使得代码变的更加难以阅读和难以维护，这就是传说中臭名昭著的**回调地狱**～产生回调地狱的原因归结起来有两点：

1. 嵌套调用，第一个函数的输出往往是第二个函数的输入；
2. 处理多个异步请求并发，开发时往往需要同步请求最终的结果。

所以为了解决嵌套调用产生的回调地狱和合并多个任务请求的结果(Promise.all)，产生了 promise。

以上面的例子，我们使用 promise 来实现是怎样的？

```js
let fs = require("fs");

function read(filename) {
  return new Promise((resolve, reject) => {
    fs.readFile(filename, "utf8", (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
}

read("./name.txt")
  .then((data) => {
    return read(data);
  })
  .then((data) => {
    return read(data);
  })
  .then(
    (data) => {
      console.log(data);
    },
    (err) => {
      console.log(err);
    }
  );
```

使用了 promise 之后，之前的臃肿的嵌套变得了线性多了和简洁多了。

## 如何实现 promise

### 基础版的 promise

回顾一下最简单的 Promise 的使用方式

```js
const p1 = new Promise((resolve, reject) => {
  console.log("create a promise");
  resolve("成功了");
});

console.log("after new promise");

const p2 = p1.then((data) => {
  console.log(data);
  throw new Error("失败了");
});

const p3 = p2.then(
  (data) => {
    console.log("success", data);
  },
  (err) => {
    console.log("faild", err);
  }
);

// "create a promise"
// "after new promise"
// "成功了"
// "faild Error: 失败了"
```

我们可以了解到 我们在调用 promise 时，会返回一个 Promise 对象。然鹅在我们构建 promise 对象时，需要传入一个**executor 函数**，promise 的主要业务流程都在 executor 函数中执行。如果运行 executor 函数成功，会调用 resolve 函数。如果执行失败，则调用 reject 函数。Promise 的状态不可逆，同时调用 resovle 函数和 reject 函数，默认会采取第一次调用的结果。

结合 [Promise/A+](https://promisesaplus.com/)的规范，我们可以总结出 promise 具有的基本特征：

1. promise 有三个状态：pending，fulfilled，or rejected；
2. new promise 时， 需要传递一个 executor()执行器，执行器立即执行
3. executor 接受两个参数，分别是 resolve 和 reject；
4. promise 的默认状态是 pending；
5. promise 有一个 value 保存成功状态的值，可以是 undefined/thenable/promise；
6. promise 有一个 reason 保存失败状态的值
7. promise 只能从 pending 到 rejected, 或者从 pending 到 fulfilled，状态一旦确认，就不会再改变
8. promise 必须有一个 then 方法，then 接收两个参数，分别是 promise 成功的回调 onFulfilled, 和 promise 失败的回调 onRejected；
9. 如果调用 then 时，promise 已经成功，则执行 onFulfilled，参数是 promise 的 value
10. 如果调用 then 时，promise 已经失败，那么执行 onRejected, 参数是 promise 的 reason
11. 如果 then 中抛出了异常，那么就会把这个异常作为参数，传递给下一个 then 的失败的回调 onRejected

经过上面的总结，我们可以试着实现一个基本的 promise

```js
// 三个状态：PENDING、FULFILLED、REJECTED
const PENDING = "PENDING";
const FULFILLED = "FULFILLED";
const REJECTED = "REJECTED";

class myPromise {
  constructor(executor) {
    //构造函数，默认初始状态为pending,value和reason为undefined，然后执行executor函数

    this.status = PENDING;
    this.value = undefined;
    this.reason = undefined;

    //执行成功调用的方法
    let resolve = (data) => {
      if (this.status === PENDING) {
        this.status = FULFILLED;
        this.value = data;
      }
    };
    //执行失败调用的方法
    let reject = (err) => {
      if (this.status === PENDING) {
        this.status = REJECTED;
        this.reason = err;
      }
    };
    //执行executor函数,将resolve和reject函数作为参数
    try {
      executor(resolve, reject);
    } catch (err) {
      //中间执行出错的话，将错误reject传出去
      reject(err);
    }
  }
  //promise对象还有一个then函数成员，应该作为类promise的方法成员，接受两个参数onFulfilled,onRejected
  then(onFulfilled, onRejected) {
    if (this.status === FULFILLED) {
      onFulfilled(this.value); //如果一个new promise()的promise对象，调用 then函数的话，此时this.value 是内部获取得到的。
      //因为此时的this指向new promise()创建出来的对象
    }
    if (this.status === REJECTED) {
      onRejected(this.reason);
    }
  }
}
//写完测试一下
const promise = new myPromise((resolve, reject) => {
  resolve("成功");
}).then(
  (data) => {
    console.log("success", data);
  },
  (err) => {
    console.log("faild", err);
  }
);

//控制台输出
//"success 成功"
```

### 支持异步操作的 promise

现在我们已经实现了一个基础版的 promise，但是还是有缺陷的，因为我们上面的 promise 只能处理同步操作，如果在 executor 函数中，传入异步操作的话，会发生什么：

```js
const promise = new myPromise((resolve, reject) => {
  //传入异步操作
  setTimeout(() => {
    resolve("成功");
  }, 1000);
}).then(
  (data) => {
    console.log("success", data);
  },
  (err) => {
    console.log("faild", err);
  }
);
```

我们会发现我们的控制台什么输出都没有，promise 没有任何返回。

因为 promise 调用 then 方法时，当前的 promise 并没有成功，一直处于 `pending` 状态。所以如果当调用 then 方法时，当前状态是 `pending`，我们需要先将成功和失败的回调分别存放起来，在 `executor()`的异步任务被执行时，触发 `resolve` 或 `reject`，依次调用成功或失败的回调。

结合这个思路我们优化一下我们的代码：

```js
// 三个状态：PENDING、FULFILLED、REJECTED
const PENDING = "PENDING";
const FULFILLED = "FULFILLED";
const REJECTED = "REJECTED";

class myPromise {
  constructor(executor) {
    //构造函数，默认初始状态为pending,value和reason为undefined，然后执行executor函数

    this.status = PENDING;
    this.value = undefined;
    this.reason = undefined;
    this.onResolvedCallbacks = []; //存放执行成功的回调
    this.onRejectedCallbacks = []; //存放执行失败的回调
    //执行成功调用的方法
    let resolve = (data) => {
      if (this.status === PENDING) {
        this.status = FULFILLED;
        this.value = data;
        //当异步函数真正执行到resolve操作的时候，再把回调拿出来执行
        this.onResolvedCallbacks.forEach((fn) => fn());
      }
    };
    //执行失败调用的方法
    let reject = (err) => {
      if (this.status === PENDING) {
        this.status = REJECTED;
        this.reason = err;
        //当异步函数真正执行到reject操作的时候，再把回调拿出来执行
        this.onRejectedCallbacks.forEach((fn) => fn());
      }
    };
    //执行executor函数,将resolve和reject函数作为参数
    try {
      executor(resolve, reject);
    } catch (err) {
      //中间执行出错的话，将错误reject传出去
      reject(err);
    }
  }
  //promise对象还有一个then函数成员，应该作为类promise的方法成员，接受两个参数onFulfilled,onRejected
  then(onFulfilled, onRejected) {
    if (this.status === FULFILLED) {
      onFulfilled(this.value); //如果一个new promise()的promise对象，调用 then函数的话，此时this.value 是内部获取得到的。
      //因为此时的this指向new promise()创建出来的对象
    }
    if (this.status === REJECTED) {
      onRejected(this.reason);
    }
    if (this.status === PENDING) {
      // 如果promise的状态是 pending，需要将 onFulfilled 和 onRejected 函数存放起来，等待状态确定后，再依次将对应的函数执行
      this.onResolvedCallbacks.push(() => onFulfilled(this.value));
      this.onRejectedCallbacks.push(() => onRejected(this.reason));
    }
  }
}

const promise = new myPromise((resolve, reject) => {
  setTimeout(() => {
    resolve("成功");
  }, 1000);
}).then(
  (data) => {
    console.log("success", data);
  },
  (err) => {
    console.log("faild", err);
  }
);
```

重新执行，控制台等待大概一秒钟之后输出`"success 成功"`这样就解决了异步的问题。

其实熟悉熟悉设计模式的同学，应该意识到了这其实是一个发布订阅模式，这种收集依赖 -> 触发通知 -> 取出依赖执行的方式，被广泛运用于发布订阅模式的实现。

### then 的链式调用 和值的穿透特性

我们都知道，promise 的优势在于可以链式调用。在我们使用 Promise 的时候，当 then 函数中 return 了一个值，不管是什么值，我们都能在下一个 then 中获取到，这就是所谓的 then 的链式调用。而且，当我们不在 then 中放入参数，例：promise.then().then()，那么其后面的 then 依旧可以得到之前 then 返回的值，这就是所谓的值的穿透。那具体如何实现呢？简单思考一下，如果每次调用 then 的时候，我们都重新创建一个 promise 对象，并把上一个 then 的返回结果传给这个新的 promise 的 then 方法，不就可以一直 then 下去了么？

我们继续完善一下之前的实现代码：

```js
// 三个状态：PENDING、FULFILLED、REJECTED
const PENDING = "PENDING";
const FULFILLED = "FULFILLED";
const REJECTED = "REJECTED";

const resolvePromise = (promise2, x, resolve, reject) => {
  //自己等待自己是一个错误的实现，用一个类型错误结束掉promise
  if (promise2 === x) {
    return reject(
      new TypeError("Chaining cycle detected for promise #<Promise>")
    );
  }
  let called;
  if ((typeof x === "object" && x !== null) || typeof x === "function") {
    try {
      //为了判断resolve 过的就不用再reject了，比如 reject 和resolve 同时调用的时候
      let then = x.then;
      if (typeof then === "function") {
        //不要写成x.then，直接then.call 就可以了 因为x.then 会再次取值
        then.call(
          x,
          (y) => {
            if (called) return;
            called = true;
            //递归解析的过程中 因为Promise中还有promise
            resolvePromise(promise2, y, resolve, reject);
          },
          (r) => {
            //只要失败就失败
            if (called) return;
            called = true;
            reject(r);
          }
        );
      } else {
        //如果x.then是一个普通值就直接返回resolve 作为结果
        resolve(x);
      }
    } catch (e) {
      if (called) return;
      called = true;
      reject(e);
    }
  } else {
    //如果x是一个普通值就直接返回resolve 作为结果
    resolve(x);
  }
};

class myPromise {
  constructor(executor) {
    //构造函数，默认初始状态为pending,value和reason为undefined，然后执行executor函数

    this.status = PENDING;
    this.value = undefined;
    this.reason = undefined;
    this.onResolvedCallbacks = []; //存放执行成功的回调
    this.onRejectedCallbacks = []; //存放执行失败的回调
    //执行成功调用的方法
    let resolve = (data) => {
      if (this.status === PENDING) {
        this.status = FULFILLED;
        this.value = data;
        //当异步函数真正执行到resolve操作的时候，再把回调拿出来执行
        this.onResolvedCallbacks.forEach((fn) => fn());
      }
    };
    //执行失败调用的方法
    let reject = (err) => {
      if (this.status === PENDING) {
        this.status = REJECTED;
        this.reason = err;
        //当异步函数真正执行到reject操作的时候，再把回调拿出来执行
        this.onRejectedCallbacks.forEach((fn) => fn());
      }
    };
    //执行executor函数,将resolve和reject函数作为参数
    try {
      executor(resolve, reject);
    } catch (err) {
      //中间执行出错的话，将错误reject传出去
      reject(err);
    }
  }
  //promise对象还有一个then函数成员，应该作为类promise的方法成员，接受两个参数onFulfilled,onRejected
  then(onFulfilled, onRejected) {
    //解决onFufilled,onRejected没有传值的问题
    onFulfilled = typeof onFulfilled === "function" ? onFulfilled : (v) => v;
    //因为错误的值要让后面访问到，所以这里也要跑出个错误，不然会在之后 then 的 resolve 中捕获
    onRejected =
      typeof onRejected === "function"
        ? onRejected
        : (err) => {
            throw err;
          };

    //每次调用then ,链式调用，都返回一个新的promise

    let promise2 = new myPromise((resolve, reject) => {
      if (this.status === FULFILLED) {
        setTimeout(() => {
          try {
            let x = onFulfilled(this.value);
            resolvePromise(promise2, x, resolve, reject);
          } catch (err) {
            reject(err);
          }
        }, 0);
      }

      if (this.status === REJECTED) {
        setTimeout(() => {
          try {
            let x = onRejected(this.reason);
            resolvePromise(promise2, x, resolve, reject);
          } catch (err) {
            reject(err);
          }
        }, 0);
      }
      if (this.status === PENDING) {
        // 如果promise的状态是 pending，需要将 onFulfilled 和 onRejected 函数存放起来，等待状态确定后，再依次将对应的函数执行
        this.onResolvedCallbacks.push(() => {
          setTimeout(() => {
            try {
              let x = onFulfilled(this.value);
              resolvePromise(promise2, x, resolve, reject);
            } catch (e) {
              reject(e);
            }
          }, 0);
        });
        this.onRejectedCallbacks.push(() => {
          setTimeout(() => {
            try {
              let x = onRejected(this.reason);
              resolvePromise(promise2, x, resolve, reject);
            } catch (e) {
              reject(e);
            }
          }, 0);
        });
      }
    });
    // if (this.status === FULFILLED) {
    //   onFulfilled(this.value); //如果一个new promise()的promise对象，调用 then函数的话，此时this.value 是内部获取得到的。
    //   //因为此时的this指向new promise()创建出来的对象
    // }

    return promise2;
  }
}

const promise = new myPromise((resolve, reject) => {
  reject("失败");
})
  .then()
  .then()
  .then(
    (data) => {
      console.log(data);
    },
    (err) => {
      console.log("err", err);
    }
  );
```

控制台输出`err 失败` 至此，我们已经完成了 promise 最关键的部分：then 的链式调用和值的穿透。搞清楚了 then 的链式调用和值的穿透，你也就搞清楚了 Promise。

## 引用

https://www.zhihu.com/search?type=content&q=promise%E5%AE%9E%E7%8E%B0

## promise 相关的事件循环题

```js
new Promise((resolve, reject) => {
  console.log("log: 外部promise");
  resolve();
})
  .then(() => {
    console.log("log: 外部第一个then");
    new Promise((resolve, reject) => {
      console.log("log: 内部promise");
      resolve();
    })
      .then(() => {
        console.log("log: 内部第一个then");
      })
      .then(() => {
        console.log("log: 内部第二个then");
      });
  })
  .then(() => {
    console.log("log: 外部第二个then");
  });

// log: 外部promise
// log: 外部第一个then
// log: 内部promise
// log: 内部第一个then
// log: 外部第二个then
// log: 内部第二个then
```

### 结论一

> 当执行 then 方法时，如果前面的 promise 已经是 resolved 状态，则直接将回调放入微任务队列中

执行 then 方法是同步的，而 then 中的回调是异步的

```js
new Promise((resolve, reject) => {
  resolve();
}).then(() => {
  console.log("log: 外部第一个then");
});
```

实例化 Promise 传入的函数是同步执行的，then 方法本身其实也是同步执行的，但 then 中的回调会先放入微任务队列，等同步任务执行完毕后，再依次取出执行，换句话说只有回调是异步的

同时在同步执行 then 方法时，会进行判断：

- **如果前面的 promise 已经是 resolved 状态，则会立即将回调推入微任务队列**（但是执行回调还是要等到所有同步任务都结束后）

- 如果前面的 promise 是 pending 状态则会将回调存储在 promise 的内部，一直等到 promise 被 resolve 才将回调推入微任务队列

### 结论 2

> 当一个 promise 被 resolve 时，会遍历之前通过 then 给这个 promise 注册的所有回调，将它们依次放入微任务队列中

```js
let p = new Promise((resolve, reject) => {
  setTimeout(resolve, 1000);
});
p.then(() => {
  console.log("log: 外部第一个then");
});
p.then(() => {
  console.log("log: 外部第二个then");
});
p.then(() => {
  console.log("log: 外部第三个then");
});
```

1 秒后变量 p 才会被 resolve，但是在 resolve 前通过 then 方法给它注册了 3 个回调，此时这 3 个回调不会被执行，也不会被放入微任务队列中，它们会被 p 内部储存起来（在手写 promise 时，这些回调会放在 promise 内部保存的数组中），等到 p 被 resolve 后，依次将这 3 个回调推入微任务队列，此时如果没有同步任务就会逐个取出再执行

另外还有几点需要注意:

对于普通的 promise 来说，当执行完 resolve 函数时，promise 状态就为 resolved

resolve 函数就是在实例化 Promise 时，传入函数的第一个参数

```js
new Promise((resolve) => {
  resolve();
});
```

它的作用除了将当前的 promise 由 pending 变为 resolved，还会遍历之前通过 then 给这个 promise 注册的所有回调，将它们依次放入微任务队列中，**很多人以为是由 then 方法来触发它保存回调，而事实上 then 方法即不会触发回调，也不会将它放到微任务，then 只负责注册回调，由 resolve 将注册的回调放入微任务队列，由事件循环将其取出并执行**

### promise 代码输出

```js
//1 2 4 3 6 5
const promise = new Promise((resolve, reject) => {
  console.log(1);
  resolve();
  console.log(2);
  reject();
});
setTimeout(() => {
  console.log(5);
}, 0);
promise
  .then(() => {
    console.log(3);
  })
  .then(() => {
    console.log(6);
  })
  .catch(() => {
    console.log(7);
  });
console.log(4);
```