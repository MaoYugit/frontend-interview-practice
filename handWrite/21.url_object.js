function urlToParamsObj(urlStr) {
  const obj = {};
  // 提取问号后面的查询字符串
  const queryString = urlStr.includes("?")
    ? urlStr.split("?")[1].split("#")[0]
    : urlStr;
  const params = new URLSearchParams(queryString);

  for (const [key, value] of params.entries()) {
    // 处理同一个 key 出现多次的情况（转为数组）
    if (obj[key] !== undefined) {
      if (Array.isArray(obj[key])) {
        obj[key].push(value);
      } else {
        obj[key] = [obj[key], value];
      }
    } else {
      obj[key] = value;
    }
  }
  return obj;
}

// 测试：
const url =
  "https://example.com/page?name=jack&age=25&hobby=coding&hobby=games#hash";
console.log(urlToParamsObj(url));
// 输出: { name: 'jack', age: '25', hobby: [ 'coding', 'games' ] }

function urlToParamsObjManual(urlStr) {
  const obj = {};

  // 1. 获取问号 '?' 的位置
  const qIndex = urlStr.indexOf("?");
  if (qIndex === -1) return obj;

  // 2. 截取查询参数部分，并去掉 hash 符号 '#' 及其后面的内容
  let queryString = urlStr.slice(qIndex + 1);
  const hashIndex = queryString.indexOf("#");
  if (hashIndex !== -1) {
    queryString = queryString.slice(0, hashIndex);
  }

  if (!queryString) return obj;

  // 3. 按 '&' 拆分各个参数对
  const pairs = queryString.split("&");
  for (const pair of pairs) {
    if (!pair) continue;

    // 4. 按 '=' 拆分 key 和 value，并进行解码
    const [rawKey, rawValue = ""] = pair.split("=");
    const key = decodeURIComponent(rawKey);
    const value = decodeURIComponent(rawValue);

    // 5. 组装成对象，处理重复 key
    if (obj[key] !== undefined) {
      if (Array.isArray(obj[key])) {
        obj[key].push(value);
      } else {
        obj[key] = [obj[key], value];
      }
    } else {
      obj[key] = value;
    }
  }

  return obj;
}

// 测试：
const url2 =
  "https://example.com/page?name=%E5%BC%A0%E4%B8%89&age=18&tag=admin&tag=vip#title";
console.log(urlToParamsObjManual(url2));
// 输出: { name: '张三', age: '18', tag: [ 'admin', 'vip' ] }

function parseFullUrl(urlStr) {
  try {
    const parsed = new URL(urlStr);

    return {
      href: parsed.href, // 完整 URL
      protocol: parsed.protocol, // 协议 (如 http:, https:)
      host: parsed.host, // 域名 + 端口 (如 localhost:8080)
      hostname: parsed.hostname, // 域名 (如 localhost)
      port: parsed.port, // 端口 (如 8080)
      pathname: parsed.pathname, // 路径 (如 /path/to/page)
      hash: parsed.hash, // 哈希值 (如 #section1)
      search: parsed.search, // 查询字符串 (如 ?a=1&b=2)
      // 结合前面的方法，将 query 也转为对象
      query: urlToParamsObj(parsed.search),
    };
  } catch (error) {
    console.error("输入的不是有效的 URL", error);
    return null;
  }
}

// 测试：
const fullUrl =
  "https://user:pass@example.com:8080/directory/file.html?query=string#hash";
console.log(parseFullUrl(fullUrl));
/*
输出：
{
  href: 'https://user:pass@example.com:8080/directory/file.html?query=string#hash',
  protocol: 'https:',
  host: 'example.com:8080',
  hostname: 'example.com',
  port: '8080',
  pathname: '/directory/file.html',
  hash: '#hash',
  search: '?query=string',
  query: { query: 'string' }
}
*/
