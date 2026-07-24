Array.prototype.myFilter = function (callback, thisArg) {
  // 1. 检查 this 是否为 null 或 undefined
  if (this == null) {
    throw new TypeError("this is null or undefined");
  }

  // 2. 将 this 转为对象
  const O = Object(this);

  // 3. 确保长度是有效的 32 位无符号整数
  const len = O.length >>> 0;

  // 4. 检查 callback 是否为函数
  if (typeof callback !== "function") {
    throw new TypeError(callback + " is not a function");
  }

  // 5. 创建结果数组（初始化为空数组）
  const result = [];

  // 6. 遍历原数组
  for (let i = 0; i < len; i++) {
    // 检查该索引是否存在于原对象（处理稀疏数组）
    if (i in O) {
      const val = O[i];
      // 调用 callback，如果返回值为真值（Truthy），则将元素放入新数组
      if (callback.call(thisArg, val, i, O)) {
        result.push(val);
      }
    }
  }

  // 7. 返回结果数组
  return result;
};
