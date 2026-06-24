function myNew(Constructor, ...args) {
  // 1. 创建一个空的简单 JavaScript 对象，并关联原型
  // Object.create(proto) 会创建一个新对象，并将该对象的 __proto__ 指向 proto
  const obj = Object.create(Constructor.prototype);

  // 2. 执行构造函数，并将 this 绑定到新创建的对象 obj 上
  // args 是传递给构造函数的参数数组
  const res = Constructor.apply(obj, args);

  // 3. 根据构造函数的返回值类型，决定最终返回什么
  // 如果构造函数返回的是一个对象（且不是 null），就返回这个对象；否则返回我们创建的 obj
  return res instanceof Object ? res : obj;
}
