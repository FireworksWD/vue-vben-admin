<script setup lang="ts">
import {$t} from '#/locales'
import {onMounted, computed, createVNode, defineAsyncComponent} from "vue";
import {createCrudOptions} from "./crud";
import {FsButton, useFs} from "@fast-crud/fast-crud";
import {message, Modal} from "ant-design-vue";
import * as api from "./api";
import {useAccess} from '@vben/access';

const {hasAccessByCodes} = useAccess();

const importExcel = defineAsyncComponent(() => import('./FileUpload/index.vue'));
const {crudRef, crudBinding, crudExpose, selectedRows} = useFs({createCrudOptions});

// 页面打开后获取列表数据
onMounted(async () => {
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
      $t('system.N00304'), createVNode('br'),
      createVNode('span', {style: 'color:red'}, $t('system.N00095'))
    ]),
    onOk: async () => {
      await api.BatchDelete(selectedRows.value);
      message.success($t('system.N00080'));
      selectedRows.value = [];
      await crudExpose.doRefresh();
    },
    onCancel() {
    },
  });
};
/**
 * 批量下载文件
 */
const batchDownloadFile = async () => {
  if (selectedRowsCount.value > 0) {
    Modal.confirm({
      title: $t('system.N00328'),
      type: "info",
      content: createVNode('div', {style: 'color:green;'}, [
        $t('system.N00364'),
        ' ',
        createVNode('span', {style: 'color:blue;'}, selectedRows.value?.length),
        ' ',
        $t('system.N00022') + '?'
      ]),
      onOk: async () => {
        message.info($t('system.N00608'));
        await api.BatchDownload(selectedRows.value);
        selectedRows.value = [];
        await crudExpose.doRefresh();
      },
      onCancel() {
      },
    });
  } else {
    message.warning($t('system.N00496'))
  }
}
/**
 * 刷新表格数据
 */
const handleRefreshTable = async () => {
  await crudExpose.doRefresh();
}
</script>

<template>
  <fs-page>
    <fs-crud ref="crudRef" v-bind="crudBinding">
      <template #actionbar-right>
        <a-button type="primary"
                  class="gradient-hover"
                  @click="batchDownloadFile"
                  v-if="hasAccessByCodes(['user:Import'])">{{ $t('system.N00210') }}
        </a-button>
        <importExcel @refreshData="handleRefreshTable" api=""
                     v-if="hasAccessByCodes(['user:Import'])">{{ $t('system.N00254') }}
        </importExcel>
      </template>
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
    </fs-crud>
  </fs-page>
</template>

<style scoped lang="scss">
.gradient-hover {
  background-color: #7a5ff2;
  border-color: #7a5ff2;
  transition: background 0.3s, border-color 0.3s;
  margin-right: 10px;
}

.gradient-hover:hover {
  background: linear-gradient(to right, #7a5ff2, #ff6ed1);
  border-color: #7a5ff2;
  transform: scale(1.05);
}
</style>
