Array.prototype.myMap = function (callback, thisArg) {
  // 1. 检查 this 是否为 null/undefined
  if (this == null) {
    throw new TypeError("this is null or undefined");
  }

  // 2. 将 this 转为对象（处理类数组）
  const O = Object(this);

  // 3. 保证长度是有效的 32 位无符号整数
  const len = O.length >>> 0;

  // 4. 检查 callback 是否为函数
  if (typeof callback !== "function") {
    throw new TypeError(callback + " is not a function");
  }

  // 5. 创建结果数组（长度相同）
  const result = new Array(len);

  // 6. 遍历原数组
  for (let i = 0; i < len; i++) {
    // 检查该索引是否存在于原对象（处理稀疏数组）
    if (i in O) {
      // 调用 callback，传入三个参数：元素、索引、原数组
      // thisArg 作为 callback 的 this（若未传则为 undefined）
      result[i] = callback.call(thisArg, O[i], i, O);
    }
    // 如果该索引不存在（空位），结果数组保持空位，不调用 callback
  }

  // 7. 返回新数组
  return result;
};
