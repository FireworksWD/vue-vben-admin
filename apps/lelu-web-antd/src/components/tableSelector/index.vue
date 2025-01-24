<script setup lang="ts">
import {$t} from '#/locales'
import {defineProps, ref, watch} from 'vue'
import type {VxeGridListeners, VxeGridProps} from '#/adapter/vxe-table';
import {useVbenVxeGrid} from '#/adapter/vxe-table';
import {Page} from '@vben/common-ui';
import type {rowAreaType} from './types';
import * as api from '#/views/system/areas/api';
import {requestClient} from '#/api/request'

//表格数据
const selectedValue = ref()
const areaData = ref<rowAreaType[]>([]);
const props = defineProps({
  modelValue: {},
  displayLabel: {},
  tableConfig: {
    url: null,
    label: null,
    value: null,
    columns: [],
    data: [],
    load: () => {
    },
    isMultiple: false,
    isTree: false,
    lazy: true,
  }
} as any)
const emit = defineEmits(['update:modelValue']);
// 监听displayLabel的变化，更新数据
watch(
  () => {
    return props.displayLabel;
  },
  (value: any) => {
    const {tableConfig} = props;
    selectedValue.value = value
      ? value.map((item: any) => {
        return item[tableConfig.label];
      })
      : null;
  },
  {immediate: true}
);
/**
 * 点击事件
 */
const gridEvents: VxeGridListeners<rowAreaType> = {
  cellClick({row}) {
    selectedValue.value = row.name;
    emit('update:modelValue', row.code);
  },
}
/**
 * 配置
 */
const gridOptions: VxeGridProps<rowAreaType> = {
  border: true,
  // stripe: true,
  rowConfig: {
    isHover: true
  },
  columns: [
    {type: 'seq', width: 70},
    {field: 'name', minWidth: 100, title: $t('system.N00096'), treeNode: true},
    {field: 'code', title: $t('system.N00117')},
  ],
  data: areaData.value,
  pagerConfig: {
    total: 0,
    currentPage: 1,
    pageSize: 10
  },
  proxyConfig: {
    ajax: {
      query: async ({page}) => {
        return await getAreaDataPage({
          page: page.currentPage,
          limit: page.pageSize,
        });
      },
    },
  },
  keepSource: true,
  treeConfig: {
    parentField: 'pcode',
    rowField: 'id',
    transform: true,
    lazy: true,
    hasChild: 'hasChild',
    loadMethod: async ({row}) => {
      const resp = await requestClient.get(props.tableConfig.url, {params: {'pcode': row.code}});
      return resp.data
    }
  },
}
const [Grid, gridApi] = useVbenVxeGrid({gridOptions, gridEvents});
const getAreaDataPage = async (query: any = {}) => {
  return new Promise<{ items: any; total: number }>(async (resolve) => {
    const resp = await requestClient.get(props.tableConfig.url, {params: query});
    resolve({
      total: resp.total,
      items: resp.data,
    });
  });
}
/**
 * 加载表格数据
 * @param query
 */
const getAreaData = async (query: any = {}) => {
  const resp = await api.GetList(query)
  areaData.value = resp.data
  await gridApi?.grid?.reloadData(areaData.value); // 刷新表格数据
}
const visibleChange = async (bool: any) => {
  if (bool) {
    await getAreaData()
  }
};
</script>

<template>
  <Page style="margin-top: -14px;margin-left: -15px">
    <a-select
      style="width: 100%;"
      @dropdownVisibleChange="visibleChange"
      v-model:value="selectedValue"
      :placeholder="$t('system.N00488')"
      :dropdownMatchSelectWidth="false"
    >
      <template #notFoundContent>
        <Grid style="height: 350px; overflow: auto;width: auto"/>
      </template>
    </a-select>
  </Page>
</template>

<style scoped lang="scss">
:deep().ant-select-dropdown {
  margin-left: -50px;
}
</style>
