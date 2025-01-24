<template>
  <fs-page>
    <fs-crud ref="crudRef" v-bind="crudBinding">
      <template #pagination-left>
        <a-tooltip :title="$t('system.N00329')">
          <fs-button
            :disabled="false"
            icon="mingcute:delete-2-fill"
            @click="handleBatchDelete"
            style="color:#e76c40"
          />
        </a-tooltip>
      </template>
    </fs-crud>
  </fs-page>
</template>

<script lang="ts" setup name="areas">
import {$t} from '#/locales'
import {onMounted, computed, createVNode} from 'vue';
import {FsButton, useFs} from '@fast-crud/fast-crud';
import {createCrudOptions} from './crud';
import {GetPermission, BatchDelete} from './api';
import {handleColumnPermission} from '#/utils/columnPermission';
import {Modal, notification} from 'ant-design-vue';

const {
  crudBinding,
  crudRef,
  crudExpose,
  crudOptions,
  resetCrudOptions,
  selectedRows
} = useFs({createCrudOptions});

// 页面打开后获取列表数据
onMounted(async () => {
  // 设置列权限
  const newOptions = await handleColumnPermission(GetPermission, crudOptions);
  //重置crudBinding
  resetCrudOptions(newOptions);
  // 刷新
  await crudExpose.doRefresh();
});

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
      // await BatchDelete(selectedRows.value);
      notification.success({message: $t('system.N00080'), placement: 'top'});
      selectedRows.value = [];
      await crudExpose.doRefresh();
    },
    onCancel() {
    },
    class: 'test',
  });
};
</script>
<style scoped>
/*
:deep().ant-table-tbody tr:nth-child(2n) {
  background-color: #fafafa;
}
*/
</style>
