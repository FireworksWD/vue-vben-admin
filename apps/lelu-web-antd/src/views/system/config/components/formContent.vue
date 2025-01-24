<script setup lang="tsx">
import * as api from '../api';
import {dictionary} from '#/utils/dictionary';
import {getBaseURL} from '#/utils/baseUrl';
import {ref, reactive, watch, nextTick, inject} from 'vue';
import {message} from "ant-design-vue";
import type {UploadChangeParam, UploadProps} from 'ant-design-vue';
import {PlusOutlined, LoadingOutlined} from '@ant-design/icons-vue';
import {$t} from "@vben/locales";
import {preferences} from '@vben/preferences';
import {useAccessStore} from "@vben/stores";
import {Icon} from "@iconify/vue";
import tableSelector from './tableSelect.vue'

const props = defineProps({
  options: Object,
  editableTabsItem: Object,
});

const loadingStates = reactive({});
const imageUrl = ref<string>('');

let formData: any = reactive({});
let formList: any = ref([]);
let childTableData = ref([]);
let childRemoveVisible = ref(false);
const validRules = reactive({
  title: [
    {
      required: true,
      message: $t('system.N00653'),
    },
  ],
  key: [
    {
      required: true,
      message: $t('system.N00653'),
    },
  ],
  value: [
    {
      required: true,
      message: $t('system.N00653'),
    },
  ],
});
const formRef = ref()
const uploadUrl = ref(getBaseURL() + 'api/system/file/');
const uploadHeaders = ref({
  Authorization: 'JWT ' + useAccessStore().accessToken,
  'Accept-Language': preferences.app.locale,
});
let dialogImageUrl = ref('');
let dialogImgVisible = ref(false);
let uploadImgKey = ref(null);

// 获取数据
const getInit = (parent = null) => {
  api.GetList({parent: parent || props.options.id, limit: 999}).then((res: any) => {
    let data = res.data;
    formList.value = data;
    const _formData: any = {};
    for (const item of data) {
      const key = item.key;
      if (item.value) {
        _formData[key] = item.value;
      } else {
        if ([5, 12, 14].indexOf(item.form_item_type) !== -1) {
          _formData[key] = [];
        } else {
          _formData[key] = item.value;
        }
      }
      if (item.form_item_type_label === 'array') {
        console.log('test');
        nextTick(() => {
          const tableName = 'xTable_' + key;
          const tabelRef = ref();
          console.log(tabelRef);
          // const $table = this.$refs[tableName][0];
          // $table.loadData(item.chinldern);
        });
      }
    }
    formData = Object.assign(formData, _formData)
  });
};

// 提交数据
const onSubmit = async () => {
  // const form = JSON.parse(JSON.stringify(form));
  const keys = Object.keys(formData);
  const values = Object.values(formData);
  for (const index in formList.value) {
    const item = formList.value[index];
    // eslint-disable-next-line camelcase
    const form_item_type_label = item.form_item_type_label;

    // eslint-disable-next-line camelcase
    if (form_item_type_label === 'array') {
      const parentId = item.id;
      const tableName = 'xTable_' + item.key;
      // const $table = this.$refs[tableName][0];
      // const { tableData } = $table.getTableData();
      // for (const child of tableData) {
      // 	if (!child.id && child.key && child.value) {
      // 		child.parent = parentId;
      // 		child.id = null;
      // 		formList.push(child);
      // 	}
      // }
      // // 必填项的判断
      // for (const arr of item.rule) {
      // 	if (arr.required && tableData.length === 0) {
      // 		errorMessage(item.title + '不能为空');
      // 		return;
      // 	}
      // }
      // item.value = tableData;
    }
    // 赋值操作
    keys.map((mapKey, mapIndex) => {
      if (mapKey === item.key) {
        if (item.form_item_type_label !== 'array') {
          item.value = values[mapIndex];
        }
        // 必填项的验证
        if (['img', 'imgs'].indexOf(item.form_item_type_label) > -1) {
          for (const arr of item.rule) {
            if (arr.required && item.value === null) {
              message.error(item.title + $t('system.N00622'));
              return;
            }
          }
        }
      }
    });
  }
  try {
    await formRef.value.validate();
    let res;
    res = await api.saveContent(formList.value)
    if (res.code === 2000) {
      message.success($t('system.N00627'));
      refreshView && refreshView();
    } else {
      message.error($t('system.N00658'))
    }
  } catch (error) {

  }
};

function getBase64(img: Blob, callback: (base64Url: string) => void) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result as string));
  reader.readAsDataURL(img);
}

