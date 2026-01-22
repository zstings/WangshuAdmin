<template>
  <LayoutHeader></LayoutHeader>
  <section class="layout-section flex">
    <LayoutSidebar />
    <div class="layout-main flex flex-1 flex-col">
      <div class="layout-breadcrumb flex items-center">
        <el-breadcrumb separator="/">
          <template v-for="(name, index) in breadcrumb" :key="index">
            <el-breadcrumb-item>{{ name }}</el-breadcrumb-item>
          </template>
        </el-breadcrumb>
      </div>
      <div class="layout-main-auto flex-1">
        <router-view></router-view>
      </div>
      <LayoutCopyright v-if="false" />
    </div>
  </section>
</template>

<script setup lang="ts">
import LayoutHeader from '@/views/layout/Header.vue';
import LayoutSidebar from '@/views/layout/Sidebar.vue';
import LayoutCopyright from '@/views/layout/Copyright.vue';
import { useRoute } from 'vue-router';
import { computed } from 'vue';
const route = useRoute();
const breadcrumb = computed(() => {
  return typeof route.meta.breadcrumb == 'function' ? route.meta.breadcrumb(route) : route.meta.breadcrumb;
});
</script>

<style lang="less" scoped>
.layout-section {
  height: calc(100vh - 60px);
  overflow: hidden;
}
.layout-main {
  height: 100%;
  overflow: auto;
  padding: 0 15px;
  &-auto {
    background-color: #fff;
    padding: 15px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
}
.layout-breadcrumb {
  height: 44px;
  font-weight: 600;
}
</style>
