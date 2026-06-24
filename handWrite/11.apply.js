Function.prototype.myApply = function (context, argsArray) {
  context = context || window;
  const fnSymbol = Symbol("fn");
  context[fnSymbol] = this;

  // 唯一区别：argsArray 是数组，直接展开传进去
  const result = context[fnSymbol](...(argsArray || []));

  delete context[fnSymbol];
  return result;
};
