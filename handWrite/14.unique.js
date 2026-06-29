function unique1(arr) {
  return [...new Set(arr)];
}

function unique2(arr) {
  let result = [];
  let arrMap = new Map();

  for (let item of arr) {
    if (!arrMap.has(item)) {
      result.push(item);
      arrMap.set(item, true);
    }
  }
  return result;
}
