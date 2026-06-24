Promise.myAll = function (promises) {
  return new Promise((resolve, reject) => {
    let count = 0; // 计数器，记录成功了几个
    const result = []; // 存放结果的数组
    const len = promises.length;

    if (len === 0) return resolve([]); // 处理空数组

    promises.forEach((p, index) => {
      // 用 Promise.resolve 包裹一下，防止 p 不是 Promise 对象
      Promise.resolve(p)
        .then((res) => {
          result[index] = res; // 保证结果顺序和输入顺序一致
          count++;
          if (count === len) {
            resolve(result); // 全部成功了，返回结果数组
          }
        })
        .catch(reject); // 只要有一个失败，直接调用 reject
    });
  });
};
