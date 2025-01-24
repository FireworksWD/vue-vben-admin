/**
 * @author: Ethan
 * @contact: email:
 * @Created on: 2024/12/7 15:57
 * @Remark:
 **/
import {downloadFile, requestClient} from '#/api/request';
import type {UserPageQuery, AddReq, DelReq, EditReq} from '@fast-crud/fast-crud';

export const apiPrefix = '/api/system/file/';

/**
 * 列表数据,排除图片类型
 * @param query
 * @constructor
 */
export function GetList(query: UserPageQuery) {
    return requestClient.get(apiPrefix, {
        params: {...query,mime_type:'application/vnd'},
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
 * 批量下载
 * @param objs
 * @constructor
 */
export function BatchDownload(objs: any) {
    return downloadFile(apiPrefix + 'multiple_download/', {
        method: 'POST',
        data: {keys: objs}
    })
}

/**
 * 导入文件
 * @param id
 * @constructor
 */
export function ImportFile (id:any) {
  return requestClient.post(apiPrefix + id + '/import/')
}
