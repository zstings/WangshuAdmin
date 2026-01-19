<template>
  <el-result :icon="data.type" :title="data.title" :sub-title="data.msg">
    <template #extra>
      <el-button type="primary" @click="router.go(-1)">返回</el-button>
    </template>
  </el-result>
</template>
<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
const route = useRoute();
const router = useRouter();
const data = {
  type: 'success' as 'error' | 'primary' | 'success' | 'warning' | 'info',
  title: '充值成功',
  msg: '充值成功了，充值成功了，充值成功了，充值成功了，充值成功了。',
};
Object.assign(data, route.query);
</script>
