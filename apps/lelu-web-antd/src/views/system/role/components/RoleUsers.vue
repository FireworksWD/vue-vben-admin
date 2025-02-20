<script setup lang="ts">
import { message } from "ant-design-vue";
import { $t } from "@vben/locales";
import { RoleDrawerStores } from "../stores/RoleDrawerStores";
import { RoleUsersStores } from "../stores/RoleUsersStores";
import { setRoleUsers } from "./api";

const RoleDrawer = RoleDrawerStores(); // 抽屉参数
const RoleUsers = RoleUsersStores(); // 角色-用户

/**
 *
 * @param _value
 * @param direction 移动的方向
 * @param movedKeys 移动的用户
 */
const handleChange = (_value: number[] | string[], direction: "left" | "right", movedKeys: string[] | number[]) => {
  setRoleUsers(RoleDrawer.$state.roleId, { direction, movedKeys }).then((res: any) => {
    RoleDrawer.set_state(res.data);
    message.success(res.msg);
  });
};

const filterOption = (inputValue: string, option: any) => {
  return option.title.indexOf(inputValue) > -1;
};

</script>

<template>
  <a-transfer
    v-model:target-keys="RoleUsers.$state.right_users"
    :data-source="RoleUsers.$state.all_users"
    :titles="[` ${$t('system.N00734')}`, ` ${$t('system.N00735')}`]"
    show-search
    :filter-option="filterOption"
    :render="(item:any) => item.name"
    @change="handleChange"
    :list-style="{
      width: '400px',
      height: '400px',
    }"
    style="width: 100%"
  />
</template>

<style scoped lang="scss">

</style>
