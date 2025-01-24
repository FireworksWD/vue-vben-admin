import { requestClient } from '#/api/request';
import type { PageQuery, AddReq, EditReq } from '@fast-crud/fast-crud';
export function GetUserInfo(query: PageQuery) {
	return requestClient.get('/api/system/user/user_info/',{
		params: query,
	});
}

/**
 * 更新用户信息
 * @param data
 */
export function updateUserInfo(data: AddReq) {
	return requestClient.put('/api/system/user/update_user_info/', data);
}

/**
 * 获取自己接收的消息
 * @param query
 * @returns {*}
 * @constructor
 */
export function GetSelfReceive(query: PageQuery) {
	return requestClient.get('/api/system/message_center/get_self_receive/',{
		params: query,
	});
}

/***
 * 修改密码
 * @param data
 */
export function UpdatePassword(data: EditReq) {
	return requestClient.put('/api/system/user/change_password/',data);
}

/***
 * 上传头像
 * @param data
 */
export function uploadAvatar(data: AddReq) {
  return requestClient.post('api/system/file/', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}
