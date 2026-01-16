<template>
  <div class="descr-item flex">
    <div class="descr-label">{{ label }}<template v-if="label">：</template></div>
    <div class="descr-content" :class="$slots.right ? 'descr-content-right' : ''">
      <span class="descr-content-content"><slot></slot></span>
      <slot name="right"></slot>
    </div>
  </div>
</template>
<script setup lang="ts">
// import { inject, toRefs } from 'vue'
withDefaults(defineProps<{ label?: string }>(), {
  label: '',
});
defineOptions({
  name: 'AppDescrItem',
});
// const { showOverflow } = toRefs(inject<{ labelWidth?: string; showOverflow?: boolean }>('props')!)
</script>
<style></style>
