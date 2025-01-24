import {requestClient} from '#/api/request';
import type {PageQuery, AddReq, DelReq, EditReq, InfoReq} from '@fast-crud/fast-crud';

export const apiPrefix = '/api/system/menu_button/';

export function GetList(query: PageQuery) {
  return requestClient.get(apiPrefix, {
    params: query,
  });
}

export function GetObj(id: InfoReq) {
  return requestClient.get(apiPrefix + id,);
}

export function AddObj(obj: AddReq) {
  return requestClient.post(apiPrefix, obj);
}

export function UpdateObj(obj: any) {
  return requestClient.put(apiPrefix + obj.id + '/', obj);
}

export function DelObj(id: DelReq) {
  return requestClient.delete(apiPrefix + id + '/', {
    data: {id},
  });
}

export function BatchAdd(obj: AddReq) {
  return requestClient.post(apiPrefix + 'batch_create/', obj);
}

export function BatchDelete(obj: any) {
  return requestClient.delete(apiPrefix + 'multiple_delete/', {data: {keys: obj}});
}
