<script lang="ts" setup>
import type {VbenFormSchema} from '@vben/common-ui';
import type {BasicOption} from '@vben/types';

import {computed, markRaw} from 'vue';

import {
  AuthenticationLogin,
  SliderCaptcha,
  z
} from '@vben/common-ui';
import {$t} from '@vben/locales';

import {useAuthStore} from '#/store';
import {SystemConfigStore} from '#/store/systemConfig'

const systemConfig = computed(() => SystemConfigStore().systemConfig);
const loginSubTitle = computed(() => systemConfig.value['login.site_description'])
const loginTitle = computed(() => systemConfig.value['login.site_title'])
const loginCaptcha = computed(() => systemConfig.value['base.captcha_state'])

const Subtitle = computed(() => {
  return loginSubTitle.value ? $t(loginSubTitle.value) : '';
})
const LoginTitle = computed(() => {
  return loginTitle.value ? $t(loginTitle.value) : '';
})

defineOptions({name: 'Login'});

const authStore = useAuthStore();

const MOCK_USER_OPTIONS: BasicOption[] = [
  {
    label: 'Super',
    value: 'superadmin',
  },
  {
    label: 'Admin',
    value: 'admin',
  },
  {
    label: 'User',
    value: 'test',
  },
];

const formSchema = computed((): VbenFormSchema[] => {
  return [
    {
      component: 'VbenSelect',
      componentProps: {
        options: MOCK_USER_OPTIONS,
        placeholder: $t('authentication.selectAccount'),
      },
      fieldName: 'selectAccount',
      label: $t('authentication.selectAccount'),
      rules: z
        .string()
        .min(1, {message: $t('authentication.selectAccount')})
        .optional()
        .default('superadmin'),
    },
    {
      component: 'VbenInput',
      componentProps: {
        placeholder: $t('authentication.usernameTip'),
      },
      dependencies: {
        trigger(values, form) {
          if (values.selectAccount) {
            const findUser = MOCK_USER_OPTIONS.find(
              (item) => item.value === values.selectAccount,
            );
            if (findUser) {
              form.setValues({
                password: 'admin123456',
                username: findUser.value,
              });
            }
          }
        },
        triggerFields: ['selectAccount'],
      },
      fieldName: 'username',
      label: $t('authentication.username'),
      rules: z.string().min(1, {message: $t('authentication.usernameTip')}),
    },
    {
      component: 'VbenInputPassword',
      componentProps: {
        placeholder: $t('authentication.password'),
      },
      fieldName: 'password',
      label: $t('authentication.password'),
      rules: z.string().min(1, {message: $t('authentication.passwordTip')}),
    },
    {
      component: markRaw(SliderCaptcha),
      dependencies: {
        triggerFields: ['captcha'],
        if: loginCaptcha
      },
      fieldName: 'captcha',
      rules: z.boolean().refine((value) => value, {
        message: $t('authentication.verifyRequiredTip'),
      }),
    },
  ];
});
</script>

<template>
  <AuthenticationLogin
    :form-schema="formSchema"
    :loading="authStore.loginLoading"
    @submit="authStore.authLogin"
    :sub-title="Subtitle"
    :title="`${LoginTitle} 👋🏻`"
  />
</template>
