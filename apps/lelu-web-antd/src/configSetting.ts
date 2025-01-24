/**
 * @author: Ethan
 * @contact: email:
 * @Created on: 2025/1/20 16:58
 * @Remark:
 **/
import {nextTick} from 'vue'
import {storeToRefs} from 'pinia';
import {SystemConfigStore} from "#/store/systemConfig";
import {createPinia} from 'pinia';

const pinia = createPinia()

export function useFavicon() {
  const stores = SystemConfigStore(pinia);
  const {systemConfig} = storeToRefs(stores);
  nextTick(() => {
    const iconUrl = systemConfig.value['base.web_favicon']
    if (iconUrl) {
      // 动态设置 favicon，这里假设 favicon 的 URL 是动态获取的或从变量中来
      const faviconUrl = `${iconUrl}?t=${new Date().getTime()}`;
      const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
      if (!link) {
        const newLink = document.createElement('link') as HTMLLinkElement;
        newLink.rel = 'shortcut icon';
        newLink.href = faviconUrl;
        document.head.appendChild(newLink);
      } else {
        link.href = faviconUrl;
      }
    }

  });
}


const configSetting = {
  useFavicon: () => {
    useFavicon()
  },
}
export default configSetting;
