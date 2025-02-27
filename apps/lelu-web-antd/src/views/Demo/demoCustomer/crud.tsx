import {$t} from '#/locales'
/**
 * @author: Ethan
 * @contact: email:
 * @Created on: 2024/12/7 14:07
 * @Remark:
 **/
import type {
  AddReq,
  DelReq,
  EditReq,
  CreateCrudOptionsRet,
  CreateCrudOptionsProps,
  UserPageQuery,
  UserPageRes,
} from '@fast-crud/fast-crud';
import * as api from './api';
import {auth} from '#/utils/authFunction'
import {ref} from "vue";
import {summarySlots} from '#/utils/tableUtils/tableUtil'
import {Popover} from 'ant-design-vue'

export default function ({
                           crudExpose,
                           context,
                           expose
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
  const statsList = ref<any>({})

  const popoverContent = (record: any) => {
    return (
      <div>
        <p>Username: {record.first_name}</p>
        <p>Email: {record.email}</p>
        <p>Status: {record.status}</p>
        <p>Other Details: ...</p>
      </div>
    );
  }

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
        //@ts-ignore
        slots: {summary: () => summarySlots(expose.crudBinding.value.table, statsList)},
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
            show: auth('demo:Create')
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
            show: auth('demo:Update')
          },
          remove: {
            show: auth('demo:Delete')
          },
        },
      },
      columns: {
        _index: {
          title: $t('system.N00179'),
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
        first_name: {
          title: "First Name",
          type: "text",
          search: {
            show: true,
            col: {
              span: 6,
            }
          }
        },
        last_name: {
          title: "Last Name",
          type: "text",
          search: {show: false}
        },
        email: {
          title: "Email",
          type: "text",
          search: {show: false}
        },
        phone: {
          title: "Phone",
          type: "text",
          search: {show: false}
        },
        birthday: {
          title: "Birthday",
          type: "text",
          search: {show: false}
        },
        gender: {
          title: "Gender",
          type: "text",
          search: {show: false}
        },
        customer_type: {
          title: "CustomerType",
          type: "text",
          search: {show: false}
        },
        status: {
          title: "Status",
          type: "text",
          search: {show: false},
          column: {
            cellRender({row}) {
              return (
                <Popover
                  trigger="click"
                  content={popoverContent(row)}
                  title="Details"
                  placement="left"
                >
                  <a-button type="primary">Show Info</a-button>
                </Popover>
              )
            }
          }
        },
        created_at: {
          title: "Created At",
          type: "text",
          search: {show: false},
          form: {
            show: false
          }
        },
        updated_at: {
          title: "Updated At",
          type: "text",
          search: {show: false},
          form: {
            show: false
          }
        },
      }
    }
  };
}
