import {$t} from '#/locales'
import type {
  AddReq,
  CreateCrudOptionsProps,
  CreateCrudOptionsRet,
  DelReq,
  EditReq,
  UserPageQuery
} from '@fast-crud/fast-crud';
import {compute, dict} from '@fast-crud/fast-crud';
import * as api from './api';
import {dictionary} from '#/utils/dictionary';
import {message} from 'ant-design-vue';
import {auth} from "#/utils/authFunction";
import {requestClient} from "#/api/request";
import XEUtils from "xe-utils";

export const createCrudOptions = function ({
                                             crudExpose,
                                             context
                                           }: CreateCrudOptionsProps): CreateCrudOptionsRet {
  const pageRequest = async (query: UserPageQuery) => {
    const show_all = context?.isShowChildFlag.value ? '1' : '0';
    /**
     * 处理crud警告：Invalid prop: type check failed for prop "name". Expected String with value "2", got Number with value 2.
     */
    // res.data.forEach((item: any) => {
    // 	item.dept = String(item.dept);
    // 	if (item.role && Array.isArray(item.role) && item.role.length > 0) {
    // 		item.role = item.role.map((r: number) => String(r));
    // 	}
    // });
    return await api.GetList({...query, show_all});
  };
  const editRequest = async ({form, row}: EditReq) => {
    form.id = row.id;
    return await api.UpdateObj(form);
  };
  const delRequest = async ({row}: DelReq) => {
    const res = await api.DelObj(row.id);
    context?.getDeptInfo();
    return res;
  };
  const addRequest = async ({form}: AddReq) => {
    const res = await api.AddObj(form);
    context?.getDeptInfo();
    return res;
  };

  const exportRequest = async (query: UserPageQuery) => {
    return await api.exportData(query);
  };

  return {
    crudOptions: {
      table: {
        remove: {
          confirmMessage: $t('system.N00269'),
        },
      },
      request: {
        pageRequest,
        addRequest,
        editRequest,
        delRequest,
      },
      actionbar: {
        buttons: {
          add: {
            show: auth('user:Create')
          },
          export: {
            text: $t('system.N00162'), //按钮文字
            title: $t('system.N00162'), //鼠标停留显示的信息
            show: auth('user:Export'),
            click() {
              return exportRequest(crudExpose!.getSearchFormData());
            },
          },
        },
      },
      rowHandle: {
        //固定右侧
        fixed: 'right',
        width: 250,
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
            click: (ctx: any) => {
              const {row} = ctx;
              context?.handleResetPwdOpen(row);
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
        search: {
          title: $t('system.N00062'),
          column: {
            show: false,
            width: 100
          },
          search: {
            show: false,
            col: {
              span: 6,
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
          title: $t('system.N00500'),
          type: 'text',
          column: {
            width: 100, //最小列宽
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
          type: 'text',
          column: {
            show: false,
            width: 120,
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
            // value: vm.systemConfig('base.default_password'),
          },
          /* valueResolve(row, key) {
                        if (row.password) {
                            row.password = vm.$md5(row.password)
                        }
                    } */
        },
        name: {
          title: $t('system.N00136'),
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
          type: 'dict-tree',
          dict: dict({
            // isTree: true,
            // url: '/api/system/dept/all_dept/',
            // value: 'id',
            // label: 'name',
            // labelBuilder:(option)=>{
            //   console.log(option)
            //   return $t(option.label);
            // },
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
              treeLine: true,
              // fieldNames: {label: "name", key: "id", value: "id", parent: {'id': 'id'}}
            },
          },
        },
        role: {
          title: $t('system.N00411'),
          search: {
            show: true,
            component: {
              props: {
                clearable: true,
              },
            },
          },
          type: 'dict-select',
          dict: dict({
            url: '/api/system/role/',
            value: 'id',
            label: 'name',
          }),
          column: {
            width: 100, //最小列宽
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
          type: 'number',
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
            col: {
              span: 8
            }

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
          title: $t('system.N00539'),
          search: {
            show: true,
            col: {
              span: 5
            }
          },
          type: 'dict-radio',
          column: {
            width: 100,
            component: {
              name: 'fs-dict-switch',
              vModel: "checked",
              activeText: '',
              inactiveText: '',
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
      },
      search: {
        buttons: {
          search: {
            text: $t('system.N00548'),
          },
          reset: {
            text: $t('system.N00549'),
          }
        },
        layout: 'inline',
        collapse: true,
        col: {
          span: 4,
        },
        options: {
          labelCol: {
            style: {
              width: '30%'
            }
          },
          wrapperCol: {
            style: {
              width: '70%'
            }
          },
          labelAlign: 'right'
        },
      },
    },
  };
};
