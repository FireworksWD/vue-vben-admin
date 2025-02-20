<script setup lang="ts">
import { message } from "ant-design-vue";
import { $t } from "@vben/locales";
import { RoleDrawerStores } from "../stores/RoleDrawerStores";
import { RoleMenuFieldStores, RoleMenuFieldHeaderStores } from "../stores/RoleMenuFieldStores";
import { setRoleMenuField } from "./api";

const RoleMenuField = RoleMenuFieldStores();
const RoleMenuFieldHeader = RoleMenuFieldHeaderStores();
const RoleDrawer = RoleDrawerStores(); // 角色-抽屉
/** 全选 */
const handleColumnChange = (event: any, btnType: string, disabledType: string) => {
  const isChecked = event.target.checked;
  for (const iterator of RoleMenuField.$state) {
    //@ts-ignore
    iterator[btnType] = iterator[disabledType] ? iterator[btnType] : isChecked;
  }
};
const handleSaveField = async () => {
  const res = await setRoleMenuField(RoleDrawer.$state.roleId, RoleMenuField.$state);
  message.success(res.msg);
};
</script>

<template>
  <div class="pccm-item" v-if="RoleMenuField.$state.length > 0">
    <div class="menu-form-alert">
      <a-button size="small" @click="handleSaveField">{{ $t("system.N00580") }}</a-button>
      {{ $t("system.N00535")}}
    </div>

    <ul class="columns-list">
      <li class="columns-head">
        <div class="width-txt">
          <span>{{ $t("system.N00144")}}</span>
        </div>
        <div v-for="(head, hIndex) in RoleMenuFieldHeader.$state" :key="hIndex" class="width-check">
          <a-checkbox v-model:checked="head.checked"
                      @change="handleColumnChange($event, head.value, head.disabled)">
            <span>{{ head.label }}</span>
          </a-checkbox>
        </div>
      </li>
      <div class="columns-content">
        <li v-for="(c_item, c_index) in RoleMenuField.$state" :key="c_index" class="columns-item">
          <div class="width-txt">{{ c_item.title }}</div>
          <div v-for="(col, cIndex) in RoleMenuFieldHeader.$state" :key="cIndex"
               class="width-check">
            <a-checkbox v-model:checked="c_item[col.value]" class="ci-checkout"
                        :disabled="c_item[col.disabled]"></a-checkbox>
          </div>
        </li>
      </div>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
.pccm-item {
  margin-bottom: 10px;

  .menu-form-alert {
    color: #fff;
    line-height: 24px;
    padding: 12px 20px; /* 稍微增加内边距，使内容不那么拥挤 */
    margin-bottom: 20px;
    border-radius: 4px;
    background-color: #40a9ff; /* 淡蓝色，避免太刺眼 */
    border: 1px solid #1890ff; /* 边框加上和背景色稍深的蓝色 */
    box-shadow: 0 2px 8px rgba(24, 144, 255, 0.2); /* 微妙的阴影，提升层次感 */
    transition: all 0.3s ease; /* 平滑过渡效果 */
  }

  /* 当鼠标悬浮时 */
  .menu-form-alert:hover {
    background-color: #1890ff; /* 悬浮时的背景色变为深蓝色 */
    border-color: #1890ff; /* 悬浮时边框的颜色变为深蓝色 */
    box-shadow: 0 4px 12px rgba(24, 144, 255, 0.3); /* 更强的阴影效果 */
  }

  .menu-form-btn {
    margin-left: 10px;
    height: 40px;
    padding: 8px 16px;
    margin-bottom: 20px;
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
      width: 300px; /* 增加列宽度 */
    }

    .width-check {
      width: 200px; /* 增加列宽度 */
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

    .columns-content {
      max-height: calc(100vh - 240px); /* 视口高度 */
      overflow-y: auto; /* 当内容超出高度时显示垂直滚动条 */
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

</style>
