<template>
  <a-drawer
    v-model:open="drawerVisibleNew"
    direction="rtl"
    :close-on-click-modal="false"
    @close="handleDrawerClose"
    :destroy-on-close="true"
    :width="'60%'"
  >
    <template #title>
      <a-row>
        <a-col :span="10">
          <div>
            当前授权角色：
            <a-tag color="purple">{{ props.roleName }}</a-tag>
          </div>
        </a-col>
        <a-col :span="6">
          <div>
            <a-button type="primary" class="pc-save-btn"
                      @click="handleSavePermission">{{ $t('system.N00049') }}</a-button>
          </div>
        </a-col>
      </a-row>
    </template>
    <a-divider style="height: 2px; background-color: #7cb305;margin-top: -10px"/>
    <div class="permission-com">
      <a-row :gutter="20">
        <a-col :span="7">
          <div class="menu-box menu-left-box">
            <a-tree
              blockNode
              ref="treeRef"
              :show-line="{showLeafIcon}"
              :tree-data="menuData"
              v-model:checked-keys="checkedKeys"
              v-model:expanded-keys="expandedKeys"
              @select="handleMenuClick"
              :field-names="fieldNames"
              checkable
            >
              <template #title="{dataRef }">
              <span class="tree-title" :class="{'hovered': dataRef.selected}">
                    {{ dataRef.name }}
              </span>
              </template>
            </a-tree>
          </div>
        </a-col>
        <a-divider type="vertical"
                   style="height: auto; background-color: #7cb305;margin-top: -10px"/>
        <a-col :span="16">
          <div class="pc-collapse-main" v-if="menuCurrent.btns && menuCurrent?.btns.length > 0">
            <div class="pccm-item">
              <div class="menu-form-alert">{{ $t('system.N00534') }},{{ $t('system.N00536') }}</div>
              <a-checkbox v-for="(btn, bIndex) in menuCurrent.btns" :key="bIndex"
                          v-model:checked="btn.isCheck" :label="btn.value"
                          style="margin-right: 25px;margin-bottom: 12px">
                <div class="btn-item">
                  {{
                    btn.data_range !== null ? `${btn.name}(${formatDataRange(btn.data_range)})` : btn.name
                  }}
                  <span v-show="btn.isCheck"
                        @click.stop.prevent="handleSettingClick(menuCurrent, btn)"
                  >
                        <Icon icon="icon-park:database-setting" style="font-size: 24px;"/>
									</span>
                </div>
              </a-checkbox>
            </div>
            <a-divider style="border-color: #7cb305;margin-top: -10px" dashed/>
            <div class="pccm-item" v-if="menuCurrent.columns && menuCurrent.columns.length > 0">
              <div class="menu-form-alert">{{ $t('system.N00535') }}</div>
              <ul class="columns-list">
                <li class="columns-head">
                  <div class="width-txt">
                    <span>{{ $t('system.N00144') }}</span>
                  </div>
                  <div v-for="(head, hIndex) in column.header" :key="hIndex" class="width-check">
                    <a-checkbox :label="head.value"
                                @change="handleColumnChange($event, menuCurrent, head.value, head.disabled)">
                      <span>{{ head.label }}</span>
                    </a-checkbox>
                  </div>
                </li>

                <li v-for="(c_item, c_index) in menuCurrent.columns" :key="c_index"
                    class="columns-item">
                  <div class="width-txt">{{ c_item.title }}</div>
                  <div v-for="(col, cIndex) in column.header" :key="cIndex" class="width-check">
                    <a-checkbox v-model:checked="c_item[col.value]" class="ci-checkout"
                                :disabled="c_item[col.disabled]"></a-checkbox>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </a-col>
      </a-row>
      <a-modal v-model:open="dialogVisible" :title="$t('system.N00247')"
               :close-on-click-modal="false"
               :before-close="handleDialogClose"
               :width="'35%'"
               :body-style="{height:'25vh'}"
               style="top: 30%">
        <div class="pc-dialog">
          <a-select v-model:value="dataPermission"
                    @change="handlePermissionRangeChange"
                    :placeholder="$t('system.N00488')" style="width: 100%"
                    :options="dataPermissionRange"
                    :field-names="{label:'label',value:'value'}"
          />

          <a-tree-select
            v-model:value="customDataPermission"
            :tree-line="treeLine && { showLeafIcon }"
            show-search
            style="width: 100%;margin-top: 20px"
            v-show="dataPermission === 4"
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
              <Icon icon="material-symbols:gesture-select-sharp"/>
            </template>

          </a-tree-select>
        </div>

        <template #footer>
          <div>
            <a-button type="primary" @click="handleDialogConfirm">{{ $t('system.N00362') }}</a-button>
            <a-button @click="handleDialogClose" style="margin-left: 10px">{{ $t('system.N00091') }}</a-button>
          </div>
        </template>
      </a-modal>
    </div>
  </a-drawer>
</template>

