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
