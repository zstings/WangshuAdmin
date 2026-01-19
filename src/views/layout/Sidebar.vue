<template>
  <div class="layout-sidebar flex flex-col">
    <el-menu :default-active="defaultActive" class="layout-menu-vertical" :router="true" :collapse="collapse">
      <el-menu-item index="/ipBlack">
        <el-icon><User /></el-icon>
        <span> IP黑名单</span>
      </el-menu-item>
      <el-menu-item index="/company">
        <el-icon><User /></el-icon>
        <span> 企业列表</span>
      </el-menu-item>
      <el-menu-item index="/contract">
        <el-icon><User /></el-icon>
        <span> 合同列表</span>
      </el-menu-item>
      <el-sub-menu index="1">
        <template #title>
          <el-icon><User /></el-icon>
          <span>结果页面</span>
        </template>
        <el-menu-item index="/result">成功页</el-menu-item>
        <el-menu-item index="/result/eg">其他状态示例</el-menu-item>
      </el-sub-menu>
    </el-menu>
    <div class="mt-auto mr-[6px] mb-10 ml-auto flex h-[30px] w-[30px] cursor-pointer items-center justify-center rounded-[6px] bg-[#f7f8fa]" @click="collapse = !collapse">
      <el-icon color="#a2aab3" class="#a2aab3"><Operation /></el-icon>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { computed, ref } from 'vue';
import { User, Operation } from '@element-plus/icons-vue';

const route = useRoute();
const defaultActive = computed(() => {
  return route.path;
});

const collapse = ref(false);
function setCollapse() {
  collapse.value = window.innerWidth < 640;
}
setCollapse();
window.addEventListener('resize', setCollapse);
</script>

<style lang="less" scoped>
.layout-sidebar {
  height: 100%;
  background-color: #fff;
  padding: 0 8px;
  position: relative;
  overflow: auto;
  --el-menu-base-level-padding: 10px;
  .layout-menu-vertical:not(.el-menu--collapse) {
    width: 220px;
  }
  :deep(.el-menu) {
    border: none;
    .el-menu-item {
      height: 40px;
      margin: 8px 0;
      &.is-active {
        background-color: #f3f6f9;
        border-radius: 6px;
      }
      &:hover {
        background-color: #f3f6f9;
        border-radius: 6px;
      }
    }
    .el-sub-menu__title {
      height: 40px;
      &:hover {
        background-color: #fff;
        border-radius: 6px;
      }
    }
    .layout-icon {
      font-size: 18px;
      margin-right: 8px;
      color: #666;
    }
  }
  .el-menu-item.is-active {
    .layout-icon {
      color: var(--subColor);
    }
  }
}
</style>
