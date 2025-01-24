import {$t} from '#/locales'
/**
 * @author: Ethan
 * @contact: email:
 * @Created on: 2024/12/7 15:57
 * @Remark:
 **/
import * as api from './api';
import {
  type UserPageQuery,
  type AddReq,
  type DelReq,
  type EditReq,
  type CreateCrudOptionsProps,
  type CreateCrudOptionsRet,
  type UserPageRes, dict,
} from '@fast-crud/fast-crud';
import {ref} from "vue";
import {dictionary} from '#/utils/dictionary';
import dayjs from "dayjs";

export const createCrudOptions = function ({crudExpose}: CreateCrudOptionsProps): CreateCrudOptionsRet {
  const pageRequest = async (query: UserPageQuery): Promise<UserPageRes> => {
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
  //批量删除
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
        width: 160,
        show: true,
        buttons: {
          view: {
            show: false,
          },
          edit: {
            show: false
          },
          remove: {
            show: false,
          },
          custom: {
            text: '',
            iconRight: "line-md:upload-loop",
            style: {
              fontSize: '25px',
            },
            tooltip: {
              is: 'a-tooltip',
              placement: 'top',
              title: $t('system.N00161'),
            },
            click: async (context: any): Promise<void> => {
              const {row} = context;
              //根据自己的接口来导入数据,这里只做示例
              await api.ImportFile(row.id);
            }
          },
          custom1:{
            text: '',
            iconRight: 'emojione:eye-in-speech-bubble',
            tooltip: {
              is: 'a-tooltip',
              placement: 'top',
              title: $t('system.N00307'),
            },
          }
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
        id: {
          title: 'ID',
          type: 'number',
          width: '70px',
          form: {
            show: false,
          },
          column: {
            show: false,
          }
        },
        name: {
          title: $t('system.N00251'),
          search: {
            show: true,
            col: {
              span: 5
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
            width: 300,
          },
        },
        // platform: {
        //   title: '平台',
        //   search: {show: true},
        //   type: 'dict-select',
        //   dict: dict({
        //     data: dictionary('platform_label_value')
        //   }),
        //   column: {
        //     width: 100
        //   }
        // },
        // seller_account: {
        //   title: '销售账号',
        //   type: 'text',
        //   search: {
        //     show: true,
        //     col: {
        //       span: 5
        //     }
        //   },
        //   column: {
        //     width: 100,
        //     component: {
        //       color: 'auto',
        //       name: 'fs-values-format',
        //     },
        //   }
        // },
        // file_date: {
        //   title: '文件时间',
        //   type: 'text',
        //   search: {
        //     show: true,
        //     col: {span: 9},
        //     component: {
        //       name: 'a-range-picker',
        //       showTime: true,
        //       placeholder: ['开始时间', '结束时间'],
        //       valueFormat: 'YYYY-MM-DD',
        //       presets: [
        //         {label: 'Last 7 Days', value: [dayjs().add(-7, 'd'), dayjs()]},
        //         {label: 'Last 14 Days', value: [dayjs().add(-14, 'd'), dayjs()]},
        //         {label: 'Last 30 Days', value: [dayjs().add(-30, 'd'), dayjs()]},
        //         {label: 'Last 90 Days', value: [dayjs().add(-90, 'd'), dayjs()]},
        //       ],
        //     },
        //     valueResolve(context: any) {
        //       const {key, value} = context;
        //       // 将组件的值转化为后台所需要的格式
        //       if (value) {
        //         // 使用 dayjs 格式化日期为指定的 "YYYY-MM-DDTHH:mm:ss[.SSS][Z]" 格式
        //         context.form.create_datetime_after = dayjs(value[0]).format("YYYY-MM-DD");
        //         context.form.create_datetime_before = dayjs(value[1]).format("YYYY-MM-DD");
        //       }
        //     }
        //   },
        //   column: {
        //     width: 150,
        //   },
        //   form: {
        //     show: false,
        //   },
        //   viewForm: {
        //     show: true
        //   }
        // },
        // creator_name: {
        //   title: $t('system.N00075'),
        //   type: 'text',
        //   column: {
        //     width: 150,
        //     component: {
        //       color: 'auto',
        //       name: 'fs-values-format',
        //     },
        //   },
        //   search: {
        //     show: true,
        //     col: {
        //       span: 5
        //     }
        //   }
        // },
        // function: {
        //   title: 'Function',
        //   type: 'text',
        //   column: {
        //     width: 120
        //   },
        //   search: {
        //     show: true,
        //     col: {span: 5}
        //   }
        // },
        // error: {
        //   title: '导入日志',
        //   type: 'text',
        //   column: {
        //     width: 120
        //   }
        // },
        // original_file: {
        //   title: 'Original File Name',
        //   type: 'text',
        //   column: {
        //     width: 150
        //   }
        // },
        // description: {
        //   title: $t('system.N00122'),
        //   type: 'textarea',
        //   column: {
        //     width: 120
        //   }
        // },
        // modifier_name: {
        //   title: $t('system.N00075'),
        //   type: 'text',
        //   column: {
        //     show: false,
        //     width: 100
        //   }
        // },
        // create_datetime: {
        //   title: $t('system.N00076'),
        //   type: 'text',
        //   column: {
        //     width: 150
        //   }
        // }
      },
    },
  };
};
