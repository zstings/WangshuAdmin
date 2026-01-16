import { createRouter, createWebHashHistory } from 'vue-router';
import HomeView from '../views/layout/Index.vue';
// import { apiGetUserInfo } from '@/api';
// import { apiGetUserInfo } from '@/api';

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: '/ipBlack',
      component: HomeView,
      children: [
        {
          path: '/ipBlack',
          name: 'ipBlack',
          component: () => import('../views/ipBlack/Index.vue'),
          meta: { breadcrumb: ['IP黑名单'] },
        },
        {
          path: '/company',
          name: 'company',
          component: () => import('../views/contractSuper/company/Index.vue'),
          meta: { breadcrumb: ['合同管理', '企业列表'] },
        },
        {
          path: '/contract',
          name: 'contract',
          component: () => import('../views/contractSuper/contract/Index.vue'),
          meta: { breadcrumb: ['合同管理', '合同列表'] },
        },
      ],
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/login/Index.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'notFound',
      component: () => import('@/views/notFound/Index.vue'),
    },
  ],
});

// router.beforeEach(async to => {
//   // 登录页不需要处理任何验证
//   if (['login', 'notFound'].includes(to.name as string)) return true;
//   // 没有token的情况下且不在登录页，就跳转到登录页
//   if (!localStorage.getItem('token') && to.name !== 'login') {
//     return { name: 'login', query: { redirect: to.name as string } };
//   }
//   // 如果用户没有创建用户权限，就跳转到404
//   const { commission_mode, top_user_id } = await apiGetUserInfo();
//   // 处理默认路由重定向
//   // if (['home'].includes(to.name as string)) {
//   //   return { name: is_create_agent == 1 ? 'agentManagement' : 'userManagement' };
//   // }
//   // 没有权限导航到404页面
//   if (!(top_user_id == 0 && commission_mode == 2) && to.name === 'commissionSettings') return { name: 'notFound' };
// });

export default router;
