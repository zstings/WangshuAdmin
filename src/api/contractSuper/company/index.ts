import { Get, Post, type AppRequestConfig } from '@/https';

/**
 * 获取企业列表
 */
export function apiGetCompanyList<U extends AppRequestConfig>(params: Record<string, any> = {}, config: U = {} as U) {
  return Get('/user/getCompanyList', params, config);
}
/**
 * 新增企业
 */
export function apiAddCompany<U extends AppRequestConfig>(data: Record<string, any> = {}, config: U = {} as U) {
  return Post('/user/addCompany', data, config);
}
/**
 * 删除企业
 */
export function apiDeleteCompany<U extends AppRequestConfig>(id: string, config: U = {} as U) {
  return Post('/user/deleteCompany', { id }, config);
}
/**
 * 修改企业名称
 */
export function apiUpdateCompanyName<U extends AppRequestConfig>(data: Record<string, any> = {}, config: U = {} as U) {
  return Post('/user/updateCompanyName', data, config);
}
