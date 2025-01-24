<template>
	<fs-page class="columns">
		<a-row class="columns-el-row" :gutter="10">
			<a-col :span="6">
				<div class="columns-box columns-left">
					<ItemCom :title="$t('system.N00411')" type="role" showPagination @fetchData="fetchRoleData" @itemClick="handleClick" />
				</div>
			</a-col>
<!--      <el-col :span="4">-->
<!--        <div class="columns-box columns-left">-->
<!--          <ItemCom :title="$t('system.N00406')" type="menu" showPagination @fetchData="fetchMenuData" @itemClick="handleClick" />-->
<!--        </div>-->
<!--      </el-col>-->
			<a-col :span="8">
				<div class="columns-box columns-center">
					<ItemCom :title="$t('system.N00314')" type="model" label="showText" value="key" @fetchData="fetchModelData" @itemClick="handleClick" />
				</div>
			</a-col>
			<a-col :span="10">
				<div class="columns-box columns-right">
					<ColumnsTableCom ref="columnsTableRef" :currentInfo="currentInfo" />
				</div>
			</a-col>
		</a-row>
	</fs-page>
</template>

<script lang="ts" setup>
import {$t} from '#/locales'
import { ref, reactive, defineAsyncComponent } from 'vue';
import { getRoleList, getModelList,getMenuList } from './api';
import type { PageQuery, CurrentInfoType, ModelItemType } from './types';

const ItemCom = defineAsyncComponent(() => import('./components/ItemCom/index.vue'));
const ColumnsTableCom = defineAsyncComponent(() => import('./components/ColumnsTableCom/index.vue'));

const columnsTableRef = ref<InstanceType<typeof ColumnsTableCom> | null>(null);
let currentInfo = reactive<CurrentInfoType>({
	role: '',
	model: '',
	app: '',
  menu:''
});

/**
 * 获取角色
 * @param query
 * @param callback
 */
const fetchRoleData = async (query: PageQuery, callback: Function) => {
	const res = await getRoleList(query);
	callback(res);
};

/**
 * 获取菜单
 * @param query
 * @param callback
 */
const fetchMenuData= async (query: PageQuery, callback: Function) => {
  const res = await getMenuList(query);
  callback(res);
};
//@ts-ignore
const fetchModelData = async (query: PageQuery, callback: Function) => {
	const res = await getModelList();
	res.data.forEach((item: ModelItemType) => {
		item.showText = `${item.app}-${item.title}(${item.key})`;
	});
	callback(res);
};

const fetchTableData = () => {
	if (currentInfo.role && currentInfo.model && currentInfo.app) {
		columnsTableRef.value?.fetchData(currentInfo);
		return;
	}
};

const handleClick = (type: string, record: any) => {
	if (type === 'role') {
		currentInfo.role = record.id;
	}

  if(type === 'menu'){
    currentInfo.menu = record.id;
  }

	if (type === 'model') {
		currentInfo.model = record.key;
		currentInfo.app = record.app;
	}
	fetchTableData();
};
</script>

<style lang="scss" scoped>
.columns {
	.columns-el-row {
		height: 100%;
		overflow: hidden;

		.el-col {
			height: 100%;
			padding: 10px 0;
			box-sizing: border-box;
		}
	}
	.columns-box {
		height: 100%;
		padding: 10px;
		background-color: #fff;
		box-sizing: border-box;
	}
	.columns-left {
		border-radius: 0 8px 8px 0;
	}
	.columns-center {
		border-radius: 8px;
	}
	.columns-right {
		position: relative;
		border-radius: 8px 0 0 8px;
	}
}
</style>
