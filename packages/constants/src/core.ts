import {h} from 'vue'
import {Icon} from "@iconify/vue";
/**
 * @zh_CN 登录页面 url 地址
 */
export const LOGIN_PATH = '/auth/login';

/**
 * @zh_CN 默认首页地址
 */
export const DEFAULT_HOME_PATH = '/analytics';

export interface LanguageOption {
  icon?: any;
  label: string;
  value: 'en-US' | 'zh-CN' | 'ja-JP' | 'vi-VN';
}

/**
 * Supported languages
 */
export const SUPPORT_LANGUAGES: LanguageOption[] = [
  {
    icon: h(Icon, { icon: 'circle-flags:cn' }),
    label: '简体中文',
    value: 'zh-CN',
  },
  {
    icon: h(Icon, { icon: 'circle-flags:us' }),
    label: 'English',
    value: 'en-US',
  },
  {
    icon: h(Icon, { icon: 'circle-flags:jp' }),
    label: 'Japanese',
    value: 'ja-JP',
  },
  {
    icon: h(Icon, { icon: 'circle-flags:vn' }),
    label: 'Vietnamese',
    value: 'vi-VN',
  },
];
