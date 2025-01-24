<script lang="ts" setup>
import {$t} from '#/locales'
import type {
  WorkbenchProjectItem,
  WorkbenchQuickNavItem,
  WorkbenchTodoItem,
  WorkbenchTrendItem,
} from '@vben/common-ui';

import {ref} from 'vue';

import {
  AnalysisChartCard,
  WorkbenchHeader,
  WorkbenchProject,
  WorkbenchQuickNav,
  WorkbenchTodo,
  WorkbenchTrends,
} from '@vben/common-ui';
import {preferences} from '@vben/preferences';
import {useUserStore} from '@vben/stores';

import AnalyticsVisitsSource from '../analytics/analytics-visits-source.vue';

const userStore = useUserStore();

const projectItems: WorkbenchProjectItem[] = [
  {
    color: '',
    content: $t('system.N00015') + '，' + $t('system.N00401') + '。',
    date: '2021-04-01',
    group: $t('system.N00184'),
    icon: 'carbon:logo-github',
    title: 'Github',
  },
  {
    color: '#3fb27f',
    content: $t('system.N00339') + '。',
    date: '2021-04-01',
    group: $t('system.N00382'),
    icon: 'ion:logo-vue',
    title: 'Vue',
  },
  {
    color: '#e18525',
    content: $t('system.N00315') + '。',
    date: '2021-04-01',
    group: $t('system.N00006'),
    icon: 'ion:logo-html5',
    title: 'Html5',
  },
  {
    color: '#bf0c2c',
    content: $t('system.N00331') + '。',
    date: '2021-04-01',
    group: 'UI',
    icon: 'ion:logo-angular',
    title: 'Angular',
  },
  {
    color: '#00d8ff',
    content: $t('system.N00057') + '。',
    date: '2021-04-01',
    group: $t('system.N00216'),
    icon: 'bx:bxl-react',
    title: 'React',
  },
  {
    color: '#EBD94E',
    content: $t('system.N00505') + '，' + $t('system.N00400') + '。',
    date: '2021-04-01',
    group: $t('system.N00306'),
    icon: 'ion:logo-javascript',
    title: 'Js',
  },
];

const quickNavItems: WorkbenchQuickNavItem[] = [
  {
    color: '#1fdaca',
    icon: 'ion:home-outline',
    title: $t('system.N00544'),
  },
  {
    color: '#bf0c2c',
    icon: 'ion:grid-outline',
    title: $t('system.N00034'),
  },
  {
    color: '#e18525',
    icon: 'ion:layers-outline',
    title: $t('system.N00387'),
  },
  {
    color: '#3fb27f',
    icon: 'ion:settings-outline',
    title: $t('system.N00384'),
  },
  {
    color: '#4daf1bc9',
    icon: 'ion:key-outline',
    title: $t('system.N00301'),
  },
  {
    color: '#00d8ff',
    icon: 'ion:bar-chart-outline',
    title: $t('system.N00114'),
  },
];

const todoItems = ref<WorkbenchTodoItem[]>([
  {
    completed: false,
    content: `审查最近提交到Git仓库的前端代码，确保代码质量和规范。`,
    date: '2024-07-30 11:00:00',
    title: $t('system.N00150'),
  },
  {
    completed: true,
    content: `检查并优化系统性能，降低CPU使用率。`,
    date: '2024-07-30 11:00:00',
    title: $t('system.N00383'),
  },
  {
    completed: false,
    content: `进行系统安全检查，确保没有安全漏洞或未授权的访问。 `,
    date: '2024-07-30 11:00:00',
    title: $t('system.N00148'),
  },
  {
    completed: false,
    content: `更新项目中的所有npm依赖包，确保使用最新版本。`,
    date: '2024-07-30 11:00:00',
    title: $t('system.N00289'),
  },
  {
    completed: false,
    content: `修复用户报告的页面UI显示问题，确保在不同浏览器中显示一致。 `,
    date: '2024-07-30 11:00:00',
    title: '修复UI显示问题',
  },
]);
const trendItems: WorkbenchTrendItem[] = [
  {
    avatar: 'svg:avatar-1',
    content: `在 <a>${$t('system.N00184')}}</a>${$t('system.N00074')}<a>Vue</a>`,
    date: $t('system.N00073'),
    title: $t('system.N00138'),
  },
  {
    avatar: 'svg:avatar-2',
    content: `关注了 <a>${ $t('system.N00138') }</a> `,
    date: '1'+$t('system.N00019'),
    title: $t('system.N00404'),
  },
  {
    avatar: 'svg:avatar-3',
    content: `发布了 <a>${ $t('system.N00018') }</a> `,
    date: '1'+$t('system.N00127'),
    title: $t('system.N00059'),
  },
  {
    avatar: 'svg:avatar-4',
    content: `发表文章 <a>如何编写一个Vite插件</a> `,
    date: '2'+$t('system.N00127'),
    title: 'Vben',
  },
  {
    avatar: 'svg:avatar-1',
    content: `回复了 <a>${ $t('system.N00305') }</a>${ $t('system.N00350') }<a>如何进行项目优化？</a>`,
    date: '3'+$t('system.N00127'),
    title: $t('system.N00351'),
  },
  {
    avatar: 'svg:avatar-2',
    content: `关闭了问题 <a>${ $t('system.N00133') }</a> `,
    date: '1'+$t('system.N00104'),
    title: $t('system.N00305'),
  },
  {
    avatar: 'svg:avatar-3',
    content: `发布了 <a>${ $t('system.N00018') }</a> `,
    date: '1'+$t('system.N00104'),
    title: $t('system.N00138'),
  },
  {
    avatar: 'svg:avatar-4',
    content: `推送了代码到 <a>Github</a>`,
    date: '2021-04-01 20:00',
    title: $t('system.N00138'),
  },
  {
    avatar: 'svg:avatar-4',
    content: `发表文章 <a>如何编写使用 Admin Vben</a> `,
    date: '2021-03-01 20:00',
    title: 'Vben',
  },
];
</script>

<template>
  <div class="p-5">
    <WorkbenchHeader
      :avatar="userStore.userInfo?.avatar || preferences.app.defaultAvatar"
    >
      <template #title>
        {{ $t('system.N00265') }}, {{ userStore.userInfo?.username }}, {{ $t('system.N00182') }}！
      </template>
      <template #description> {{ $t('system.N00031') }}，20℃ - 32℃！</template>
    </WorkbenchHeader>

    <div class="mt-5 flex flex-col lg:flex-row">
      <div class="mr-4 w-full lg:w-3/5">
        <WorkbenchProject :items="projectItems" :title="$t('system.N00543')"/>
        <WorkbenchTrends :items="trendItems" class="mt-5" :title="$t('system.N00291')"/>
      </div>
      <div class="w-full lg:w-2/5">
        <WorkbenchQuickNav
          :items="quickNavItems"
          class="mt-5 lg:mt-0"
          :title="$t('system.N00192')"
        />
        <WorkbenchTodo :items="todoItems" class="mt-5" :title="$t('system.N00188')"/>
        <AnalysisChartCard class="mt-5" :title="$t('system.N00417')">
          <AnalyticsVisitsSource/>
        </AnalysisChartCard>
      </div>
    </div>
  </div>
</template>
