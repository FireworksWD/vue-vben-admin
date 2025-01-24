import type {
  AddReq,
  CreateCrudOptionsProps,
  CreateCrudOptionsRet, DelReq, EditReq,
  UserPageQuery, UserPageRes
} from "@fast-crud/fast-crud";
import * as api from "./api";
import {ref} from "vue";
import {auth} from "#/utils/authFunction";

/**
 * @author: Ethan
 * @contact: email:
 * @Created on: 2025/1/8 10:50
 * @Remark:
 **/
export default function ({
                           crudExpose,
                           context
                         }: CreateCrudOptionsProps): CreateCrudOptionsRet {
  const pageRequest = async (query: UserPageQuery): Promise<UserPageRes> => {
    return await api.GetList(query);
  };
  const editRequest = async ({form, row}: EditReq) => {
    if (form.id == null) {
      form.id = row.id;
    }
    return await api.UpdateObj(form);
  };
  const delRequest = async ({row}: DelReq) => {
    return await api.DelObj(row.id);
  };

  const addRequest = async ({form}: AddReq) => {
    return await api.AddObj(form);
  };

  const selectedRowKeys = ref([]);
  context.selectedRowKeys = selectedRowKeys;

  const onSelectChange = (changed: any) => {
    selectedRowKeys.value = changed;
  };

  return {
    selectedRowKeys,
    crudOptions: {
      table: {
        rowKey: "id",
        rowSelection: {
          selectedRowKeys: selectedRowKeys,
          onChange: onSelectChange,
          getCheckboxProps: (record: any) => ({
            disabled: record.id === 1
          })
        },
      },
      request: {
        pageRequest,
        addRequest,
        editRequest,
        delRequest
      },
      container: {
        is: "fs-layout-card"
      },
      actionbar: {
        buttons: {
          add: {
            show: auth('btn:Create')
          },
        }
      },
      rowHandle: {
        //固定右侧
        fixed: 'right',
        width: 200,
        buttons: {
          view: {},
          edit: {
            show: auth('btn:Update')
          },
          remove: {
            show: auth('btn:Delete')
          },
        },
      },
      columns: {
        _index: {
          title: '序号',
          form: {show: false},
          column: {
            // type: 'number',
            align: 'center',
            width: '70px',
            columnSetDisabled: true, //禁止在列设置中选择
            //@ts-ignore
            formatter: (context) => {
              //计算序号,你可以自定义计算规则，此处为翻页累加
              let index = context.index ?? 1;
              let pagination: any = crudExpose!.crudBinding.value.pagination;
              return ((pagination.currentPage ?? 1) - 1) * pagination.pageSize + index + 1;
            },
          },
        },
        id: {
          title: "ID",
          type: "number",
          column: {show: false, width: 100},
          search: {show: false},
          form: {show: false},
        },
        name: {
          title: "Name",
          type: "text",
          search: {
            show: true,
            col: {
              span: 6,
            }
          }
        },
        remark: {
          title: "remark",
          type: "text",
          search: {show: false}
        },
        gender: {
          title: "Gender",
          type: "text",
          search: {show: false}
        },
        age: {
          title: "Age",
          type: "text",
          search: {show: false}
        },
      }
    }
  };
}
