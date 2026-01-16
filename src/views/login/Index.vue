<template>
  <section class="fixed top-1/2 left-1/2 h-fit w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-8">
    <h1 class="h1 mb-10 w-full text-left text-2xl font-medium">登录</h1>
    <el-form :model="form" label-width="auto" class="w-full" size="large">
      <el-form-item label="">
        <el-input v-model="form.username" clearable :prefix-icon="User" placeholder="请输入账号" />
      </el-form-item>
      <el-form-item label="">
        <el-input v-model="form.password" clearable show-password :prefix-icon="Lock" type="password" placeholder="请输入密码" @keyup.enter="onSubmit" />
      </el-form-item>
      <el-form-item label="">
        <el-checkbox v-model="rememberPassword" name="type" @change="onRememberPasswordChange"> 记住密码 </el-checkbox>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" class="w-full" @click="onSubmit">登录</el-button>
      </el-form-item>
    </el-form>
  </section>
  <div class="logo-bg fixed top-0 left-0 h-full w-full"></div>
  <div class="fixed top-[2vh] left-[1vw] flex items-center">
    <div class="w-[30px]"><img src="/logo.svg" alt="" /></div>
    <span class="ml-2">WangshuAdmin</span>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { Lock, User } from '@element-plus/icons-vue';
import { apiLogin } from '@/api';
import { useRouter } from 'vue-router';

localStorage.removeItem('token');
const rememberPassword = ref(true);
const router = useRouter();

const form = ref({
  username: '',
  password: '',
});

if (rememberPassword.value && localStorage.getItem('loginInfo')) {
  const loginInfo = JSON.parse(localStorage.getItem('loginInfo') || '{}');
  Object.assign(form.value, loginInfo);
}

if (import.meta.env.MODE == 'development') {
  form.value.username = 'admin';
  form.value.password = 'admin';
}

const onSubmit = async () => {
  if (!form.value.username) {
    ElMessage.error('请输入账号');
    return;
  }
  if (!form.value.password) {
    ElMessage.error('请输入密码');
    return;
  }
  if (rememberPassword.value) {
    localStorage.setItem('loginInfo', JSON.stringify(form.value));
  }
  apiLogin(form.value).then(res => {
    localStorage.setItem('token', res.token);
    router.push({ name: (router.currentRoute.value.query.redirect as string) || 'home' });
  });
};

const onRememberPasswordChange = () => {
  if (!rememberPassword.value) {
    localStorage.removeItem('loginInfo');
  }
};
</script>
<style scoped>
section {
  background: var(--el-bg-color-overlay);
  box-shadow: var(--el-box-shadow-light);
  border: 1px solid var(--el-border-color-light);
}
.logo-bg {
  background-image: url('@/assets/login-bg.svg');
  background-repeat: no-repeat, no-repeat;
  background-position:
    center center,
    center center;
  background-size: cover, cover;
  z-index: -1;
}
</style>
