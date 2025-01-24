import {$t} from '#/locales'
import * as api from './api';
import type {
  UserPageQuery,
  AddReq,
  DelReq,
  EditReq,
  compute,
  CreateCrudOptionsProps,
  CreateCrudOptionsRet, PageQuery
} from '@fast-crud/fast-crud';
import {dict} from '@fast-crud/fast-crud';
import {auth} from "#/utils/authFunction";
import {ref} from "vue";


export const createCrudOptions = function ({
                                             crudExpose,
                                             context
                                           }: CreateCrudOptionsProps): CreateCrudOptionsRet {
  const pageRequest = async (query: PageQuery) => {
    // return await api.GetList(query);
    if (context?.selectOptions.value.id) {
      return await api.GetList({menu: context?.selectOptions.value.id, ...query} as any);
    } else {
      return undefined;
    }
  };
  const editRequest = async ({form, row}: EditReq) => {
    form.id = row.id;
    return await api.UpdateObj(form);
  };
  const delRequest = async ({row}: DelReq) => {
    return await api.DelObj(row.id);
  };
  const addRequest = async ({form}: AddReq) => {
    form.menu = context?.selectOptions.value.id;
    return await api.AddObj(form);
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
      request: {
        pageRequest,
        addRequest,
        editRequest,
        delRequest,
      },
      pagination: {
        show: false,
      },
      actionbar: {
        buttons: {
          add: {
            show: auth('column:Create')
          },
          auto: {
            text: $t('system.N00403'),
            type: 'primary',
            show: auth('column:Match'),
            click: () => {
              return context.modelDialog.value = true;
            },
          },
        },
      },
      rowHandle: {
        //固定右侧
        fixed: 'right',
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
            show: auth('column:Update')
          },
          remove: {
            text: '',
            iconRight: 'icon-park:delete',
            tooltip: {
              is: 'a-tooltip',
              placement: 'top',
              title: $t('system.N00078'),
            },
            show: auth('column:Delete')
          },
        },
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
        model: {
          title: 'model',
          type: 'dict-select',
          dict: dict({
            url: '/api/system/column/get_models/',
            label: 'title',
            value: 'key'
          }),
          column: {
            sortable: true,
            width: 100,
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
              showSearch: true,
              filterable: true,
              //默认的filterOption仅支持value的过滤，label并不会加入查询
              //所以需要自定义filterOption
              filterOption(inputValue: any, option: any) {
                return option.label.indexOf(inputValue) >= 0 || option.value.indexOf(inputValue) >= 0;
              }
            },
          },
        },
        title: {
          title: $t('system.N00024'),
          sortable: 'custom',
          column: {
            width: 120,
          },
          search: {
            show: true,
            col: {
              span: 7
            }
          },
          type: 'text',
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
              placeholder: $t('system.N00435'),
            },
          },
        },
        field_name: {
          title: $t('system.N00145'),
          type: 'text',
          search: {
            show: true,
            col: {
              span: 7
            }
          },
          column: {
            sortable: true,
            width: 120
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
              placeholder: $t('system.N00454'),
            },
          },
        },
      },
    },
  };
};
