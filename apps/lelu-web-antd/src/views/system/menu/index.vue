<script lang="ts" setup>
import {onMounted, ref, defineAsyncComponent, createVNode, h} from 'vue';
import XEUtils from 'xe-utils';
import {Modal, notification, Tag} from 'ant-design-vue';
import {DelObj, GetList} from './api';
import type {MenuTreeItemType} from './types';
import {ExclamationCircleOutlined} from '@ant-design/icons-vue';
import {$t} from '#/locales'

const MenuTreeCom = defineAsyncComponent(() => import('./components/MenuTreeCom/index.vue'));
const MenuButtonCom = defineAsyncComponent(() => import('./components/MenuButtonCom/index.vue'));
const MenuFormCom = defineAsyncComponent(() => import('./components/MenuFormCom/index.vue'));
const MenuFieldCom = defineAsyncComponent(() => import('./components/MenuFieldCom/index.vue'));

let menuTreeData = ref<any[]>([]);
let drawerVisible = ref(false);
let drawerFormData = ref<Partial<MenuTreeItemType>>({});
let menuTreeRef = ref<InstanceType<typeof MenuTreeCom> | null>(null);
let menuButtonRef = ref<InstanceType<typeof MenuButtonCom> | null>(null);
let menuFieldRef = ref<InstanceType<typeof MenuFieldCom> | null>(null);


const getData = () => {
  GetList({}).then((resp) => {
    const result = XEUtils.toArrayTree(
      resp.data.map((item: any) => ({
        ...item,
        title: $t(item.name), // 重命名 name 为 title
        key: item.id,     // 重命名 id 为 key
        children: item.children || [],// 保留子节点
        isLeaf: !item.hasChild,
        value: item.id, //a-tree-select的数据结构
      })), {
        parentKey: 'parent',
        children: 'children',
        strict: true,
      });
    menuTreeData.value = result;
  });
};
/**
 * 菜单的点击事件
 */
const handleTreeClick = (record: MenuTreeItemType) => {
  menuButtonRef.value?.handleRefreshTable(record);
  menuFieldRef.value?.handleRefreshTable(record)
};

/**
 * 部门的 新增 or 编辑 事件
 */
const handleUpdateMenu = (type: string, record?: MenuTreeItemType) => {
  if (type === 'update' && record) {
    drawerFormData.value = record;
  } else {
    drawerFormData.value = {};
  }
  drawerVisible.value = true;
};
// 定义一个 key，用于强制刷新
const menuTreeKey = ref(1);
const handleDrawerClose = (type?: string) => {
  if (type === 'submit') {
    getData();
    // 刷新组件
    menuTreeKey.value = menuTreeKey.value === 1 ? 0 : 1;
  }
  drawerVisible.value = false;
  drawerFormData.value = {};
};

/**
 * 部门的删除事件
 */
const handleDeleteMenu = (info: any, callback: Function) => {
  Modal.confirm({
    title: $t('system.N00328'),
    content: h('div', {}, [
      $t('system.N00200') + ' ',
      h(Tag, {color: "#3b5999"}, {default: () => info.name}),
      $t('system.N00419') + '?',
    ]),
    okText: $t('system.N00367'),
    cancelText: $t('system.N00091'),
    okType: 'danger',
    icon: createVNode(ExclamationCircleOutlined),
    onOk: async () => {
      await DelObj(info.id);
      notification.success({message: $t('system.N00080'), placement: 'top'});
      getData();
      callback();
    },
  });
};

onMounted(() => {
  getData();
});
const tabList = [
  {
    key: 'btnPermConf',
    tab: $t('system.N00222'),
  },
  {
    key: 'colPermConf',
    tab: $t('system.N00070'),
  },
];

const key = ref('btnPermConf');

const onTabChange = (value: string) => {
  key.value = value;
};
</script>

<template>
  <fs-page>
    <a-row>
      <a-col xs="24" :sm="9" :md="7" :lg="5" :xl="6">
        <a-card hoverable :body-style="{height:'89vh'}" style="margin-right: 5px">
          <MenuTreeCom
            :key="menuTreeKey"
            ref="menuTreeRef"
            :treeData="menuTreeData"
            @treeClick="handleTreeClick"
            @updateDept="handleUpdateMenu"
            @deleteDept="handleDeleteMenu"
          />
        </a-card>
      </a-col>

      <a-col xs="24" :sm="15" :md="17" :lg="19" :xl="18">
        <a-card hoverable style="margin-right: 5px"
                :tab-list="tabList"
                :active-tab-key="key"
                @tabChange="(key:any) => onTabChange(key)"
        >
          <p v-show="key === 'btnPermConf'" style="height: 77vh">
            <MenuButtonCom ref="menuButtonRef"/>
          </p>
          <p v-show="key === 'colPermConf'" style="height: 77vh">
            <MenuFieldCom ref="menuFieldRef"/>
          </p>
        </a-card>
      </a-col>
    </a-row>
    <a-drawer
      :maskClosable="false"
      v-model:open="drawerVisible"
      :title="$t('system.N00410')" direction="rtl"
      :close-on-click-modal="false"
      :before-close="handleDrawerClose"
      :footer="null"
      :width="'50%'"
    >
      <MenuFormCom
        v-if="drawerVisible"
        :initFormData="drawerFormData"
        :treeData="menuTreeData"
        @drawerClose="handleDrawerClose"
      />
    </a-drawer>
  </fs-page>
</template>
<style lang="scss" scoped>
</style>
