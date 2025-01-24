<script lang="ts" setup>
import {computed, onMounted} from 'vue';

import {AuthPageLayout} from '@vben/layouts';
import {preferences} from '@vben/preferences';

import {$t} from '#/locales';
import {SystemConfigStore} from '#/store/systemConfig'

onMounted(() => {
  SystemConfigStore().getSystemConfigs();
})
const systemConfig = computed(() => SystemConfigStore().systemConfig);
const webTitle = computed(() => systemConfig.value['base.web_title']);
const webLogo = computed(() => systemConfig.value['base.web_logo']);
const webDescription = computed(() => systemConfig.value['base.web_description']);
const webPageTitle = computed(() => systemConfig.value['base.web_page_name']);

const appName = computed(() => preferences.app.name);
const logo = computed(() => preferences.logo.source);

const pageDescription = computed(() => {
  return webDescription.value ? $t(webDescription.value) : $t('authentication.pageDesc');
});

const pageTitle = computed(() => {
  return webPageTitle.value ? $t(webPageTitle.value) : $t('authentication.pageTitle');
});

//首页svg图
const loginBackground = computed(() => {
  return systemConfig.value['login.login_svgImg'] ? systemConfig.value['login.login_svgImg'] : '';
})

/*
登录页
 */
const loginCopyright = computed(() => {
  return systemConfig.value['login.copyright'] ? systemConfig.value['login.copyright'] : '2024-2025 django-vue-admin.com 版权所有';
})
// 备案号
const keepRecord = computed(() => {
  return systemConfig.value['login.keep_record'] ? systemConfig.value['login.keep_record'] : '晋ICP备18005113号-3';
})
// 帮助
const helpUrl = computed(() => {
  return systemConfig.value['login.help_url'] ? systemConfig.value['login.help_url'] : 'https://django-vue-admin.com';
})
// 隐私
const privacyUrl = computed(() => {
  return systemConfig.value['login.privacy_url'] ? systemConfig.value['login.privacy_url'] : '#';
})
//条款
const clauseUrl = computed(() => {
  return systemConfig.value['login.clause_url'] ? systemConfig.value['login.clause_url'] : '#';
})
const apiUrl = import.meta.env.VITE_GLOB_API_URL
</script>

<template>
  <AuthPageLayout
    :app-name="webTitle || appName"
    :logo="webLogo || logo"
    :page-description="pageDescription"
    :page-title="pageTitle"
    :sloganImage="loginBackground"
  >
    <!-- 自定义工具栏 -->
    <!-- <template #toolbar></template> -->
    <template #copyright>
      <div class="container">
        <div class="copyright">Copyright ©{{ loginCopyright }}</div>
        <div class="links">
          <a href="https://beian.miit.gov.cn" target="_blank">{{keepRecord}}</a>
          <span class="separator">|</span>
          <a :href="helpUrl" target="_blank">{{$t('system.N00619')}}</a>
          <span class="separator">|</span>
          <a :href="apiUrl+privacyUrl" target="_blank">{{$t('system.N00620')}}</a>
          <span class="separator">|</span>
          <a :href="apiUrl+clauseUrl" target="_blank">{{ $t('system.N00621')}}</a>
        </div>
      </div>
    </template>
  </AuthPageLayout>
</template>
<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.copyright {
  text-align: center;
  margin-bottom: 10px;
}


.links {
  text-align: center;
  display: inline-flex;
  align-items: center;
}


.separator {
  margin: 0 6px;
}

.links a {
  color: #4682B4;
  text-decoration: none;
  margin: 0 5px;
}
</style>
