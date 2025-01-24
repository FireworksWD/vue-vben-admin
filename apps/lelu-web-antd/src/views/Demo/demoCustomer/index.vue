<script setup lang="ts">
import {$t} from '#/locales'
import {createVNode, onMounted} from "vue";
import createCrudOptions from "./crud";
import {FsButton, useFs,} from "@fast-crud/fast-crud";
import {message, Modal} from "ant-design-vue";
import {BatchDelete} from "./api";

const {crudRef, crudBinding, crudExpose, selectedRowKeys} = useFs({createCrudOptions});
// 页面打开后获取列表数据
onMounted(async () => {
  await crudExpose.doRefresh();
});

/**
 * 批量删除
 */
const handleBatchDelete = () => {
  if (selectedRowKeys.value?.length > 0) {
    Modal.confirm({
      title: $t('system.N00367'),
      content: createVNode('div', {style: ''}, [
        $t('system.N00365'),
        ' ',
        createVNode('span', {style: 'color:red;'}, selectedRowKeys.value?.length),
        ' ',
        $t('system.N00304')
      ]),
      async onOk() {
        await BatchDelete(selectedRowKeys.value);
        message.info($t('system.N00080'));
        await crudExpose.doRefresh();
        selectedRowKeys.value = [];
      }
    });
  } else {
    message.error($t('system.N00423'));
  }
};
</script>

<template>
  <fs-page>
    <fs-crud ref="crudRef" v-bind="crudBinding">
      <template #actionbar-right>
        <span>{{ $t('system.N00370') }}：1、{{ $t('system.N00081') }}，{{ $t('system.N00332') }} pagination {{
            $t('system.N00169')
          }}。2、{{ $t('system.N00378') }}</span>
      </template>
      <template #pagination-left>
        <a-tooltip :title="$t('system.N00211')">
          <fs-button icon="DeleteOutlined" @click="handleBatchDelete"></fs-button>
        </a-tooltip>
      </template>
    </fs-crud>
  </fs-page>
</template>

<style scoped lang="scss">
/*
:deep().ant-table-row:last-child td {
  background: #fff;
  position: sticky;
  bottom: 0px;
  z-index: 1;
  box-shadow: 5px 0 10px #e4e4e4;
}
*/
</style>
