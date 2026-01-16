import { createApp } from 'vue';

import App from './App.vue';
import router from './router';

import './assets/main.less';
import './assets/tailwind.css';

import httpRequest from './mocks/swhandlers';

const app = createApp(App);

app.use(router);

httpRequest.init('www.wangshuadmin.com').then(() => {
  app.mount('#app');
});

// 使 v-tablesl 在所有组件中都可用
app.directive('tablesl', {
  updated(_, binding, vnode) {
    // console.log(el, binding.instance, vnode, prevVnode)
    if (JSON.stringify(binding.oldValue) != JSON.stringify(binding.value)) {
      (vnode as any).ctx.setupState.setScrollTop(0);
    }
  },
});
