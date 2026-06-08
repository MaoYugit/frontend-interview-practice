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

### 第二步：编写 Pinia 状态管理

我们需要在 Pinia 中存储两部分数据：
1. **用户信息与登录状态**（Token、用户角色 Roles）。
2. **根据角色过滤后的动态路由**。

请在 `src` 下创建 `store` 文件夹，并编写以下两个文件：

#### 1. 用户状态仓库：`src/store/user.ts`
这里负责处理登录逻辑、获取用户角色以及登出。

```typescript
// src/store/user.ts
import { defineStore } from 'pinia'

interface UserState {
  token: string | null
  roles: string[]
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    // 初始化时从 localStorage 读取 token
    token: localStorage.getItem('token'),
    roles: []
  }),
  actions: {
    // 模拟登录
    async login(username: string) {
      // 简单模拟：输入 admin 获取 admin 角色，输入其他获取 editor 角色
      let token = ''
      if (username === 'admin') {
        token = 'admin-token'
      } else {
        token = 'editor-token'
      }
      
      this.token = token
      localStorage.setItem('token', token)
    },

    // 模拟获取用户信息/角色
    async getUserInfo() {
      // 实际开发中应该通过接口请求用户信息
      // 这里根据本地的 token 简单模拟返回对应的角色
      if (this.token === 'admin-token') {
        this.roles = ['admin']
      } else if (this.token === 'editor-token') {
        this.roles = ['editor']
      } else {
        this.roles = []
      }
      return { roles: this.roles }
    },

    // 重置 Token 和角色（登出或 Token 失效时调用）
    resetToken() {
      this.token = null
      this.roles = []
      localStorage.removeItem('token')
    }
  }
})
```

#### 2. 路由生成仓库：`src/store/permission.ts`
这里负责根据用户的 `roles`，从我们之前定义的 `asyncRoutes` 中筛选出用户可访问的路由。

```typescript
// src/store/permission.ts
import { defineStore } from 'pinia'
import { RouteRecordRaw } from 'vue-router'
import { asyncRoutes, constantRoutes } from '../router'

// 辅助函数：判断当前用户是否拥有该路由的访问权限
function hasPermission(roles: string[], route: RouteRecordRaw): boolean {
  if (route.meta && route.meta.roles) {
    // 只要用户的角色和路由要求的角色有一个重合，就可以访问
    return roles.some(role => (route.meta!.roles as string[]).includes(role))
  }
  // 如果路由没配置 meta.roles 属性，说明是公共页面，默认有权限访问
  return true
}

// 递归过滤动态路由表
export function filterAsyncRoutes(routes: RouteRecordRaw[], roles: string[]): RouteRecordRaw[] {
  const res: RouteRecordRaw[] = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

interface PermissionState {
  routes: RouteRecordRaw[] // 完整的路由表（静态 + 动态）
  addRoutes: RouteRecordRaw[] // 动态添加的权限路由
}

export const usePermissionStore = defineStore('permission', {
  state: (): PermissionState => ({
    routes: [],
    addRoutes: []
  }),
  actions: {
    generateRoutes(roles: string[]): RouteRecordRaw[] {
      let accessedRoutes: RouteRecordRaw[]
      
      if (roles.includes('admin')) {
        // 如果是超级管理员，可以直接赋予所有动态路由权限
        accessedRoutes = asyncRoutes || []
      } else {
        // 否则，根据角色进行过滤
        accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      }

      this.addRoutes = accessedRoutes
      // 将静态路由与通过权限过滤的动态路由拼接，用于侧边栏菜单等组件的渲染
      this.routes = constantRoutes.concat(accessedRoutes)
      
      return accessedRoutes
    }
  }
})
```

---

### 第三步：编写核心路由守卫（Permission Guard）

现在我们需要在路由跳转前进行拦截：
1. **检查是否有 Token**：
   * 没有 Token：如果去非白名单页面（如 `/login` 以外的页面），直接拦截重定向至 `/login`。
2. **有 Token**：
   * 如果去 `/login`，重定向至 `/`（首页）。
   * 如果去其他页面，**检查 Pinia 中是否有用户角色（Roles）**：
     * **有角色**：说明已经加载过动态路由，直接放行 `next()`。
     * **没有角色**（页面刷新或首次进入）：请求获取用户信息/角色 -> 调用 `permissionStore` 过滤出可访问的路由 -> 使用 **`router.addRoute`** 动态注册这些路由 -> 重新触发跳转 `next({ ...to, replace: true })`。

在 `src` 目录下新建 `permission.ts` 文件并编写以下代码：

```typescript
// src/permission.ts
import router from './router'
import { useUserStore } from './store/user'
import { usePermissionStore } from './store/permission'

// 白名单，不需要 Token 就可以直接访问的路由
const whiteList = ['/login', '/404']

router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()
  const permissionStore = usePermissionStore()

  // 1. 获取 Token
  const hasToken = userStore.token

  if (hasToken) {
    if (to.path === '/login') {
      // 已经登录，访问登录页则直接重定向到首页
      next({ path: '/' })
    } else {
      // 检查是否已经获取了用户的角色
      const hasRoles = userStore.roles && userStore.roles.length > 0
      
      if (hasRoles) {
        next()
      } else {
        try {
          // 如果没有角色信息（如刷新了页面），重新获取用户信息和角色
          const { roles } = await userStore.getUserInfo()

          // 根据角色生成可访问的动态路由
          const accessRoutes = permissionStore.generateRoutes(roles)

          // 核心：使用 addRoute 动态注册路由
          accessRoutes.forEach(route => {
            router.addRoute(route)
          })

          // 关键点：动态添加完路由后，必须使用 next({ ...to, replace: true }) 
          // 重新触发一次路由导航，确保新添加的路由生效
          next({ ...to, replace: true })
        } catch (error) {
          // 获取用户信息或过滤路由出错，重置 token 并重定向到登录页
          userStore.resetToken()
          next(`/login?redirect=${to.path}`)
        }
      }
    }
  } else {
    // 没有 Token
    if (whiteList.includes(to.path)) {
      // 在白名单中，直接放行
      next()
    } else {
      // 否则，重定向到登录页并带上重定向参数
      next(`/login?redirect=${to.path}`)
    }
  }
})
```

**并在 `src/main.ts` 中引入全局守卫**，确保它生效：

```typescript
// src/main.ts
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './permission' // 引入路由守卫，确保 beforeEach 机制运行

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
```

---

### 下一步实践：让界面动起来（登录/跳转测试）

有了上述逻辑后，我们需要在 `Login.vue` 和 `Dashboard.vue` 中编写按钮事件，以测试我们的权限拦截逻辑。

请问您写完了这部分 Store 和路由守卫的代码了吗？如果准备完毕，告诉我，我们可以开始编写**前端页面逻辑（登录、切换角色并测试不同角色的访问权限）**。
