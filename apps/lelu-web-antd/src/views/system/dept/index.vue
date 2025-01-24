<template>
  <fs-page>
    <a-row>
      <a-col xs="24" :sm="9" :md="7" :lg="5" :xl="6">
        <a-card hoverable :body-style="{height:'89vh'}" style="margin-right: 5px">
          <DeptTreeCom
            ref="deptTreeRef"
            :treeData="deptTreeData"
            @treeClick="handleTreeClick"
            @updateDept="handleUpdateMenu"
            @deleteDept="handleDeleteMenu"
          />
        </a-card>
      </a-col>

      <a-col xs="24" :sm="15" :md="17" :lg="19" :xl="18">
        <a-card hoverable :body-style="{height:'89vh'}">
          <DeptUserCom ref="deptUserRef"/>
        </a-card>
      </a-col>
    </a-row>

    <a-drawer v-model:open="drawerVisible" :title="$t('system.N00533')" direction="rtl"
              :width="'30%'"
              :close-on-click-modal="false" :before-close="handleDrawerClose">
      <DeptFormCom
        v-if="drawerVisible"
        :initFormData="drawerFormData"
        :treeData="deptTreeData"
        :cacheData="deptTreeCacheData"
        @drawerClose="handleDrawerClose"
      />
    </a-drawer>
  </fs-page>
</template>

<script lang="ts" setup name="dept">
import {$t} from '#/locales'
import {defineAsyncComponent, h, onMounted, ref} from 'vue';
import XEUtils from 'xe-utils';
import {Modal, notification, Tag} from 'ant-design-vue';
import {DelObj, GetList} from './api';
import type {APIResponseData, TreeItemType} from './types';

const DeptTreeCom = defineAsyncComponent(() => import('./components/DeptTreeCom/index.vue'));
const DeptFormCom = defineAsyncComponent(() => import('./components/DeptFormCom/index.vue'));
const DeptUserCom = defineAsyncComponent(() => import('./components/DeptUserCom/index.vue'));

let deptTreeData = ref<any[]>([]);
let deptTreeCacheData = ref<TreeItemType[]>([]);
let drawerVisible = ref(false);
let drawerFormData = ref<Partial<TreeItemType>>({});
let deptUserRef = ref<InstanceType<typeof DeptUserCom> | null>(null);
let deptTreeRef = ref<InstanceType<typeof DeptTreeCom> | null>(null);

const getData = async () => {
  let res: APIResponseData = await GetList({});
  if (res?.code === 2000 && Array.isArray(res.data)) {
    const result = XEUtils.toArrayTree(
      res.data.map((item: any) => ({
        ...item,
        identity: item.key,
        title: $t(item.name), // 重命名 name 为 title
        key: item.id,     // 重命名 id 为 key
        children: item.children || [],// 保留子节点
        isLeaf: !item.hasChild,
        value: item.id, //a-tree-select的数据结构
        parentId: item.parent, //防止对象错误
        parent: item.parent ? {id: item.parent} : null,
      })), {
        parentKey: 'parentId',
        children: 'children',
        //strict: true,
      });
    deptTreeData.value = result;
  }
};

/**
 * 部门的点击事件
 */
const handleTreeClick = (record: TreeItemType) => {
  deptUserRef.value?.handleDoRefreshUser(record.id as string);
};

/**
 * 部门的删除事件
 */
const handleDeleteMenu = (info: any, callback: Function) => {
  Modal.confirm({
    title: $t('system.N00328'),
    content: h('div', {}, [
      $t('N00200') + ' ',
      h(Tag, {color: "#3b5999"}, {default: () => info.name}),
      $t('system.N00420') + '?',
    ]),
    okText: $t('system.N00367'),
    okType: 'danger',
    cancelText: $t('system.N00091'),
    onOk: async () => {
      const res: APIResponseData = await DelObj(info.id);
      callback();
      if (res?.code === 2000) {
        notification.success({message: res.msg as string, placement: 'top'});
        await getData();
        deptUserRef.value?.handleDoRefreshUser('');
      }
    },
    onCancel: () => {
      // 取消逻辑
    }
  });
};

/**
 * 部门的 新增 or 编辑 事件
 */
const handleUpdateMenu = (type: string, record?: TreeItemType) => {
  if (type === 'update' && record) {
    drawerFormData.value = record;
  } else {
    drawerFormData.value = {};
  }
  drawerVisible.value = true;
};
const handleDrawerClose = (type?: string) => {
  if (type === 'submit') {
    getData();
  }
  drawerVisible.value = false;
  drawerFormData.value = {};
};

onMounted(() => {
  getData();
});
</script>

<style lang="scss" scoped>

</style>
