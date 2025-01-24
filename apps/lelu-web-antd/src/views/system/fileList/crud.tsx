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
      actionbar: {
        buttons: {
          add: {
            show: false,
          },
        },
      },
      request: {
        pageRequest,
        addRequest,
        editRequest,
        delRequest,
      },
      rowHandle: {
        //固定右侧
        fixed: 'right',
        width: 200,
        show: false,
        buttons: {
          view: {
            show: false,
          },
          edit: {
            text: '',
            iconRight: "fluent-color:clipboard-text-edit-20",
            tooltip: {
              is: 'a-tooltip',
              placement: 'top',
              title: $t('system.N00395'),
            },
          },
          remove: {
            text: '',
            iconRight: 'icon-park:delete',
            tooltip: {
              is: 'a-tooltip',
              placement: 'top',
              title: $t('system.N00078'),
            },
          },
        },
      },
      container: {
        is: "fs-layout-card"
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
            width: 100,
          },
          search: {
            show: true,
            col:{
              span:5
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
        name: {
          title: $t('system.N00251'),
          search: {
            show: true,
            col:{
              span:5
            }
          },
          type: 'text',
          column: {
            width: 120,
          },
          form: {
            component: {
              placeholder: $t('system.N00460'),
            },
          },
        },
        url: {
          title: $t('system.N00252'),
          type: 'file-uploader',
          search: {
            disabled: true,
          },
          column: {
            width: 200,
          },
        },
        md5sum: {
          title: '文件MD5',
          search: {
            disabled: true,
          },
          column: {
            width: 120,
          },
          form: {
            disabled: false,
          },
        },
      },
    },
  };
};
