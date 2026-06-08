// src/store/user.ts
import { defineStore } from "pinia";

interface UserState {
  token: string | null;
  roles: string[];
}

export const useUserStore = defineStore("user", {
  state: (): UserState => ({
    // 初始化时从 localStorage 读取 token
    token: localStorage.getItem("token") || null,
    roles: [],
  }),
  actions: {
    // 模拟登录
    async login(username: string) {
      // 简单模拟：输入 admin 获取 admin 角色，输入 editor 获取 editor 角色，其他输入获取 guest 角色
      let token = "";
      if (username === "admin") {
        token = "admin-token";
        this.roles = ["admin"];
      } else if (username === "editor") {
        token = "editor-token";
        this.roles = ["editor"];
      } else {
        token = "guest-token";
        this.roles = ["guest"];
      }
      this.token = token;
      localStorage.setItem("token", token);
    },

    // 模拟获取用户信息/角色
    async getUserInfo() {
      if (this.token === "admin-token") {
        this.roles = ["admin"];
      } else if (this.token === "editor-token") {
        this.roles = ["editor"];
      } else {
        this.roles = [];
      }
      return { roles: this.roles };
    },
    // 重置 Token 和角色（登出或 Token 失效时调用）
    resetToken() {
      this.token = null;
      this.roles = [];
      localStorage.removeItem("token");
    },
  },
});
