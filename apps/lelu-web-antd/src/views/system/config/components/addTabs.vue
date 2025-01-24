<script setup lang="ts">
import {$t} from '#/locales'
import {type VbenFormProps, useVbenForm, z} from '#/adapter/form';
import * as api from '../api';
import {message} from "ant-design-vue";

const emit = defineEmits();
/**
 * form表单
 */
const formOptions: VbenFormProps = {
  handleSubmit: onSubmit,
  schema: [
    {
      // 组件需要在 #/adapter.ts内注册，并加上类型
      component: 'Input',
      // 对应组件的参数
      componentProps: {
        placeholder: $t('system.N00454'),
      },
      // 字段名
      fieldName: 'title',
      // 界面显示的label
      label: $t('system.N00311'),
      rules: 'required',
    },
    {
      // 组件需要在 #/adapter.ts内注册，并加上类型
      component: 'Input',
      // 对应组件的参数
      componentProps: {
        placeholder: $t('system.N00434') + 'key' + $t('system.N00628'),
      },
      // 字段名
      fieldName: 'key',
      // 界面显示的label
      label: 'key值',
      rules: z.string().min(1, {message: $t('system.N00434')})
        .refine((value) => /^[A-Za-z0-9]+$/.test(value), {
          message: $t('system.N00639')
        }),
    },
  ],
  submitButtonOptions: {
    content: $t('system.N00676'),
  },
};

/**
 * 提交函数
 */
async function onSubmit(values: Record<string, any>) {
  const res = await api.AddObj(values);
  if (res.code == 2000) {
    emit('updateTabsModal', false)
    message.success($t('system.N00661'))
  } else message.error($t('system.N00660'));
}

const [BaseForm, formApi] = useVbenForm(formOptions)

</script>

<template>
  <BaseForm/>
</template>

<style scoped lang="scss">

</style>
