<template>
  <fs-crud ref="crudRef" v-bind="crudBinding">
    <template #pagination-left>
      <a-tooltip :title="$t('system.N00211')">
        <fs-button
          :disabled="selectedRowsCount === 0"
          icon="mingcute:delete-2-fill"
          @click="handleBatchDelete"
          style="color:#e76c40"
        />
      </a-tooltip>
    </template>
    <template #pagination-right>
      <a-popover placement="topRight" style="height: 50px">
        <template #title>
          <a-row>
            <a-col :span="12">
              id
            </a-col>
            <a-col :span="12">{{ $t('system.N00235') }}</a-col>
          </a-row>
        </template>
        <template #content>
          <div style="height: 100%; overflow-y: auto; max-height:200px;padding: 5px">
            <template v-for="(row, index) in selectedRows" :key="index">
              <a-row>
                <a-col :span="12">{{ row }}</a-col>
                <a-col :span="12">
                  <a-button @click="removeSelectedRows(row)" size="small">
                    <Icon icon="mingcute:delete-back-line"/>
                  </a-button>
                </a-col>
              </a-row>
            </template>
          </div>
        </template>
        <a-button>{{ $t('system.N00177') }} {{ selectedRowsCount }} {{ $t('system.N00303') }}</a-button>
      </a-popover>
    </template>
  </fs-crud>
</template>

<script lang="ts" setup>
import {$t} from '#/locales'
import {computed, createVNode, ref} from 'vue';
import {FsButton, useFs} from '@fast-crud/fast-crud';
import {createCrudOptions} from './crud';
import type {MenuTreeItemType} from '../../types';
import {Icon} from "@iconify/vue";
import {Modal, notification} from 'ant-design-vue'
import {BatchDelete} from './api';
import XEUtils from 'xe-utils';
// 当前选择的菜单信息
let selectOptions: any = ref({name: null});

const {crudRef, crudBinding, crudExpose, selectedRows} = useFs({
  createCrudOptions,
  context: {selectOptions}
});
const {doRefresh, setTableData} = crudExpose;

/**
 *选中行的条数
 */
const selectedRowsCount = computed(() => {
  return selectedRows.value.length;
});

/**
 * 批量删除
 */
const handleBatchDelete = async () => {
  Modal.confirm({
    title: $t('system.N00328'),
    type: "warning",
    content: createVNode('div', {style: ''}, [
      $t('system.N00365'),
      ' ',
      createVNode('span', {style: 'color:red;'}, selectedRows.value?.length),
      ' ',
      $t('system.N00304')
    ]),
    onOk: async () => {
      await BatchDelete(selectedRows.value);
      notification.success({message: $t('system.N00080'), placement: 'top'});
      selectedRows.value = [];
      await crudExpose.doRefresh();
    },
    onCancel() {
    },
    class: 'test',
  });
};


/**
 * 移除已选中的行
 */
const removeSelectedRows = (row: any) => {
  const tableData = crudExpose.getTableData();
  if (XEUtils.pluck(tableData, 'id').includes(row)) {
    selectedRows.value = selectedRows.value.filter((id: any) => id !== row);
  } else {
    selectedRows.value = XEUtils.remove(selectedRows.value, (item: any) => item.id !== row);
  }
};

const handleRefreshTable = (record: MenuTreeItemType) => {
  if (!record.is_catalog && record.id) {
    selectOptions.value = record;
    doRefresh();
  } else {
    //清空表格数据
    setTableData([]);
  }
};

defineExpose({selectOptions, handleRefreshTable});
</script>
