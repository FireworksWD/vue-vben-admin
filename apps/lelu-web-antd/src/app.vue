<script lang="ts" setup>
import {computed, watch, onBeforeUnmount} from 'vue';

import {useAntdDesignTokens} from '@vben/hooks';
import {preferences, usePreferences} from '@vben/preferences';

import {App, ConfigProvider, theme, notification} from 'ant-design-vue';

import {antdLocale, $t} from '#/locales';
import {useRoute} from 'vue-router';
import websocket from '#/utils/websocket';
import configSetting from "#/configSetting";

defineOptions({name: 'App'});

const {isDark} = usePreferences();
const {tokens} = useAntdDesignTokens();

const tokenTheme = computed(() => {
  const algorithm = isDark.value
    ? [theme.darkAlgorithm]
    : [theme.defaultAlgorithm];

  // antd 紧凑模式算法
  if (preferences.app.compact) {
    algorithm.push(theme.compactAlgorithm);
  }

  return {
    algorithm,
    token: tokens,
  };
});

const route = useRoute();


// websocket相关代码
import {messageCenterStore} from '#/store/messageCenter';

const wsReceive = (message: any) => {
  const data = JSON.parse(message.data);
  const {unread} = data;
  const messageCenter = messageCenterStore();
  messageCenter.setUnread(unread);
  if (data.contentType === 'SYSTEM') {
    notification.open({
      message: $t('system.N00557'),
      description: unread === 0 ? $t('system.N00558') : $t('system.N00559'),
      type: 'success',
      placement: 'bottomRight',
      duration: 5,
    });
  }
};
watch(
  () => route.path,
  () => {
    configSetting.useFavicon();
    if (!websocket.websocket) {
      //websockt 模块
      try {
        websocket.init(wsReceive)
      } catch (e) {
        console.log(e)
        console.log('websocket错误');
      }
    }
  },
  {
    immediate: true,
  }
);
onBeforeUnmount(() => {
  // 关闭连接
  websocket.close();
});
</script>

<template>
  <ConfigProvider :locale="antdLocale" :theme="tokenTheme">
    <App>
      <RouterView/>
    </App>
  </ConfigProvider>
</template>

<style lang="scss" scoped>
/* 为 table summary 插槽添加全局的浮动效果 */
:deep(.ant-table-summary) {
  position: sticky;
  bottom: 0;
  z-index: 1;
  box-shadow: 0 -5px 10px rgba(0, 0, 0, 0.1);
}
</style>
