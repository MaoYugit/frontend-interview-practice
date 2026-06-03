<template>
  <div class="virtual-list-container" :style="{ height: containerHeight + 'px' }" @scroll="onScroll">
    <!-- 1. 撑开高度的占位背景（让浏览器出现正确的滚动条） -->
    <div class="virtual-list-phantom" :style="{ height: totalHeight + 'px' }"></div>
    <!-- 2. 列表容器 -->
    <div class="virtual-list-content" :style="{ transform: `translateY(${offsetY}px)` }">
      <div v-for="item in visibleItems" :key="item.id" class="virtual-list-item"
        :style="{ height: itemHeight + 'px', lineHeight: itemHeight + 'px' }">
        <!-- 作用域插槽 -->
        <slot :item="item" :index="item._index"></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" generic="T extends { id: number | string }">
import { ref, computed } from "vue";

// 1. 定义 Props
interface Props {
  items: T[];
  itemHeight?: number;
  containerHeight?: number;
  buffer?: number;
}

// 2. 为可选的 Props 声明默认值
const props = withDefaults(defineProps<Props>(), {
  itemHeight: 50,
  containerHeight: 400,
  buffer: 3
})

// 3. 
const scrollTop = ref<number>(0);

// 4.  DOM 滚动事件
const onScroll = (e: Event): void => {
  const target = e.target as HTMLElement;
  scrollTop.value = target.scrollTop;
}

// 5. 计算总高度
const totalHeight = computed<number>(() => props.items.length * props.itemHeight);

// 6. 计算可视区域内最多能容纳节点的数量
const visibleCount = computed<number>(() => {
  return Math.ceil(props.containerHeight / props.itemHeight) + props.buffer;
})

// 7. 计算当前的起始索引
const startIndex = computed<number>(() => {
  const index = Math.floor(scrollTop.value / props.itemHeight);
  return Math.max(0, index - Math.floor(props.buffer / 2));
});

// 8. 计算当前的结束索引
const endIndex = computed<number>(() => {
  return Math.min(props.items.length, startIndex.value + visibleCount.value);
});

// 9. 截取真实数据
const visibleItems = computed<(T & { _index: number })[]>(() => {
  return props.items
    .slice(startIndex.value, endIndex.value)
    .map((item, index) => ({
      ...item,
      _index: startIndex.value + index,
    }))
})

// 10. 计算偏移量
const offsetY = computed<number>(() => startIndex.value * props.itemHeight);
</script>

<style scoped>
.virtual-list-container {
  overflow-y: auto;
  position: relative;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #fafafa;
}

.virtual-list-phantom {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  z-index: -1;
}

.virtual-list-content {
  left: 0;
  right: 0;
  top: 0;
  position: absolute;
  will-change: transform;
  /* 开启 GPU 加速 */
}

.virtual-list-item {
  box-sizing: border-box;
  border-bottom: 1px solid #f0f0f0;
  padding: 0 16px;
  background-color: #fff;
  font-size: 14px;
  color: #333;
}
</style>