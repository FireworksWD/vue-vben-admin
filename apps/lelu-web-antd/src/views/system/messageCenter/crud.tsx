import { $t } from "#/locales";
import * as api from "./api";
import type {
  PageQuery,
  AddReq,
  DelReq,
  EditReq,
  CreateCrudOptionsProps,
  CreateCrudOptionsRet
} from "@fast-crud/fast-crud";
import { dict, useCompute } from "@fast-crud/fast-crud";
import tableSelector from "./componments/commonTableSelect.vue";
import { shallowRef, computed } from "vue";
import manyToMany from "#/components/manyToMany/index.vue";
import { auth } from "#/utils/authFunction";

const { compute } = useCompute();

export default function({ crudExpose, context }: CreateCrudOptionsProps): CreateCrudOptionsRet {
  const { tabActivted } = context; //从context中获取tabActivted

  const pageRequest = async (query: PageQuery) => {
    if (tabActivted.value === "receive") {
      return await api.GetSelfReceive(query);
    }
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

  const viewRequest = async ({ row }: { row: any }) => {
    return await api.GetObj(row.id);
  };

  const IsReadFunc = computed(() => {
    return tabActivted.value === "receive";
  });
  const colors = [
    "orange",
    "green",
    "purple",
    "#3b5999",
    "#2db7f5",
    "#87d068",
    "#108ee9"
  ];
  const tagColor = (value: any) => {
    const hash: any = Array.from(value).reduce((acc: any, char: any) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };
  return {
    crudOptions: {
      request: {
        pageRequest,
        addRequest,
        editRequest,
        delRequest
      },
      container: {
        is: "fs-layout-card"
      },
      form: {
        // group: {
        //   groupType: "tabs", //collapse， tabs
        //   accordion: false,
        //   groups: {
        //     base: {
        //       tab: "按用户",
        //       icon: "el-icon-goods",
        //       columns: ["title", "target_user", "content"]
        //     },
        //     price: {
        //       tab: "按角色",
        //       icon: "el-icon-price-tag",
        //       columns: ["title", "target_role", "content"]
        //     },
        //     info: {
        //       tab: "按部门",
        //       collapsed: true, //默认折叠
        //       icon: "el-icon-warning-outline",
        //       columns: ["title", "target_dept", "content"],
        //     },
        //     content: {
        //       tab: "通知公告",
        //       collapsed: true, //默认折叠
        //       icon: "el-icon-warning-outline",
        //       columns: ["title", "content"],
        //     },
        //   },
        // }
      },
      addForm: {
        initialForm: {
          disabledSelect: false
        }
      },
      actionbar: {
        buttons: {
          add: {
            show: computed(() => {
              return tabActivted.value !== "receive" && auth("messageCenter:Create");
            })
          }
        }
      },
      rowHandle: {
        fixed: "right",
        width: 150,
        buttons: {
          edit: {
            show: false
          },
          view: {
            text: "",
            iconRight: "emojione:eye-in-speech-bubble",
            tooltip: {
              is: "a-tooltip",
              placement: "top",
              title: $t("system.N00307")
            },
            show: auth("messageCenter:Search"),
            async click({ index, row }) {
              await crudExpose.openView({ index, row });
              if (tabActivted.value === "receive") {
                await viewRequest({ row });
                await crudExpose.doRefresh();
              }
            }
          },
          remove: {
            text: "",
            iconRight: "icon-park:delete",
            show: auth("messageCenter:Delete"),
            tooltip: {
              is: "a-tooltip",
              placement: "top",
              title: $t("system.N00078")
            }
          }
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
          title: "id",
          column: {
            show: false,
            width: 75
          },
          form: {
            show: false
          }
        },
        send_user_info: {
          title: $t('system.N00724'),
          type: "text",
          form: {
            show: false
          },
          column: {
            cellRender({ row }) {
              return (
                <a-tag
                  color={tagColor(row.send_user_info?.username)}>{row.send_user_info?.username}</a-tag>
              );
            },
            show: computed(() => {
              return tabActivted.value === "receive";
            }),
            width: 120
          }
        },
        title: {
          title: $t("system.N00311"),
          search: {
            show: true,
            col: {
              span: 5
            }
          },
          type: ["text", "colspan"],
          column: {
            width: 120
          },
          form: {
            labelCol: {
              span: 3
            },
            rules: [
              // 表单校验规则
              {
                required: true,
                message: $t("system.N00190")
              }
            ],
            component: { span: 24, placeholder: $t("system.N00463") }
          }
        },
        is_read: {
          title: $t("system.N00272"),
          type: "dict-select",
          column: {
            show: IsReadFunc,
            width: 100
          },
          dict: dict({
            data: [
              { label: $t("system.N00176"), value: true, color: "success" },
              { label: $t("system.N00295"), value: false, color: "purple" }
            ]
          }),
          form: {
            show: false
          }
        },
        target_type: {
          title: $t("system.N00353"),
          type: ["dict-radio", "colspan"],
          column: {
            width: 120
          },
          dict: dict({
            data: [
              { value: 0, label: $t("system.N00218") },
              { value: 1, label: $t("system.N00219") },
              { value: 2, label: $t("system.N00220") },
              { value: 3, label: $t("system.N00519") }
            ]
          }),
          form: {
            labelCol: {
              span: 3
            },
            component: {
              optionName: "a-radio-button",
              buttonStyle: "solid"
            },
            rules: [
              {
                required: true,
                message: $t("system.N00191"),
                // @ts-ignore
                trigger: ["blur", "change"]
              }
            ]
          }
        },
        target_user: {
          title: $t("system.N00352"),
          search: {
            disabled: true
          },
          form: {
            labelCol: {
              span: 6
            },
            component: {
              name: shallowRef(tableSelector),
              vModel: "modelValue",
              disabledSelect: compute(({ row }) => {
                return row?.disabledSelect ?? true;
              }),
              displayLabel: compute(({ row }) => {
                if (row) {
                  return row?.user_info;
                }
                return null;
              }),
              tableConfig: {
                url: "/api/system/user/",
                label: "name",
                value: "id",
                columns: [
                  {
                    field: "#",
                    type: "checkbox",
                    width: 50
                  },
                  { type: "seq", width: 50 },
                  {
                    field: "username",
                    label: $t("system.N00500")
                  },
                  {
                    field: "name",
                    label: $t("system.N00342")
                  }
                ]
              }
            },
            show: compute(({ form }) => {
              return form.target_type === 0;
            }),
            rules: [
              // 表单校验规则
              {
                required: true,
                message: $t("system.N00190")
              }
            ]
          },
          column: {
            show: false,
            width: 120,
            component: {
              name: shallowRef(manyToMany),
              vModel: "modelValue",
              bindValue: compute(({ row }) => {
                return row.user_info;
              }),
              displayLabel: "name"
            }
          }
        },
        target_role: {
          title: $t("system.N00354"),
          search: {
            disabled: true
          },
          width: 130,
          form: {
            labelCol: {
              span: 6
            },
            component: {
              name: shallowRef(tableSelector),
              vModel: "modelValue",
              disabledSelect: compute(({ row }) => {
                return row?.disabledSelect ?? true;
              }),
              displayLabel: compute(({ row }) => {
                if (row) {
                  return row?.role_info;
                }
                return null;
              }),
              tableConfig: {
                url: "/api/system/role/",
                label: "name",
                value: "id",
                columns: [
                  {
                    field: "#",
                    type: "checkbox",
                    width: 50
                  },
                  { type: "seq", width: 50 },
                  {
                    field: "name",
                    label: $t("system.N00412")
                  },
                  {
                    field: "key",
                    label: $t("system.N00299")
                  }
                ]
              }
            },
            show: compute(({ form }) => {
              return form.target_type === 1;
            }),
            rules: [
              // 表单校验规则
              {
                required: true,
                message: $t("system.N00190")
              }
            ]
          },
          column: {
            show: false,
            width: 130,
            component: {
              name: shallowRef(manyToMany),
              vModel: "modelValue",
              bindValue: compute(({ row }) => {
                return row.role_info;
              }),
              displayLabel: "name"
            }
          }
        },
        target_dept: {
          title: $t("system.N00355"),
          search: {
            disabled: true
          },
          width: 130,
          type: "table-selector",
          form: {
            labelCol: {
              span: 6
            },
            component: {
              name: shallowRef(tableSelector),
              vModel: "modelValue",
              disabledSelect: compute(({ row }) => {
                return row?.disabledSelect ?? true;
              }),
              displayLabel: compute(({ form }) => {
                return form?.dept_info;
              }),
              tableConfig: {
                url: "/api/system/dept/all_dept/",
                label: "name",
                value: "id",
                isTree: true,
                columns: [
                  {
                    field: "#",
                    type: "checkbox",
                    width: 50
                  },
                  { type: "seq", width: 50 },
                  {
                    field: "name",
                    label: $t("system.N00526"),
                    width: 150,
                    treeNode: true
                  },
                  {
                    field: "parent_name",
                    label: $t("system.N00336")
                  }
                ]
              },
              treeProps: { parentField: "parent", rowField: "id" }
            },
            show: compute(({ form }) => {
              return form.target_type === 2;
            }),
            rules: [
              // 表单校验规则
              {
                required: true,
                message: $t("system.N00190")
              }
            ]
          },
          column: {
            show: false,
            width: 130,
            component: {
              name: shallowRef(manyToMany),
              vModel: "modelValue",
              bindValue: compute(({ row }) => {
                return row.dept_info;
              }),
              displayLabel: "name"
            }
          }
        },
        content: {
          title: $t("system.N00065"),
          column: {
            width: 300,
            show: false
          },
          type: ["editor-wang5", "colspan"],
          form: {
            labelCol: {
              span: 3
            },
            rules: [
              // 表单校验规则
              {
                required: true,
                message: $t("system.N00190")
              }
            ],
            component: {
              disabled: false,
              id: "1", // 当同一个页面有多个editor时，需要配置不同的id
              editorConfig: {
                // 是否只读
                readOnly: compute((context) => {
                  const { mode } = context;
                  return mode !== "add";
                })
              },
              uploader: {
                type: "form",
                buildUrl(res: any) {
                  return res.url;
                }
              }
            }
          }
        },
        create_datetime: {
          title: $t("system.N00323"),
          type: "text",
          column: {
            width: 120
          },
          form: {
            show: false
          }
        }
      }
    }
  };
}
