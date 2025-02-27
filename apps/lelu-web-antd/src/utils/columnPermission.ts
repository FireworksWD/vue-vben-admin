import XEUtils from "xe-utils";
import { useColumnPermission } from "#/store/columnPermission";

type permissionType = "is_create" | "is_query" | "is_update";

export const columnPermission = (key: string, type: permissionType): boolean => {
  const permissions = useColumnPermission().permission || [];

  return permissions.some((i) => i.field_name === key && i[type]);
};

/**
 * 处理字段信息权限
 * @param func 获取字段信息的接口函数
 * @param crudOptions 原始的crudOptions信息
 * @param excludeColumn 需要排除的列
 */
export const handleColumnPermission = async (func: Function, crudOptions: any, excludeColumn: string[] = []) => {
  const res = await func();
  if (crudOptions.pagination == undefined) {
    crudOptions["pagination"] = {
      show: true
    };
  }
  const columns = crudOptions.columns;
  const excludeColumns = ["checked", "_index", "id", "create_datetime", "update_datetime"].concat(excludeColumn);
  XEUtils.eachTree(columns, (item, key) => {
    if (!excludeColumns.includes(String(key)) && key in res.data) {
      // 确保 item.column 存在，不存在时初始化
      if (!item.column) {
        item.column = {}; // 初始化 column 对象
      }

      // 如果列表不可见，则禁止在列设置中选择
      if (!res.data[key]["is_query"]) {
        item.column.show = false;
        item.column.columnSetDisabled = true;
        // 搜索框也关掉
        if (item.search) {
          item.search.show = false;
        }

      }

      // 设置 addForm 和 editForm 的显示状态
      item.addForm = { show: res.data[key]["is_create"] };
      item.editForm = { show: res.data[key]["is_update"] };
    }
  });

  return crudOptions;
};

