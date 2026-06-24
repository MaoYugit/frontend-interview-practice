Promise.myRace = function (promises) {
  return new Promise((resolve, reject) => {
    for (let p of promises) {
      // 谁跑得快，谁就先触发 resolve 或 reject
      Promise.resolve(p).then(resolve, reject);
    }
  });
};
