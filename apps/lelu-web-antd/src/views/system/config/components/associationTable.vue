<template>
  <div>
    <a-form :model="formObj" ref="associationRef" :label-col="{span:5}"
            style="margin-bottom: -20px">
      <a-form-item label="关联表"
                   :rules="[{ required: true, message: $t('system.N00190'), trigger: 'blur' }]">
        <a-select v-model:value="formObj.table" show-search allow-clear
                  :placeholder="$t('system.N00488')"
                  @change="handleChange">
          <a-select-option v-for="item in tableOptions" :key="item.table" :value="item.table">
            <span style="float: left">{{ item.tableName }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.table }}</span>
          </a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item label="显示字段"
                   :rules="[{ required: true, message: $t('system.N00190'), trigger: 'blur' }]">
        <a-select v-model:value="formObj.field" show-search allow-clear
                  :placeholder="$t('system.N00488')">
          <a-select-option v-for="item in labelOptions" :key="item.table" :value="item.field">
            <span style="float: left">{{ item.field }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.title }}</span>
          </a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item label="储存字段"
                   :rules="[{ required: true, message: $t('system.N00190'), trigger: 'blur' }]">
        <a-select v-model:value="formObj.primarykey" show-search allow-clear
                  :placeholder="$t('system.N00488')">
          <a-select-option v-for="(item, index) in labelOptions" :key="index" :value="item.field">
            <span style="float: left">{{ item.field }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.title }}</span>
          </a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item label="过滤条件"
                   :rules="[{ required: true, message: $t('system.N00190'), trigger: 'blur' }]">
        <a-select v-model:value="formObj.oldSearchField" mode="multiple" show-search allow-clear
                  :placeholder="$t('system.N00488')" @change="handleSearch">
          <a-select-option v-for="(item, index) in labelOptions" :key="index" :value="item.field">
            <span style="float: left">{{ item.field }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.title }}</span>
          </a-select-option>
        </a-select>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import {$t} from '#/locales'
import * as api from '../api';
import {ref, reactive, defineExpose, onMounted} from 'vue';

const formObj: any = reactive({
  table: null,
  primarykey: null,
  field: null,
  searchField: null,
  oldSearchField: null,
});
let searchField = ref('');
let tableOptions: any = ref([]);
let labelOptions: any = ref([]);
const associationRef: any = ref();

const emits = defineEmits(['updateVal']);
const props = defineProps(['value']);
// 初始化数据
const init = () => {
  api.GetAssociationTable().then((res: any) => {
    const data = res.data;
    tableOptions = data;
    // 设置默认选中
    formObj.table = data[0].table;
    labelOptions = data[0].tableFields;
    formObj.primarykey = 'id';
    formObj.field = 'id';
    formObj.oldSearchField = []
  });
};
// 选中事件
const handleChange = (val: any) => {
  const {tableFields} = tableOptions.find((item: any) => {
    return item.table === val;
  });
  labelOptions = tableFields;
};

// 过滤条件选中
const handleSearch = (val: any) => {
  const fields = labelOptions.filter((item: any) => {
    return val.indexOf(item.field) > -1;
  });
  formObj.searchField = fields;
};
// 更新数据
const handleUpdate = () => {
  emits('updateVal', formObj);
};
// 数据验证
const onSubmit = async () => {
  try {
    await associationRef.value.validate()
    return true
  } catch (error) {
    return false
  }
};
onMounted(() => {
  init()
})
defineExpose({onSubmit, formObj})
</script>

<style></style>
