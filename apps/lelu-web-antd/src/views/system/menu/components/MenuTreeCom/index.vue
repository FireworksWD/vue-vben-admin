<script setup lang="ts">
import {ref, watch} from 'vue';
import {Icon} from '@iconify/vue';
import {QuestionOutlined} from '@ant-design/icons-vue'
import {notification, Tree, message} from "ant-design-vue";
import {lazyLoadMenu, menuMoveUp, menuMoveDown} from '../../api';
import type {MenuTreeItemType} from '../../types';
import type {TreeProps} from 'ant-design-vue';
import {$t} from '#/locales'


const showLeafIcon = ref(false);

interface IProps {
  treeData: TreeProps['treeData'];
}

const props = withDefaults(defineProps<IProps>(), {
  treeData: () => [],
});
const treeRef = ref<InstanceType<typeof Tree>>();
const emit = defineEmits(['treeClick', 'deleteDept', 'updateDept']);

let sortDisable = ref(false);
let treeSelectMenu = ref<Partial<MenuTreeItemType>>({});
//@ts-ignore
let treeSelectNode = ref<TreeProps['treeData'][number] | null>(null);

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
watch(() => props.treeData, (newData) => {
  generateList(newData);
}, {immediate: true, deep: true});
const expandedKeys = ref<(string | number | null | undefined)[]>([]);
const searchValue = ref<string>('');
const autoExpandParent = ref<boolean>(true);
const onExpand = (keys: string[]) => {
  expandedKeys.value = keys;
  autoExpandParent.value = false;
};

/**
 * 树的搜索事件
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
      if (node.children.some(item => item.key === key)) {
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
      return getParentKey(item.key, props.treeData);
    }
    return null;
  })
    .filter((item, i, self) => item && self.indexOf(item) === i);
  expandedKeys.value = expanded;
  searchValue.value = value;
  autoExpandParent.value = true;
});
/**
 * 树的懒加载
 */
const handleTreeLoad: TreeProps['loadData'] = (treeNode) => {
  return new Promise<void>((resolve) => {
    if (treeNode?.dataRef?.children) {
      resolve();
      return;
    }
    lazyLoadMenu({parent: treeNode?.dataRef?.id}).then((res) => {
      const resp = res.data.map((item: any) => ({
        ...item,
        title: $t(item.name), // 重命名 name 为 title
        key: item.id,     // 重命名 id 为 key
        children: item.children || [], // 保留子节点
        isLeaf: !item.hasChildren,
        parent: treeNode.dataRef,
        value: item.id
      }))
      if (treeNode.dataRef) {
        treeNode.dataRef.children = resp
      } else {
        treeNode.children = resp;
      }
      resolve();
    })
  })
};


/**
 * 树的点击事件
 */
const handleNodeClick: TreeProps['onSelect'] = (_selectedKeys, info) => {
  treeSelectMenu.value = info.node.dataRef || {};
  treeSelectNode.value = info.node.dataRef || {};
  emit('treeClick', info.node.dataRef);
};
/**
 * 点击左侧编辑按钮
 */
const handleUpdateMenu = (type: string) => {
  if (type === 'update') {
    if (!treeSelectMenu.value.id) {
      notification.warning({message: $t('system.N00495') + '！', placement: 'top'});
      return;
    }
    emit('updateDept', type, treeSelectMenu.value);
  } else {
    emit('updateDept', type);
  }
};

/**
 * 删除菜单
 */
const handleDeleteMenu = () => {
  if (!treeSelectMenu.value.id) {
    notification.warning({message: $t('system.N00495') + '！', placement: 'top'});
    return;
  }
  emit('deleteDept', treeSelectMenu.value, () => {
    treeSelectMenu.value = {};
  });
};
/**
 * 移动操作
 */
const handleSort = async (type: string) => {
  if (!treeSelectMenu.value.id) {
    notification.warning({message: $t('system.N00495') + '！', placement: 'top'});
    return;
  }
  if (sortDisable.value) return;
  const moveNode = (list: any[], index: number, direction: 'up' | 'down' | any) => {
    if (direction === 'up') {
      if (index === 0) {
        message.info($t('system.N00173') + '!');
        return;
      }
      const [movingNode] = list.splice(index, 1);
      list.splice(index - 1, 0, movingNode);
    } else if (direction === 'down') {
      if (index === list.length - 1) {
        message.info($t('system.N00172') + '!');
        return;
      }
      const [movingNode] = list.splice(index, 1);
      list.splice(index + 1, 0, movingNode);
    }
  };

  const parentList = treeSelectNode.value?.parent?.children || [];
  const targetList = parentList.length > 0 ? parentList : props.treeData;
  const index = targetList.findIndex((item: any) => item.id === treeSelectMenu.value?.id);

  if (index === -1) return;

  moveNode(targetList, index, type);

  // 设置排序禁用状态，调用 API，然后恢复排序启用状态
  sortDisable.value = true;
  try {
    if (type === 'up') {
      await menuMoveUp({menu_id: treeSelectMenu.value.id});
    } else if (type === 'down') {
      await menuMoveDown({menu_id: treeSelectMenu.value.id});
    }
    // await fetchTreeData();
  } catch (error) {
    console.error('排序失败:', error);
  } finally {
    sortDisable.value = false;
  }

};

