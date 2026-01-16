import { Get, Post, type AppRequestConfig } from '@/https';

/**
 * 获取合同列表
 */
export function apiGetContractList<U extends AppRequestConfig>(params: Record<string, any> = {}, config: U = {} as U) {
  return Get('/user/getContractList', params, config);
}

/**
 * 新增、编辑合同
 */
export function apiAddContract<U extends AppRequestConfig>(params: Record<string, any> = {}, config: U = {} as U) {
  return Post('/user/addContract', params, config);
}

/**
 * 删除合同
 */
export function apiDeleteContract<U extends AppRequestConfig>(params: Record<string, any> = {}, config: U = {} as U) {
  return Post('/user/deleteContract', params, config);
}

/**
 * 修改合同状态
 */
export function apiUpdateContractStatus<U extends AppRequestConfig>(params: Record<string, any> = {}, config: U = {} as U) {
  return Post('/user/updateContractStatus', params, config);
}

/**
 * 修改合同名称
 */
export function apiUpdateContractName<U extends AppRequestConfig>(params: Record<string, any> = {}, config: U = {} as U) {
  return Post('/user/updateContractName', params, config);
}
