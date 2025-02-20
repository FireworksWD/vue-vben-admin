<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { RoleDrawerStores } from "../stores/RoleDrawerStores";
import { RoleMenuBtnStores } from "../stores/RoleMenuBtnStores";
import { RoleMenuTreeStores } from "../stores/RoleMenuTreeStores";
import type { RoleMenuBtnType } from "../types";
import { getRoleToDeptAll, setRoleMenuBtn, setRoleMenuBtnDataRange } from "./api";
import XEUtils from "xe-utils";
import { message, TreeSelect } from "ant-design-vue";
import { Icon } from "@iconify/vue";
import { $t } from "@vben/locales";

const RoleDrawer = RoleDrawerStores(); // 角色-菜单
const RoleMenuTree = RoleMenuTreeStores(); // 角色-菜单
const RoleMenuBtn = RoleMenuBtnStores(); // 角色-菜单-按钮
const dialogVisible = ref(false);
// 选中的按钮
const selectBtn = ref<RoleMenuBtnType>({
  id: 0,
  menu_btn_pre_id: 0,
  /** 是否选中 */
  isCheck: false,
  /** 按钮名称 */
  name: "",
  /** 数据权限范围 */
  data_range: 0,
  dept: []
});


/**
 * 树配置
 */
const SHOW_ALL = TreeSelect.SHOW_ALL;
const treeLine = ref(true);
const showLeafIcon = ref(false);

/**
 * 数据权限范围
 */
const dataPermissionRange = ref([
  { label: "仅本人数据权限", value: 0 },
  { label: "本部门及以下数据权限", value: 1 },
  { label: "本部门数据权限", value: 2 },
  { label: "全部数据权限", value: 3 },
  { label: "自定数据权限", value: 4 }
]);
/**
 * 自定义数据权限的部门树配置
 */
const defaultTreeProps = {
  children: "children",
  label: "name",
  value: "id"
};

/**
 * 自定数据权限下拉选择事件
 */
const handlePermissionRangeChange = async (val: number) => {
  if (val < 4) {
    selectBtn.value.dept = [];
  }
};
/**
 * 格式化按钮数据范围
 */
const formatDataRange = computed(() => {
  return function(datarange: number) {
    const datarangeitem = XEUtils.find(dataPermissionRange.value, (item: any) => {
      if (item.value === datarange) {
        return item.label;
      }
    });
    return datarangeitem.label;
  };
});
/**
 * 勾选按钮
 */
const handleCheckChange = async (btn: RoleMenuBtnType) => {
  const put_data = {
    isCheck: btn.isCheck,
    roleId: RoleDrawer.roleId,
    menuId: RoleMenuTree.id,
    btnId: btn.id
  };
  const { data, msg } = await setRoleMenuBtn(put_data);
  RoleMenuBtn.updateState(data);
  message.success(msg);
};

/**
 * 按钮-数据范围确定
 */
const handleDialogConfirm = async () => {
  selectBtn.value.dept = selectBtn.value?.dept.map((item: any) => item?.value);
  const { data, msg } = await setRoleMenuBtnDataRange(selectBtn.value);
  selectBtn.value = data;
  dialogVisible.value = false;
  message.success(msg);
};
/**
 * 数据范围关闭
 */
const handleDialogClose = () => {
  dialogVisible.value = false;
};

/**
 * 齿轮点击
 */
const handleSettingClick = async (btn: RoleMenuBtnType) => {
  selectBtn.value = btn;
  dialogVisible.value = true;
};

/**
 * 部门数据
 *
 */
const deptData = ref<number[]>([]);
// 页面打开后获取列表数据
onMounted(async () => {
  const colors = ["blue", "cyan", "green", "orange", "pink", "purple"];
  const res = await getRoleToDeptAll({ role: RoleDrawer.roleId, menu_button: selectBtn.value.id });
  deptData.value = XEUtils.toArrayTree(
    res.data.map((item: any) => ({
      ...item,
      key: item.id,
      value: item.id,
      label: $t(item.name),
      color: colors[Math.floor(Math.random() * colors.length)],
      parentId: item.parent, //防止对象错误
      parent: item.parent ? { id: item.parent } : null
    })), { parentKey: "parentId", strict: false });
});
</script>

