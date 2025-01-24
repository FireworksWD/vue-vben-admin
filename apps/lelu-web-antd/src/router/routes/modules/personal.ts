import type {RouteRecordRaw} from 'vue-router';

import {$t} from '#/locales';
import {BasicLayout} from "#/layouts";

const routes: RouteRecordRaw[] = [
  {
    component: BasicLayout,
    meta: {
      icon: 'lucide:layout-dashboard',
      order: -1,
      title: $t('page.personal.title'),
      hideInMenu: true,
    },
    name: 'Personal-Admin',
    path: '/personal',
    children: [
      {
        component: () => import('#/views/system/personal/index.vue'),
        meta: {
          icon: "fluent-color:calendar-people-20",
          order: -1,
          title: $t('page.personal.title'),
          hideInMenu: true,
        },
        name: 'Personal',
        path: '/personal/info',
      },
    ],
  },
];

export default routes;
