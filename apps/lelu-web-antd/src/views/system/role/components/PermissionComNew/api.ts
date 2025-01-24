import { requestClient } from "#/api/request";
import XEUtils from "xe-utils";
/**
 * 获取角色的授权列表
 * @param query
 */
export function getRolePermission(query:object) {
  return requestClient.get('/api/system/role_menu_button_permission/get_role_permission/',{
    params:query
  })
}

/***
 * 设置角色的权限
 * @param roleId
 * @param data
 */
export function setRolePremission(roleId:any,data:object) {
  return requestClient.put(`/api/system/role_menu_button_permission/${roleId}/set_role_premission/`,data)
}

export function getDataPermissionRange(query:object) {
  return requestClient.get('/api/system/role_menu_button_permission/data_scope/',{
    params:query
  })
}

export function getDataPermissionRangeAll() {
  return requestClient.get('/api/system/role_menu_button_permission/data_scope/',)
}
export function getDataPermissionDept(query:object) {
  return requestClient.get('/api/system/role_menu_button_permission/role_to_dept_all/',{
    params:query
  })
}

export function getDataPermissionMenu() {
  return requestClient.get('/api/system/role_menu_button_permission/get_role_permissions/')
}

/**
 * 设置按钮的数据范围
 */
export function setBtnDatarange(roleId:number,data:object) {
  return requestClient.put(`/api/system/role_menu_button_permission/${roleId}/set_btn_datarange/`,data)
}

