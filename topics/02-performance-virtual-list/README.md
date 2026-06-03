# 性能优化：虚拟列表 (Virtual List)

## 1. 面试官常见问法

- 页面渲染 10 万条数据卡顿如何解决？
- 虚拟滚动的核心原理是什么？能手写出它的关键几何计算公式吗？
- 如果列表项（Item）的高度是动态不固定的，虚拟列表该怎么实现？
- 虚拟滚动中如何避免滚动过快时的白屏闪烁问题？

---

## 2. 核心原理解析

### ① 为什么 10 万条数据会卡顿？

浏览器的瓶颈不在于 JS 解析 10 万条数据，而在于 **DOM 的渲染和重排重绘**。一次性创建 10 万个 DOM 节点会撑爆内存，导致 GPU 绘制跟不上滚动速度。

### ② 什么是虚拟列表？

虚拟列表是一种**只渲染可视区域 DOM** 的技术。无论数据总量是 10 万条还是 100 万条，页面上实际存在的 DOM 节点永远只有 $N$ 个（$N = 可视区能容纳的节点数 + 少量缓冲区（Buffer）$）。

### ③ 核心几何计算公式

实现一个最基础的“固定高度虚拟列表”，我们需要三个容器：

1. **外层滚动容器（Container）**：固定高度，设置 `overflow-y: auto`。
2. **绝对定位的占位背景（Phantom）**：高度为 `总数据量 * 单个Item高度`。它的唯一作用是撑开滚动条。
3. **真实渲染列表容器（Content）**：绝对定位，通过 `transform: translateY(offsetY)` 保持在用户的视口内。

```text
▲ [Container] (视口，如 400px，可滚动)
├─▲ [Content] (真实渲染列表，通过 translateY 保持在视口)
│ ├─ [Item 1] (当前可视的第 1 项)
│ ├─ [Item 2]
│ └─ [Item 3]
└─ [Phantom] (虚拟占位层，总高度如 50000px，用于撑开滚动条)
```

当滚动容器发生 `scroll` 事件时，我们实时计算以下变量：

- **可视区能渲染的数量**：`visibleCount = Math.ceil(containerHeight / itemHeight) + buffer`
- **当前滚动的起始索引**：`startIndex = Math.floor(scrollTop / itemHeight)`
- **当前滚动的结束索引**：`endIndex = startIndex + visibleCount`
- **数据截取**：`visibleData = allData.slice(startIndex, endIndex)`
- **内容区域的偏移量**：`offsetY = startIndex * itemHeight`

---

## 3. 常见避坑与面试追问

- **追问 1：如果滚动过快，下方或上方会出现短暂的白屏，怎么解决？**
  - **解答**：引入 **缓冲区（Buffer）**。在计算 `startIndex` 和 `endIndex` 时，向上一行和向下一行多渲染 2 到 3 个不显示在视口内的 DOM。这样当用户快速滚动时，浏览器已经提前准备好了临近的 DOM，从而消除白屏感。
- **追问 2：如果 Item 的高度是不固定的（比如微博、朋友圈有长有短），该如何处理？**
  - **解答**：
    1. **预估高度**：给每一个 Item 一个预估的高度（如 `estimatedItemHeight = 80`）。
    2. **位置缓存**：创建一个数组 `positions`，记录每一个 Item 的 `top`、`bottom`、`height`。
    3. **动态更新**：在 DOM 渲染后，通过 `ResizeObserver` 或 `updated` 生命周期获取 Item 的真实 DOM 高度，更新 `positions` 缓存，并重新计算 Phantom 的总高度和OffsetY。
    4. **二分查找**：在滚动时，由于高度不固定，不能直接用 `Math.floor(scrollTop / height)`。需要通过**二分查找法**在 `positions` 数组中快速找到当前 `scrollTop` 对应的 `startIndex`。

---

## 4. 运行本 Demo

1. 回到项目根目录。

2. 运行以下命令启动服务：

   ```bash
   pnpm --filter @demo/performance-virtual-list dev
   ```

   
