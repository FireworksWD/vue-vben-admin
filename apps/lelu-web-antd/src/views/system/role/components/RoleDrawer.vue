<script setup lang="ts">
import { Page } from "@vben/common-ui";
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
      v-model:open="RoleDrawer.drawerVisible"
      direction="rtl"
      :close-on-click-modal="false"
      @close="RoleDrawer.handleDrawerClose"
      :destroy-on-close="true"
      :width="'60%'">
      <template #title>
        <div>
          当前授权角色：
          <a-tag style="margin-right: 20px" color="green">{{ RoleDrawer.roleName }}</a-tag>
          授权人员：
          <a-button size="small" :icon="h(UserSwitchOutlined)" @click="handleUsers">
            {{ RoleDrawer.users.length }}
          </a-button>
        </div>
      </template>
      <splitpanes class="default-theme" style="height: 100%">
        <pane min-size="20" size="22">
          <div class="pane-box">
            <MenuTreeCom />
          </div>
        </pane>
        <pane min-size="20">
          <div class="pane-box">
<!--            <a-radio-group v-model:value="activeName"  button-style="solid" animated>-->
<!--              <a-radio-button value="first">接口权限</a-radio-button>-->
<!--              <a-radio-button value="second">列字段权限</a-radio-button>-->
<!--            </a-radio-group>-->
<!--            <div v-if="activeName === 'first'" style="margin-top: 20px">-->
<!--              <MenuBtnCom />-->
<!--            </div>-->
<!--            <div v-if="activeName === 'second'" style="margin-top: 14px">-->
<!--              <MenuFieldCom />-->
<!--            </div>-->
            <a-tabs v-model:activeKey="activeName" class="demo-tabs" animated>
              <a-tab-pane key="first" tab="接口权限">
                <MenuBtnCom />
              </a-tab-pane>
              <a-tab-pane key="second" tab="列字段权限">
                <MenuFieldCom />
              </a-tab-pane>
            </a-tabs>
          </div>
        </pane>
      </splitpanes>
    </a-drawer>

    <a-modal v-model:open="dialogVisible" title="授权用户" :close-on-click-modal="false"
             :footer="null" width="800px">
      <RoleUsersCom />
    </a-modal>
  </Page>
</template>

<style scoped lang="scss">
.pane-box {
  width: 100vw; /* 视口宽度 */
  height: 100vh; /* 视口高度 */
  max-width: 100%; /* 确保不超过父元素的宽度 */
  max-height: 100%; /* 确保不超过父元素的高度 */
  overflow: auto; /* 当内容超出容器尺寸时显示滚动条 */
  padding: 10px;
  background-color: #fff;
}
</style>
