import {requestClient} from '#/api/request';
import type {UserPageQuery, AddReq, EditReq, InfoReq, PageQuery} from '@fast-crud/fast-crud';

export const apiPrefix = '/api/system/dept/';

export function GetList(query: UserPageQuery) {
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

export function UpdateObj(obj: EditReq) {
  return requestClient.put(apiPrefix + obj.id + '/', obj);
}

export function DelObj(id: string) {
  return requestClient.delete(apiPrefix + id + '/',);
}

export function lazyLoadDept(query: UserPageQuery) {
  return requestClient.get(apiPrefix, {
    params: query,
  });
}

/**
 * 上下移动
 */
export function deptMoveUp(obj: AddReq) {
  return requestClient.post(apiPrefix + 'move_up/', obj);
}

export function deptMoveDown(obj: AddReq) {
  return requestClient.post(apiPrefix + 'move_down/', obj);
}

/**
 * 用户相关接口
 */
export function getDeptUserList(query: PageQuery) {
  return requestClient.get("/api/system/user/", {
    params: query,
  });
}

/**
 * 获取所有部门列表
 */
export function getAllDeptList() {
  return requestClient.get("/api/system/dept/all_dept/");
}
