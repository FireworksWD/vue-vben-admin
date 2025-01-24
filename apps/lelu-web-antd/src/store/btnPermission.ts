import {defineStore} from 'pinia';
import {requestClient} from '#/api/request';
import {useAccessStore} from '@vben/stores';

export const BtnPermissionStore = defineStore('BtnPermission', {
  actions: {
    async getBtnPermissionStore() {
      const ret = await requestClient.get('/api/system/menu_button/menu_button_all_permission/',)
      //按钮权限融合到vb框架
      useAccessStore().setAccessCodes(ret.data);
      this.data = ret.data
    },
  },
  state: (): any => ({
    data: []
  })
});
