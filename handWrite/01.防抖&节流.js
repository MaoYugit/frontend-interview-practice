// 防抖
function debounce(fn, delay = 300) {
  let timer = null; // 1. 用闭包保存定时器

  return function (...args) {
    if (timer) clearTimeout(timer); // 2. 每次进来，先清除上一次的定时器

    timer = setTimeout(() => {
      fn.apply(this, args); // 3. 重新计时，时间到了才执行
    }, delay);
  };
}

// 节流
function throttle(fn, delay = 300) {
  let prev = 0; // 1. 保存上一次执行的时间戳

  return function (...args) {
    let now = Date.now(); // 2. 获取当前时间戳

    if (now - prev >= delay) {
      // 3. 如果两次点击的时间间隔大于设定的 cd 时间
      fn.apply(this, args); // 4. 执行函数
      prev = now; // 5. 更新上一次执行时间戳
    }
  };
}
