import { defineStore } from 'pinia';
import type { ConfigStates } from './interface';
import { requestClient } from '#/api/request';
export const urlPrefix = '/api/init/settings/';

/**
 * 系统配置数据
 * @methods getSystemConfig 获取系统配置数据
 */
export const SystemConfigStore = defineStore('SystemConfig', {
	state: (): ConfigStates => ({
		systemConfig: {},
	}),
	actions: {
		async getSystemConfigs() {
      requestClient.get(urlPrefix).then((ret: { data: [] }) => {
				// 转换数据格式并保存到pinia
				this.systemConfig = JSON.parse(JSON.stringify(ret.data));
			});
		},
	}
});
