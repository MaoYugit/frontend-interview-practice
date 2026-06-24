Function.prototype.myCall = function (context, ...args) {
  // 1. 确定上下文。如果 context 是 null 或 undefined，则指向 window/global
  context = context || window;

  // 2. 将当前函数（就是 this）作为 context 的一个临时属性挂载上去
  // 为了防止属性名冲突，最好使用 Symbol，但面试直接用普通变量也行
  const fnSymbol = Symbol("fn");
  context[fnSymbol] = this;

  // 3. 执行这个函数。重点：此时函数是被 context 调用的，所以里面的 this 自动指向 context
  const result = context[fnSymbol](...args);

  // 4. 执行完后，把这个临时属性删掉，保持对象原样
  delete context[fnSymbol];

  // 5. 返回执行结果
  return result;
};
