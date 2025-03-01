<script setup lang="ts">
import { onMounted, ref } from "vue";
import { RoleDrawerStores } from "../stores/RoleDrawerStores";
import { RoleMenuTreeStores } from "../stores/RoleMenuTreeStores";
import { RoleMenuBtnStores } from "../stores/RoleMenuBtnStores";
import { RoleMenuFieldStores } from "../stores/RoleMenuFieldStores";
import { RoleMenuFieldHeaderStores } from "../stores/RoleMenuFieldStores";
import { getRoleMenu, getRoleMenuBtnField, setRoleMenu } from "./api";
import { message, type TreeProps, TreeSelect } from "ant-design-vue";
import XEUtils from "xe-utils";
import { $t } from "#/locales";
import type { RoleMenuTreeType } from "../types";

const RoleDrawer = RoleDrawerStores(); // 角色-抽屉
const RoleMenuTree = RoleMenuTreeStores(); // 角色-菜单
const RoleMenuBtn = RoleMenuBtnStores(); // 角色-菜单-按钮
const RoleMenuField = RoleMenuFieldStores(); // 角色-菜单-列字段
const RoleMenuFieldHeader = RoleMenuFieldHeaderStores();// 角色-菜单-列字段
const menuData = ref<RoleMenuTreeType[]>([]); // 菜单列表数据

/**
 * 树配置
 */
const fieldNames: TreeProps["fieldNames"] = {
  children: "children",
  title: "name"
};
const showLeafIcon = ref(false);
const expandedKeys = ref<any>([]);
const checkedKeys = ref<any>([]);// 默认选中的菜单列表


/**
 * 菜单复选框选中
 * @param _checkedKeys
 * @param e
 */
const handleMenuChange = (_checkedKeys: any, { checked, node }: { checked: any, node: any }) => {
  setRoleMenu({ roleId: RoleDrawer.roleId, menuId: node.id, isCheck: checked }).then((res: any) => {
    message.success(res.msg);
  });
};
/**
 * 菜单点击事件
 */
const handleMenuClick = async (_selectedKeys: any, info: any) => {
  const selectNode = info?.node?.dataRef;
  if (!selectNode.is_catalog) {
    RoleMenuTree.setRoleMenuTree(selectNode); // 更新当前选中的菜单
    // 获取当前菜单的按钮列表
    const { data } = await getRoleMenuBtnField({
      roleId: RoleDrawer.roleId,
      menuId: selectNode.id
    });
    RoleMenuBtn.setState(data.menu_btn); // 更新按钮列表
    RoleMenuField.setState(data.menu_field); // 更新列字段列表
  } else {
    RoleMenuBtn.setState([]); // 更新按钮列表
    RoleMenuField.setState([]); // 更新列字段列表
  }
  RoleMenuFieldHeader.$reset();
};

// 页面打开后获取列表数据
onMounted(async () => {
  const data = await getRoleMenu({ roleId: RoleDrawer.roleId });
  menuData.value = XEUtils.mapTree(data, (item) => {
    if (item.parent !== null) {
      item.parent = { id: item.parent };
    }
    if (item.name !== null) {
      item.name = $t(item.name);
    }
    // 返回修改后的 item
    return {
      ...item,
      key: item.id
    };
  }, { children: "children" });
  checkedKeys.value = XEUtils.toTreeArray(menuData.value)
    .filter((i) => i.isCheck)
    .map((i) => i.id);
  expandedKeys.value = XEUtils.toTreeArray(menuData.value)
    .filter((i) => i.isCheck).filter((i) => !i.parent)
    .map((i) => i.id);
});
</script>

<template>
  <a-tree
    blockNode
    checkStrictly
    ref="treeRef"
    :show-line="{showLeafIcon}"
    :tree-data="menuData"
    v-model:checked-keys="checkedKeys"
    v-model:expanded-keys="expandedKeys"
    @select="handleMenuClick"
    :field-names="fieldNames"
    checkable
    @check="handleMenuChange"
  >
    <template #title="{dataRef }">
              <span class="tree-title" :class="{'hovered': dataRef.selected}">
                    {{ dataRef.name }}
              </span>
    </template>
  </a-tree>
</template>

<style scoped lang="scss">
.tree-title {
  display: inline-block;
  padding: 2px 4px;
  cursor: pointer;
  border-radius: 4px; /* 圆角效果 */
  transition: background-color 0.3s ease, box-shadow 0.3s ease; /* 平滑过渡效果 */
}

.tree-title:hover {
  background-color: rgba(0, 0, 0, 0.05); /* 悬停时的背景颜色 */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* 悬停时的阴影效果 */
}

.tree-title.hovered {
  background-color: #7cb305; /* 选中的节点背景颜色 */
  color: white; /* 选中时文字变白 */
  font-weight: bold; /* 选中时加粗字体 */
}

.tree-title:focus {
  outline: none; /* 去除默认焦点边框 */
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.5); /* 焦点时添加蓝色边框 */
}

.tree-title:active {
  background-color: #6b9c05; /* 点击时的背景颜色 */
}
</style>
