import {requestClient} from '#/api/request';
import type { PageQuery } from './types'

export function getRoleList(query: PageQuery) {
  return requestClient.get('/api/system/role/',{
    params: query,
  });
}

export function getMenuList(query: PageQuery) {
  return requestClient.get('/api/system/menu/',{
    params: {is_catalog:0,...query},
  });
}

export function getModelList() {
  return requestClient.get('/api/system/column/get_models/');
}
