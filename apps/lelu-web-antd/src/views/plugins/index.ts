export let pluginsAll: any = [];
// 扫描插件目录并注册插件
export const scanAndInstallPlugins = (app: any) => {
  const components = import.meta.glob("./*/index.ts"); // 查找 src 文件夹下的所有 index.ts 文件
  const pluginNames = new Set();

  // 遍历找到的 index.ts 文件
  for (const [key, value] of Object.entries(components)) {

    // 动态导入 index.ts 文件并执行其中的 install 方法
    value().then((module: any) => {
      if (module.default.install) {
        app.use(module.default.install); // 如果有 install 方法，执行它
      }
    });

    const pluginsName = key.match(/\/([^\/]*)\//)?.[1];
    pluginNames.add(pluginsName);
  }

  const pluginsAll = Array.from(pluginNames);
  console.log("已发现插件：", pluginsAll);
};
