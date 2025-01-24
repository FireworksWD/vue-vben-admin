<template>
  <div class="columns-form-com">
    <a-form ref="formRef" :model="formData" :rules="formRules" label-col="{ span: 8 }"
            wrapper-col="{ span: 16 }">
      <a-form-item :label="$t('system.N00145')" name="field_name"
                   :rules="[{ required: true, message: $t('system.N00454') }]">
        <a-input v-model="formData.field_name" :placeholder="$t('system.N00454')"/>
      </a-form-item>

      <a-form-item :label="$t('system.N00069')" name="title" :rules="[{ required: true, message: $t('system.N00439') }]">
        <a-input v-model="formData.title" :placeholder="$t('system.N00439')"/>
      </a-form-item>

      <a-form-item :label="$t('system.N00077')" name="is_create">
        <a-switch v-model="formData.is_create"/>
      </a-form-item>

      <a-form-item :label="$t('system.N00397')" name="is_update">
        <a-switch v-model="formData.is_update"/>
      </a-form-item>

      <a-form-item :label="$t('system.N00309')" name="is_query">
        <a-switch v-model="formData.is_query"/>
      </a-form-item>

      <a-form-item>
        <a-button type="primary" @click="handleSubmit" :loading="btnLoading">{{ $t('system.N00362') }}</a-button>
        <a-button @click="handleClose">{{ $t('system.N00091') }}</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script lang="ts" setup>
import {$t} from '#/locales'
import {reactive, ref, onMounted} from 'vue';
import {addColumnsData, updateColumnsData} from '../ColumnsTableCom/api';
import type {CurrentInfoType, ColumnsFormDataType} from '../../types';
import {notification} from 'ant-design-vue'
import type {FormInstance} from 'ant-design-vue';

const props = defineProps({
  currentInfo: {
    type: Object as () => CurrentInfoType,
    required: true,
    default: () => {
    },
  },
  initFormData: {
    type: Object as () => Partial<ColumnsFormDataType>,
    default: () => {
    },
  },
});
const emit = defineEmits(['drawerClose']);

const formRef = ref<FormInstance>();
const formRules = reactive({
  field_name: [{required: true, message: $t('system.N00454')+'！', trigger: 'blur'}],
  title: [{required: true, message: $t('system.N00439')+'！', trigger: 'blur'}],
});

let formData = reactive<ColumnsFormDataType>({
  field_name: '',
  title: '',
  is_create: true,
  is_update: true,
  is_query: true,
});
let btnLoading = ref(false);

const setMenuFormData = () => {
  if (props.initFormData?.id) {
    formData.id = props.initFormData?.id || '';
    formData.field_name = props.initFormData.field_name || '';
    formData.title = props.initFormData.title || '';
    formData.is_create = !!props.initFormData.is_create;
    formData.is_update = !!props.initFormData.is_update;
    formData.is_query = !!props.initFormData.is_query;
  }
};

const handleSubmit = async () => {
  try {
    const valid = await formRef.value?.validateFields();
    if (!valid) return;
    btnLoading.value = true;
    let res;
    if (formData.id) {
      res = await updateColumnsData({...formData, ...props.currentInfo});
    } else {
      res = await addColumnsData({...formData, ...props.currentInfo});
    }
    if (res?.code === 2000) {
      notification.success({message: res.msg as string, placement: 'top'});
      handleClose('submit');
    }
  } catch (error) {
    console.error('验证失败:', error);
  } finally {
    btnLoading.value = false;
  }

};

const handleClose = (type: string = '') => {
  emit('drawerClose', type);
  formRef.value?.resetFields();
};

onMounted(() => {
  setMenuFormData();
});
</script>

<style lang="scss" scoped>
.columns-form-com {
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
}
</style>
