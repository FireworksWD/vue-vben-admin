<template>
  <a-input v-model:value="searchValue" :placeholder="$t('system.N00487')">
    <template #prefix>
      <Icon icon="streamline-emojis:magnifying-glass-tilted-left"/>
    </template>
  </a-input>
  <div class="dept-tree-com">
    <div class="tc-head">
      <Icon icon="icon-park:home"/>
      <span class="tc-head-txt">{{ $t('system.N00528') }}</span>
      <Icon icon="pepicons-pencil:eye-circle-off"
            @click="() => (showTotalNum = !showTotalNum)"
            v-if="!showTotalNum"
      />
      <Icon icon="emojione:eye-in-speech-bubble"
            @click="() => (showTotalNum = !showTotalNum)"
            v-if="showTotalNum"
      />
    </div>
    <a-divider style="border-color: #7cb305;margin-top: 10px;margin-left: -5px" dashed/>
    <a-tree
      ref="treeRef"
      :show-line="{showLeafIcon}"
      :tree-data="props.treeData"
      :load-data="handleLoadNode"
      :indent="38"
      @select="handleNodeClick"
      :expanded-keys="expandedKeys"
      :auto-expand-parent="autoExpandParent"
      @expand="onExpand"
      highlight-current
      style="margin-top: -20px; height: 600px; overflow-y: auto; overflow-x: hidden;margin-left: -10px"
    >
      <template #title="{ title, dataRef }">
    <span style="display: flex; align-items: center; justify-content: space-between;">
      <!-- 图标部分 -->
      <span style="display: flex; align-items: center;">
        <Icon icon="flat-color-icons:home"/>
        <span>&nbsp;&nbsp;</span>
        <!-- 标题部分 -->
        <span v-if="title.indexOf(searchValue) > -1" style="color: #a9a9a9; font-weight: bold;">
          {{ title.substring(0, title.indexOf(searchValue)) }}
          <span style="color: #f50">{{ searchValue }}</span>
          {{ title.substring(title.indexOf(searchValue) + searchValue.length) }}
        </span>
        <span v-else style="color: #a9a9a9; font-weight: bold;">{{ title }}</span>
      </span>
      <!-- 数量部分 -->
      <span v-show="showTotalNum" style="margin-left: auto; white-space: nowrap;font-size: 10px">
        （{{ dataRef.dept_user_count }} {{ $t('system.N00029') }}）
      </span>
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
        <a-button @click="handleDeleteDept">
          <Icon
            icon="fluent:delete-12-filled"
            class="mtc-tags-icon"
          />
        </a-button>
      </a-tooltip>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {$t} from '#/locales'
import {ref, watch} from 'vue';
import {lazyLoadDept, deptMoveUp, deptMoveDown} from '../../api';
import {message, notification} from 'ant-design-vue';
import type {TreeProps} from 'ant-design-vue';
import {Icon} from "@iconify/vue";
import XEUtils from 'xe-utils';

interface IProps {
  treeData: TreeProps['treeData'];
}


const props = withDefaults(defineProps<IProps>(), {
  treeData: () => [],
});
const emit = defineEmits(['treeClick', 'deleteDept', 'updateDept']);
const showLeafIcon = ref(false);

let showTotalNum = ref(false);
let sortDisable = ref(false);
let treeSelectDept = ref<any>({});
//@ts-ignore
let treeSelectNode = ref<TreeProps['treeData'][number] | null>(null);
const treeRef = ref();


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
 * 部门树的懒加载
 */
const handleLoadNode: TreeProps['loadData'] = (treeNode) => {
  return new Promise<void>((resolve) => {
    if (treeNode?.dataRef?.children) {
      resolve();
      return;
    }
    lazyLoadDept({parent: treeNode?.dataRef?.id}).then((res) => {
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
 * 部门的点击事件
 */
const handleNodeClick: TreeProps['onSelect'] = (_selectedKeys, info) => {
  treeSelectDept.value = info.node.dataRef || {};
  treeSelectNode.value = info.node.dataRef || {};
  emit('treeClick', info.node.dataRef);
};
/**
 * 新增 or 编辑 操作
 */
const handleUpdateMenu = (type: string) => {
  if (type === 'update') {
    if (!treeSelectDept.value.id) {
      notification.warning({message: $t('system.N00495') + '！', placement: 'top'});
      return;
    }
    emit('updateDept', type, treeSelectDept.value);
  } else {
    emit('updateDept', type);
  }
};

/**
 * 删除部门
 */
const handleDeleteDept = () => {
  if (!treeSelectDept.value.id) {
    notification.warning({message: $t('system.N00495') + '！', placement: 'top'});
    return;
  }
  emit('deleteDept', treeSelectDept.value, () => {
    treeSelectDept.value = {};
  });
};

/**
 * 部门上下移动操作
 */
const handleSort = async (type: string) => {
  if (!treeSelectDept.value.id) {
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

  // 获取当前选中节点的父节点
  const parentNode = XEUtils.find(props.treeData, node => node.id === treeSelectDept.value.parentId);
  const parentList = parentNode?.children || [];
  const targetList = parentList.length > 0 ? parentList : props.treeData;
  const index = targetList.findIndex((item: any) => item.id === treeSelectDept.value?.id);

  if (index === -1) return;

  moveNode(targetList, index, type);
  // 设置排序禁用状态，调用 API，然后恢复排序启用状态
  sortDisable.value = true;
  try {
    if (type === 'up') {
      await deptMoveUp({dept_id: treeSelectDept.value.id});
    } else if (type === 'down') {
      await deptMoveDown({dept_id: treeSelectDept.value.id});
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
</script>

<style lang="scss" scoped>
.tc-head {
  display: flex;
  align-items: center;
  margin-left: -8px;
  color: #606266;
  font-weight: 600;

  .tc-head-txt {
    margin: 0 6px;
  }

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
</style>

<style lang="scss">
.dept-tree-com {
  height: calc(100% - 60px);
  padding: 20px;
  box-sizing: border-box;
  overflow-y: auto;
  margin-left: -12px;
}
</style>
