import { createApp } from "vue";

import { registerAccessDirective } from "@vben/access";
import { initStores } from "@vben/stores";
import "@vben/styles";
import "@vben/styles/antd";
import fastCrud from "./crudSettings";
import { setupI18n } from "#/locales";
import Antd from "ant-design-vue";

import { initComponentAdapter } from "./adapter/component";
import App from "./app.vue";
import { router } from "./router";
import { Icon } from "@iconify/vue";
import { registerIcons } from "./iconSettings";
// 自动注册插件
import { scanAndInstallPlugins } from "#/views/plugins";

async function bootstrap(namespace: string) {
  // 初始化组件适配器
  await initComponentAdapter();

  const app = createApp(App);
  // 插件扫描
  scanAndInstallPlugins(app);
  // 注册全局的 Icon 组件
  app.component("Icon", Icon);
  // 调用函数来注册本地图标集合
  await registerIcons();

  // 国际化 i18n 配置
  await setupI18n(app);

  // 配置 pinia-tore
  await initStores(app, { namespace });

  // 安装权限指令
  registerAccessDirective(app);

  // 配置路由及路由守卫
  app.use(router);
  // @ts-ignore
  app.use(fastCrud);
  app.use(Antd);

  app.mount("#app");
}

export { bootstrap };