defineExpose({
  treeRef,
});
</script>/

<template>
  <a-input v-model:value="searchValue" :placeholder="$t('system.N00478')">
    <template #prefix>
      <Icon icon="streamline-emojis:magnifying-glass-tilted-left"/>
    </template>
  </a-input>
  <div class="menu-tree-com">
    <div class="mtc-head">
      <Icon icon="streamline-emojis:package" style="font-size: 16px;margin-right: 6px"/>
      {{ $t('system.N00407') }}
      <a-tooltip
        color="geekblue"
        placement="rightTop"
        :title="'1.'+$t('system.N00385')+'; 2.'+$t('system.N00327')+'，'+$t('system.N00135')+'，'+$t('system.N00390')+'; 3.'+$t('system.N00326')+'，'+$t('system.N00333')+'ID'+$t('system.N00025')+';'"
      >
        <QuestionOutlined/>
      </a-tooltip>
    </div>
    <a-tree
      ref="treeRef"
      :show-line="{showLeafIcon}"
      :tree-data="treeData"
      :load-data="handleTreeLoad"
      :indent="45"
      :expanded-keys="expandedKeys"
      :auto-expand-parent="autoExpandParent"
      @expand="onExpand"
      @select="handleNodeClick"
      style="margin-top: 4px;height: 600px; overflow-y: auto;overflow-x: hidden;"
      class="a-tree"
    >
      <template #title="{ title, dataRef }">
      <span style="display: flex; align-items: center;">
        <Icon :icon="dataRef.icon"/>
        <span>&nbsp;&nbsp;</span>
        <span v-if="title.indexOf(searchValue) > -1">
          {{ title.substring(0, title.indexOf(searchValue)) }}
          <span style="color: #f50">{{ searchValue }}</span>
          {{ title.substring(title.indexOf(searchValue) + searchValue.length) }}
        </span>
        <span v-else>{{ title }}</span>
      </span>
      </template>
    </a-tree>

    <div class="mtc-tags">
      <a-tooltip :title="$t('system.N00258')">
        <a-button @click="handleUpdateMenu('create')">
          <Icon icon="fluent:add-circle-12-filled"
                class="mtc-tags-icon"
          />
        </a-button>
      </a-tooltip>

      <a-tooltip :title="$t('system.N00395')">
        <a-button @click="handleUpdateMenu('update')">
          <Icon icon="fluent:color-line-16-filled"

                class="mtc-tags-icon"
          />
        </a-button>
      </a-tooltip>

      <a-tooltip :title="$t('system.N00007')">
        <a-button @click="handleSort('up')">
          <Icon icon="fluent:arrow-circle-up-12-filled"
                class="mtc-tags-icon"
          />
        </a-button>
      </a-tooltip>

      <a-tooltip :title="$t('system.N00009')">
        <a-button @click="handleSort('down')">
          <Icon icon="fluent:arrow-circle-down-12-filled"
                class="mtc-tags-icon"
          />
        </a-button>
      </a-tooltip>

      <a-tooltip :title="$t('system.N00078')">
        <a-button @click="handleDeleteMenu">
          <Icon
            icon="fluent:delete-12-filled"
            class="mtc-tags-icon"
          />
        </a-button>
      </a-tooltip>
    </div>

  </div>
</template>
<style lang="scss" scoped>
.menu-tree-com {
  height: calc(100% - 60px);
  padding: 20px;
  box-sizing: border-box;
  overflow-y: auto;

  .mtc-head {
    display: flex;
    align-items: center;
    margin-left: -8px;
    color: #606266;
    font-weight: 600;

  }

  .mtc-tags {
    height: 40px;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 0 20px;
    display: flex;
    align-items: center;
    justify-content: space-around;
    box-sizing: border-box;

    .mtc-tags-icon {
      cursor: pointer;
      color: var(--el-color-primary);
      font-size: 20px;
      transition: color 0.3s ease;
    }

  }
}
</style>

