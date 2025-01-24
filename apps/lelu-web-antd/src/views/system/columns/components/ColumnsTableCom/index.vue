<template>
  <div class="columns-table-com">
    <p class="ctc-title">{{ $t('system.N00146') }}</p>

    <div class="ctc-head">
      <a-button type="primary" @click="handleUpdateColumn('create')">{{
          $t('system.N00258')
        }}
      </a-button>
      <a-button type="primary" @click="handleAutomatch">{{ $t('system.N00403') }}</a-button>
    </div>

    <a-table :data="state.data" border v-loading="state.loading" class="ctc-table">
      <a-table-column prop="field_name" :label="$t('system.N00145')"/>
      <a-table-column prop="title" :label="$t('system.N00069')"/>
      <a-table-column :label="$t('system.N00235')" width="180" align="center">
        <template #default="scope">
          <a-button type="primary" @click="handleUpdateColumn('update', scope.row)">
            {{ $t('system.N00395') }}
          </a-button>
          <a-button type="danger" @click="handleDelete(scope.row)">{{
              $t('system.N00078')
            }}
          </a-button>
        </template>
      </a-table-column>
    </a-table>

    <div class="ctc-pagination">
      <a-pagination
        v-model:current-page="searchParams.page"
        v-model:page-size="searchParams.limit"
        :page-sizes="[5, 10, 20, 50]"
        :total="state.total"
        background
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <a-drawer v-model="drawerVisible" :title="$t('system.N00146')" direction="rtl" size="500px"
              :close-on-click-modal="false" :before-close="handleDrawerClose">
      <ColumnsFormCom v-if="drawerVisible" :currentInfo="props.currentInfo"
                      :initFormData="drawerFormData" @drawerClose="handleDrawerClose"/>
    </a-drawer>
  </div>
</template>

<script lang="ts" setup>
import {$t} from '#/locales'
import {ref, reactive} from 'vue';
import {Modal, notification} from 'ant-design-vue';
import ColumnsFormCom from '../ColumnsFormCom/index.vue';
import {getColumnsData, automatchColumnsData, deleteColumnsData, updateColumnsData} from './api';
import type {
  APIResponseData,
  CurrentInfoType,
  ColumnsFormDataType,
  AddColumnsDataType
} from '../../types';

const props = defineProps({
  currentInfo: {
    type: Object as () => CurrentInfoType,
    required: true,
    default: () => {
    },
  },
});

let searchParams = reactive({
  page: 1,
  limit: 20,
});
let state = reactive({
  loading: false,
  data: [],
  total: 0,
});
let drawerVisible = ref(false);
let drawerFormData = ref<Partial<ColumnsFormDataType>>({});

const fetchData = async (query: CurrentInfoType = props.currentInfo) => {
  try {
    state.loading = true;
    const res = await getColumnsData({...searchParams, ...query});
    if (res?.code === 2000) {
      state.data = res.data;
      state.total = res.total;
    }
  } finally {
    state.loading = false;
  }
};

/**
 * 自动匹配列
 */
const handleAutomatch = async () => {
  if (props.currentInfo?.role && props.currentInfo?.model && props.currentInfo?.app) {
    const res = await automatchColumnsData(props.currentInfo);
    if (res?.code === 2000) {
      notification.success({message: $t('system.N00083'), placement: 'top'});
      await fetchData();
    }
    return;
  }
  notification.warning({message: $t('system.N00498') + '！', placement: 'top'});
};

/**
 * 新增 or 编辑
 */
const handleUpdateColumn = (type: string, record?: ColumnsFormDataType) => {
  if (props.currentInfo?.role && props.currentInfo?.model && props.currentInfo?.app) {
    if (type === 'update' && record) {
      drawerFormData.value = record;
    }
    drawerVisible.value = true;
    return;
  }
  notification.warning({message: $t('system.N00498') + '！', placement: 'top'});
};
const handleDrawerClose = (type?: string) => {
  if (type === 'submit') {
    fetchData();
  }
  drawerVisible.value = false;
  drawerFormData.value = {};
};

/**
 * 删除 deleteColumnsData
 */
const handleDelete = ({id}: { id: number }) => {
  Modal.confirm({
    title: $t('system.N00230'),
    content: $t('system.N00363') + '？',
    okText: $t('system.N00362'),
    cancelText: $t('system.N00091'),
    onOk: async () => {
      try {
        const res = await deleteColumnsData(id);
        if (res?.code === 2000) {
          notification.success({message: $t('system.N00080'), placement: 'top'});
          await fetchData();
        }
      } catch (error) {
        // 处理错误
        notification.error({message: $t('system.N00079'), placement: 'top'});
      }
    },
  });
};

const handleChange = (record: AddColumnsDataType) => {
  updateColumnsData(record).then((res: APIResponseData) => {
    notification.success({message: res.msg || $t('system.N00286'), placement: 'top'});
  });
};

/**
 * 分页
 */
const handleSizeChange = (limit: number) => {
  searchParams.limit = limit;
  fetchData();
};
const handleCurrentChange = (page: number) => {
  searchParams.page = page;
  fetchData();
};

defineExpose({fetchData});
</script>

<style lang="scss" scoped>
.columns-table-com {
  height: 100%;

  .ctc-title {
    font-size: 16px;
    font-weight: 900;
    padding-bottom: 10px;
    border-bottom: 1px solid #dcdfe6;
  }

  .ctc-head {
    height: 35px;
    margin-top: 10px;
  }

  .ctc-table {
    width: 100%;
    height: calc(100% - 135px);
    margin: 10px 0;
  }

  .ctc-pagination {
    height: 35px;
  }
}
</style>
