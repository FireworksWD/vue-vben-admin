import {$t} from '#/locales'
import * as api from './api';
import type {
  UserPageQuery,
  AddReq,
  DelReq,
  EditReq,
  CreateCrudOptionsProps,
  CreateCrudOptionsRet
} from '@fast-crud/fast-crud';

export const createCrudOptions = async function ({crudExpose}: CreateCrudOptionsProps): Promise<CreateCrudOptionsRet> {
  const pageRequest = async (query: UserPageQuery) => {
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
      actionbar: {
        buttons: {
          add: {
            show: false,
          },
        },
      },
      rowHandle: {
        fixed: 'right',
        width: 100,
        buttons: {
          view: {
            text: '',
            iconRight: 'emojione:eye-in-speech-bubble',
            tooltip: {
              is: 'a-tooltip',
              placement: 'top',
              title: $t('system.N00307'),
            },
          },
          edit: {
            show: false,
          },
          remove: {
            show: false,
          },
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
            formatter: (context) => {
              //计算序号,你可以自定义计算规则，此处为翻页累加
              let index = context.index ?? 1;
              let pagination = crudExpose!.crudBinding.value.pagination;
              return ((pagination!.currentPage ?? 1) - 1) * pagination!.pageSize + index + 1;
            },
          },
        },
        search: {
          title: $t('system.N00062'),
          column: {
            show: false,
          },
          search: {
            show: true,
            col: {
              span: 5
            },
            component: {
              props: {
                clearable: true,
              },
              placeholder: $t('system.N00436'),
            },
          },
          form: {
            show: false,
            component: {
              props: {
                clearable: true,
              },
            },
          },
        },
        request_modular: {
          title: $t('system.N00432'),
          search: {
            disabled: false,
          },
          type: 'text',
          column: {
            width: 100,
          },
          form: {
            disabled: true,
            component: {
              placeholder: $t('system.N00482'),
            },
          },
        },
        request_path: {
          title: $t('system.N00428'),
          search: {
            disabled: false,
          },
          type: 'text',
          column: {
            width: 200,
          },
          form: {
            disabled: true,
            component: {
              placeholder: $t('system.N00480'),
            },
          },
        },
        request_body: {
          column: {
            showOverflowTooltip: true,
            width: 200, //列宽
          },
          title: $t('system.N00427'),
          search: {
            disabled: true,
          },
          disabled: true,
          type: 'textarea',
          form: {
            component: {
              props: {
                type: 'textarea',
              },
              autosize: {
                minRows: 2,
                maxRows: 8,
              },
              placeholder: $t('system.N00436'),
            },
          },
        },
        request_method: {
          title: $t('system.N00431'),
          type: 'text',
          search: {
            disabled: false,
          },
          column: {
            width: 100,
          },
          form: {
            disabled: true,
            component: {
              placeholder: $t('system.N00481'),
            },
          },
          component: {props: {color: 'auto'}}, // 自动染色
        },
        request_msg: {
          title: $t('system.N00238'),
          disabled: true,
          type: 'text',
          column: {
            width: 100
          },
          form: {
            component: {
              span: 12,
              placeholder: '暂无数据!',
            },
          },
        },
        request_ip: {
          title: 'IP '+$t('system.N00119'),
          search: {
            disabled: false,
          },
          type: 'text',
          column: {
            width: 100,
          },
          form: {
            disabled: true,
            component: {
              placeholder: $t('system.N00434')+'IP'+$t('system.N00119'),
            },
          },
          component: {props: {color: 'auto'}}, // 自动染色
        },
        request_browser: {
          title: $t('system.N00433'),
          type: 'text',
          column: {
            width: 120,
          },
          form: {
            disabled: true,
          },
          component: {props: {color: 'auto'}}, // 自动染色
        },
        response_code: {
          title: $t('system.N00105'),
          search: {
            disabled: true,
          },
          type: 'text',
          column: {
            width: 100,
          },
          form: {
            disabled: true,
          },
          component: {props: {color: 'auto'}}, // 自动染色
        },
        request_os: {
          title: $t('system.N00237'),
          disabled: true,
          search: {
            disabled: true,
          },
          type: 'text',
          column: {
            width: 120,
          },
          form: {
            disabled: true,
          },
          component: {props: {color: 'auto'}}, // 自动染色
        },
        json_result: {
          title: $t('system.N00512'),
          search: {
            disabled: true,
          },
          type: 'text',
          column: {
            width: 150,
          },
          form: {
            disabled: true,
          },
          component: {props: {color: 'auto'}}, // 自动染色
        },
        creator_name: {
          title: $t('system.N00236'),
          type: 'text',
          column: {
            width: 100,
          },
          form: {
            disabled: true,
          },
        },
      },
    },
  };
};