//文件的状态
const handleChange = (info: UploadChangeParam, item: any) => {
  if (info.file.status === 'uploading') {
    loadingStates[item.key] = true;
  }
  if (info.file.status === 'done') {
    loadingStates[item.key] = false;
    // @ts-ignore
    getBase64(info.file.originFileObj, (base64Url: string) => {
      imageUrl.value = base64Url;
    });
    const uploadImgKey = formData[item.key];
    if (!uploadImgKey || uploadImgKey === '') {
      formData[item.key] = [];
    }
    const dict = {
      name: info.file.name,
      url: info.file.response?.data?.url,
      uid: info.file.uid,
      status: 'done'
    };
    item.value = [dict]
    formData[item.key].push(dict);
  }
  if (info.file.status === 'error') {
    loadingStates[item.key] = false;
    message.error($t('system.N00003'));
  }
};
// 判断是否为图片
// 封装一个判断图片文件后缀名的方法
const isImage = (fileName: any) => {
  if (typeof fileName !== 'string') return;
  const name = fileName.toLowerCase();
  return name.endsWith('.png') || name.endsWith('.jpeg') || name.endsWith('.jpg') || name.endsWith('.png') || name.endsWith('.bmp');
};
//文件上传前的检查
//@ts-ignore
const beforeUpload = (file: UploadProps['fileList'][number]) => {
  const isJpgOrPng = isImage(file.name)
  if (!isJpgOrPng) {
    message.error($t('system.N00638'));
  }
  return isJpgOrPng;
};
//文件的移除
const handleRemove = (file: any, item: any) => {
  var index = 0;
  item.value.map((value: any, inx: any) => {
    if (value.uid === file.uid) index = inx;
  });
  item.value.splice(index, 1);
};

// 配置的行删除
const onDelRow = async (obj: any) => {
  await api.DelObj(obj.id)
  await getInit(obj.parent)
  message.success($t('system.N00080'))
};

// 行编辑
const onEdit = (index: any) => {
  formList.value[index].edit = true
  formList.value[index].new_key = formList.value[index].key
};
// 行编辑保存
const onEditSave = async (obj: any, index) => {
  obj.key = JSON.parse(JSON.stringify(obj.new_key));
  await api.UpdateObj(obj)
  formList.value[index].edit = false
  getInit(obj?.parent)
  message.success($t('system.N00627'))
};

const dataSource = ref([
  // { key: '1', title: '标题1', key: 'key1', value: '值1' },
  // { key: '2', title: '标题2', key: 'key2', value: '值2' },
]);
const columns = [
  {
    title: $t('system.N00311'),
    dataIndex: 'title',
    editable: true,
    render: (text, record) => (
      <a-input
        value={record.title}
        onInput={(e) => updateData(record.key, 'title', e.target.value)}
      />
    ),
  },
  {
    title: $t('system.N00689'),
    dataIndex: 'key',
    editable: true,
    render: (text, record) => (
      <a-input
        value={record.key}
        onInput={(e) => updateData(record.key, 'key', e.target.value)}
      />
    ),
  },
  {
    title: $t('system.N00688'),
    dataIndex: 'value',
    editable: true,
    render: (text, record) => (
      <a-input
        value={record.value}
        onInput={(e) => updateData(record.key, 'value', e.target.value)}
      />
    ),
  },
  {
    title: $t('system.N00235'),
    key: 'operation',
    render: (_, record, index) => (
      <a-popconfirm
        title={$t('system.N00633') + "," + $t('system.N00673')}
        onConfirm={() => onRemoveChild(record, index, item.key)}
      >
        <a-button type="text" size="small">{$t('system.N00078')}</a-button>
      </a-popconfirm>
    ),
  },
];
const updateData = (key, column, value) => {
  const row = dataSource.value.find(item => item.key === key);
  if (row) {
    row[column] = value;
  }
};
// 追加
const onAppend = (tableName: any) => {
  dataSource.value.push({key: Date.now().toString(), title: '', key: '', value: ''});
  // const $table = this.$refs[tableName][0];
  // const { tableData } = $table.getTableData();
  // const tableLength = tableData.length;
  // if (tableLength === 0) {
  // 	const { row: newRow } = $table.insert();
  // 	console.log(newRow);
  // } else {
  // 	const errMap = $table.validate().catch((errMap: any) => errMap);
  // 	if (errMap) {
  // 		errorMessage('校验不通过!');
  // 	} else {
  // 		const { row: newRow } = $table.insert();
  // 		console.log(newRow);
  // 	}
  // }
};

