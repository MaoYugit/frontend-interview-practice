Function.prototype.myBind = function (context, ...args1) {
  // 1. 保存当前的函数（即谁调用了 myBind，this 就是谁）
  const fn = this;

  // 2. 返回一个全新的函数
  return function (...args2) {
    // 3. 当这个新函数在未来被执行时，调用原函数
    // 并通过 apply 把 this 绑定到 context，同时合并两次传入的参数
    return fn.apply(context, [...args1, ...args2]);
  };
};
