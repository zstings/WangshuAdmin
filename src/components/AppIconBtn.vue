<template>
  <!-- <el-tooltip class="box-item" :effect="effect" :content="tip" placement="top">
    <el-icon color="var(--el-color-primary)" class="jf" @click="emit('click')">
      <component :is="icon" />
    </el-icon>
  </el-tooltip> -->
  <el-tooltip :effect="effect" :content="tip" placement="top">
    <el-link :underline="false" type="primary" class="ml-2">
      <el-icon :size="size" @click="emit('click')"><component :is="icon" /> </el-icon>
    </el-link>
  </el-tooltip>
</template>
<script setup lang="ts">
import type { Component } from 'vue';
withDefaults(
  defineProps<{
    icon: Component;
    tip: string;
    size?: string;
    effect?: string;
  }>(),
  {
    size: 'inherit',
    effect: 'dark',
  },
);
const emit = defineEmits<{
  (e: 'click'): void;
}>();
</script>