<script setup lang="ts">
import {$t} from '#/locales'
import {Icon} from '@iconify/vue'
import {computed, defineProps, onMounted, reactive, ref, watch} from 'vue';
import XEUtils from 'xe-utils';
import type {TreeProps, TreeSelectProps} from 'ant-design-vue';
import {message, notification, TreeSelect} from 'ant-design-vue';
import {
  getDataPermissionDept,
  getDataPermissionRange,
  getRolePermission,
  setRolePremission
} from './api';
import type {DataPermissionRangeType, MenuDataType} from './types';

const fieldNames: TreeProps['fieldNames'] = {
  children: 'children',
  title: 'name',
};


const SHOW_ALL = TreeSelect.SHOW_ALL;
const treeLine = ref(true);
const showLeafIcon = ref(false);
const expandedKeys = ref<any>([]);
const checkedKeys = ref<any>([]);// 默认选中的菜单列表


const props = defineProps({
  roleId: {
    type: [Number, Object, null],
    default: -1,
  },
  roleName: {
    type: [String, Object, null],
    default: '',
  },
  drawerVisible: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(['drawerClose']);

const drawerVisibleNew = ref(false);
watch(
  () => props.drawerVisible,
  (val) => {
    drawerVisibleNew.value = val;
    getMenuBtnPermission();
    getDataPermissionRangeLable();
    menuCurrent.value = {};
  }
);
const handleDrawerClose = () => {
  emit('drawerClose', false);
};


let menuData = ref<TreeProps['treeData']>([]); // 菜单列表数据

let menuCurrent = ref<any>({}); // 当前选中的菜单

let menuBtnCurrent = ref<number>(-1);
let dialogVisible = ref(false);
let dataPermissionRange = ref<DataPermissionRangeType[]>([]);
let dataPermissionRangeLabel = ref<DataPermissionRangeType[]>([]);

const formatDataRange = computed(() => {
  return function (datarange: number) {
    const findItem = dataPermissionRangeLabel.value.find((i) => i.value === datarange);
    return findItem?.label || '';
  };
});
let deptData = ref<TreeSelectProps['treeData']>([]);
let dataPermission = ref();
let customDataPermission = ref([]);
const AutoExpandParent = ref(true)
const onExpand = (expandedKeys: any) => {
  console.log(22, expandedKeys)
  expandedKeys.value = expandedKeys
  AutoExpandParent.value = false
}
/**
 * 菜单复选框选中
 * @param _node
 * @param data
 */
watch(checkedKeys, () => {
  XEUtils.eachTree(menuData.value, (item) => {
    item.isCheck = checkedKeys?.value.includes(item.id);
  });
  expandedKeys.value = [...expandedKeys.value, ...checkedKeys.value];
});
/**
 * 菜单点击
 * @param _selectedKeys
 * @param info
 */
const handleMenuClick: TreeProps['onSelect'] = (_selectedKeys, info) => {
  menuCurrent.value = info?.node?.dataRef;
};
//获取菜单,按钮,权限
const getMenuBtnPermission = async () => {
  const res = await getRolePermission({role: props.roleId});
  const resMenu = XEUtils.toArrayTree(
    res.data.map((item: any) => ({
      ...item,
      name:$t(item.name),
      key: item.id,
      parentId: item.parent, //防止对象错误
      parent: item.parent ? {id: item.parent} : null,
    })), {
      key: 'id',
      parentKey: 'parentId',
      children: 'children',
      strict: false
    })
  menuData.value = resMenu;
  const {checked, expanded} = XEUtils.toTreeArray(resMenu).reduce(
    (acc, item) => {
      if (item.isCheck) {
        if (item.parent) {
          acc.checked.push(item.key);  // 如果有 parent，添加到 checked
        } else {
          acc.expanded.push(item.key);  // 如果没有 parent，添加到 expanded
        }
      }
      return acc;
    },
    {checked: [], expanded: []} // 初始化的 checked 和 expanded 数组
  );

  checkedKeys.value = checked;
  expandedKeys.value = expanded;
};
// 获取按钮的数据权限下拉选项
const getDataPermissionRangeLable = async () => {
  const resRange = await getDataPermissionRange({role: props.roleId});
  dataPermissionRangeLabel.value = resRange.data;
};

/**
 * 获取按钮数据权限下拉选项
 * @param btnId  按钮id
 */
const fetchData = async (btnId: number) => {
  try {
    const resRange = await getDataPermissionRange({menu_button: btnId});
    if (resRange?.code === 2000) {
      dataPermissionRange.value = resRange.data;
    }
  } catch {
    return;
  }
};


/**
 * 设置按钮数据权限
 * @param record 当前菜单
 * @param btn
 */
const handleSettingClick = (record: any, btn: MenuDataType['btns'][number]) => {
  menuCurrent.value = record;
  menuBtnCurrent.value = btn.id;
  dialogVisible.value = true;
  dataPermission.value = btn.data_range;
  handlePermissionRangeChange(btn.data_range);
  fetchData(btn.id);
};

/**
 * 设置列权限
 * @param event
 * @param record  当前菜单
 * @param btnType  按钮类型
 * @param disabledType  禁用类型
 */
const handleColumnChange = (event: any, record: any, btnType: string, disabledType: string) => {
  const isChecked = event.target.checked;
  for (const iterator of record.columns) {
    iterator[btnType] = iterator[disabledType] ? iterator[btnType] : isChecked;
  }
};

/**
 * 数据权限设置
 */
const handlePermissionRangeChange = async (val: number) => {
  if (val === 4) {
    const res = await getDataPermissionDept({
      role: props.roleId,
      menu_button: menuBtnCurrent.value
    });
    const colors = ['blue', 'cyan', 'green', 'orange', 'pink', 'purple'];
    deptData.value = XEUtils.toArrayTree(
      res.data.map((item: any) => ({
        ...item,
        key: item.id,
        value: item.id,
        label: item.name,
        color: colors[Math.floor(Math.random() * colors.length)],
        parentId: item.parent, //防止对象错误
        parent: item.parent ? {id: item.parent} : null,
      })), {parentKey: 'parentId', strict: false});
    const btnObj = XEUtils.find(menuCurrent.value.btns, (item) => item.id === menuBtnCurrent.value);
    customDataPermission.value = btnObj.dept;
  }
};

/**
 * 数据权限设置确认
 */
const handleDialogConfirm = () => {
  if (dataPermission.value !== 0 && !dataPermission.value) {
    notification.error({message: $t('system.N00488'), placement: 'top'});
    return;
  }
  for (const btn of menuCurrent.value?.btns || []) {
    if (btn.id === menuBtnCurrent.value) {
      const findItem = dataPermissionRange.value.find((i) => i.value === dataPermission.value);
      btn.data_range = findItem?.value || 0;
      if (btn.data_range === 4) {
        // 提取每个对象的 value（如果存在）
        btn.dept = customDataPermission.value.map((item: any) => item?.value);
      }
    }
  }
  handleDialogClose();
};
const handleDialogClose = () => {
  dialogVisible.value = false;
  customDataPermission.value = [];
  dataPermission.value = null;
};

//保存菜单授权
const handleSavePermission = () => {
  setRolePremission(props.roleId, XEUtils.toTreeArray(menuData.value)).then((res: any) => {
    message.success(res.msg);
  });
};

const column = reactive({
  header: [
    {value: 'is_create', label: $t('system.N00259'), disabled: 'disabled_create'},
    {value: 'is_update', label: $t('system.N00396'), disabled: 'disabled_update'},
    {value: 'is_query', label: $t('system.N00072'), disabled: 'disabled_query'},
  ],
});

onMounted(() => {
});
</script>

<style lang="scss" scoped>
.permission-com {
  margin-top: -10px;
  box-sizing: border-box;

  .pc-save-btn {
    margin-bottom: 15px;
  }

  .pc-collapse-title {
    line-height: 32px;
    text-align: left;

    span {
      font-size: 16px;
    }
  }

  .pc-collapse-main {
    box-sizing: border-box;

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

      .btn-item {
        display: flex;
        align-items: center;

        span {
          margin-left: 5px;
        }
      }

      .columns-list {
        .width-txt {
          width: 200px;
        }

        .width-check {
          width: 100px;
        }

        .width-icon {
          cursor: pointer;
        }

        .columns-head {
          display: flex;
          align-items: center;
          padding: 6px 0;
          border-bottom: 1px solid #ebeef5;
          box-sizing: border-box;

          span {
            font-weight: 900;
          }
        }

        .columns-item {
          display: flex;
          align-items: center;
          padding: 6px 0;
          box-sizing: border-box;

          .ci-checkout {
            height: auto !important;
          }
        }
      }
    }
  }

  .pc-dialog {
    .dialog-tree {
      width: 100%;
      margin-top: 20px;
    }
  }
}
</style>

<style lang="scss">
.permission-com {
  .a-collapse {
    border-top: none;
    border-bottom: none;
  }

  .a-collapse-item {
    margin-bottom: 15px;
  }

  .a-collapse-item__header {
    height: auto;
    padding: 15px;
    border-radius: 8px;
    border-top: 1px solid #ebeef5;
    border-left: 1px solid #ebeef5;
    border-right: 1px solid #ebeef5;
    box-sizing: border-box;
    background-color: #fafafa;
  }

  .a-collapse-item__header.is-active {
    border-radius: 8px 8px 0 0;
    background-color: #fafafa;
  }

  .a-collapse-item__wrap {
    padding: 15px;
    border-left: 1px solid #ebeef5;
    border-right: 1px solid #ebeef5;
    border-top: 1px solid #ebeef5;
    border-radius: 0 0 8px 8px;
    background-color: #fafafa;
    box-sizing: border-box;

    .a-collapse-item__content {
      padding-bottom: 0;
    }
  }
}

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
