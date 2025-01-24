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
import {dictionary} from '#/utils/dictionary';
// import {auth} from "#/utils/authFunction";

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
    const data = crudExpose!.getSearchFormData()
    const parent = data.parent
    form.parent = parent
    if (parent) {
      return await api.AddObj(form);
    } else {
      return undefined
    }

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
        //固定右侧
        fixed: 'right',
        width: 200,
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
        label: {
          title: $t('system.N00096'),
          search: {
            show: true,
            col:{
              span:6
            },
            component: {
              props: {
                clearable: true,
              },
            },
          },
          type: 'text',
          form: {
            rules: [
              // 表单校验规则
              {required: true, message: $t('system.N00097')},
            ],
            component: {
              props: {
                clearable: true,
              },
              placeholder: $t('system.N00444'),
            },
          },
          column: {
            width: '150px',
            //@ts-ignore
            formatter({value, row, index}) {
              return $t(value)
            }
          }
        },
        type: {
          column: {
            width: '130px',
          },
          title: $t('system.N00243'),
          type: 'dict-select',
          search: {
            disabled: true,
            component: {
              props: {
                clearable: true,
              },
            },
          },
          show: false,
          dict: dict({
            data: [
              {label: 'text', value: 0},
              {label: 'number', value: 1},
              {label: 'date', value: 2},
              {label: 'datetime', value: 3},
              {label: 'time', value: 4},
              {label: 'file', value: 5},
              {label: 'boolean', value: 6},
              {label: 'images', value: 7},
            ],
          }),
          form: {
            rules: [
              // 表单校验规则
              {required: true, message: $t('system.N00244')},
            ],
            value: 0,
            component: {
              props: {
                clearable: true,
              },
              placeholder: $t('system.N00491'),
            },
            // valueChange(key, value, form, { getColumn, mode, component, immediate, getComponent }) {
            //     const template = vm.getEditFormTemplate('value')
            //     // 选择框重新选择后，情况value值
            //     if (!immediate) {
            //         form.value = undefined
            //     }
            //     if (value === 0) {
            //         template.component.name = 'a-input'
            //     } else if (value === 1) {
            //         template.component.name = 'a-input-number'
            //     } else if (value === 2) {
            //         template.component.name = 'a-date-picker'
            //         template.component.props = {
            //             type: 'date',
            //             valueFormat: 'yyyy-MM-dd'
            //         }
            //     } else if (value === 3) {
            //         template.component.name = 'a-date-picker'
            //         template.component.props = {
            //             type: 'datetime',
            //             valueFormat: 'yyyy-MM-dd HH:mm:ss'
            //         }
            //     } else if (value === 4) {
            //         template.component.name = 'a-time-picker'
            //         template.component.props = {
            //             pickerOptions: {
            //                 arrowControl: true
            //             },
            //             valueFormat: 'HH:mm:ss'
            //         }
            //     } else if (value === 5) {
            //         template.component.name = 'd2p-file-uploader'
            //         template.component.props = { elProps: { listType: 'text' } }
            //     } else if (value === 6) {
            //         template.component.name = 'dict-switch'
            //         template.component.value = true
            //         template.component.props = {
            //             dict: {
            //                 data: [
            //                     { label: $t('system.N00267'), value: 'true' },
            //                     { label: $t('system.N00101'), value: 'false' }
            //                 ]
            //             }
            //         }
            //     } else if (value === 7) {
            //         template.component.name = 'd2p-cropper-uploader'
            //         template.component.props = { accept: '.png,.jpeg,.jpg,.ico,.bmp,.gif', cropper: { viewMode: 1 } }
            //     }
            // },
          },
        },
        value: {
          title: $t('system.N00241'),
          search: {
            show: true,
            col:{
              span:6
            },
            component: {
              props: {
                clearable: true,
              },
            },
          },
          column: {
            width: '150px',
          },
          view: {
            component: {props: {height: 100, width: 100}},
          },
          /* // 提交时,处理数据
          valueResolve(row: any, col: any) {
              const value = row[col.key]
              const type = row.type
              if (type === 5 || type === 7) {
                  if (value != null) {
                      if (value.length >= 0) {
                          if (value instanceof Array) {
                              row[col.key] = value.toString()
                          } else {
                              row[col.key] = value
                          }
                      } else {
                          row[col.key] = null
                      }
                  }
              } else {
                  row[col.key] = value
              }
          },
          // 接收时,处理数据
          valueBuilder(row: any, col: any) {
              const value = row[col.key]
              const type = row.type
              if (type === 5 || type === 7) {
                  if (value != null && value) {
                      row[col.key] = value.split(',')
                  }
              } else {
                  row[col.key] = value
              }
          }, */
          type: 'text',
          form: {
            rules: [
              // 表单校验规则
              {required: true, message: $t('system.N00242')},
            ],
            component: {
              props: {
                clearable: true,
              },
              placeholder: $t('system.N00459'),
            },
          },
        },
        status: {
          title: $t('system.N00337'),
          width: 80,
          search: {
            show: true
          },
          type: 'dict-radio',
          column: {
            width: 120,
            component: {
              name: 'fs-dict-switch',
              vModel: 'checked',
            }
          },
          dict: dict({
            data: dictionary('button_status_bool'),
          }),
          form: {
            value: true,
            rules: [
              // 表单校验规则
              {required: true, message: $t('system.N00338')},
            ],
          },
        },
        sort: {
          title: $t('system.N00223'),
          column:{
            width:75
          },
          type: 'number',
          form: {
            value: 1,
            component: {},
            rules: [
              // 表单校验规则
              {required: true, message: $t('system.N00226')},
            ],
          },
        },
        color: {
          title: $t('system.N00310'),
          search: {
            disabled: true,
          },
          column:{
            width:120
          },
          type: 'dict-select',
          dict: dict({
            data: [
              {label: 'success', value: 'success', color: 'success'},
              {label: 'primary', value: 'primary', color: 'cyan'},
              {label: 'info', value: 'info', color: 'purple'},
              {label: 'danger', value: 'danger', color: 'error'},
              {label: 'warning', value: 'warning', color: 'warning'},
            ],
          }),
          form: {
            component: {
              props: {
                clearable: true,
              },
            },
          },
        },
      },
    },
  };
};
