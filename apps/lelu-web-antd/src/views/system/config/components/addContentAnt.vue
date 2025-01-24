<template>
  <a-form ref="formRef"
          :model="formData"
          :label-col="{span:5}" :rules="rules"
          style="padding-left:20px;padding-right:20px;margin-top: 20px">
    <!-- 所属分组 -->
    <a-form-item
      :label="$t('system.N00655')"
      name="parent"
    >
      <a-select
        v-model:value="formData.parent"
        :options="parentOptions"
        allow-clear
        show-search
        :placeholder="$t('system.N00488')"
        style="width: 100%"
      />
    </a-form-item>

    <!-- 标题 -->
    <a-form-item
      :label="$t('system.N00311')"
      name="title"
    >
      <a-input v-model:value="formData.title" :placeholder="$t('system.N00434')" allow-clear/>
    </a-form-item>

    <!-- key值 -->
    <a-form-item
      :label="'key'+$t('system.N00628')"
      name="key"
    >
      <a-input v-model:value="formData.key" :placeholder="$t('system.N00434')"/>
    </a-form-item>

    <!-- 表单类型 -->
    <a-form-item
      :label="$t('system.N00606')"
      name="form_item_type"
    >
      <a-select
        v-model:value="formData.form_item_type"
        :options="formTypeOptions"
        allow-clear
        show-search
        :placeholder="$t('system.N00488')"
        style="width: 100%"
      />
    </a-form-item>
    <!--    &lt;!&ndash; 字典key &ndash;&gt;-->
    <!--    <a-form-item-->
    <!--      label="字典key"-->
    <!--      name="setting"-->
    <!--    >-->
    <!--      <a-input v-model:value="formData.setting" placeholder="请输入dictionary中key值"-->
    <!--               allow-clear></a-input>-->
    <!--    </a-form-item>-->

    <!-- 模型表 -->
    <a-form-item
      v-if="[13, 14].indexOf(formData.form_item_type) > -1"
    >
      <associationTable ref="associationTableRef" v-model="formData.setting"
                        @updateVal="associationTableUpdate"></associationTable>
    </a-form-item>

    <!-- 校验规则 -->
    <a-form-item
      :label="$t('system.N00669')"
      name="rule"
    >
      <a-select
        v-model:value="formData.rule"
        :options="ruleOptions"
        allow-clear
        mode="multiple"
        show-search
        :placeholder="$t('system.N00488') + '(' + $t('system.N00641') + ')'"
        style="width: 100%"
      />
    </a-form-item>

    <!-- 提示信息 -->
    <a-form-item
      :label="$t('system.N00659')"
      name="placeholder"
    >
      <a-input v-model:value="formData.placeholder" :placeholder="$t('system.N00434')" allow-clear/>
    </a-form-item>

    <!-- 排序 -->
    <a-form-item
      :label="$t('system.N00223')"
      name="sort"
    >
      <a-input-number
        v-model:value="formData.sort"
        :min="0"
        :max="99"
        style="width: 50%"
        :placeholder="$t('system.N00434')"
      />
    </a-form-item>

    <!-- 提交按钮 -->
    <a-form-item>
      <a-button type="primary" @click="onSubmit">{{ $t('system.N00676') }}</a-button>
    </a-form-item>
  </a-form>
</template>

<script setup>
import {$t} from '#/locales'
import * as api from '../api'
import {ref, watch} from 'vue';
import {dictionary} from '#/utils/dictionary';
import {message} from "ant-design-vue";
import associationTable from './associationTable.vue';

const props = defineProps({
  parentOptions: {
    type: Array,
    required: false,
    default: () => []
  }
});

const associationTableRef = ref()

const emit = defineEmits();
const rules = {
  parent: [{required: true, message: $t('system.N00684'), trigger: 'change'}],
  title: [{required: true, message: $t('system.N00463'), trigger: 'change'}],
  key: [
    {required: true, message: $t('system.N00434') + 'key' + $t('system.N00628'), trigger: 'change'},
    {
      pattern: /^[A-Za-z0-9_]+$/,
      message: $t('system.N00681') + '、' + $t('system.N00648'),
      trigger: 'blur'
    }
  ],
  form_item_type: [{required: true, message: $t('system.N00685'), trigger: 'change'}],
  sort: [{required: true, message: $t('system.N00656'), trigger: 'change'}],
  // setting: [{required: true, message: '不能为空', trigger: 'change'}],
}

const formTypeOptions = ref(dictionary('config_form_type'));  // 用于选择表单类型
const ruleOptions = ref([
  {
    label: $t('system.N00190'),
    value: '{"required": true, "message": "必填项不能为空"}',
  },
  {
    label: $t('system.N00521'),
    value: '{ "type": "email", "message": "请输入正确的邮箱地址"}',
  },
  {
    label: 'URL' + $t('system.N00119'),
    value: '{ "type": "url", "message": "请输入正确的URL地址"}',
  },
]);

const formData = ref({
  parent: null,
  title: '',
  key: '',
  form_item_type: null,
  setting: null,
  rule: [],
  placeholder: '',
  sort: null,
});
const resetForm = () => {
  formData.value = {
    parent: null,
    title: '',
    key: '',
    form_item_type: null,
    setting: null,
    rule: [],
    placeholder: '',
    sort: null,
  };
};
const formRef = ref();

const onSubmit = async () => {
  try {
    await formRef.value.validate();
    const isValid = await associationTableUpdate()
    if (!isValid) {
      message.error($t('system.N00545'))
      return
    }
    const res = await api.AddObj(formData.value)
    if (res.code === 2000) {
      message.success($t('system.N00661'));
      emit('updateContentModal', false)
      resetForm()
    } else {
      message.error($t('system.N00658'))
    }
  } catch (error) {
  }
};
/**
 * 关联表数据更新
 * @returns {Promise<unknown>}
 */
const associationTableUpdate = async () => {
  try {
    const isValid = await associationTableRef.value.onSubmit();
    if (isValid) {
      const {formObj} = associationTableRef.value
      formData.value.setting = formObj;
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
};

</script>