<template>
  <div class="pccm-item" v-if="RoleMenuBtn.$state.length > 0">
    <div class="menu-form-alert">配置操作功能接口权限，配置数据权限点击小齿轮</div>
    <div class="checkbox-container">
      <a-checkbox
        v-for="btn in RoleMenuBtn.$state"
        :key="btn.id"
        v-model:checked="btn.isCheck"
        @change="handleCheckChange(btn)"
      >
        <div class="btn-item">
          {{ btn.data_range !== null ? `${btn.name}(${formatDataRange(btn.data_range)})` : btn.name
          }}
          <span v-show="btn.isCheck" @click.stop.prevent="handleSettingClick(btn)">
          <Icon icon="icon-park:database-setting" style="font-size: 24px;" />
        </span>
        </div>
      </a-checkbox>
    </div>
  </div>
  <a-modal v-model:open="dialogVisible" :title="$t('system.N00247')"
           :close-on-click-modal="false"
           :before-close="handleDialogClose"
           :width="'35%'"
           :body-style="{height:'25vh'}"
           style="top: 30%">
    <div class="pc-dialog">
      <a-select v-model:value="selectBtn.data_range"
                @change="handlePermissionRangeChange"
                :placeholder="$t('system.N00488')" style="width: 100%"
                :options="dataPermissionRange"
                :field-names="{label:'label',value:'value'}"
      />

      <a-tree-select
        node-key="id"
        v-model:value="selectBtn.dept"
        :tree-line="treeLine && { showLeafIcon }"
        show-search
        style="width: 100%;margin-top: 20px"
        v-show="selectBtn.data_range === 4"
        placeholder="Please select"
        allow-clear
        treeCheckable
        treeCheckStrictly
        :show-checked-strategy="SHOW_ALL"
        :tree-data="deptData"
        tree-node-filter-prop="label"
      >
        <template #tagRender="{ label, closable, onClose, option }">
          <a-tag :closable="closable" :color="option.color" style="margin-right: 3px"
                 @close="onClose">
            {{ label }}&nbsp;&nbsp;
          </a-tag>
        </template>
        <template #title="{ value: val, label }">
          <b v-if="val === 'parent 1-1'" style="color: #08c">{{ val }}</b>
          <template v-else>{{ label }}</template>
        </template>
        <template #suffixIcon>
          <Icon icon="material-symbols:gesture-select-sharp" />
        </template>

      </a-tree-select>
    </div>

    <template #footer>
      <div>
        <a-button type="primary" @click="handleDialogConfirm">{{ $t("system.N00362") }}</a-button>
        <a-button @click="handleDialogClose" style="margin-left: 10px">{{ $t("system.N00091") }}
        </a-button>
      </div>
    </template>
  </a-modal>
</template>

<style lang="scss" scoped>
.checkbox-container {
  display: flex;
  flex-wrap: wrap; /* 允许换行 */
  gap: 10px; /* 设置复选框之间的间距 */
}

.checkbox-container .ant-checkbox-wrapper {
  flex: 1 1 20%; /* 每个复选框占 22% 的宽度，留出一些间隙 */
  max-width: 24%; /* 最大宽度为 24%，确保每行最多四个 */
  box-sizing: border-box; /* 防止 padding 和 border 影响宽度 */
}

.btn-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.pccm-item {
  margin-bottom: 10px;
  margin-top: -10px;

  .menu-form-alert {
    color: #fff;
    line-height: 24px;
    padding: 8px 16px;
    margin-bottom: 20px;
    border-radius: 4px;
    background-color: #409EFFFF;
  }
}
</style>
