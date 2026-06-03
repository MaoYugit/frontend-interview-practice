## 1. 目录结构

为了方便管理和维护，本项目采用 **“文档与 Demo 集中在同一主题文件夹”** 的结构。这样，点进某一个面试题，既能看理论，又能直接看代码。

```text
frontend-interview-practice/
├── README.md                 # 仓库主页介绍（带有分类索引）
├── package.json              # 根目录配置（用 pnpm monorepo 管理 demo）
├── .gitignore
└── topics/                   # 所有面试题库
    ├── 01-js-async-concurrency/        # 模块 1：JS 异步并发控制
    │   ├── README.md         # 理论解答、核心原理、常见追问
    │   └── demo/             # 对应的实际项目代码（如 Vite + Vue3 极简项目）
    │       ├── src/
    │       └── package.json
    ├── 02-performance-virtual-list/ # 模块 2：性能优化-虚拟列表
    │   ├── README.md
    │   └── demo/
    └── 03-frontend-permission-control/ # 模块 3：前端按钮权限控制
        ├── README.md
        └── demo/
```

---

## 2. 单个面试主题的标准模板（Topic README.md）

每个主题文件夹下的 `README.md` 可以按照以下标准结构来写，保证内容详实、有深度：

````markdown
# 主题名称（例如：Vue 3 中的 Slot 及其应用）

## 1. 面试官常见问法

## 2. 核心概念与原理解析

> 简明扼要地回答核心考点，避免长篇大论，突出重点。

## 3. 常见避坑与面试追问

- **追问 1**：

- **追问 2**：

## 4. 实际项目演练 (Demo 说明)

> 介绍当前文件夹下 `demo/` 目录中所实现的具体业务场景。

- **场景描述**：
- **功能点**：

## 5. 如何运行本 Demo

```bash

```
````

---

## 3. 仓库主页 `README.md` 模板

仓库的根目录 `README.md` 是你的“门面”。它不仅应该介绍这个仓库是什么，还应该提供一个**清晰的知识图谱索引**：

具体内容请看项目 [README.md](../README.md)

---

## 4. 优先整理的高价值选题

优先选取面试中出现频率高的题型

## 5.搭建 pnpm workspace 框架

### 第一步：初始化 Git 并配置 `.gitignore`

在安装任何依赖之前，一定要先配置好 `.gitignore`，否则成千上万的依赖文件会把你的 Git 缓存撑爆。

1. 在项目根目录下打开终端，初始化 Git：
   ```bash
   git init

2. 在项目根目录下新建一个 `.gitignore` 文件，并写入以下常见前端忽略配置：

   ```text
   # Dependency directories
   node_modules/
   
   # Build outputs
   dist/
   out/
   .next/
   
   # Debug logs
   npm-debug.log*
   yarn-debug.log*
   yarn-error.log*
   pnpm-debug.log*
   
   # System files
   .DS_Store
   Thumbs.db
   
   # IDE files
   .vscode/
   .idea/
   ```

---

### 第二步：在根目录初始化 pnpm 并配置工作区

1. 在项目根目录下执行初始化命令，生成根目录的 `package.json`：

   ```bash
   pnpm init
   ```

2. 修改根目录的 `package.json`。为了防止根目录无意中被发布，建议加上 `"private": true`：

   ```json
   {
     "name": "frontend-interview-practice",
     "private": true,
     "version": "1.0.0",
     "description": "Frontend Interview Practice Repository",
     "scripts": {
       "test": "echo \"Error: no test specified\" && exit 1"
     }
   }
   ```

3. 在项目根目录下，新建一个 `pnpm-workspace.yaml` 文件，写入以下内容，用来指定你的 Demo 项目存放在哪里：

   ```yaml
   packages:
     # 声明所有的 demo 文件夹都是工作区成员
     - "topics/*/demo"
   ```

   _注：这里我们约定，每个主题文件夹下，用一个独立的 `demo` 文件夹来存放可运行的代码（如 `topics/01-js-async-concurrency/demo`），而主题根目录只留 `README.md`，这样文档和代码结构最为清晰。_

---

### 第三步：创建第一个 Demo 并安装依赖（以 JS 异步并发为例）

我们以 `01-js-async-concurrency` 为例，初始化它的代码目录：

1. 在 `topics/01-js-async-concurrency` 下新建一个 `demo` 文件夹。

2. 进入该文件夹，初始化它的 `package.json`：

   ```bash
   cd topics/01-js-async-concurrency/demo
   pnpm init
   ```

3. 修改该 `demo/package.json` 的 `name` 属性（比如命名为 `@demo/js-async-concurrency`）：

   ```json
   {
     "name": "@demo/js-async-concurrency",
     "version": "1.0.0",
     "type": "module",
     "scripts": {
       "dev": "vite"
     }
   }
   ```

4. 因为是一个 JS/TS 相关的 Demo，我们给它安装 `vite`（由于配置了 workspace，在任何子目录下执行 pnpm 安装，pnpm 都会自动做全局优化）：

   ```bash
   pnpm add vite -D
   ```

5. 在 `demo` 目录下新建一个极简的网页来测试运行：
   - 新建 `index.html`：

     ```html
     <!DOCTYPE html>
     <html lang="en">
       <head>
         <meta charset="UTF-8" />
         <title>JS Async Concurrency Demo</title>
       </head>
       <body>
         <h1>打开控制台查看异步并发控制效果</h1>
         <script type="module" src="./main.js"></script>
       </body>
     </html>
     ```

   - 新建 `main.js`：

     ```javascript
     console.log("Demo 已成功运行！接下来在这里编写你的并发控制调度器。");
     ```

---

### 第四步：在根目录一键启动

得益于 pnpm workspace 的设计，你**不需要**每次都 cd 到具体的子目录去运行项目。

回到项目根目录，你可以通过 `--filter` 参数直接运行指定的 Demo。例如：

```bash
# 格式：pnpm --filter <子项目 package.json 中的 name> <脚本>
pnpm --filter @demo/js-async-concurrency dev
```

控制台会直接打印出 Vite 的本地服务器地址，打开即可开始调试。

---

### 开发节奏：

1. **写文档**：在对应的 `README.md` 中写好面试题的理论、核心代码伪代码。
2. **写代码**：在 `demo` 目录下实现可运行的完整逻辑（可以用原生 JS，也可以用 Vue/React）。
3. **提交代码**：完成一个主题后，进行一次 Git Commit。
