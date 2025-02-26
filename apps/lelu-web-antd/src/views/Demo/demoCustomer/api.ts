/**
 * @author: Ethan
 * @contact: email:
 * @Created on: 2024/12/7 14:07
 * @Remark:
 **/
import {requestClient} from '#/api/request';
import type {UserPageQuery, AddReq, DelReq, EditReq, InfoReq} from '@fast-crud/fast-crud';

export const apiPrefix = '/api/demo/customer/';

/**
 * 获取列表
 * @param query
 * @constructor
 */
export function GetList(query: UserPageQuery) {
  return requestClient.get(apiPrefix, {
    params: query,
  });
}

/**
 * 新增
 * @param obj
 * @constructor
 */
export function AddObj(obj: AddReq) {
  return requestClient.post(apiPrefix, obj);
}

/**
 * 更新
 * @param obj
 * @constructor
 */
export function UpdateObj(obj: EditReq) {
  return requestClient.put(apiPrefix + obj.id + '/', obj);
}

/**
 * 删除
 * @param id
 * @constructor
 */
export function DelObj(id: DelReq) {
  return requestClient.delete(apiPrefix + id + '/', {
    data: {id},
  });
}

/**
 * 批量删除
 * @param obj
 * @constructor
 */
export function BatchDelete(obj: any) {
  return requestClient.delete(apiPrefix + 'multiple_delete/', {data: {keys: obj}});
}
/**
 * 获取列权限
 * @constructor
 */
export function GetPermission() {
  return requestClient.get(apiPrefix + 'field_permission/');
}
