- _场景_：基于路由守卫的动态路由添加，以及用 Vue 自定义指令（如 `v-permission`）控制按钮级别的权限展示。

搭建项目基础框架：
创建demo文件夹，进入该文件夹路径，执行 `pnpm create vite@latest . --template vue-ts `
package.json 中 name 改成这个 `"name": "@demo/frontend-permission-control",`

接下来我们将分步骤、循序渐进地构建一个功能完整的权限控制系统。完整版通常包含以下四个核心部分：

1. **路由设计**：划分“静态路由”与“动态路由（权限路由）”
2. **状态管理（Pinia）**：存储 Token、用户角色（Roles）和权限列表（Permissions）
3. **路由守卫（Permission Guard）**：动态过滤路由并通过 `router.addRoute()` 动态加载
4. **按钮级控制（自定义指令）**：编写 `v-permission` 核心指令

现在，我们从 **第一步：基础路由与权限表设计** 开始。

---

### 第一步：安装必要依赖

由于我们在 `demo` 项目中需要使用路由和状态管理，请在终端进入 `demo` 目录安装 `vue-router` 和 `pinia`：

```bash
# 确保在 topics/03-frontend-permission-control/demo 目录下执行
pnpm add vue-router@4 pinia
```

---

### 第二步：设计路由（静态路由与动态路由）

在 `topics/03-frontend-permission-control/demo/src` 目录下，新建 `router` 目录，并创建 `index.ts` 文件。

我们将路由分为两组：

- **`constantRoutes` (静态路由)**：无需任何权限，任何人均可访问（如 `/login`, `/404`, `/dashboard`）。
- **`asyncRoutes` (动态/权限路由)**：需要匹配用户角色后，才动态添加到路由表中的页面（如管理员页面、编辑页面）。

请创建并编写 `src/router/index.ts`：

```typescript
// src/router/index.ts
import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

// 1. 静态路由：所有人都可以访问
export const constantRoutes: RouteRecordRaw[] = [
  {
    path: "/login",
    name: "Login",
    component: () => import("../views/login/index.vue"),
    meta: { title: "登录" },
  },
  {
    path: "/",
    name: "Dashboard",
    component: () => import("../views/dashboard/index.vue"),
    meta: { title: "首页" },
  },
  {
    path: "/404",
    name: "404",
    component: () => import("../views/error/404.vue"),
    meta: { title: "404" },
  },
];

// 2. 动态路由：根据用户角色（roles）动态加载
export const asyncRoutes: RouteRecordRaw[] = [
  {
    path: "/admin",
    name: "AdminPage",
    component: () => import("../views/admin/index.vue"),
    meta: {
      title: "管理员页面",
      roles: ["admin"], // 只有拥有 'admin' 角色的用户才能访问
    },
  },
  {
    path: "/editor",
    name: "EditorPage",
    component: () => import("../views/editor/index.vue"),
    meta: {
      title: "编辑页面",
      roles: ["admin", "editor"], // 'admin' 或 'editor' 角色都可以访问
    },
  },
];

// 3. 初始化路由，初始时只挂载静态路由
const router = createRouter({
  history: createWebHistory(),
  routes: constantRoutes,
});

export default router;
```

---

### 第三步：创建测试页面

为了让路由能够正常运转，我们需要在 `src/views` 下创建对应的几个简单页面。

请在 `src` 下新建 `views` 文件夹，并创建以下文件（简单的写几句 H1 标签即可，方便后续测试跳转结果）：

1. **`src/views/login/index.vue`**

```vue
<template>
  <div class="login-container">
    <h1>登录页面</h1>
    <p>待实现：模拟登录，并保存 Token 与角色</p>
  </div>
</template>
```

2. **`src/views/dashboard/index.vue`**

```vue
<template>
  <div class="dashboard-container">
    <h1>系统首页（所有人可见）</h1>
  </div>
</template>
```

3. **`src/views/admin/index.vue`**

```vue
<template>
  <div>
    <h1>管理员专属页面（仅 admin 可见）</h1>
  </div>
</template>
```

4. **`src/views/editor/index.vue`**

```vue
<template>
  <div>
    <h1>编辑页面（admin 和 editor 可见）</h1>
  </div>
</template>
```

5. **`src/views/error/404.vue`**

```vue
<template>
  <div>
    <h1>404 - 页面未找到或无权访问</h1>
  </div>
</template>
```

---

### 第四步：修改 `src/App.vue` 和 `src/main.ts`

1. **修改 `src/App.vue`**，只保留基本的路由出口：

```vue
<template>
  <div id="app">
    <!-- 路由渲染出口 -->
    <router-view />
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  padding: 20px;
}
</style>
```

2. **修改 `src/main.ts`**，将路由和 Pinia 注册进 Vue 实例：

```typescript
import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount("#app");
```

---

