// 快速变成功的
Promise.myResolve = function (value) {
  return new Promise((resolve) => resolve(value));
};

// 快速变失败的
Promise.myReject = function (reason) {
  return new Promise((resolve, reject) => reject(reason));
};
