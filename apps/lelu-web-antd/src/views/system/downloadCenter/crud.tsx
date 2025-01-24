import {$t} from '#/locales'
import type {
  CrudOptions,
  AddReq,
  DelReq,
  EditReq,
  CreateCrudOptionsProps
} from '@fast-crud/fast-crud';
import {dict, compute} from '@fast-crud/fast-crud';
import * as api from './api';

interface CreateCrudOptionsTypes {
  output: any;
  crudOptions: CrudOptions;
}

//此处为crudOptions配置
export const createCrudOptions = function ({crudExpose}: CreateCrudOptionsProps): CreateCrudOptionsTypes {
  const pageRequest = async (query: any) => {
    return await api.GetList(query);
  };
  const editRequest = async ({form, row}: EditReq) => {
    form.id = row.id;
    return await api.UpdateObj(form);
  };
  const delRequest = async ({row}: DelReq) => {
    return await api.DelObj(row.id);
  };
  const addRequest = async ({form}: AddReq) => {
    return await api.AddObj(form);
  };

  //权限判定

  // @ts-ignore
  // @ts-ignore
  return {
    crudOptions: {
      request: {
        pageRequest,
        addRequest,
        editRequest,
        delRequest,
      },
      container: {
        is: "fs-layout-card"
      },
      pagination: {
        show: true
      },
      actionbar: {
        buttons: {
          add: {
            show: false
          }
        }
      },
      toolbar: {
        buttons: {
          export: {
            show: false
          }
        }
      },
      rowHandle: {
        //固定右侧
        fixed: 'right',
        width: 120,
        buttons: {
          view: {
            show: false
          },
          edit: {
            show: false
          },
          remove: {
            show: false
          },
          download: {
            //@ts-ignore
            show: compute(ctx => ctx.row.task_status === 2),
            text: $t('system.N00012'),
            type: 'warning',
            click: (ctx) => window.open(ctx.row.url, '_blank')
          }
        },
      },
      form: {
        col: {span: 24},
        labelWidth: '100px',
        wrapper: {
          is: 'a-modal',
          width: '600px',
        },
      },
      columns: {
        _index: {
          title: $t('system.N00179'),
          form: {show: false},
          column: {
            //type: 'index',
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
        task_name: {
          title: $t('system.N00035'),
          type: 'text',
          column: {
            width: 160,
            align: 'left'
          },
          search: {
            show: true,
            col: {
              span: 5
            },
            component: {
              placeholder: $t('system.N00434'),
            },
          }
        },
        file_name: {
          title: $t('system.N00250'),
          type: 'text',
          column: {
            width: 160,
            align: 'left'
          },
          search: {
            show: true,
            col: {
              span: 5,
            },
            component: {
              placeholder: $t('system.N00434'),
            },
          }
        },
        size: {
          title: $t('system.N00253') + '(b)',
          type: 'number',
          column: {
            width: 100
          }
        },
        task_status: {
          title: $t('system.N00039'),
          type: 'dict-select',
          dict: dict({
            data: [
              {label: $t('system.N00038'), value: 0},
              {label: $t('system.N00040'), value: 1},
              {label: $t('system.N00037'), value: 2},
              {label: $t('system.N00036'), value: 3},
            ]
          }),
          column: {
            width: 120
          },
          search: {
            show: true,
            component: {
              placeholder: $t('system.N00488'),
            },
          }
        },
        create_datetime: {
          title: $t('system.N00076'),
          column: {
            width: 160
          }
        },
        update_datetime: {
          title: $t('system.N00076'),
          column: {
            width: 160
          }
        }
      },
    },
  };
};
