<script setup lang="ts">
import { Page } from "@vben/common-ui";
import { $t } from "@vben/locales";
import { Splitpanes, Pane } from "splitpanes";
import "splitpanes/dist/splitpanes.css";
import { UserSwitchOutlined } from "@ant-design/icons-vue";

import { RoleDrawerStores } from "../stores/RoleDrawerStores";
import { defineAsyncComponent, ref, h } from "vue";
import { RoleUsersStores } from "../stores/RoleUsersStores";

const MenuTreeCom = defineAsyncComponent(() => import("./RoleMenuTree.vue"));
const MenuBtnCom = defineAsyncComponent(() => import("./RoleMenuBtn.vue"));
const MenuFieldCom = defineAsyncComponent(() => import("./RoleMenuField.vue"));
const RoleUsersCom = defineAsyncComponent(() => import("./RoleUsers.vue"));
const RoleDrawer = RoleDrawerStores(); // 抽屉参数
const RoleUsers = RoleUsersStores(); // 角色-用户
const activeName = ref("first");

const dialogVisible = ref(false);

const handleUsers = () => {
  dialogVisible.value = true;
  RoleUsers.get_all_users(); // 获取所有用户
  RoleUsers.set_right_users(RoleDrawer.$state.users); // 设置已选中用户
};
</script>

<template>
  <Page>
    <a-drawer
      :maskClosable="false"
      v-model:open="RoleDrawer.drawerVisible"
      direction="rtl"
      :close-on-click-modal="false"
      @close="RoleDrawer.handleDrawerClose"
      :destroy-on-close="true"
      :width="'75%'">
      <template #title>
        <div>
          {{ $t("system.N00187") }}：
          <a-tag style="margin-right: 20px" color="green">{{ RoleDrawer.roleName }}</a-tag>
          {{ $t("system.N00728") }}：
          <a-button size="small" :icon="h(UserSwitchOutlined)" @click="handleUsers">
            {{ RoleDrawer.users.length }}
          </a-button>
        </div>
      </template>
      <splitpanes>
        <pane min-size="22" size="24">
          <div class="pane-box">
            <MenuTreeCom />
          </div>
        </pane>
        <pane min-size="34" style="overflow: hidden;">
          <div class="pane-box">
            <a-tabs v-model:activeKey="activeName" class="demo-tabs" animated>
              <a-tab-pane key="first" :tab="$t('system.N00725')">
                <MenuBtnCom />
              </a-tab-pane>
              <a-tab-pane key="second" :tab="$t('system.N00726')">
                <MenuFieldCom />
              </a-tab-pane>
            </a-tabs>
          </div>
        </pane>
      </splitpanes>
    </a-drawer>

    <a-modal v-model:open="dialogVisible" :title="$t('system.N00727')" :close-on-click-modal="false"
             :footer="null" width="800px">
      <RoleUsersCom />
    </a-modal>
  </Page>
</template>

<style scoped lang="scss">
.splitpanes {
  display: flex;
  width: 100%;
  height: 100%;
  border: 1px solid #808080; /* 更柔和的浅灰色边框 */
  border-radius: 8px; /* 圆角边框，增加柔和感 */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 添加阴影效果，给容器增加层次感 */
  overflow: hidden; /* 确保内容不超出容器 */
}

/* 显示拖动条 */
:deep(.splitpanes__splitter) {
  background-color: #808080; /* 设置分割条的背景色 */
  width: 7px; /* 增加分割条的宽度 */
  border-radius: 2px; /* 给分割条加圆角 */
  transition: background-color 0.3s ease; /* 添加过渡效果 */


  &:before, &:after {
    transform: translateY(-50%);
    width: 1px;
    height: 30px;
  }

  &:before {
    margin-left: -2px;
  }

  &:after {
    margin-left: 1px;
  }
}


/* 给 pane 内的组件加点 padding，避免边缘太挤 */
.pane-box {
  padding: 15px;
}

</style>
