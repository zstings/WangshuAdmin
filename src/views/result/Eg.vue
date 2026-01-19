<template>
  <el-result icon="primary" title="" sub-title="">
    <template #extra>
      <el-button type="primary" @click="toResult('primary', '标题', '你猜我猜你猜不猜')">默认示例</el-button>
      <el-button type="success" @click="toResult('success', '提交成功', '好家伙终于提交成功了')">成功示例</el-button>
      <el-button type="warning" @click="toResult('warning', '警告', '月入不足3000')">警告示例</el-button>
      <el-button type="danger" @click="toResult('error', '传值失败', '卡里余额不足')">失败示例</el-button>
      <el-button type="info" @click="toResult('info', '提示', '你看到我了')">提示示例</el-button>
    </template>
  </el-result>
</template>
<script setup lang="ts">
import { useRouter } from 'vue-router';
const router = useRouter();
function toResult(stauts: string, title: string, msg: string) {
  console.log(stauts);
  router.push({ name: 'result', query: { type: stauts, title, msg } });
}
</script>
