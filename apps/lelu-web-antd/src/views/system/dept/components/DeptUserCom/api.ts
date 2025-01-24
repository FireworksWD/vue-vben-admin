import { requestClient, downloadFile } from '#/api/request';
import type { PageQuery, AddReq, DelReq, EditReq, InfoReq } from '@fast-crud/fast-crud';

type GetListType = PageQuery & { show_all: string };

export const apiPrefix = '/api/system/user/';

export function GetDept(query: PageQuery) {
	return requestClient.get('/api/system/dept/dept_lazy_tree/',{
		params: query,
	});
}

export function GetList(query: GetListType) {
	return requestClient.get(apiPrefix,{
		params: query,
	});
}
export function GetObj(id: InfoReq) {
	return requestClient.get(apiPrefix + id);
}

export function AddObj(obj: AddReq) {
	return requestClient.post(apiPrefix,obj);
}

export function UpdateObj(obj: EditReq) {
	return requestClient.put(apiPrefix + obj.id + '/', obj);
}

export function DelObj(id: DelReq) {
	return requestClient.delete(apiPrefix + id + '/',{
		data: { id },
	});
}

export function exportData(params: any) {
	return downloadFile(apiPrefix + 'export_data/',{
		params: params,
		method: 'get',
	});
}

export function getDeptInfoById(id: string, type: string) {
	return requestClient.get(`/api/system/dept/dept_info/?dept_id=${id}&show_all=${type}`);
}

export function resetPwd(id: number, data: { [key: string]: string }) {
	return requestClient.put(`/api/system/user/${id}/reset_password/`, data);
}
