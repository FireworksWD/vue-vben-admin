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
import {dictionary} from '#/utils/dictionary';
import {nextTick} from 'vue';
import {message} from 'ant-design-vue';
import {auth} from '#/utils/authFunction';

export const createCrudOptions = function ({
                                             crudExpose,
                                             context
                                           }: CreateCrudOptionsProps): CreateCrudOptionsRet {
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
      form: {
        col: {span: 24},
        labelWidth: '100px',
        wrapper: {
          is: 'a-modal',
          width: '600px',
        },
      },
      rowHandle: {
        fixed: 'right',
        width: 200,
        buttons: {
          view: {
            show: false,
          },
          edit: {
            text: '',
            iconRight: "fluent-color:clipboard-text-edit-20",
            show: auth('dictionary:Update'),
            tooltip: {
              is: 'a-tooltip',
              placement: 'top',
              title: $t('system.N00395'),
            },
          },
          remove: {
            text: '',
            iconRight: 'icon-park:delete',
            show: auth('dictionary:Delete'),
            tooltip: {
              is: 'a-tooltip',
              placement: 'top',
              title: $t('system.N00078'),
            },
          },
          custom: {
            text: '',
            title: '',
            iconRight: 'line-md:edit-filled',
            show: auth('dictionary:Update'),
            tooltip: {
              is: 'a-tooltip',
              placement: 'top',
              title: $t('system.N00143'),
            },
            //@ts-ignore
            click: (ctx: any) => {
              const {row} = ctx;
              context!.subDictRef.value.drawer = true;
              nextTick(() => {
                context!.subDictRef.value.setSearchFormData({form: {parent: row.id}});
                context!.subDictRef.value.doRefresh();
              });
            },
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
              // @ts-ignore
              return ((pagination.currentPage ?? 1) - 1) * pagination.pageSize + index + 1;
            },
          },
        },
        search: {
          title: $t('system.N00062'),
          column: {
            show: false,
            width: '70px',
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
        label: {
          title: $t('system.N00139'),
          search: {
            show: true,
            col: {
              span: 5
            },
            component: {
              props: {
                clearable: true,
              },
            },
          },
          type: 'text',
          column: {
            width: 120,
            //@ts-ignore
            formatter({value, row, index}) {
              return $t(value)
            }
          },
          form: {
            rules: [
              // 表单校验规则
              {required: true, message: $t('system.N00140')},
            ],
            component: {
              props: {
                clearable: true,
              },
              placeholder: $t('system.N00452'),
            },
          },
        },
        value: {
          title: $t('system.N00141'),
          search: {
            disabled: true,
            component: {
              props: {
                clearable: true,
              },
            },
          },
          type: 'text',
          column: {
            width: 120,
          },
          form: {
            rules: [
              // 表单校验规则
              {required: true, message: $t('system.N00142')},
            ],
            component: {
              props: {
                clearable: true,
              },
              placeholder: $t('system.N00453'),
            },
            helper: {
              render(_h) {
                return <a-alert
                  message={$t('system.N00042') + ":dictionary('" + $t('system.N00141') + "')"}
                  type="warning"/>;
              },
            },
          },
        },
        status: {
          title: $t('system.N00337'),
          search: {
            valueResolve(context: any) {
              const {key, value, form} = context;//  <------注意这里是form，不是row
              if (value != null) {
                form[key] = value === 'true';
              }
            },
            show: true,
            component: {
              placeholder: $t('system.N00488'),
              name: 'a-select',
              vModel: 'value',
              options: dictionary('button_status_bool').map((item: any) => ({
                value: String(item.value), // 将 value 转换为字符串
                label: $t(item.label)
              })),
            },
          },
          type: 'dict-radio',
          column: {
            width: 90,
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
        sort: {
          title: $t('system.N00223'),
          type: 'number',
          column: {
            width: 80,
          },
          form: {
            value: 1,
          },
        },
      },
    },
  };
};
