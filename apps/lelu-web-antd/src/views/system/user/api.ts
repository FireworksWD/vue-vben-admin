import {requestClient, downloadFile} from '#/api/request';
import type {PageQuery, AddReq, DelReq, EditReq, InfoReq} from '@fast-crud/fast-crud';

export const apiPrefix = '/api/system/user/';

export function GetDept(query: PageQuery) {
  return requestClient.get("/api/system/dept/", {
    params: query,
  });
}

export function GetList(query: PageQuery) {
  return requestClient.get(apiPrefix, {
    params: query,
  });
}

export function GetObj(id: InfoReq) {
  return requestClient.get(apiPrefix + id);
}

export function AddObj(obj: AddReq) {
  return requestClient.post(apiPrefix, obj);
}

export function UpdateObj(obj: EditReq) {
  return requestClient.put(apiPrefix + obj.id + '/', obj);
}

export function DelObj(id: DelReq) {
  return requestClient.delete(apiPrefix + id + '/', {
    data: {id},
  });
}

export function exportData(params: any) {
  return downloadFile(apiPrefix + 'export_data/',{
    params: params,
    method: 'get',
  })
}


export function resetToDefaultPassword(id: any) {
  return requestClient.put(apiPrefix + id + '/reset_to_default_password/',)
}

/**
 * 批量删除
 */
export function BatchDelete(obj: any) {
  return requestClient.delete(apiPrefix + 'multiple_delete/', {data: {keys: obj}});
}
