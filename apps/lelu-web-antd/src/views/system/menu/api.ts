import {requestClient} from '#/api/request';
import type {UserPageQuery, AddReq, EditReq, InfoReq} from '@fast-crud/fast-crud';

export const apiPrefix = '/api/system/menu/';

export function GetList(query: UserPageQuery) {
  return requestClient.get(apiPrefix, {
    params: query,
  });
}

export function GetObj(id: InfoReq) {
  return requestClient.get(apiPrefix + id + '/');
}

export function AddObj(obj: AddReq) {
  return requestClient.post(apiPrefix, obj);
}

export function UpdateObj(obj: EditReq) {
  return requestClient.put(apiPrefix + obj.id + '/', obj);
}

export function DelObj(id: string | number) {
  return requestClient.delete(apiPrefix + id + '/');
}

export function GetAllMenu(query: UserPageQuery) {
  return requestClient.get(apiPrefix + 'get_all_menu/', {
    params: query,
  });
}

export function lazyLoadMenu(query: UserPageQuery) {
  return requestClient.get(apiPrefix, {
    params: query,
  });
}

export function dragMenu(obj: AddReq) {
  return requestClient.post(apiPrefix + 'drag_menu/', obj);
}

export function menuMoveUp(obj: AddReq) {
  return requestClient.post(apiPrefix + 'move_up/', obj);
}

export function menuMoveDown(obj: AddReq) {
  return requestClient.post(apiPrefix + 'move_down/', obj);
}
