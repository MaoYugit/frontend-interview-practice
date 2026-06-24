Promise.myAllSettled = function (promises) {
  return new Promise((resolve) => {
    let count = 0;
    const result = [];
    const len = promises.length;

    promises.forEach((p, index) => {
      Promise.resolve(p)
        .then((res) => {
          result[index] = { status: "fulfilled", value: res };
        })
        .catch((err) => {
          result[index] = { status: "rejected", reason: err };
        })
        .finally(() => {
          count++;
          if (count === len) resolve(result);
        });
    });
  });
};
