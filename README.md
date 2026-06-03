# Frontend Interview Practice

这是一个专注于**“理论深度 + 实际项目应用”**的前端面试题库与实践仓库。这里不仅记录了高频前端面试题解，还为每一个考点编写了**现代化、可独立运行的工程 Demo**，帮助开发者通过真实的业务场景攻克面试难关。

## 🚀 核心设计原则

1. **真实工程化**：Demo 统一采用 Vite + TypeScript + Vue 3 现代技术栈构建，贴近一线大厂开发环境。
2. **场景化落地**：拒绝纯理论的死记硬背。每个核心考点均对应一个实际项目中的业务场景（如：大文件上传、按钮级权限、双 Token 无感刷新等）。
3. **源码级思考**：原理解释部分不流于表面，而是结合 Vue 3 源码实现、V8 引擎垃圾回收机制或网络协议标准进行深度剖析。

---

## 📂 面试题库索引

为了方便学习，题目按模块由浅入深进行了分类，并标注了面试高频指数（🔥）和推荐攻克难度（🟢 基础 | 🟡 进阶 | 🔴 突破）。

### 🟢 Vue 3 核心与原理

| 序号 | 题目 / 主题                     | 推荐难度 | 核心考点                                                     | 对应 Demo 场景                                               | 传送门                        |
| :--- | :------------------------------ | :------- | :----------------------------------------------------------- | :----------------------------------------------------------- | :---------------------------- |
| 01   | **响应式原理与 Ref/Reactive**   | 🟢 基础   | Proxy 拦截 / Reflect 配合 / 依赖收集与触发 (`track` & `trigger`) / 浅劫持与深劫持 | 手写极简 `reactive` / 实现防抖 `customRef` 的输入框          | [Go](./topics/vue-reactive)   |
| 02   | **Vue 3 虚拟 DOM 与 Diff 算法** | 🔴 突破   | 最长递增子序列（LIS）/ 双端对比 / 节点的 Patch 逻辑 / Key 的作用 | 可视化 Diff 节点变化过程                                     | [Go](./topics/vue-diff)       |
| 03   | **按钮级权限控制指令**          | 🟢 基础   | 自定义指令生命周期（`mounted`）/ AST 节点的简单理解 / 权限码设计与 RBAC | 动态鉴权按钮组（实现 `v-permission`）                        | [Go](./topics/vue-permission) |
| 04   | **Composition API 与逻辑复用**  | 🟡 进阶   | `provide/inject` 响应式丢失问题 / 组合式函数封装规范 / 页面性能优化 | 封装通用的 `useIntersectionObserver` 与 `useRequest` 状态管理 | [Go](./topics/vue-composable) |
| 05   | **Pinia 状态管理及持久化**      | 🟢 基础   | 订阅机制 (`$subscribe`) / 插件机制编写 / 单向数据流与响应式共享原理 | 手写实现一个精简版 Pinia 及其持久化插件                      | [Go](./topics/vue-pinia)      |

---

### 🟡 JavaScript / TypeScript 进阶

| 序号 | 题目 / 主题                    | 推荐难度 | 核心考点                                                     | 对应 Demo 场景                                               | 传送门                              |
| :--- | :----------------------------- | :------- | :----------------------------------------------------------- | :----------------------------------------------------------- | :---------------------------------- |
| 01   | **异步并发限制器**             | 🟡 进阶   | Promise 链式调度 / 队列（Queue）设计 / 动态执行窗口（Window）控制 | 大文件分片上传并发控制（限制同时上传数为 3）                 | [Go](./topics/js-async-concurrency) |
| 02   | **手写 Promise A+ 规范**       | 🔴 突破   | 状态机模型（Pending/Fulfilled/Rejected）/ 微任务队列 / `then` 链式调用与值穿透 | 编写通过 `promises-aplus-tests` 标准测试的 MiniPromise       | [Go](./topics/js-promise-aplus)     |
| 03   | **事件循环机制（Event Loop）** | 🟡 进阶   | 宏任务（MacroTask）与微任务（MicroTask）/ 浏览器渲染时机 / V8 任务队列管理 | 编写复杂嵌套 Promise/setTimeout，通过 Timeline 工具分析执行顺序 | [Go](./topics/js-event-loop)        |
| 04   | **深拷贝与循环引用**           | 🟢 基础   | `WeakMap` 解决循环引用 / 复杂类型（RegExp/Date/Map/Set）处理 / 堆栈溢出防范 | 拷贝带有循环依赖的复杂配置对象                               | [Go](./topics/js-deep-clone)        |
| 05   | **TS 高级类型与泛型约束**      | 🟡 进阶   | `infer` 关键字 / 条件类型 / 映射类型 / `Omit` & `Pick` 底层实现 | 封装企业级 API 请求的响应类型体操（自动推导 Response Data）  | [Go](./topics/ts-type-gymnastics)   |

