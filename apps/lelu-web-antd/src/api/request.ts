/**
 * 该文件可自行根据业务逻辑进行调整
 */
import type {HttpResponse} from '@vben/request';

import {useAppConfig} from '@vben/hooks';
import {preferences} from '@vben/preferences';
import {
  authenticateResponseInterceptor,
  errorMessageResponseInterceptor,
  RequestClient,
} from '@vben/request';
import {resetAllStores, useAccessStore} from '@vben/stores';

import {message} from 'ant-design-vue';

import {useAuthStore} from '#/store';

import {refreshTokenApi} from './core';
import {LOGIN_PATH} from "@vben/constants";
import {useRouter} from "vue-router";

const {apiURL} = useAppConfig(import.meta.env, import.meta.env.PROD);

function createRequestClient(baseURL: string) {
  const client = new RequestClient({
    baseURL,
  });

  /**
   * 重新认证逻辑
   */
  async function doReAuthenticate() {
    // console.warn('Access token or refresh token is invalid or expired. ');
    const accessStore = useAccessStore();
    const authStore = useAuthStore();
    accessStore.setAccessToken(null);
    // && accessStore.isAccessChecked
    if (
      preferences.app.loginExpiredMode === 'modal' && accessStore.isAccessChecked
    ) {
      accessStore.setLoginExpired(true);
    } else {
      // await authStore.logout();
      const router = useRouter();
      resetAllStores();
      accessStore.setLoginExpired(false);

      // 回登录页带上当前路由地址
      await router.replace({
        path: LOGIN_PATH,
        query: {
          redirect: encodeURIComponent(router.currentRoute.value.fullPath),
        },
      });
    }
  }

  /**
   * 刷新token逻辑
   */
  async function doRefreshToken() {
    const accessStore = useAccessStore();
    const resp = await refreshTokenApi(accessStore.refreshToken);
    const newToken = resp?.data.access;
    accessStore.setAccessToken(newToken);
    return newToken;
  }

  function formatToken(token: null | string) {
    return token ? `JWT ${token}` : null;
  }

  // 请求头处理
  client.addRequestInterceptor({
    fulfilled: async (config) => {
      const accessStore = useAccessStore();

      config.headers.Authorization = formatToken(accessStore.accessToken);
      config.headers['Accept-Language'] = preferences.app.locale;
      return config;
    },
  });

  // response数据解构
  client.addResponseInterceptor<HttpResponse>({
    fulfilled: (response: any) => {
      const {data: responseData, status} = response;

      const {code} = responseData;

      if ((status >= 200 && status < 400 && code === 2000) || responseData.swagger !== undefined) {
        return responseData;
      }
      if (code === undefined && (status >= 200 && status < 400)) {
        return response;
      }
      throw Object.assign({}, response, {response});
    },
  });

  // token过期的处理
  client.addResponseInterceptor(
    authenticateResponseInterceptor({
      client,
      doReAuthenticate,
      doRefreshToken,
      enableRefreshToken: preferences.app.enableRefreshToken,
      formatToken,
    }),
  );

  // 通用的错误处理,如果没有进入上面的错误处理逻辑，就会进入这里
  client.addResponseInterceptor(
    errorMessageResponseInterceptor(async (msg: string, error) => {
      // 这里可以根据业务进行定制,你可以拿到 error 内的信息进行定制化处理，根据不同的 code 做不同的提示，而不是直接使用 message.error 提示 msg
      // 当前mock接口返回的错误字段是 error 或者 message
      const err: string = error?.toString?.() ?? '';
      const responseData = error?.response?.data ?? {};
      const code = error?.response?.data.code;
      let errorMessage = responseData?.error ?? responseData?.msg ?? '';
// 如果 errorMessage 是数组，取其第一个元素
      if (Array.isArray(errorMessage) && errorMessage.length > 0 && errorMessage[0]) {
        errorMessage = errorMessage[0]?.value ?? '';
      } else if (typeof errorMessage === 'object' && errorMessage !== null && 'detail' in errorMessage) {
        // 如果是对象，取 `detail`
        errorMessage = errorMessage.detail ?? '';
      }
      // 如果没有错误信息，则会根据状态码进行提示
      if (code === 401) {
        message.error('身份认证失败，请重新登录', 5);
      } else {
        message.error(errorMessage || msg, 5);
      }
    }),
  );


  return client;
}

export const requestClient = createRequestClient(apiURL);

export const baseRequestClient = new RequestClient({baseURL: apiURL});

/**
 * 下载文件
 * @param url
 * @param params
 * @param method
 * @param filename
 * @param config
 */
export const downloadFile = async function (url: string, {
  params,
  method,
  filename = '文件导出',
  ...config
}: any) {
  try {
    const res: any = await requestClient.request(url, {
      params: params,
      method: method,
      responseType: 'blob',
      ...config,
    })
    if (res) {
      const xlsxName = decodeURIComponent(res.headers['content-disposition'].split('=')[1])
      const fileName = xlsxName || `${filename}.xlsx`

      const blob = new Blob([res.data], {type: 'charset=utf-8'})
      const link = document.createElement('a')
      link.download = fileName
      link.style.display = 'none'
      link.href = URL.createObjectURL(blob)
      document.body.appendChild(link)
      link.click()
      URL.revokeObjectURL(link.href) // 释放URL 对象0
      document.body.removeChild(link)
    }
  } catch (err) {
    // console.error(err);
  }
}
