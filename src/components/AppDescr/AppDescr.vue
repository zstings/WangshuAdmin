<template>
  <div class="app-descr" :class="`${center ? 'app-descr-center' : ''} ${showOverflow ? 'app-descr-overflow' : ''}`">
    <slot></slot>
  </div>
</template>
<script setup lang="ts">
// import { provide } from 'vue'
withDefaults(defineProps<{ labelWidth?: string; showOverflow?: boolean; center?: boolean }>(), {
  center: false,
  labelWidth: 'auto',
  showOverflow: false,
});
defineOptions({
  name: 'AppDescr',
});
// provide('props', props)
</script>
<style lang="less">
.app-descr {
  .icon-shuxiebianji {
    font-size: 14px;
    color: #ccc;
    cursor: pointer;
  }
}
.descr-label {
  width: v-bind('labelWidth');
  flex-shrink: 0;
}
.descr-content {
  // width: 100%;
  text-align: left;
  position: relative;
  word-break: break-all;
}
.app-descr-overflow {
  .descr-content {
    display: flex;
    align-items: center;
    flex: 1;
    overflow: hidden;
  }
  .descr-content-content {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
.app-descr-center {
  .descr-item {
    justify-content: center;
  }
  .descr-content {
    flex: initial;
  }
}
</style>
