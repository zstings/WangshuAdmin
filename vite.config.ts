import { fileURLToPath, URL } from 'node:url';

import { defineConfig, normalizePath, PluginOption } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import vue from '@vitejs/plugin-vue';
import VueJsx from '@vitejs/plugin-vue-jsx';
import { globSync } from 'node:fs';

import { mockswPlugin } from 'mocksw/vite';

const epStyles = globSync('element-plus/es/components/*/style/css.mjs', {
  cwd: fileURLToPath(new URL('./node_modules', import.meta.url)),
}).map(file => normalizePath(file.replace('.mjs', '')));

// https://vite.dev/config/
export default defineConfig({
  // 预加载vue、vue-router、element-plus的css 用于开发环境下按需加载的页面载入速度。
  optimizeDeps: {
    include: ['vue', 'vue-router', ...epStyles],
  },
  plugins: [
    vue(),
    VueJsx(),
    tailwindcss(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
      dirs: ['src/components'],
    }),
    elementuiColorReplace('#155dff'),
    mockswPlugin(),
  ],
  // server: {
  //   host: '0.0.0.0',
  //   proxy: {
  //     '/api': {
  //       target: 'http://172.16.78.80:9501',
  //       changeOrigin: true,
  //       rewrite: path => path.replace(/^\/api/, ''),
  //     },
  //   },
  // },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  base: './',
});

function elementuiColorReplace(base: string = '#409eff'): PluginOption {
  return {
    name: '',
    enforce: 'pre',
    transform: (code, id) => {
      if (id.includes('node_modules/element-plus/theme-chalk/base.css') && code.includes('--el-color-primary')) {
        code = code.replace('--el-color-primary-rgb:64,158,255;', `--el-color-primary-rgb:${hexToRgb(base, 2)};`);
        code = code.replace('--el-color-primary:#409eff;', `--el-color-primary:${base};`);
        code = code.replace('--el-color-primary-light-3:rgb(121,187,255);', `--el-color-primary-light-3:${hexToRgb(mix(base, '#ffffff', 30))};`);
        code = code.replace('--el-color-primary-light-5:rgb(160,207,255);', `--el-color-primary-light-5:${hexToRgb(mix(base, '#ffffff', 50))};`);
        code = code.replace('--el-color-primary-light-7:rgb(198,226,255);', `--el-color-primary-light-7:${hexToRgb(mix(base, '#ffffff', 70))};`);
        code = code.replace('--el-color-primary-light-8:rgb(217,236,255);', `--el-color-primary-light-8:${hexToRgb(mix(base, '#ffffff', 80))};`);
        code = code.replace('--el-color-primary-light-9:rgb(236,245,255);', `--el-color-primary-light-9:${hexToRgb(mix(base, '#ffffff', 90))};`);
        // console.log(code);
        function mix(color1: string, color2: string, weight: number) {
          const w = weight / 100;
          const c1 = parseInt(color1.slice(1), 16);
          const c2 = parseInt(color2.slice(1), 16);
          const r = Math.round(((c2 >> 16) - (c1 >> 16)) * w + (c1 >> 16));
          const g = Math.round((((c2 >> 8) & 0xff) - ((c1 >> 8) & 0xff)) * w + ((c1 >> 8) & 0xff));
          const b = Math.round(((c2 & 0xff) - (c1 & 0xff)) * w + (c1 & 0xff));
          return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
        }
        function hexToRgb(hex: string, type = 1) {
          // 去掉开头的 #
          hex = hex.replace(/^#/, '');
          // 支持 #rgb 写法
          if (hex.length === 3) {
            hex = hex
              .split('')
              .map((x: any) => x + x)
              .join('');
          }
          // 解析为整数
          const num = parseInt(hex, 16);
          const r = (num >> 16) & 255;
          const g = (num >> 8) & 255;
          const b = num & 255;
          return type == 1 ? `rgb(${r}, ${g}, ${b})` : `${r}, ${g}, ${b}`;
        }
        return code;
      }
    },
  };
}
