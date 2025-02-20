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
          {{$t('system.N00187')}}：
          <a-tag style="margin-right: 20px" color="green">{{ RoleDrawer.roleName }}</a-tag>
          {{$t('system.N00728')}}：
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
.pane-box {
  width: 100vw; /* 视口宽度 */
  height: 100vh; /* 视口高度 */
  max-width: 100%; /* 确保不超过父元素的宽度 */
  max-height: 100%; /* 确保不超过父元素的高度 */
  overflow: auto; /* 当内容超出容器尺寸时显示滚动条 */
  padding: 10px;
  background-color: #fff;
}
.splitpanes {
  display: flex;
  width: 100%;
  height: 100%;

  &--vertical {flex-direction: row;}
  &--horizontal {flex-direction: column;}
  &--dragging * {user-select: none;}

  &__pane {
    width: 100%;
    height: 100%;
    overflow: hidden;

    .splitpanes--vertical & {transition: width 0.2s ease-out;}
    .splitpanes--horizontal & {transition: height 0.2s ease-out;}
    .splitpanes--dragging & {transition: none;}
  }

  // Disable default zoom behavior on touch device when double tapping splitter.
  &__splitter {touch-action: none;}
  &--vertical > .splitpanes__splitter {min-width: 1px;cursor: col-resize;}
  &--horizontal > .splitpanes__splitter {min-height: 1px;cursor: row-resize;}
}
.splitpanes.default-theme {
  .splitpanes__pane {
    background-color: #f2f2f2;
  }
  .splitpanes__splitter {
    background-color: #fff;
    box-sizing: border-box;
    position: relative;
    flex-shrink: 0;
    &:before, &:after {
      content: "";
      position: absolute;
      top: 50%;
      left: 50%;
      background-color: rgba(0, 0, 0, .15);
      transition: background-color 0.3s;
    }
    &:hover:before, &:hover:after {background-color: rgba(0, 0, 0, .25);}
    &:first-child {cursor: auto;}
  }
}
.default-theme {
  &.splitpanes .splitpanes .splitpanes__splitter {
    z-index: 1;
  }
  &.splitpanes--vertical > .splitpanes__splitter,
  .splitpanes--vertical > .splitpanes__splitter {
    width: 7px;
    border-left: 1px solid #eee;
    margin-left: -1px;
    &:before, &:after {
      transform: translateY(-50%);
      width: 1px;
      height: 30px;
    }
    &:before {margin-left: -2px;}
    &:after {margin-left: 1px;}
  }
  &.splitpanes--horizontal > .splitpanes__splitter,
  .splitpanes--horizontal > .splitpanes__splitter {
    height: 7px;
    border-top: 1px solid #eee;
    margin-top: -1px;
    &:before,
    &:after {
      transform: translateX(-50%);
      width: 30px;
      height: 1px;
    }
    &:before {margin-top: -2px;}
    &:after {margin-top: 1px;}
  }
}
</style>
