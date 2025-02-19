import type { Recordable } from "@vben/types";

import { computed, ref } from "vue";
import { useRouter } from "vue-router";

import { DEFAULT_HOME_PATH, LOGIN_PATH } from "@vben/constants";
import { resetAllStores, useAccessStore, useUserStore } from "@vben/stores";

import { notification, message } from "ant-design-vue";
import { defineStore } from "pinia";

import { getUserInfoApi, loginApi, logoutApi } from "#/api";
import { $t } from "#/locales";
import { formatAxis } from "#/utils/formatTime";

export const useAuthStore = defineStore("auth", () => {
  const accessStore = useAccessStore();
  const userStore = useUserStore();
  const router = useRouter();

  const loginLoading = ref(false);

  /**
   * 异步处理登录操作
   * Asynchronously handle the login process
   * @param params 登录表单数据
   * @param onSuccess
   */
  async function authLogin(
    params: Recordable<any>,
    onSuccess?: () => Promise<void> | void
  ) {
    // 异步处理用户登录操作并获取 accessToken
    let userInfo;
    let user;
    try {
      loginLoading.value = true;
      // const { accessToken } = await loginApi(params);
      const res = await loginApi(params);
      user = res.data;


      // 如果成功获取到 accessToken
      if (user.access) {
        accessStore.setAccessToken(user.access);
        accessStore.setRefreshToken(user.refresh);

        // 获取用户信息并存储到 accessStore 中
        // const [fetchUserInfoResult, accessCodes] = await Promise.all([
        //   fetchUserInfo(),
        //   getAccessCodesApi(),
        // ]);
        userInfo = await fetchUserInfo();
        // accessStore.setAccessCodes(accessCodes);

        if (accessStore.loginExpired) {
          accessStore.setLoginExpired(false);
        } else {
          onSuccess
            ? await onSuccess?.()
            : await router.push(DEFAULT_HOME_PATH);
        }
        // 时间获取
        const currentTime = computed(() => {
          return formatAxis(new Date());
        });

        if (userInfo?.username) {
          // notification.success({
          //   description: `${$t("authentication.loginSuccessDesc")}:${userInfo?.username}`,
          //   duration: 3,
          //   // message: $t("authentication.loginSuccess"),
          //   message: currentTime.value,
          //   placement: "top"
          // });
          message.success({
            content: `${currentTime.value},${$t("authentication.loginSuccessDesc")}:${userInfo?.username}`,
            duration: 4
          });
        }
      }
    } finally {
      loginLoading.value = false;
    }

    return {
      userInfo
    };
  }

  async function logout(redirect: boolean = true) {
    try {
      await logoutApi();
    } catch {
      // 不做任何处理
    }
    resetAllStores();
    accessStore.setLoginExpired(false);

    // 回登录页带上当前路由地址
    await router.replace({
      path: LOGIN_PATH,
      query: redirect
        ? {
          redirect: encodeURIComponent(router.currentRoute.value.fullPath)
        }
        : {}
    });
  }

  async function fetchUserInfo() {
    let userInfo;
    const res = await getUserInfoApi();
    userInfo = res.data;
    userStore.setUserInfo(userInfo);
    return userInfo;
  }

  function $reset() {
    loginLoading.value = false;
  }

  return {
    $reset,
    authLogin,
    fetchUserInfo,
    loginLoading,
    logout
  };
});
