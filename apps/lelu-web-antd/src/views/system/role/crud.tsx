/**
 * @author: Ethan
 * @contact: email:
 * @Created on: 2025/2/19 15:24
 * @Remark:
 **/
import type { CreateCrudOptionsProps, CreateCrudOptionsRet, AddReq, DelReq, EditReq } from "@fast-crud/fast-crud";
import { dict, compute } from "@fast-crud/fast-crud";
import * as api from "./api";
import { dictionary } from "#/utils/dictionary";
import { message } from "ant-design-vue";
import { auth } from "#/utils/authFunction";
import { $t } from "@vben/locales";

/**
 *
 * @param crudExpose：index传递过来的示例
 * @param context：index传递过来的自定义参数
 * @returns
 */
export const createCrudOptions = function({ crudExpose, context }: CreateCrudOptionsProps): CreateCrudOptionsRet {
  const pageRequest = async (query: any) => {
    return await api.GetList(query);
  };
  const editRequest = async ({ form, row }: EditReq) => {
    form.id = row.id;
    return await api.UpdateObj(form);
  };
  const delRequest = async ({ row }: DelReq) => {
    return await api.DelObj(row.id);
  };
  const addRequest = async ({ form }: AddReq) => {
    return await api.AddObj(form);
  };

  return {
    crudOptions: {
      request: {
        pageRequest,
        addRequest,
        editRequest,
        delRequest
      },
      pagination: {
        show: true
      },
      container: {
        is: "fs-layout-card"
      },
      actionbar: {
        buttons: {
          add: {
            show: auth("role:Create")
          }
        }
      },
      rowHandle: {
        //固定右侧
        fixed: "right",
        width: 320,
        buttons: {
          view: {
            show: true
          },
          edit: {
            show: auth("role:Update")
          },
          remove: {
            show: auth("role:Delete")
          },
          permission: {
            type: "primary",
            text: $t("system.N00302"),
            title: "",
            show: auth("role:Permission"),
            tooltip: {
              is: "a-tooltip",
              placement: "top",
              title: $t("system.N00302")
            },
            click: (clickContext: any): void => {
              const { row } = clickContext;
              context.RoleDrawer.handleDrawerOpen(row);
              context.RoleMenuBtn.setState([]);
              context.RoleMenuField.setState([]);
            }
          }
        }
      },
      form: {
        col: { span: 24 },
        labelWidth: "100px",
        wrapper: {
          is: "a-modal",
          width: "600px"
        }
      },
      columns: {
        _index: {
          title: $t("system.N00179"),
          form: { show: false },
          column: {
            // type: 'number',
            align: "center",
            width: "70px",
            columnSetDisabled: true, //禁止在列设置中选择
            //@ts-ignore
            formatter: (context) => {
              //计算序号,你可以自定义计算规则，此处为翻页累加
              let index = context.index ?? 1;
              let pagination: any = crudExpose!.crudBinding.value.pagination;
              return ((pagination.currentPage ?? 1) - 1) * pagination.pageSize + index + 1;
            }
          }
        },
        id: {
          title: "ID",
          type: "text",
          column: {
            show: false,
            width: 100
          },
          search: { show: false },
          form: { show: false }
        },
        name: {
          title: $t("system.N00412"),
          type: "text",
          search: {
            show: true,
            col: {
              span: 5
            }
          },
          column: {
            width: 120,
            sortable: "custom"
          },
          form: {
            rules: [{ required: true, message: $t("system.N00413") }],
            component: {
              placeholder: $t("system.N00479")
            }
          }
        },
        key: {
          title: $t("system.N00299"),
          type: "text",
          search: { show: false },
          column: {
            width: 120,
            sortable: "custom",
            columnSetDisabled: true
          },
          form: {
            rules: [{ required: true, message: $t("system.N00300") }],
            component: {
              placeholder: $t("system.N00508")
            }
          },
          valueBuilder(context) {
            const { row, key } = context;
            return row[key];
          }
        },
        sort: {
          title: $t("system.N00223"),
          search: { show: false },
          type: "number",
          column: {
            width: 90,
            sortable: "custom"
          },
          form: {
            rules: [{ required: true, message: $t("system.N00225") }],
            value: 1
          }
        },
        status: {
          title: $t("system.N00337"),
          search: {
            valueResolve(context: any) {
              const { key, value, form } = context;//  <------注意这里是form，不是row
              if (value != null) {
                form[key] = value === "true";
              }
            },
            show: true,
            component: {
              placeholder: $t("system.N00488"),
              name: "a-select",
              vModel: "value",
              options: dictionary("button_status_bool").map((item: any) => ({
                value: String(item.value), // 将 value 转换为字符串
                label: item.label
              }))
            }
          },
          // type: 'dict-switch',
          column: {
            width: 100,
            component: {
              name: "fs-dict-switch",
              vModel: "checked",
              onChange: compute((context) => {
                return () => {
                  api.UpdateObj(context.row).then((res: any) => {
                    message.success(res.msg as string);
                  });
                };
              })
            }
          },
          dict: dict({
            data: dictionary("button_status_bool")
          })
        }
      }
    }
  };
};
