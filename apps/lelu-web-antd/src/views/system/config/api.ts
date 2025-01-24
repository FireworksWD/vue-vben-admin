/**
 * @author: Ethan
 * @contact: email:
 * @Created on: 2025/1/17 11:00
 * @Remark:
 **/
import {requestClient} from '#/api/request';
import type {UserPageQuery, AddReq, DelReq, EditReq, InfoReq} from '@fast-crud/fast-crud';

export const apiPrefix = '/api/system/system_config/';

export function GetList(query: UserPageQuery) {
  return requestClient.get(apiPrefix, {
    params: query,
  });
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

/*
获取所有的model及字段信息
 */
export function GetAssociationTable() {
  return requestClient.get(apiPrefix + 'get_association_table/');
}

export function saveContent(data: any) {
  return requestClient.put(apiPrefix + 'save_content/', data);
}
