<template>
  <div class="app-container">
    <h2>🚀 10万条数据高性能虚拟滚动</h2>

    <VirtualList :items="listData" :itemHeight="50" :containerHeight="500">
      <template #default="{ item, index }">
        <div class="item-content">
          <span class="index">#{ index + 1 }</span>
          <span class="title">{{ item.title }} [{{ item.role }}]</span>
          <span class="tag">ID: {{ item.id }}</span>
        </div>
      </template>
    </VirtualList>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import VirtualList from './components/VirtualList.vue';

interface Member {
  id: string;
  title: string;
  role: 'Admin' | 'User' | 'Guest';
}

const total = 100000;

const listData = ref<Member[]>(
  Array.from({ length: total }).map((_, index) => ({
    id: `uuid-${index}`,
    title: `测试会员信息 · 编号 ${index + 1}`,
    role: index % 3 === 0 ? 'Admin' : index % 3 === 1 ? 'User' : 'Guest'
  }))
)
</script>