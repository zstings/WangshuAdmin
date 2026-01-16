<template>
  <div class="flex-center h-screen w-screen flex-col">
    <h1 class="text-8xl font-bold">404</h1>
    <p class="text-2xl text-[#666]">页面不存在</p>
    <el-button class="mt-10" type="primary" @click="handleClick">返回上一页</el-button>
  </div>
</template>
<script setup lang="ts">
import { useRouter } from 'vue-router';
const router = useRouter();
const handleClick = () => {
  router.go(-1);
};
</script>
