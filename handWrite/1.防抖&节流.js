function debounce(fn, delay = 300) {
  let timer = null;
  return function () {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {});
  };
}
