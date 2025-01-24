import {requestClient} from '#/api/request';
import type {UserPageQuery, AddReq, DelReq, EditReq, InfoReq} from '@fast-crud/fast-crud';

export const apiPrefix = '/api/system/login_log/';

export function GetList(query: UserPageQuery) {
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

export function GetPermission() {
  return requestClient.get(apiPrefix + 'field_permission/',);
}
