<script lang="ts" setup>
import type {NotificationItem} from '@vben/layouts';
import {BasicLayout, LockScreen, Notification, UserDropdown,} from '@vben/layouts';

import {computed, nextTick, provide, reactive, ref, watch} from 'vue';

import {AuthenticationLoginExpiredModal} from '@vben/common-ui';
import {useWatermark} from '@vben/hooks';
import {preferences} from '@vben/preferences';
import {useAccessStore, useUserStore} from '@vben/stores';
import {useRouter} from 'vue-router';

import {message} from 'ant-design-vue';

import {$t} from '#/locales';
import {useAuthStore} from '#/store';
import LoginForm from '#/views/_core/authentication/login.vue';
import {requestClient} from "#/api/request";
import {messageCenterStore} from '#/store/messageCenter';
import {apiPrefix} from '#/views/system/messageCenter/api';
import {SystemConfigStore} from '#/store/systemConfig'

const systemConfig = computed(() => SystemConfigStore().systemConfig);
const webTitle = computed(() => {
  const title = systemConfig.value['base.web_title'];
  return title ? title : preferences.app.name;
});

const webLogo = computed(() => {
  const logo = systemConfig.value['base.site_logo'];
  return logo ? logo : preferences.logo.source;
});

interface ExtendedNotificationItem extends NotificationItem {
  [key: string]: any;
}

const messageCenter = messageCenterStore();
const state = reactive({
  newsList: ref<ExtendedNotificationItem[]>([]),
});

const getLastMsg = async () => {
  //获取最细你的10条数据
  const res = await requestClient.get(apiPrefix + 'get_self_receive/?page=1&limit=10&is_read=False')
  const {data} = res
  state.newsList = data.map((item: any) => ({
    avatar: item?.send_user_info?.avatar || preferences.app.defaultAvatar || '',  // 头像，如果没有则为空
    date: item?.create_datetime,  // 格式化日期
    isRead: item?.is_read,  // 判断是否已读
    message: item?.content,  // 消息内容
    title: item?.title,  // 标题
    id: item?.id
  }))
}
const handleClick = async () => {
  await getLastMsg()
}
// onMounted(async () => {
//   await getLastMsg()
// })
const router = useRouter();
const notifications = ref<NotificationItem[]>([
  {
    avatar: '',
    date: '3小时前',
    isRead: true,
    message: '描述信息描述信息描述信息',
    title: '收到了 14 份新周报',
  },
  {
    avatar: '',
    date: '刚刚',
    isRead: false,
    message: '描述信息描述信息描述信息',
    title: '朱偏右 回复了你',
  },
  {
    avatar: '',
    date: '2024-01-01',
    isRead: false,
    message: '描述信息描述信息描述信息',
    title: '曲丽丽 评论了你',
  },
  {
    avatar: '',
    date: '1天前',
    isRead: false,
    message: '描述信息描述信息描述信息',
    title: '代办提醒',
  },
]);

const userStore = useUserStore();
const authStore = useAuthStore();
const accessStore = useAccessStore();
const {destroyWatermark, updateWatermark} = useWatermark();
let showDot = computed(() =>
  messageCenter.unread !== 0,
);
/**
 * 刷新页面
 */
const showView = ref(true)
const refreshView = function () {
  showView.value = false // 通过v-if移除router-view节点
  nextTick(() => {
    showView.value = true // DOM更新后再通过v-if添加router-view节点
  })
}
provide('refreshView', refreshView)
const menus = computed(() => [
  {
    handler: async () => {
      await router.push('/personal/info')
    },
    icon: "fluent-color:calendar-people-20",
    text: $t('page.personal.title'),
  },
]);

const avatar = computed(() => {
  return userStore.userInfo?.avatar ?? preferences.app.defaultAvatar;
});

async function handleLogout() {
  await authStore.logout(false);
  message.success($t('system.N00617') + '!');
}

function handleNoticeClear() {
  state.newsList = [];
}

async function handleMakeAll() {
  const messageIds = state.newsList.map((item) => item.id);
  await requestClient.put(apiPrefix + 'batch_update/', {keys: messageIds})
  state.newsList = [];
  messageCenter.unread = 0
}

watch(
  () => preferences.app.watermark,
  async (enable) => {
    if (enable) {
      await updateWatermark({
        content: `${userStore.userInfo?.username}`,
      });
    } else {
      destroyWatermark();
    }
  },
  {
    immediate: true,
  },
);
//跳转到消息中心
const viewAllClick = async () => {
  await router.push('/messageCenter')
}
</script>

<template>
  <BasicLayout :logo-url="webLogo" :web-title="webTitle"
               @clear-preferences-and-logout="handleLogout">
    <template #user-dropdown>
      <UserDropdown
        :avatar
        :description="userStore.userInfo?.email"
        :menus
        :text="userStore.userInfo?.username"
        tag-text="Pro"
        @logout="handleLogout"
      />
    </template>
    <template #notification>
      <Notification
        :dot="showDot"
        :notifications="state.newsList"
        @clear="handleNoticeClear"
        @make-all="handleMakeAll"
        @viewAll="viewAllClick"
        @click="handleClick"
      />
    </template>
    <template #extra>
      <AuthenticationLoginExpiredModal
        v-model:open="accessStore.loginExpired"
        :avatar
      >
        <LoginForm/>
      </AuthenticationLoginExpiredModal>
    </template>
    <template #lock-screen>
      <LockScreen :avatar @to-login="handleLogout"/>
    </template>
  </BasicLayout>
</template>
