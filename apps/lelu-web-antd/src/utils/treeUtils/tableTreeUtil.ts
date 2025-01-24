import XEUtils from "xe-utils";

/**
 * @author: Ethan
 * @contact: email:
 * @Created on: 2024/12/31 10:38
 * @Remark:
 **/
/**
 * 平级树形表格懒加载的合并事件
 * @param backendData
 * @param config
 */
export const mapBackendTableTreeChildrenNode = (backendData: any[], config: Record<string, any> = {}) => {
  const options = {
    hasChildKey: 'hasChild',
    childrenKey: 'children',
    ...config,
  };
  return backendData.map(item => {
    const node = {...item};
    if (item[options.hasChildKey]) {
      node[options.childrenKey] = [];
    }
    return node;
  });
}
/**
 * 初始化平级表格数据转换成树形结构
 * @param backendData
 * @param config
 */
export const mapBackendTableTreeNode = (backendData: any[], config: Record<string, any> = {}): any[] => {
  const options = {
    hasChildKey: 'hasChild',
    childrenKey: 'children',
    key: 'id',
    parentKey: 'parent',
    ...config,
  };
  const result = XEUtils.toArrayTree(backendData,
    {
      key: options.key,
      parentKey: options.parentKey,
      children: options.childrenKey,
      strict: true,
    });
  XEUtils.eachTree(result, (node: any) => {
    if (node[options.hasChildKey]) {
      node[options.childrenKey] = []; // 将 children 设置为空数组,适应ant的树形表格
    }
  });
  return result
};
