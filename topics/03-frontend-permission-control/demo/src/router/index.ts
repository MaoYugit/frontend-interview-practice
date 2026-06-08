// src/router/index.ts

import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";

// 1. 静态路由：所有人都可访问
export const constantRoutes: RouteRecordRaw[] = [
  {
    path: "/login",
    name: "Login",
    component: () => import("../views/login/index.vue"),
    meta: {
      title: "登录",
    },
  },
  {
    path: "/",
    name: "Dashboard",
    component: () => import("../views/dashboard/index.vue"),
    meta: {
      title: "首页",
    },
  },
  {
    path: "/404",
    name: "404",
    component: () => import("../views/error/index.vue"),
    meta: {
      title: "404",
    },
  },
];

// 2. 动态路由：根据用户角色动态加载
export const asyncRoutes: RouteRecordRaw[] = [
  {
    path: "/admin",
    name: "AdminPage",
    component: () => import("../views/admin/index.vue"),
    meta: {
      title: "管理员页面",
      roles: ["admin"], // 只有 admin 角色可以访问
    },
  },
  {
    path: "/editor",
    name: "EditorPage",
    component: () => import("../views/editor/index.vue"),
    meta: {
      title: "编辑页面",
      roles: ["admin", "editor"], // 只有 admin 和 editor 角色可以访问
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes: constantRoutes,
});

export default router;
