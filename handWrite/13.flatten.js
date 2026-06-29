function flatten1(arr) {
  return arr.flat(Infinity);
}

function flatten2(arr) {
  result = [];
  for (let item of arr) {
    if (Array.isArray(item)) {
      result = result.concat(flatten2(item));
    } else {
      result.push(item);
    }
  }
  return result;
}
