class MyPromise {
  // 构造函数
  constructor(executor) {
    this.state = "pending"; // 初始状态
    this.value = undefined; // 成功后的值
    this.reason = undefined; // 失败后的原因
    this.onResolvedCallbacks = []; // 成功回调队列
    this.onRejectedCallbacks = []; // 失败回调队列

    // 成功函数
    const resolve = (value) => {
      if (this.state === "pending") {
        this.state = "fulfilled";
        this.value = value;
        // 状态改变后，依次执行存好的回调（处理异步）
        this.onResolvedCallbacks.forEach((fn) => fn());
      }
    };

    // 失败函数
    const reject = (reason) => {
      if (this.state === "pending") {
        this.state = "rejected";
        this.reason = reason;
        this.onRejectedCallbacks.forEach((fn) => fn());
      }
    };

    // 立即执行执行器，并捕获错误
    try {
      executor(resolve, reject);
    } catch (err) {
      reject(err);
    }
  }

  // then 方法
  then(onFulfilled, onRejected) {
    // 穿透处理：如果传的不是函数，就给个默认函数把值传下去
    onFulfilled = typeof onFulfilled === "function" ? onFulfilled : (v) => v;
    onRejected =
      typeof onRejected === "function"
        ? onRejected
        : (e) => {
            throw e;
          };

    // 为了链式调用，必须返回一个新的 Promise
    const promise2 = new MyPromise((resolve, reject) => {
      // 成功状态
      if (this.state === "fulfilled") {
        setTimeout(() => {
          // 用 setTimeout 模拟异步（宏任务模拟微任务）
          try {
            let x = onFulfilled(this.value);
            resolve(x); // 简化版：直接把上一个 then 的返回值 resolve 出去
          } catch (e) {
            reject(e);
          }
        }, 0);
      }

      // 失败状态
      if (this.state === "rejected") {
        setTimeout(() => {
          try {
            let x = onRejected(this.reason);
            resolve(x);
          } catch (e) {
            reject(e);
          }
        }, 0);
      }

      // 等待状态（处理异步的关键）
      if (this.state === "pending") {
        this.onResolvedCallbacks.push(() => {
          setTimeout(() => {
            try {
              let x = onFulfilled(this.value);
              resolve(x);
            } catch (e) {
              reject(e);
            }
          }, 0);
        });
        this.onRejectedCallbacks.push(() => {
          setTimeout(() => {
            try {
              let x = onRejected(this.reason);
              resolve(x);
            } catch (e) {
              reject(e);
            }
          }, 0);
        });
      }
    });

    return promise2;
  }
}