---

### 🔵 性能优化与工程化

| 序号 | 题目 / 主题                              | 推荐难度 | 核心考点                                                     | 对应 Demo 场景                                           | 传送门                            |
| :--- | :--------------------------------------- | :------- | :----------------------------------------------------------- | :------------------------------------------------------- | :-------------------------------- |
| 01   | **虚拟滚动列表 (Virtual List)**          | 🟡 进阶   | 可视区域计算 / 滚动监听与防抖 / 动态高度子节点计算（Offset / Cache） | 10 万条会员数据无延迟滚动列表（支持动态高度）            | [Go](./topics/perf-virtual-list)  |
| 02   | **图片懒加载与无限滚动**                 | 🟢 基础   | `IntersectionObserver` 替代滚动监听 / 浏览器重排与重绘优化 / `loading="lazy"` | 瀑布流图片画廊（实现触底自动加载）                       | [Go](./topics/perf-lazy-load)     |
| 03   | **Vite 插件开发与代码转换**              | 🔴 突破   | Rollup 插件生命周期 / AST（抽象语法树）解析与修改 / 模块联邦概念 | 自动化无痕埋点插件（自动分析函数并在编译期注入打点代码） | [Go](./topics/build-vite-plugin)  |
| 04   | **打包优化与分包策略（Code Splitting）** | 🟡 进阶   | ESM 静态分析 / `sideEffects` 配置 / Rollup `manualChunks` 配置 | 多路由单页应用（SPA）的按需加载与 Chunk 依赖体积优化分析 | [Go](./topics/build-split-chunks) |

---

### 🟣 网络安全、协议与工程实战

| 序号 | 题目 / 主题                    | 推荐难度 | 核心考点                                                     | 对应 Demo 场景                                              | 传送门                          |
| :--- | :----------------------------- | :------- | :----------------------------------------------------------- | :---------------------------------------------------------- | :------------------------------ |
| 01   | **无感刷新 Token（双 Token）** | 🟡 进阶   | Axios 请求/响应拦截器 / 队列挂起与批量重发 / 登录状态感知与过期捕获 | 真实的 Mock 后端环境配合，实现 AccessToken 过期自动静默刷新 | [Go](./topics/net-double-token) |
| 02   | **前端防范 XSS 与 CSRF 攻击**  | 🟢 基础   | HTML 转义防范 / CSP 策略 / SameSite 属性 / Token 防御        | 模拟 XSS 注入场景（实现评论区富文本安全渲染过滤）           | [Go](./topics/net-security)     |
| 03   | **大文件分片上传与断点续传**   | 🔴 突破   | 文件 Spark-MD5 计算 HASH / 切片逻辑 / 上传进度感知 / 秒传原理 | 完整支持“切片 + 秒传 + 断点续传”的大文件上传组件            | [Go](./topics/net-file-upload)  |

---

## 🛠️ 本地运行与调试

本仓库使用 `pnpm` 进行 Workspace（多包工作区）管理，能有效避免每个 Demo 重复安装依赖，极大节省空间并提升速度。

```bash
# 1. 克隆本项目并进入目录
git https://github.com/MaoYugit/frontend-interview-practice.git
cd frontend-interview-practice

# 2. 一键安装全局及所有子项目的依赖
pnpm install

# 3. 运行特定 Demo (格式：pnpm --filter <子项目 package.json 中的 name> <脚本>)
# 例如启动“异步并发限制器”Demo：
pnpm --filter @demo/js-async-concurrency dev

# 例如启动“虚拟滚动列表”Demo：
pnpm --filter @demo/performance-virtual-list dev
