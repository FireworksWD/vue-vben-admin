import {$t} from '#/locales'
import type {
  AddReq,
  DelReq,
  EditReq,
  PageQuery,
  CreateCrudOptionsRet,
  CreateCrudOptionsProps,
} from '@fast-crud/fast-crud';
import {dict} from '@fast-crud/fast-crud';
import * as api from './api';
import {auth} from '#/utils/authFunction'
import {requestClient} from '#/api/request';
import {message, notification} from 'ant-design-vue';
import {ref} from "vue";
//此处为crudOptions配置
export const createCrudOptions = function ({
                                             crudExpose,
                                             context
                                           }: CreateCrudOptionsProps): CreateCrudOptionsRet {
  const pageRequest = async (query:PageQuery) => {
    if (context!.selectOptions.value.id) {
      return await api.GetList({menu: context!.selectOptions.value.id,...query} as any);
    } else {
      return undefined;
    }
  };
  const editRequest = async ({form, row}: EditReq) => {
    return await api.UpdateObj({...form, menu: row.menu});
  };
  const delRequest = async ({row}: DelReq) => {
    return await api.DelObj(row.id);
  };
  const addRequest = async ({form}: AddReq) => {
    return await api.AddObj({...form, ...{menu: context!.selectOptions.value.id}});
  };
  const selectedRows = ref([]);
  const onSelectChange = (changed: any) => {
    selectedRows.value = changed;
  };
  return {
    selectedRows,
    crudOptions: {
      table: {
        rowKey: "id",
        rowSelection: {
          selectedRowKeys: selectedRows,
          onChange: onSelectChange,

        }
      },
      pagination: {
        show: false,
      },
      actionbar: {
        buttons: {
          add: {
            show: auth('btn:Create')
          },
          batchAdd: {
            show: true,
            type: 'primary',
            text: $t('system.N00213'),
            click: async () => {
              try {
                if (context!.selectOptions.value.id == undefined) {
                  message.error($t('system.N00495'));
                  return;
                }
                const result = await api.BatchAdd({menu: context!.selectOptions.value.id});
                if (result.code == 2000) {
                  notification['success']({message: result.msg});
                  await crudExpose.doRefresh();
                }
              }catch (error) {
                // notification.error({message: '数据已存在'});
              }
            },
          },
        },
      },
      rowHandle: {
        //固定右侧
        fixed: 'right',
        width: 200,
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
            show: auth('btn:Update')
          },
          remove: {
            text: '',
            iconRight: 'icon-park:delete',
            tooltip: {
              is: 'a-tooltip',
              placement: 'top',
              title: $t('system.N00078'),
            },
            show: auth('btn:Delete')
          },
        },
      },
      request: {
        pageRequest,
        addRequest,
        editRequest,
        delRequest,
      },
      form: {
        display: "flex",
        labelCol: {
          //固定label宽度
          span: null,
          style: {
            width: "120px"
          }
        },
        wrapperCol: {
          span: null
        }
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
          title: 'ID',
          type: 'text',
          column: {show: false,width:100},
          search: {show: false},
          form: {show: false},
        },
        name: {
          title: $t('system.N00297'),
          type: 'text',
          search: {
            show: true,
            col:{
              span:7
            }
          },
          column: {
            width: 120,
            sortable: true,
          },
          form: {
            rules: [{required: true, message: $t('system.N00298')}],
            component: {
              placeholder: $t('system.N00507'),
              props: {
                clearable: true,
                allowCreate: true,
                filterable: true,
              },
            },
            helper: {
              render() {
                return <a-alert message={$t('system.N00207')} type="warning"
                                 description={$t('system.N00542')}/>;
              },
            },
          },
        },
        value: {
          title: $t('system.N00296'),
          type: 'text',
          search: {show: false},
          column: {
            width: 200,
            sortable: true,
          },
          form: {
            rules: [{required: true, message: $t('system.N00300')}],
            placeholder: $t('system.N00508'),
            helper: {
              render() {
                return <a-alert message={$t('system.N00106')} type="warning"
                                 description={$t('system.N00341')}/>;
              },
            },
          },
        },
        method: {
          title: $t('system.N00430'),
          search: {show: false},
          type: 'dict-select',
          column: {
            width: 120,
            sortable: true,
          },
          dict: dict({
            data: [
              {label: 'GET', value: 0},
              {label: 'POST', value: 1, color: 'success'},
              {label: 'PUT', value: 2, color: 'warning'},
              {label: 'DELETE', value: 3, color: 'error'},
            ],
          }),
          form: {
            rules: [{required: true, message: $t('system.N00190')}],
          },
        },
        api: {
          title: $t('system.N00227'),
          search: {show: false},
          type: 'dict-select',
          dict: dict({
            getData() {
              return requestClient.get('/swagger.json').then((res: any) => {
                const ret = Object.keys(res.paths);
                const data = [];
                for (const item of ret) {
                  const obj: any = {};
                  obj.label = item;
                  obj.value = item;
                  data.push(obj);
                }
                return data;
              });
            },
          }),
          column: {
            width: 250,
            sortable: true,
          },
          form: {
            rules: [{required: true, message: $t('system.N00190')}],
            component: {
              props: {
                // mode:'tags',
                showSearch:true,
                allowClear: true,
              },
            },
            helper: {
              render() {
                return <a-alert
                  message={$t('system.N00556')+":/api/xx/.*?/"}
                  type="warning"/>;
              },
            },
          },
        },
      },
    },
  };
};
