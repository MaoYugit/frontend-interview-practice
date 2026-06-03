1. **完善文档**： `README.md` 中写下核心原理解析、核心计算公式和面试避坑。
2. **初始化 Demo 目录**：在当前文件夹下创建 `demo/` 子项目，并配置好 pnpm 工作区依赖。
3. **编写核心代码**：实现一个基于 Vue 3 的高性能虚拟列表组件，并在根目录启动测试。

---

### 第一步：完善 `README.md`

[README.md](./README.md)

---

### 第二步：创建 `demo` 子项目

接下来，我们在终端里执行命令，把这个 Demo 的开发工程搭建起来。

1. **创建并进入 demo 目录**（在项目根目录下执行）：
   ```bash
   mkdir -p topics/02-performance-virtual-list/demo
   cd topics/02-performance-virtual-list/demo

2. **初始化 `package.json`**：

   ```bash
   pnpm init
   ```

3. **修改生成的 `package.json`**：

   打开 `topics/02-performance-virtual-list/demo/package.json`，将其内容修改为支持 Vue 3 和 Vite 的配置，运行`pnpm install`。

   

4. **在 `demo/` 目录下创建 `vite.config.js`**，配置 Vue 插件

   

5. **在 `demo/` 目录下创建 `index.html` 入口文件**

   

---

### 第三步：编写虚拟滚动核心代码

现在我们用 Vue 3 的 Composition API 来实现这个最核心的算法组件。

1. **创建文件目录**（在 `demo/` 下）：

   ```bash
   mkdir src
   mkdir src/components
   ```

2. **编写虚拟列表核心组件**：创建 `topics/02-performance-virtual-list/demo/src/components/VirtualList.vue`：

   

3. **创建入口渲染实例 `src/index.ts`**

   

4. **创建主应用界面 `src/App.vue`**（在这里模拟 10 万条数据并传入组件）：

   

---

### 第四步：在根目录一键运行！

代码编写完毕后，让我们退回到整个项目的**最外层根目录**，来验证 `pnpm workspaces` 的魔力：

1. **返回项目根目录**：

   ```bash
   cd ../../..
   ```

2. **在根目录一键安装所有依赖**（pnpm 会扫描根目录和子 Demo 的依赖进行优化安装）：

   ```bash
   pnpm install
   ```

3. **使用 `--filter` 启动我们的虚拟列表项目**：

   ```bash
   pnpm --filter @demo/performance-virtual-list dev
   ```

4. 打开终端输出的本地开发服务器地址（例如 `http://localhost:5173`），你将看到一个**即便瞬间滑动到第 5 万条数据，也极其丝滑、毫无卡顿的 10 万条数据滚动列表**！并且可以在浏览器控制台中 Elements 面板里亲眼观察到，DOM 元素一直在循环复用，个数始终保持在 14 个左右。

---

