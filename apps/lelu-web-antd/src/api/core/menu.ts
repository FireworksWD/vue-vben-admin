import type {RouteRecordStringComponent} from '@vben/types';

import {requestClient} from '#/api/request';

/**
 * 获取用户所有菜单
 */
export async function getAllMenusApi() {
  const res = await requestClient.get<any>(
    '/api/system/menu/web_router/',
  );
  return res?.data;
}
