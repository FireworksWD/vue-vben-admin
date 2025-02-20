import { defineStore } from 'pinia';
import type { RoleMenuFieldType, RoleMenuFieldHeaderType } from '../types';
import { $t } from "@vben/locales";
/**
 * 权限配置：角色-菜单-列字段
 */

export const RoleMenuFieldStores = defineStore('RoleMenuFieldStores', {
	state: (): RoleMenuFieldType[] => [],
	actions: {
		/** 重置 */
		setState(data: RoleMenuFieldType[]) {
			this.$state = data;
			this.$state.length = data.length;
		},
	},
});

export const RoleMenuFieldHeaderStores = defineStore('RoleMenuFieldHeaderStores', {
	state: (): RoleMenuFieldHeaderType[] => [
		{ value: 'is_create', label: $t('system.N00259'), disabled: 'disabled_create', checked: false },
		{ value: 'is_update', label: $t('system.N00396'), disabled: 'disabled_update', checked: false },
		{ value: 'is_query', label: $t('system.N00072'), disabled: 'disabled_query', checked: false },
	],
});
