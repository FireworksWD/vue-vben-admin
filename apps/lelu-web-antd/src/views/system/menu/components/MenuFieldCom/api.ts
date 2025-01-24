import {requestClient} from '#/api/request';
import type {UserPageQuery, AddReq, DelReq, EditReq, InfoReq} from '@fast-crud/fast-crud';
import XEUtils from "xe-utils";
import type {CurrentInfoType} from "#/views/system/columns/types";

export const apiPrefix = '/api/system/column/';

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

export function BatchDelete(obj: any) {
  return requestClient.delete(apiPrefix + 'multiple_delete/', {data: {keys: obj}});
}

/**
 * 获取所有model
 */
export function getModelList() {
  return requestClient.get('/api/system/column/get_models/');
}

/**
 * 自动匹配field
 * @param data
 */
export function automatchColumnsData(data: CurrentInfoType) {
  return requestClient.post('/api/system/column/auto_match_fields/', data);
}
