<script setup lang="ts">
import {$t} from '#/locales'
import {defineProps, ref, watch} from 'vue'
import type {VxeGridListeners, VxeGridProps} from '#/adapter/vxe-table';
import {useVbenVxeGrid} from '#/adapter/vxe-table';
import {Page} from '@vben/common-ui';
import type {rowAreaType} from './types';
import * as api from '#/views/system/areas/api';
import {Button} from 'ant-design-vue'

//表格数据
const selectedValue = ref()
const areaData = ref<rowAreaType[]>([]);
const props = defineProps({
  modelValue: {},
  displayLabel: {},
} as any)
const emit = defineEmits(['update:modelValue']);
// 监听displayLabel的变化，更新数据
watch(
  () => {
    return props.displayLabel;
  },
  (value:any) => {
    const { tableConfig } = props;
    selectedValue.value = value
      ? value.map((item: any) => {
        return item[tableConfig.label];
      })
      : null;
  },
  { immediate: true }
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
  stripe: true,
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
    enabled: false,
  },
  keepSource: true,
  treeConfig: {
    parentField: 'pcode',
    rowField: 'id',
    transform: true,
    lazy: true,
    hasChild: 'hasChild',
    loadMethod: async ({row}) => {
      const resp = await api.GetList({'pcode': row.code});
      return resp.data
    }
  },
}
const [Grid, gridApi] = useVbenVxeGrid({gridOptions, gridEvents});
const expandAll = () => {
  gridApi.grid?.setAllTreeExpand(true);
};
const collapseAll = () => {
  gridApi.grid?.setAllTreeExpand(false);
};
/**
 * 加载表格数据
 * @param query
 */
const getAreaData = async (query: any = {}) => {
  const resp = await api.GetList(query)
  // areaData.value.push(...resp.data)
  areaData.value = resp.data
  await gridApi?.grid?.reloadData(areaData.value); // 刷新表格数据
}
// onMounted(async () => {
//   await getAreaData()
// })
const visibleChange = async (bool: any) => {
  if (bool) {
    await getAreaData()
  }
};
</script>

<template>
  <Page>
    <a-select
      style="width: 100%;"
      @dropdownVisibleChange="visibleChange"
      v-model:value="selectedValue"
      :placeholder="$t('system.N00488')"
    >
      <template #notFoundContent>
        <Grid table-:title="$t('system.N00245')" table-title-help="提示" style="height: 300px; overflow: auto;width: 500px">
          <template #toolbar-tools>
            <Button class="m-2" type="primary" @click="expandAll">{{ $t('system.N00165') }}</Button>
            <Button type="primary" @click="collapseAll">{{ $t('system.N00217') }}</Button>
          </template>
        </Grid>
      </template>
    </a-select>
  </Page>
</template>

<style scoped lang="scss">

</style>
