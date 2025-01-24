import {nextTick} from 'vue';

// 获取图标
const getBrunetIcons = async () => {
  const iconElSet = await import('@iconify/json/json/el.json');
  const iconVaadinSet = await import('@iconify/json/json/vaadin.json');
  const iconMedicalIconSet = await import('@iconify/json/json/medical-icon.json');
  const iconFabrandsSet = await import('@iconify/json/json/fa-brands.json');
  const FontistoSet = await import('@iconify/json/json/fontisto.json');


  const elIcons = Object.keys(iconElSet.default.icons).map(icon => `el:${icon}`);
  const vaadinIcons = Object.keys(iconVaadinSet.default.icons).map(icon => `vaadin:${icon}`);
  const medicalIconIcons = Object.keys(iconMedicalIconSet.default.icons).map(icon => `medical-icon:${icon}`);
  const fabrandsIcons = Object.keys(iconFabrandsSet.default.icons).map(icon => `fa-brands:${icon}`);
  const fontIsToIcons = Object.keys(FontistoSet.default.icons).map(icon => `fontisto:${icon}`);

  // 返回合并后的图标列表
  return [...elIcons, ...vaadinIcons, ...medicalIconIcons, ...fabrandsIcons, ...fontIsToIcons];
};

// 初始化获取 logos
const getLogosIcons = async () => {
  const vscodeIconsSet = await import('@iconify/json/json/vscode-icons.json');
  const devIconSet = await import('@iconify/json/json/devicon.json');
  const skillIconsSet = await import('@iconify/json/json/skill-icons.json');
  const unjsSet = await import('@iconify/json/json/unjs.json');
  const logosSet = await import('@iconify/json/json/logos.json');
  const tokenBrandedSet = await import('@iconify/json/json/token-branded.json');

  const vscodeIconsIcons = Object.keys(vscodeIconsSet.default.icons).map(icon => `vscode-icons:${icon}`);
  const devIconIcons = Object.keys(devIconSet.default.icons).map(icon => `devicon:${icon}`);
  const skillIconsIcons = Object.keys(skillIconsSet.default.icons).map(icon => `skill-icons:${icon}`);
  const unjsIcons = Object.keys(unjsSet.default.icons).map(icon => `unjs:${icon}`);
  const logosIcons = Object.keys(logosSet.default.icons).map(icon => `logos:${icon}`);
  const tokenBrandedIcons = Object.keys(tokenBrandedSet.default.icons).map(icon => `token-branded:${icon}`);

  return [...vscodeIconsIcons, ...devIconIcons, ...skillIconsIcons, ...unjsIcons, ...logosIcons, ...tokenBrandedIcons];
};

// 初始化emoji
const getEmojiIcons = async () => {
  const streamLineEmojisSet = await import('@iconify/json/json/streamline-emojis.json');
  const streamLineEmojisIcons = Object.keys(streamLineEmojisSet.default.icons).map(icon => `streamline-emojis:${icon}`);
  return [...streamLineEmojisIcons]
};
//其他
const getOthersIcons = async () => {
  const svgSpinnersSet = await import('@iconify/json/json/svg-spinners.json');
  const cifSet = await import('@iconify/json/json/cif.json');

  const svgSpinnersIcons = Object.keys(svgSpinnersSet.default.icons).map(icon => `svg-spinners:${icon}`);
  const cifIcons = Object.keys(cifSet.default.icons).map(icon => `cif:${icon}`);
  return [...svgSpinnersIcons, ...cifIcons]
}

/**
 * 获取图标 `document.styleSheets`
 * @method brunet 获取图标 深色
 * @method logos 获取 logos 图标
 * @method emojis 获取 emojis 的图标
 * @method others 获取 others 的图标
 */
const initIconfont = {
  // 深色
  brunet: async (): Promise<any> => {
    return await getBrunetIcons();
  },
  //
  logos: async (): Promise<any> => {
    return await getLogosIcons();
  },
  // fontawesome
  emojis: async (): Promise<any> => {
    return await getEmojiIcons();
  },
  others: async (): Promise<any> => {
    return await getOthersIcons();
  },
};

// 导出方法
export default initIconfont;
