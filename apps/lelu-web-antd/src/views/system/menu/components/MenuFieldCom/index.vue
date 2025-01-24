<template>
  <div>
    <a-modal ref="modelRef" v-model:open="modelDialog" :title="$t('system.N00517')+' Model'">
      <div v-show="props.model">
        <a-tag color="#108ee9">{{ $t('system.N00178') }}: {{ props.model }}</a-tag>
      </div>
      <!-- 搜索输入框 -->
      <a-input
        v-model:value="searchQuery"
        :placeholder="$t('system.N00233')+'...'"
        allowClear
        style="margin-top: 10px;"
      ></a-input>
      <div class="model-card">
        <!-- 对请求回来的allModelData进行computed计算，返加搜索框匹配到的内容-->
        <div v-for="(item,index) in filteredModelData" :value="item.key" :key="index">
          <a-typography-text :type="modelCheckIndex===index?'success':'default'"
                             @click="onModelChecked(item,index)"
          >
            {{ item.app + '--' + item.title + '(' + item.key + ')' }}
          </a-typography-text>
        </div>
      </div>
      <template #footer>
      <span class="dialog-footer">
        <a-button @click="modelDialog = false">{{ $t('system.N00091') }}</a-button>
        <a-button type="primary" @click="handleAutomatch">{{ $t('system.N00362') }}</a-button>
      </span>
      </template>
    </a-modal>
    <div style="height: 80vh">
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
          <a-popover placement="topRight">
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
            <a-button>{{ $t('system.N00177') }} {{ selectedRowsCount }} {{
                $t('system.N00303')
              }}
            </a-button>
          </a-popover>

        </template>
      </fs-crud>

    </div>
  </div>
</template>

<script lang="ts" setup>
import {$t} from '#/locales'
import {ref, onMounted, reactive, computed, createVNode} from 'vue';
import {FsButton, useFs} from '@fast-crud/fast-crud';
import {createCrudOptions} from './crud';
import {getModelList, BatchDelete} from './api'
import type {MenuTreeItemType} from "../../types";
import {Modal, notification} from 'ant-design-vue'
import {automatchColumnsData} from '#/views/system/columns/components/ColumnsTableCom/api';
import {Icon} from "@iconify/vue";
import XEUtils from 'xe-utils';
// 当前选择的菜单信息
let selectOptions: any = ref({name: null});

const props = reactive({
  model: '',
  app: '',
  menu: ''
})

//model弹窗
const modelDialog = ref(false)
// 获取所有model
const allModelData = ref<any[]>([]);
const modelCheckIndex = ref(null)
const onModelChecked = (row: any, index: any) => {
  modelCheckIndex.value = index
  props.model = row.key
  props.app = row.app
}


// 功能说明:搭配搜索的处理，返回搜索结果
const searchQuery = ref('');

const filteredModelData = computed(() => {
  if (!searchQuery.value) {
    return allModelData.value;
  }
  const query = searchQuery.value.toLowerCase();
  return allModelData.value.filter(item =>
    item.app.toLowerCase().includes(query) ||
    item.title.toLowerCase().includes(query) ||
    item.key.toLowerCase().includes(query)
  );
});


/**
 * 菜单选中时,加载表格数据
 * @param record
 */
const handleRefreshTable = (record: MenuTreeItemType) => {
  if (!record.is_catalog && record.id) {
    selectOptions.value = record;
    crudExpose.doRefresh();
  } else {
    //清空表格数据
    crudExpose.setTableData([]);
  }
};
/**
 * 自动匹配列
 */
const handleAutomatch = async () => {
  props.menu = selectOptions.value.id
  modelDialog.value = false
  if (props.menu && props.model) {
    const res = await automatchColumnsData(props);
    if (res?.code === 2000) {
      notification.success({message: $t('system.N00083'), placement: 'top'});
    }
    await crudExpose.doSearch({form: {menu: props.menu, model: props.model}});
  } else {
    notification.warning({message: $t('system.N00498') + '！', placement: 'top'});
  }

};


const {crudBinding, crudRef, crudExpose, selectedRows} = useFs({
  createCrudOptions,
  context: {props, modelDialog, selectOptions, allModelData}
});
onMounted(async () => {
  const res = await getModelList();
  allModelData.value = res.data;
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
defineExpose({selectOptions, handleRefreshTable});
</script>

<style scoped lang="scss">
.model-card {
  margin-top: 10px;
  height: 30vh;
  overflow-y: scroll;

  div {
    margin: 15px 0;
    cursor: pointer;
  }
}
</style>
