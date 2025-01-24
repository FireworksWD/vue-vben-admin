import {requestClient} from '#/api/request';
import type {CurrentInfoType, AddColumnsDataType} from '../../types'

export function getColumnsData(query: any) {
  return requestClient.get('/api/system/column/', {
    params: query,
  });
}

export function automatchColumnsData(data: any) {
  return requestClient.post('/api/system/column/auto_match_fields/', data);
}

export function addColumnsData(data: AddColumnsDataType) {
  return requestClient.post('/api/system/column/', data);
}

export function deleteColumnsData(id: number) {
  return requestClient.delete(`/api/system/column/${id}/`);
}

export function updateColumnsData(data: AddColumnsDataType) {
  return requestClient.put(`/api/system/column/${data.id}/`, data);
}
