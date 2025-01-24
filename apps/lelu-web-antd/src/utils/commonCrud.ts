import {$t} from '#/locales'
import {dict} from "@fast-crud/fast-crud";
import {shallowRef} from 'vue'
import deptFormat from "#/components/dept-format/index.vue";
import dayjs from 'dayjs';
import {requestClient} from "#/api/request";
import XEUtils from "xe-utils";

type CrudConfig = {
  form?: boolean;
  table?: boolean;
  search?: boolean;
};

type OptionsType = {
  create_datetime?: CrudConfig;
  update_datetime?: CrudConfig;
  creator_name?: CrudConfig;
  modifier_name?: CrudConfig;
  dept_belong_id?: CrudConfig;
  description?: CrudConfig;
};
export const commonCrudConfig = (options: OptionsType = {
  create_datetime: {
    form: false,
    table: false,
    search: false
  },
  update_datetime: {
    form: false,
    table: false,
    search: false
  },
  creator_name: {
    form: false,
    table: false,
    search: false
  },
  modifier_name: {
    form: false,
    table: false,
    search: false
  },
  dept_belong_id: {
    form: false,
    table: false,
    search: false
  },
  description: {
    form: false,
    table: false,
    search: false
  },
}) => {
  return {
    dept_belong_id: {
      title: $t('system.N00206'),
      type: 'dict-tree',
      search: {
        show: options.dept_belong_id?.search || false
      },
      dict: dict({
        // url: '/api/system/dept/all_dept/',
        // isTree: true,
        // value: 'id',
        // label: 'name',
        // children: 'children',
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
        align: 'center',
        width: 300,
        show: options.dept_belong_id?.table || false,
        component: {
          name: shallowRef(deptFormat),
          vModel: "modelValue",
        }
      },
      form: {
        show: options.dept_belong_id?.form || false,
        component: {
          // showSearch: true,
          allowClear: true,
        },
        helper: $t('system.N00546') + " ID"
      }
    },
    description: {
      title: $t('system.N00122'),
      search: {
        show: options.description?.search || false
      },
      type: 'textarea',
      column: {
        width: 100,
        show: options.description?.table || false,
      },
      form: {
        show: options.description?.form || false,
        component: {
          placeholder: $t('system.N00437'),
          showCount: true,
          maxlength: 200,
        }
      },
      viewForm: {
        show: true
      }
    },
    modifier_name: {
      title: $t('system.N00053'),
      search: {
        show: options.modifier_name?.search || false
      },
      column: {
        width: 100,
        show: options.modifier_name?.table || false,
      },
      form: {
        show: false,
      },
      viewForm: {
        show: true
      }
    },
    creator_name: {
      title: $t('system.N00075'),
      search: {
        show: options.creator_name?.search || false
      },
      column: {
        width: 100,
        show: options.creator_name?.table || false,
      },
      form: {
        show: false,
      },
      viewForm: {
        show: true
      }
    },
    update_datetime: {
      title: $t('system.N00287'),
      type: 'text',
      search: {
        show: options.update_datetime?.search || false,
        col: {span: 8},
        component: {
          name: 'a-range-picker',
          showTime: true,
          placeholder: [$t('system.N00183'), $t('system.N00393')],
          valueFormat: 'YYYY-MM-DD HH:mm:ss',
          presets: [
            {label: $t('system.N00613'), value: [dayjs().add(-7, 'd'), dayjs()]},
            {label: $t('system.N00614'), value: [dayjs().add(-14, 'd'), dayjs()]},
            {label: $t('system.N00615'), value: [dayjs().add(-30, 'd'), dayjs()]},
            {label: $t('system.N00616'), value: [dayjs().add(-90, 'd'), dayjs()]},
          ],
        },
        valueResolve(context: any) {
          const {key, value} = context;
          // 将组件的值转化为后台所需要的格式
          if (value) {
            // 使用 dayjs 格式化日期为指定的 "YYYY-MM-DDTHH:mm:ss[.SSS][Z]" 格式
            context.form.create_datetime_after = dayjs(value[0]).format("YYYY-MM-DD HH:mm:ss");
            context.form.create_datetime_before = dayjs(value[1]).format("YYYY-MM-DD HH:mm:ss");
          }
        }
      },
      column: {
        width: 160,
        show: options.update_datetime?.table || false,
      },
      form: {
        show: false,
      },
      viewForm: {
        show: true
      }
    },
    create_datetime: {
      title: $t('system.N00076'),
      type: 'text',
      search: {
        show: options.create_datetime?.search || false,
        col: {span: 9},
        component: {
          name: 'a-range-picker',
          showTime: true,
          placeholder: [$t('system.N00183'), $t('system.N00393')],
          valueFormat: 'YYYY-MM-DD',
          presets: [
            {label: $t('system.N00613'), value: [dayjs().add(-7, 'd'), dayjs()]},
            {label: $t('system.N00614'), value: [dayjs().add(-14, 'd'), dayjs()]},
            {label: $t('system.N00615'), value: [dayjs().add(-30, 'd'), dayjs()]},
            {label: $t('system.N00616'), value: [dayjs().add(-90, 'd'), dayjs()]},
          ],
        },
        valueResolve(context: any) {
          const {key, value} = context;
          // 将组件的值转化为后台所需要的格式
          if (value) {
            // 使用 dayjs 格式化日期为指定的 "YYYY-MM-DDTHH:mm:ss[.SSS][Z]" 格式
            context.form.create_datetime_after = dayjs(value[0]).format("YYYY-MM-DD HH:mm:ss");
            context.form.create_datetime_before = dayjs(value[1]).format("YYYY-MM-DD HH:mm:ss");
          }
        }
      },
      column: {
        width: 160,
        show: options.create_datetime?.table || false,
      },
      form: {
        show: false,

      },
      viewForm: {
        show: true
      }
    }
  }
}
