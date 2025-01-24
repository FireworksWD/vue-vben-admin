/**
 * @author: Ethan
 * @contact: email:
 * @Created on: 2025/1/16 13:59
 * @Remark:
 **/
import {addCollection} from '@iconify/vue';

/**
 * 异步加载图标集合
 */
const loadIcons = async () => {
  const iconElSet = await import('@iconify/json/json/el.json');
  const iconVaadinSet = await import('@iconify/json/json/vaadin.json');
  const iconMedicalIconSet = await import('@iconify/json/json/medical-icon.json');
  const iconFabrandsSet = await import('@iconify/json/json/fa-brands.json');
  const FontistoSet = await import('@iconify/json/json/fontisto.json');
  const vscodeIconsSet = await import('@iconify/json/json/vscode-icons.json');
  const devIconSet = await import('@iconify/json/json/devicon.json');
  const skillIconsSet = await import('@iconify/json/json/skill-icons.json');
  const unjsSet = await import('@iconify/json/json/unjs.json');
  const logosSet = await import('@iconify/json/json/logos.json');
  const tokenBrandedSet = await import('@iconify/json/json/token-branded.json');
  const streamLineEmojisSet = await import('@iconify/json/json/streamline-emojis.json');
  const mapCircleSet = await import('@iconify/json/json/circle-flags.json');

  // 注册各个图标集合到 Iconify
  addCollection(iconElSet.default);
  addCollection(iconVaadinSet.default);
  addCollection(iconMedicalIconSet.default);
  addCollection(iconFabrandsSet.default);
  addCollection(FontistoSet.default);
  addCollection(vscodeIconsSet.default);
  addCollection(devIconSet.default);
  addCollection(skillIconsSet.default);
  addCollection(unjsSet.default);
  addCollection(logosSet.default);
  addCollection(tokenBrandedSet.default);
  addCollection(streamLineEmojisSet.default);
  addCollection(mapCircleSet.default);
};

/**
 * 全局注册图标集合
 */
export const registerIcons = async () => {
  await loadIcons();  // 调用异步加载并注册图标集合
};
