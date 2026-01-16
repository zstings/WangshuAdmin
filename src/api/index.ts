import { Post, Get, type AppRequestConfig } from '@/https';
const cache: Record<string, any> = {};
/**
 * 登录
 */
export function apiLogin<U extends AppRequestConfig>(data: Record<string, any> = {}, config: U = {} as U) {
  return Post<U, { token: string }>('/user/login', data, config);
}
/**
 * 退出登录
 */
export function apiLogout<U extends AppRequestConfig>(data: Record<string, any> = {}, config: U = {} as U) {
  return Post('/user/logout', data, config);
}
/**
 * 获取用户信息
 */
export function apiGetUserInfo<U extends AppRequestConfig>(params: Record<string, any> = {}, config: U = {} as U) {
  const token = localStorage.getItem('token') || Date.now().toString();
  cache[token] = cache[token] || {};
  cache[token].getInfo = cache[token].getInfo || Get('/user/getInfo', params, config);
  return cache[token].getInfo as Promise<UserInfo>;
}
/**
 * 获取ip黑名单
 */
export function apiGetIpBlackList<U extends AppRequestConfig>(params: Record<string, any> = {}, config: U = {} as U) {
  return Get('/user/getIpBlackList', params, config);
}
/**
 * 新增ip黑名单
 */
export function apiAddIpBlack<U extends AppRequestConfig>(data: Record<string, any> = {}, config: U = {} as U) {
  return Post('/user/addIpBlack', data, config);
}
/**
 * 删除ip黑名单
 */
export function apiDeleteIpBlack<U extends AppRequestConfig>(id: string, config: U = {} as U) {
  return Post('/user/deleteIpBlack', { id }, config);
}
