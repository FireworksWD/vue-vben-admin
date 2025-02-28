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
import {dict, compute,} from '@fast-crud/fast-crud';
import {dictionary} from '#/utils/dictionary';
import {notification} from 'ant-design-vue';
import {auth} from '#/utils/authFunction';
import {SystemConfigStore} from "#/store/systemConfig";
import {storeToRefs} from "pinia";
import {createVNode, ref, computed} from "vue";
import {Md5} from 'ts-md5';
import {commonCrudConfig} from "#/utils/commonCrud";
import {Modal} from 'ant-design-vue';
import {ExclamationCircleOutlined} from '@ant-design/icons-vue';
import {requestClient} from "#/api/request";
import XEUtils from "xe-utils";

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

  const exportRequest = async (query: UserPageQuery) => {
    return await api.exportData(query);
  }

  const resetToDefaultPasswordRequest = async (row: EditReq) => {
    await api.resetToDefaultPassword(row.id)
    notification.success({message: $t('system.N00537')})
  }

  const systemConfigStore = SystemConfigStore()
  const {systemConfig} = storeToRefs(systemConfigStore)

  const selectedRows = ref([]);
  const onSelectChange = (changed: any) => {
    selectedRows.value = changed;
  };
  return {
    selectedRows,
    crudOptions: {
      search: {
        options: {
          labelAlign: 'right'
        }
      },
      container: {
        is: "fs-layout-card"
      },
      toolbar: {
        show: true
      },
      table: {
        rowKey: "id",
        rowSelection: {
          selectedRowKeys: selectedRows,
          onChange: onSelectChange,

        },
        remove: {
          confirmMessage: $t('system.N00269'),
        }
      },
      request: {
        pageRequest,
        addRequest,
        editRequest,
        delRequest,
      },
      form: {
        initialForm: {
          password: computed(() => {
              return systemConfig.value['base.default_password']
          }),
        }
      },
      actionbar: {
        scroll: {x: 1200},
        buttons: {
          add: {
            show: auth('user:Create')
          },
          export: {
            text: $t('system.N00162'),//按钮文字
            title: $t('system.N00162'),//鼠标停留显示的信息
            show: auth('user:Export'),
            click() {
              return exportRequest(crudExpose!.getSearchFormData())
            }
          }
        }
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
            show: auth('user:Update'),
            tooltip: {
              is: 'a-tooltip',
              placement: 'top',
              title: $t('system.N00395'),
            },
          },
          remove: {
            text: '',
            iconRight: 'icon-park:delete',
            // type: 'primary',
            show: auth('user:Delete'),
            tooltip: {
              is: 'a-tooltip',
              placement: 'top',
              title: $t('system.N00078'),
            },
          },
          custom: {
            text: 'reset',
            type: 'primary',
            show: auth('user:ResetPassword'),
            tooltip: {
              is: 'a-tooltip',
              placement: 'top',
              title: $t('system.N00538'),
            },
            //@ts-ignore
            click: async (ctx: any) => {
              Modal.confirm({
                title: $t('system.N00366')+'?',
                icon: createVNode(ExclamationCircleOutlined),
                content: createVNode('div', {style: 'color:red;'}, 'Reset Password: admin123456'),
                onOk: async () => {
                  const {row} = ctx;
                  await resetToDefaultPasswordRequest(row)
                },
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
        username: {
          title: $t('system.N00500'),
          search: {
            show: true,
            col: {
              span: 6
            }
          },
          type: 'text',
          column: {
            width: 100,
          },
          form: {
            rules: [
              // 表单校验规则
              {
                required: true,
                message: $t('system.N00502'),
              },
            ],
            component: {
              placeholder: $t('system.N00483'),
            },
          },
        },
        password: {
          title: $t('system.N00154'),
          type: 'password',
          column: {
            show: false,
            width: 120
          },
          editForm: {
            show: false,
          },
          form: {
            rules: [
              // 表单校验规则
              {
                required: true,
                message: $t('system.N00158'),
              },
            ],
            component: {

              span: 12,
              showPassword: true,
              placeholder: $t('system.N00455'),
            },
          },
          valueResolve({form}) {
            if (form.password) {
              form.password = Md5.hashStr(form.password)
            }
          }
        },
        name: {
          title: $t('system.N00136'),
          search: {
            show: false,
            col: {
              span: 6
            }
          },
          type: 'text',
          column: {
            width: 100, //最小列宽
          },
          form: {
            rules: [
              // 表单校验规则
              {
                required: true,
                message: $t('system.N00137'),
              },
            ],
            component: {
              span: 12,
              placeholder: $t('system.N00451'),
            },
          },
        },
        dept: {
          title: $t('system.N00522'),
          search: {
            disabled: true,
          },
          type: 'dict-tree',
          dict: dict({
            // isTree: true,
            // url: '/api/system/dept/all_dept/',
            // value: 'id',
            // label: 'name',
            async getData(_dict: any) {
              return requestClient.get('/api/system/dept/all_dept/').then((ret: any) => {
                const res = ret.data;
                const data = [];
                for (const item of res) {
                  const obj = {label: '', value: '', parent: {}, id: '', parentId: ''};
                  obj.label = $t(item.name);
                  obj.value = item.id;
                  obj.parentId = item.parent;
                  obj.id = item.id;
                  obj.parent = {'id': item.parent}
                  data.push(obj);
                }
                return XEUtils.toArrayTree(data, {
                  parentKey: 'parentId',
                  children: 'children',
                });
              });
            },
          }),
          column: {
            width: 150, //最小列宽
            // @ts-ignore
            formatter({value, row, index}) {
              return $t(row.dept_name)
            }
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
              // showSearch: true,
              placeholder: $t('system.N00488'),
            },
          },
        },
        role: {
          title: $t('system.N00411'),
          search: {
            disabled: true,
          },
          type: 'dict-select',
          dict: dict({
            url: '/api/system/role/',
            value: 'id',
            label: 'name',
          }),
          column: {
            width: 150, //最小列宽
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
              mode: "multiple",
              showSearch: true,
              showArrow: true,
              placeholder: $t('system.N00497'),
            },
          },
        },
        mobile: {
          title: $t('system.N00209'),
          search: {
            show: false,
          },
          type: 'text',
          column: {
            width: 120, //最小列宽
          },
          form: {
            rules: [
              {
                max: 20,
                message: $t('system.N00466'),
                trigger: 'blur',
              },
              {
                pattern: /^1[3-9]\d{9}$/,
                message: $t('system.N00466'),
              },
            ],
            component: {
              placeholder: $t('system.N00457'),
            },
          },
        },
        email: {
          title: $t('system.N00521'),
          type: 'text',
          column: {
            width: 260,
          },
          form: {
            rules: [
              {
                type: 'email',
                message: $t('system.N00467'),
                trigger: ['blur', 'change'],
              },
            ],
            component: {
              placeholder: $t('system.N00486'),
            },
          },
        },
        gender: {
          title: $t('system.N00193'),
          column: {
            width: 100
          },
          type: 'dict-select',
          dict: dict({
            data: dictionary('gender'),
          }),
          form: {
            value: 1,
            component: {
              span: 12,
            },
          },
          component: {props: {color: 'auto'}}, // 自动染色
        },
        user_type: {
          title: $t('system.N00344'),
          search: {
            show: true,
          },
          type: 'dict-select',
          dict: dict({
            data: dictionary('user_type'),
          }),
          column: {
            width: 180, //最小列宽
          },
          form: {
            show: false,
            value: 0,
            component: {
              span: 12,
            },
          },
        },
        is_active: {
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
                label: item.label
              })),
            },
          },
          type: 'dict-radio',
          column: {
            width: 100,
            component: {
              name: 'fs-dict-switch',
              vModel: "checked",
              onChange: compute((context) => {
                return () => {
                  api.UpdateObj(context.row).then((res: any) => {
                    notification.success({message: res.msg as string});
                  });
                };
              }),
            },
          },
          dict: dict({
            data: dictionary('button_status_bool'),
          }),
        },
        avatar: {
          title: $t('system.N00128'),
          type: 'image-uploader',
          form: {
            show: false,
            component: {
              uploader: {
                type: "form"
              }
            }
          },
          column: {
            component: {
              vModel: "urls"
            },
            width: 100, //最小列宽
          },
        },
        ...commonCrudConfig({
          dept_belong_id: {
            form: true,
            table: true,
          }
        })
      },
    },
  };
};
