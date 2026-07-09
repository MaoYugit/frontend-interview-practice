### Vue 计算属性的函数名和 data 中的属性可以同名吗？为什么？

**不可以**。如果同名，data 的优先级更高，计算属性会被覆盖，控制台也会报错提示。

---

**原因：初始化顺序与优先级机制**

Vue 在初始化组件实例时，会按一定顺序处理各选项，大致流程是：

1. 先处理 `props`
2. 再处理 `methods`
3. 处理 `data`
4. 最后处理 `computed`
5. 再处理 `watch`

这些选项最终都会挂载到同一个 Vue 实例上，共享同一个命名空间。

**关键点在于**：当 `data` 和 `computed` 出现同名属性时，`data` 的优先级高于 `computed`。在 Vue 2.x 中，`data` 会在 `computed` 之后被合并到实例上，直接覆盖掉同名的计算属性，导致计算属性定义的 getter/setter 完全失效。

---

**实际表现**

```javascript
new Vue({
  data() {
    return {
      fullName: '我是 data 里的'
    }
  },
  computed: {
    fullName() {
      return '我是计算属性里的'
    }
  }
});
```

结果：
- `this.fullName` 永远是 `'我是 data 里的'`
- 控制台会报警告：`The computed property "fullName" is already defined in data.`

这个设计是合理的，因为 `data` 是组件的核心状态，如果计算属性能覆盖 `data`，会导致数据流混乱和难以追踪的 bug。

---

**正确做法**

- `data` 里存放原始数据
- `computed` 里基于 `data` 派生出新名称

```javascript
data() {
  return {
    firstName: '张',
    lastName: '三'
  }
},
computed: {
  fullName() {
    return this.firstName + this.lastName
  }
}
```

这样 `data` 负责状态存储，`computed` 负责衍生逻辑，职责清晰、互不干扰。