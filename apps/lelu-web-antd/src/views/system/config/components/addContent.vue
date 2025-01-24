<script setup lang="ts">
import {$t} from '#/locales'
import {type VbenFormProps, useVbenForm, z} from '#/adapter/form';
import {ref, onMounted} from 'vue'
import * as api from '../api';
import {dictionary} from '#/utils/dictionary';


const parentOptions: any = ref([]);
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
/**
 * form表单
 */
const formOptions: VbenFormProps = {
  handleSubmit: onSubmit,
  schema: [
    {
      // 组件需要在 #/adapter.ts内注册，并加上类型
      component: 'Select',
      // 对应组件的参数
      componentProps: {
        allowClear: true,
        filterOption: true,
        options: parentOptions.value,
        placeholder: $t('system.N00488'),
        showSearch: true,
        style: {
          width: '100%',
        }
      },
      // 字段名
      fieldName: 'parent',
      // 界面显示的label
      label: $t('system.N00655'),
      rules: 'required',
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: $t('system.N00434'),
      },
      fieldName: 'title',
      label: $t('system.N00311'),
      rules: 'required',
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: $t('system.N00434'),
      },
      fieldName: 'key',
      label: 'key值',
      rules: z.string().min(1, {message: $t('system.N00434')})
        .refine((value) => /^[A-Za-z0-9_]+$/.test(value), {
          message: $t('system.N00681') + '、' + $t('system.N00648')
        }),
    },
    {
      component: 'Select',
      componentProps: {
        allowClear: true,
        filterOption: true,
        options: dictionary('config_form_type'),
        placeholder: $t('system.N00488'),
        showSearch: true,
        style: {
          width: '100%',
        }
      },
      fieldName: 'form_item_type',
      label: $t('system.N00606'),
      rules: 'required',
    },
    {
      component: 'Select',
      componentProps: {
        allowClear: true,
        filterOption: true,
        mode: 'multiple',
        options: ruleOptions.value,
        placeholder: $t('system.N00488') + '(' + $t('system.N00641') + ')',
        showSearch: true,
        showArrow: true,
        style: {
          width: '100%',
        }
      },
      fieldName: 'rule',
      label: $t('system.N00669'),
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: $t('system.N00434'),
      },
      fieldName: 'placeholder',
      label: $t('system.N00659'),
    },
    {
      component: 'InputNumber',
      componentProps: {
        placeholder: $t('system.N00434'),
        min: 0,
        max: 99,
        style: {
          width: '50%',
        }
      },
      fieldName: 'sort',
      label: $t('system.N00223'),
    },
  ],
  submitButtonOptions: {
    content: $t('system.N00676'),
  },
};


const getParent = async () => {
  const res = await api.GetList({
    parent__isnull: true,
    limit: 999,
  })
  parentOptions.value = res.data.map((item: any) => ({
    label: item.title,
    value: item.id,
  }));
};

onMounted(async () => {
  await getParent();
})

const [BaseForm, formApi] = useVbenForm(formOptions);

/**
 * 提交函数
 */
function onSubmit(values: Record<string, any>) {
  console.log(values);
}


</script>

<template>
  <BaseForm/>
</template>

<style scoped lang="scss">

</style>
