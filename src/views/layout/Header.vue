<template>
  <header class="layout-header flex items-center justify-between">
    <div class="flex items-center">
      <div class="logos flex items-center">
        <div class="logos-img"><img src="/logo.svg" alt="" /></div>
        <span class="logos-txt">WangshuAdmin</span>
      </div>
      <slot></slot>
    </div>
    <div class="header-navs flex items-center">
      <el-dropdown trigger="hover" @visible-change="visibleChange">
        <div class="head-box flex items-center" :class="{ active: oReactive.active }">
          <img :src="userinfo.avatar || 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'" class="pic" />
          <p class="name">{{ userinfo.username }}</p>
          <i class="icon"></i>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="exitLogin">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </header>
</template>

<script setup lang="ts">
import { apiLogout, apiGetUserInfo } from '@/api';
import { reactive } from 'vue';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';
const router: any = useRouter();
const userinfo: any = reactive({});

apiGetUserInfo().then(res => {
  Object.assign(userinfo, res);
});

async function exitLogin() {
  await apiLogout();
  ElMessage.warning('退出成功');
  router.push({ name: 'login', query: { from_uid: userinfo.from_uid || undefined } });
}
const oReactive: any = reactive({
  active: false,
});
function visibleChange(bool: any) {
  oReactive.active = bool;
}
</script>

<style lang="less" scoped>
.layout-header {
  background: #fff;
  height: 60px;
  padding: 0 20px;
  border-bottom: 1px solid #f3f6f9;
  .layout-header-tab {
    margin-left: 36px;
  }
  .logos {
    &-img {
      width: 30px;
      overflow: hidden;
      border-radius: 10px;
      margin-right: 10px;
    }
    .logos-txt {
      font-weight: 600;
      font-size: 20px;
    }
  }
  .head-box {
    // padding-right: 25px;
    outline: unset !important;
    border-radius: 4px;
    // padding-left: 6px;
    margin-left: 10px;
    padding: 4px 25px 4px 6px;
    .pic {
      display: block;
      width: 31px;
      height: 31px;
      background: transparent;
      border-radius: 50%;
      border: 1px solid #eeeef4;
    }
    .name {
      margin-left: 10px;
      min-width: 14px;
    }
    .icon {
      position: absolute;
      width: 0;
      height: 0;
      right: 5px;
      border-color: #999 transparent transparent;
      border-style: solid;
      border-width: 7px 6px 0;
      transition: transform 0.3s;
      border-radius: 30% 30% 50% 30%;
    }
    &:hover,
    &.active {
      background-color: #f2f2f2;
    }
    &:hover .icon,
    &.active .icon {
      transform: rotate(180deg);
    }
  }
}
</style>