// 子表删除
const onRemoveChild = (row: any, index: any, refName: any) => {
  dataSource.value.splice(index, 1);
  console.log(row, index);
  if (row.id) {
    api.DelObj(row.id).then((res: any) => {
      // this.refreshView();
    });
  } else {
    // this.childTableData.splice(index, 1);
    // const tableName = 'xTable_' + refName;
    // const tableData = this.$refs[tableName][0].remove(row);
    // console.log(tableData);
  }
};
watch(
  props.options,
  (nv) => {
    if (nv && nv.id && nv.parent === null) {
      getInit(nv.id);
    }
  },
  {immediate: true}
);
</script>

<template>
  <div>
    <!-- 表头样式 -->
    <a-row :gutter="20" style="font-weight: bold; padding: 10px 0;">
      <a-col :span="4">{{ $t('system.N00637') }}</a-col>
      <a-col :span="4">{{ $t('system.N00636') }}</a-col>
      <a-col :span="8">{{ $t('system.N00635') }}</a-col>
      <a-col :span="4" :offset="1">{{ $t('system.N00663') }}</a-col>
      <a-col :span="3">{{ $t('system.N00235') }}</a-col>
    </a-row>

    <a-form ref="formRef" :model="formData"
            style="margin-top: 20px;max-height: 480px; overflow-y: auto;padding: 10px; border-radius: 8px;">
      <a-form-item
        v-for="(item, index) in formList"
        :key="index"
        :name="['array'].indexOf(item.form_item_type_label) > -1 ? '' : item.key"
        :rules="item.rule || []"
        style="margin-bottom: 15px;"
      >
        <a-row justify="center" align="middle">
          <!-- Title Input -->
          <a-col :span="4" style="margin-bottom: 20px">
            <a-form-item v-if="item.edit" :name="item.key + '-title'">
              <a-input v-model:value="item.title" style="width: 200px"
                       :placeholder="$t('system.N00463')"/>
            </a-form-item>
            <span v-else>{{ $t(item.title) }}</span>
          </a-col>

          <!-- Key Input -->
          <a-col :span="4" style="margin-bottom: 20px">
            <a-form-item v-if="item.edit" :name="item.key + '-new_key'">
              <a-input v-model:value="item.new_key" style="width: 200px"
                       :placeholder="$t('system.N00680')+'key'">
                <template #addonBefore>
                  <span>{{ editableTabsItem.key }}</span>
                </template>
              </a-input>
            </a-form-item>
            <span v-else>{{ editableTabsItem.key }}.{{ item.key }}</span>
          </a-col>

          <!-- Field Type Input -->
          <a-col :span="8">
            <a-form-item v-if="['text', 'textarea'].indexOf(item.form_item_type_label) > -1"
                         :name="item.key">
              <a-input v-model:value="item.value" :placeholder="$t(item.placeholder)"
                       clearable/>
            </a-form-item>
            <a-form-item v-else-if="item.form_item_type_label === 'number'" :name="item.key">
              <a-input-number v-model:value="item.value" :min="0"/>
            </a-form-item>
            <a-form-item
              v-else-if="['datetime', 'date', 'time'].indexOf(item.form_item_type_label) > -1"
              :name="item.key">
              <a-date-picker v-model:value="item.value" :placeholder="$t(item.placeholder)"/>
            </a-form-item>
            <a-form-item v-else-if="item.form_item_type_label === 'select'" :name="item.key">
              <a-select v-model:value="item.value" :placeholder="$t(item.placeholder)"
                        clearable>
                <a-select-option
                  v-for="opt in dictionary(item.setting) || []"
                  :key="opt.value"
                  :value="opt.value"
                >
                  {{ opt.label }}
                </a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item v-else-if="item.form_item_type_label === 'checkbox'" :name="item.key">
              <a-checkbox-group v-model="item.value" :placeholder="$t(item.placeholder)">
                <a-checkbox v-for="items in dictionary(item.setting) || []" :key="items.value"
                            :value="items.value">
                  {{ item.label }}
                </a-checkbox>
              </a-checkbox-group>
            </a-form-item>
            <a-form-item v-else-if="item.form_item_type_label === 'radio'" :name="item.key">
              <a-radio-group v-model="item.value" :placeholder="$t(item.placeholder)" clearable>
                <a-radio v-for="items in dictionary(item.setting) || []" :key="items.value"
                         :value="items.value">
                  {{ item.label }}
                </a-radio>
              </a-radio-group>
            </a-form-item>
            <a-form-item v-else-if="item.form_item_type_label === 'switch'" :name="item.key">
              <a-switch
                v-model:checked="item.value"
                :checked-value="true"
                :unchecked-value="false"
                :checked-children="$t('system.N00267')"
                :unChecked-children="$t('system.N00101')"
              />
            </a-form-item>
            <a-form-item v-else-if="['img', 'imgs'].indexOf(item.form_item_type_label) > -1"
                         :name="item.key">
              <a-upload
                :action="uploadUrl"
                :headers="uploadHeaders"
                name="file"
                :accept="'image/*'"
                :maxCount="1"
                listType="picture-card"
                v-model:file-list="item.value"
                @change="(info) => handleChange(info, item)"
                :before-upload="beforeUpload"
                @remove="(file) => handleRemove(file, item)"
              >
                <div>
                  <!--                  <a-image v-if="item.value?.length>0" :src="item.value[0].url"/>-->
                  <loading-outlined v-if="loadingStates[item.key]"></loading-outlined>
                  <plus-outlined v-else></plus-outlined>
                  <div style="font-size: 12px">{{ $t('system.N00683') }}</div>
                </div>
              </a-upload>
            </a-form-item>
            <a-form-item v-else-if="['file'].indexOf(item.form_item_type_label) > -1"
                         :name="item.key">
              <a-upload
                :action="uploadUrl"
                :headers="uploadHeaders"
                name="file"
                :maxCount="1"
                listType="picture-card"
                @change="(info) => handleChange(info, item)"
                @remove="(file) => handleRemove(file, item)"
              >
                <div>
                  <loading-outlined v-if="loadingStates[item.key]"></loading-outlined>
                  <plus-outlined v-else></plus-outlined>
                  <div style="font-size: 12px">Upload File</div>
                </div>
              </a-upload>
            </a-form-item>
            <!-- 关联表 -->
            <a-form-item
              v-else-if="['foreignkey', 'manytomany'].indexOf(item.form_item_type_label) > -1">
              <table-selector
                v-model="formData[item.key]"
                :el-props="{
								pagination: true,
								columns: item.setting?.searchField,
							}"
                :dict="{
								url: '/api/system/system_config/get_table_data/' + item.id + '/',
								value: item.setting?.primarykey,
								label: item.setting?.field,
							}"
                :pagination="true"
                :multiple="item.form_item_type_label === 'manytomany'"
              ></table-selector>
            </a-form-item>
            <!-- Array Fields -->
            <a-form-item v-else-if="item.form_item_type_label === 'array'" :name="item.key">
              <a-table
                :rowKey="index"
                :columns="columns"
                :dataSource="item.value"
                :pagination="false"
                size="small"
                bordered
                :scroll="{ y: 200 }"
              >
                <template #bodyCell="{ column, record, index }">
                  <a-popconfirm
                    :title="$t('system.N00633')+','+$t('system.N00673')"
                    @confirm="onRemoveChild(record, index, item.key)"
                  >
                    <a-button type="text" size="small">{{ $t('system.N00078') }}</a-button>
                  </a-popconfirm>
                </template>
              </a-table>
              <div>
                <a-button size="small" @click="onAppend(item.key)">{{ $t('system.N00687') }}
                </a-button>
              </div>
            </a-form-item>
          </a-col>

          <!-- Status Switch -->
          <a-col :span="4" :offset="1">
            <a-form-item :name="item.key + '-status'">
              <a-switch v-model:checked="item.status"
                        :checked-children="$t('system.N00267')"
                        :unChecked-children="$t('system.N00101')"/>
            </a-form-item>
          </a-col>

          <!-- Edit and Delete Buttons -->
          <a-col :span="3">

            <a-tooltip v-if="item.edit" :title="$t('system.N00048')">
              <a-button type="dashed"
                        style="margin-right: 5px; background-color: #67C23A;margin-bottom: 20px"
                        @click="onEditSave(item, index)">
                <Icon icon="icon-park:update-rotation"/>
              </a-button>
            </a-tooltip>

            <a-tooltip v-else :title="$t('system.N00395')">
              <a-button type="primary" style="margin-right: 5px;margin-bottom: 20px"
                        @click="onEdit(index)">
                <Icon icon="fluent-color:clipboard-text-edit-20"/>
              </a-button>
            </a-tooltip>

            <a-popconfirm :title="$t('system.N00675')" @confirm="onDelRow(item)">
              <a-button danger>
                <Icon icon="icon-park:delete"/>
              </a-button>
            </a-popconfirm>
          </a-col>
        </a-row>
      </a-form-item>

      <a-form-item>
        <a-button type="primary" @click="onSubmit">{{ $t('system.N00362') }}</a-button>
      </a-form-item>
    </a-form>

  </div>
</template>


<style scoped lang="scss">

</style>
