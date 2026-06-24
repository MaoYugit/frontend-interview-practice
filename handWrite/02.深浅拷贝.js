// 浅拷贝
function shallowCopy(obj) {
  if (obj === null || typeof obj !== "object") return obj;

  let clone = Array.isArray(obj) ? [] : {};

  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      clone[key] = obj[key];
    }
  }
  return clone;
}

// 深拷贝
function deepCopy(obj) {
  if (obj === null || typeof obj !== "object") return obj;

  let clone = Array.isArray(obj) ? [] : {};

  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      clone[key] = deepCopy(obj[key]);
    }
  }
  return clone;
}
