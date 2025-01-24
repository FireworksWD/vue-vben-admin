<template>
  <fs-page>
    <a-row>
      <a-col xs="24" :sm="8" :md="6" :lg="4" :xl="5">
        <a-card hoverable :body-style="{height: '89vh'}" style="margin-right: 5px">
          <div style="display: flex; justify-content: center; align-items: center; width: 100%;">
            <span style="font-weight: bold;">{{ $t('system.N00525') }}&nbsp;&nbsp;</span>
            <a-tooltip effect="dark" :content="content" placement="right">
              <Icon icon="vscode-icons:file-type-homeassistant"/>
            </a-tooltip>
          </div>
          <a-divider style="border-color: #7cb305" dashed/>
          <a-input v-model:value="searchValue" :placeholder="placeholder">
            <template #prefix>
              <Icon icon="streamline-emojis:magnifying-glass-tilted-left"/>
            </template>
          </a-input>
          <a-divider style="margin-top: 10px;"/>
          <a-tree :tree-data="data"
                  :show-line="{showLeafIcon}"
                  :indent="38" highlight-current
                  @select="onTreeNodeClick"
                  :expanded-keys="expandedKeys"
                  :auto-expand-parent="autoExpandParent"
                  @expand="onExpand"
                  style="margin-top: -18px"
          >
            <template #title="{ title }">
    <span style="display: flex; align-items: center;">
      <Icon icon="flat-color-icons:home"/>
      <span>&nbsp;&nbsp;</span>
      <span v-if="title.indexOf(searchValue) > -1" style="color: #a9a9a9; font-weight: bold;">
        {{ title.substring(0, title.indexOf(searchValue)) }}
        <span style="color: #f50">{{ searchValue }}</span>
        {{ title.substring(title.indexOf(searchValue) + searchValue.length) }}
      </span>
      <span v-else style="color: #a9a9a9; font-weight: bold;">{{ title }}</span>
    </span>
            </template>
          </a-tree>
        </a-card>
      </a-col>
      <a-col xs="24" :sm="16" :md="18" :lg="20" :xl="19">
        <a-card hoverable :body-style="{height: '89vh'}">
          <fs-crud ref="crudRef" v-bind="crudBinding">
            <template #actionbar-right>
              <importExcel api="api/system/user/" v-if="hasAccessByCodes(['user:Import'])">
                {{ $t('system.N00160') }}
              </importExcel>
            </template>
            <template #pagination-left>
              <a-tooltip :title="$t('system.N00211')">
                <fs-button
                  :disabled="selectedRowsCount === 0"
                  icon="mingcute:delete-2-fill"
                  @click="handleBatchDelete"
                  style="color:#e76c40"
                />
              </a-tooltip>
            </template>
          </fs-crud>
        </a-card>
      </a-col>
    </a-row>

  </fs-page>
</template>

<script lang="ts" setup name="user">
import {$t} from '#/locales'
import {Icon} from '@iconify/vue'
import {FsButton, useFs} from '@fast-crud/fast-crud';
import {createCrudOptions} from './crud';
import * as api from './api';
import type {TreeProps} from 'ant-design-vue';
import {Modal, notification} from 'ant-design-vue'
import {computed, createVNode, defineAsyncComponent, onMounted, ref, watch} from 'vue';
import XEUtils from 'xe-utils';
import {useAccess} from '@vben/access';

const {hasAccessByCodes} = useAccess();

const importExcel = defineAsyncComponent(() => import('#/components/importExcel/index.vue'));
const showLeafIcon = ref(false);

// 引入组件
const placeholder = ref($t('system.N00487'));

let data = ref<TreeProps['treeData']>([]);


const dataList: TreeProps['treeData'] = [];
const generateList = (data: TreeProps['treeData'] = []) => {
  for (let i = 0; i < data.length; i++) {
    const node = data[i];
    const key = node?.key;
    if (key) {
      dataList.push({key, title: node?.title});
    }
    if (node?.children) {
      generateList(node.children);
    }
  }
};
// 监听 props.treeData 的变化
watch(() => data.value, (newData) => {
  generateList(newData);
}, {immediate: true, deep: true});
const expandedKeys = ref<(string | number | null | undefined)[]>([]);
const searchValue = ref<string>('');
const autoExpandParent = ref<boolean>(true);
const onExpand = (keys: string[]) => {
  expandedKeys.value = keys;
  autoExpandParent.value = false;
};
const {crudRef, crudBinding, crudExpose, selectedRows} = useFs({createCrudOptions});
/**
 *选中行的条数
 */
const selectedRowsCount = computed(() => {
  return selectedRows.value.length;
});

/**
 * 批量删除
 */
const handleBatchDelete = async () => {
  Modal.confirm({
    title: $t('system.N00328'),
    type: "warning",
    content: createVNode('div', {style: ''}, [
      $t('system.N00365'),
      ' ',
      createVNode('span', {style: 'color:red;'}, selectedRows.value?.length),
      ' ',
      $t('system.N00304')
    ]),
    onOk: async () => {
      await api.BatchDelete(selectedRows.value);
      notification.success({message: $t('system.N00080'), placement: 'top'});
      selectedRows.value = [];
      await crudExpose.doRefresh();
    },
    onCancel() {
    },
    class: 'test',
  });
};
/**
 * 部门树的搜索事件
 */
const getParentKey = (
  key: string | number,
  tree: TreeProps['treeData'] = [],
): string | number | undefined => {
  let parentKey;
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    // 确保 node 不为 undefined 且有 children
    if (node && node.children) {
      if (node.children.some((item: any) => item.key === key)) {
        parentKey = node.key;
      } else {
        // 递归调用，确保传入的是 node.children
        const foundKey = getParentKey(key, node.children);
        if (foundKey) {
          parentKey = foundKey;
        }
      }
    }
  }
  return parentKey;
};
watch(searchValue, value => {
  //@ts-ignore
  const expanded = dataList.map((item: TreeProps['treeData'][number]) => {
    if (item.title.indexOf(value) > -1) {
      return getParentKey(item.key, data.value);
    }
    return null;
  })
    .filter((item, i, self) => item && self.indexOf(item) === i);
  expandedKeys.value = expanded;
  searchValue.value = value;
  autoExpandParent.value = true;
});


const content = `
1.${$t('system.N00524')};
`;

const getData = () => {
  api.GetDept({}).then((ret: any) => {
    const responseData = ret.data.map((item: any) => ({
      id: item.id,
      title: $t(item.name), // 重命名 name 为 title
      key: item.id,     // 重命名 id 为 key
      children: item.children || [],// 保留子节点
      isLeaf: item.hasChildren,
      parentId: item.parent,
      parent: item.parent ? {id: item.parent} : null,
    }))

    data.value = XEUtils.toArrayTree(responseData, {
      parentKey: 'parentId',
      children: 'children',
      strict: true,
    });
  });
};

//树形点击事件
const onTreeNodeClick: TreeProps['onSelect'] = async (_selectedKeys, info) => {
  const id = info.node?.dataRef?.id;
  await crudExpose.doSearch({form: {dept: id}});
};

// 页面打开后获取列表数据
onMounted(() => {
  getData();
  crudExpose.doRefresh();
});

// 页面打开后获取列表数据
// onMounted(async () => {
//   await useFsAsync({crudRef, crudBinding, crudExpose, createCrudOptions});
//   await crudExpose.doRefresh();
// });

</script>

<style lang="scss" scoped>
</style>
