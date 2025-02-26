/**
 * @author: Ethan
 * @contact: email:
 * @Created on: 2025/2/26 9:25
 * @Remark:
 **/
const modules = import.meta.glob("../../../**/index.vue");
const excludeDirs = ["components", "component", "plugins"];

const getAbsolutePath = (relativePath: any) => {
  const basePath = import.meta.url; // 获取当前文件的 URL
  const url = new URL(relativePath, basePath); // 将相对路径转换为绝对路径
  // 返回绝对路径
  let processedPath = url.pathname;
  // 去掉开头的 '/src/views/'
  processedPath = processedPath.replace(/^\/src\/views\//, "");
  // 去掉末尾的 '.vue'
  processedPath = processedPath.replace(/\.vue$/, "");
  return processedPath;
};

// 递归扫描并过滤模块
const getFilteredModules = (modules: any, excludeDirs: any) => {
  return Object.keys(modules).reduce((acc: any[], path: string) => {
    const processedPath = getAbsolutePath(path);
    // 检查路径是否包含排除的目录
    if (!excludeDirs.some((dir: any) => processedPath.includes(dir))) {
      // 如果路径不包含排除的目录，就添加到结果数组中
      acc.push({
        label: processedPath,
        value: processedPath
      });
    }
    return acc;
  }, []);
};
const processedModules = getFilteredModules(modules, excludeDirs);

export default processedModules;



