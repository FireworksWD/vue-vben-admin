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
import {dict, compute} from '@fast-crud/fast-crud';
import {requestClient} from '#/api/request';
import {dictionary} from '#/utils/dictionary';
import {auth} from '#/utils/authFunction'
import {message} from 'ant-design-vue'

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
            show: auth('api_white_list:Create')
          }
        }
      },
      rowHandle: {
        //固定右侧
        fixed: 'right',
        width: 150,
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
            show: auth("api_white_list:Update")
          },
          remove: {
            text: '',
            iconRight: 'icon-park:delete',
            tooltip: {
              is: 'a-tooltip',
              placement: 'top',
              title: $t('system.N00078'),
            },
            show: auth("api_white_list:Delete")
          },
        },
      },
      form: {
        col: {span: 24},
        labelWidth: '110px',
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
        search: {
          title: $t('system.N00062'),
          column: {
            show: false,
            width: 120,
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
        method: {
          title: $t('system.N00430'),
          sortable: 'custom',
          search: {
            disabled: false,
          },
          type: 'dict-select',
          dict: dict({
            data: [
              {
                label: 'GET',
                value: 0,
              },
              {
                label: 'POST',
                value: 1,
              },
              {
                label: 'PUT',
                value: 2,
              },
              {
                label: 'DELETE',
                value: 3,
              },
              {
                label: 'PATCH',
                value: 4,
              },
            ],
          }),
          column: {
            width: 120,
          },
          form: {
            rules: [
              // 表单校验规则
              {
                required: true,
                message: $t('system.N00190'),
              },
            ],
            component: {
              span: 12,
            },
            itemProps: {
              class: {yxtInput: true},
            },
          },
        },
        url: {
          title: $t('system.N00227'),
          sortable: 'custom',
          search: {
            disabled: true,
          },
          type: 'dict-select',
          dict: dict({
            async getData(_dict: any) {
              return requestClient.get('/swagger.json').then((ret: any) => {
                const res = Object.keys(ret.paths);
                const data = [];
                for (const item of res) {
                  const obj = {label: '', value: ''};
                  obj.label = item;
                  obj.value = item;
                  data.push(obj);
                }
                return data;
              });
            },
          }),
          column: {
            width: 200,
          },
          form: {
            rules: [
              // 表单校验规则
              {
                required: true,
                message: $t('system.N00190'),
              },
            ],
            component: {
              span: 24,
              props: {
                // mode:'tags',
                showSearch:true,
                allowClear: true,
              },
            },
            itemProps: {
              class: {yxtInput: true},
            },
            helper: {
              position: 'label',
              tooltip: {
                is: 'a-tooltip',
                placement: 'top',
                title: '请正确填写，以免请求时被拦截。匹配单例使用正则,例如:/api/xx/.*?/',
              },
              text: '请正确填写，以免请求时被拦截。匹配单例使用正则,例如:/api/xx/.*?/',
            },
          },
        },
        enable_datasource: {
          title: $t('system.N00246'),
          search: {
            disabled: false,
          },
          type: 'dict-radio',
          column: {
            width: 120,
            component: {
              name: 'fs-dict-switch',
              vModel: 'checked',
              onChange: compute((context) => {
                return () => {
                  api.UpdateObj(context.row).then((res: any) => {
                    message.success(res.msg as string);
                  });
                };
              }),
            },
          },
          dict: dict({
            data: dictionary('button_status_bool'),
          }),
        },
      },
    },
  };
};
