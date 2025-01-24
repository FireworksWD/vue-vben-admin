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
import {dict} from '@fast-crud/fast-crud';
import {commonCrudConfig} from "#/utils/commonCrud";

export const createCrudOptions = function ({crudExpose}: CreateCrudOptionsProps): CreateCrudOptionsRet {
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
            width: 100
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
        username: {
          title: $t('system.N00348'),
          search: {
            disabled: false,
          },
          type: 'text',
          column: {
            width: 120,
          },
          form: {
            disabled: true,
            component: {
              placeholder: $t('system.N00470'),
            },
          },
        },
        ip: {
          title: $t('system.N00347')+" ip",
          search: {
            disabled: false,
          },
          type: 'text',
          column: {
            width: 120,
          },
          form: {
            disabled: true,
            component: {
              placeholder: '请输入登录ip',
            },
          },
        },
        isp: {
          title: $t('system.N00510'),
          search: {
            disabled: true,
          },
          disabled: true,
          type: 'text',
          column: {
            width: 120,
          },
          form: {
            component: {
              placeholder: $t('system.N00485'),
            },
          },
        },
        continent: {
          title: $t('system.N00126'),
          type: 'text',
          column: {
            width: 90,
          },
          form: {
            disabled: true,
            component: {
              placeholder: $t('system.N00450'),
            },
          },
          component: {props: {color: 'auto'}}, // 自动染色
        },
        country: {
          title: $t('system.N00110'),
          type: 'text',
          column: {
            width: 90,
          },
          form: {
            component: {
              placeholder: $t('system.N00445'),
            },
          },
          component: {props: {color: 'auto'}}, // 自动染色
        },
        province: {
          title: $t('system.N00357'),
          type: 'text',
          column: {
            width: 80,
          },
          form: {
            component: {
              placeholder: $t('system.N00471'),
            },
          },
          component: {props: {color: 'auto'}}, // 自动染色
        },
        city: {
          title: $t('system.N00120'),
          type: 'text',
          column: {
            width: 80,
          },
          form: {
            component: {
              placeholder: $t('system.N00447'),
            },
          },
          component: {props: {color: 'auto'}}, // 自动染色
        },
        district: {
          title: $t('system.N00087'),
          key: '',
          type: 'text',
          column: {
            width: 80,
          },
          form: {
            component: {
              placeholder: $t('system.N00443'),
            },
          },
          component: {props: {color: 'auto'}}, // 自动染色
        },
        area_code: {
          title: $t('system.N00084'),
          type: 'text',
          column: {
            width: 90,
          },
          form: {
            component: {
              placeholder: $t('system.N00440'),
            },
          },
          component: {props: {color: 'auto'}}, // 自动染色
        },
        country_english: {
          title: $t('system.N00405'),
          type: 'text',
          column: {
            width: 120,
          },
          form: {
            component: {
              placeholder: $t('system.N00477'),
            },
          },
          component: {props: {color: 'auto'}}, // 自动染色
        },
        country_code: {
          title: $t('system.N00381'),
          type: 'text',
          column: {
            width: 100,
          },
          form: {
            component: {
              placeholder: $t('system.N00472'),
            },
          },
          component: {props: {color: 'auto'}}, // 自动染色
        },
        longitude: {
          title: $t('system.N00391'),
          type: 'text',
          disabled: true,
          column: {
            width: 100,
          },
          form: {
            component: {
              placeholder: $t('system.N00476'),
            },
          },
          component: {props: {color: 'auto'}}, // 自动染色
        },
        latitude: {
          title: $t('system.N00386'),
          type: 'text',
          disabled: true,
          column: {
            width: 100,
          },
          form: {
            component: {
              placeholder: $t('system.N00473'),
            },
          },
          component: {props: {color: 'auto'}}, // 自动染色
        },
        login_type: {
          title: $t('system.N00349'),
          type: 'dict-select',
          search: {
            disabled: false,
          },
          dict: dict({
            data: [
              {label: $t('system.N00279'), value: 1},
              {label: $t('system.N00189'), value: 2},
            ],
          }),
          column: {
            width: 120,
          },
          form: {
            component: {
              placeholder: $t('system.N00494'),
            },
          },
        },
        os: {
          title: $t('system.N00237'),
          type: 'text',
          column: {
            width: 120,
          },
          form: {
            component: {
              placeholder: $t('system.N00458'),
            },
          },
        },
        browser: {
          title: $t('system.N00321'),
          type: 'text',
          column: {
            width: 120,
          },
          form: {
            component: {
              placeholder: $t('system.N00468'),
            },
          },
        },
        agent: {
          title: "Agent "+$t('system.N00050'),
          disabled: true,
          type: 'text',
          column: {
            width: 180,
          },
          form: {
            component: {
              placeholder: $t('system.N00434')+" agent "+$t('system.N00050'),
            },
          },
        },
        ...commonCrudConfig({
          create_datetime: {
            search: true
          }
        })
      },
    },
  };
};
