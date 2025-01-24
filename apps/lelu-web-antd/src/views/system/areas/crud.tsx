import * as api from './api';
import type {
  AddReq,
  CreateCrudOptionsProps,
  CreateCrudOptionsRet,
  DelReq,
  EditReq,
  UserPageQuery
} from '@fast-crud/fast-crud';
import {compute, dict} from '@fast-crud/fast-crud';
import {dictionary} from '#/utils/dictionary';
import {message} from 'ant-design-vue';
import {auth} from '#/utils/authFunction';
import {ref, shallowRef} from "vue";
import tableSelector from '#/components/tableSelector/index.vue'
import {requestClient} from "#/api/request";
import {
  mapBackendTableTreeChildrenNode,
  mapBackendTableTreeNode
} from '#/utils/treeUtils/tableTreeUtil'
import {$t} from '#/locales'

export const createCrudOptions = function ({
                                             crudExpose
                                           }: CreateCrudOptionsProps): CreateCrudOptionsRet {
  const pageRequest = async (query: UserPageQuery) => {
    const resp = await api.GetList(query);
    if (areasDataRef.value?.length <= 0) {
      areasDataRef.value = mapBackendDataToTreeNode(resp.data)
    }
    dataSource.value = mapBackendTableTreeNode(resp.data);
    return resp;
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

  const areasDataRef = ref<any>([])
// 定义将后端数据转换为前端需要的树形结构的方法
  const mapBackendDataToTreeNode = (backendData: any[]) => {
    return backendData.map(item => ({
      id: item.code,
      pId: item.pcode,
      value: item.code,
      key: item.code,
      title: item.name,
      isLeaf: !item.hasChild
    }));
  };

  //表格树形结构
  const tableLoading = ref(false);
  const dataSource = ref()

  //懒加载事件
  const onExpand = (expanded: any, record: any) => {
    if (!expanded) return;
    if (record?.children?.length > 0) return;

    tableLoading.value = true;
    pageRequest({pcode: record.code}).then((res: any) => {
      record.children = mapBackendTableTreeChildrenNode(res.data);
    });
    tableLoading.value = false;
  }

  //表格的选择
  const selectedRows = ref([]);
  const onSelectChange = (changed: any) => {
    selectedRows.value = changed;
  };
  return {
    selectedRows,
    crudOptions: {
      request: {
        transformRes: ({res}: any) => {
          return {
            records: mapBackendTableTreeNode(res.data, {key: 'code', parentKey: 'pcode'}),
            currentPage: res.page,
            pageSize: res.limit,
            total: res.total
          };
        },
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
            show: auth('area:Create'),
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
            show: auth('area:Update'),
          },
          remove: {
            text: '',
            iconRight: 'icon-park:delete',
            tooltip: {
              is: 'a-tooltip',
              placement: 'top',
              title: $t('system.N00078'),
            },
            show: auth('area:Delete'),
          },
        },
      },
      pagination: {
        show: true,
      },
      table: {
        // expandRowByClick: true,
        loading: tableLoading,
        onExpand: onExpand,
        indentSize: 30,
        rowKey: "id",
        rowSelection: {
          selectedRowKeys: selectedRows,
          onChange: onSelectChange,
        },
      },
      columns: {
        _index: {
          title: $t('system.N00179'),
          form: {show: false},
          column: {
            show: false,
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
        name: {
          title: $t('system.N00096'),
          key: 'code',
          search: {
            show: true,
            col: {
              span: 5
            }
          },
          // treeNode: true,
          type: 'text',
          column: {
            align: 'left',
            width: 180,
          },
          form: {
            rules: [
              // 表单校验规则
              {required: true, message: $t('system.N00097')},
            ],
            component: {
              placeholder: $t('system.N00444'),
            },
          },
        },
        pcode: {
          title: $t('system.N00334'),
          column: {
            width: 120,
          },
          dict: dict({
            url: '/api/system/area/dict_list',
            label: 'name',
            value: 'code',
          }),
          type: 'dict-tree',
          // type: 'table-selector',
          // form: {
          //   component: {
          //     "tree-data-simple-mode": true,
          //     treeData: areasDataRef,
          //     loadData: (treeNode: any) => {
          //       return new Promise((resolve: (value?: unknown) => void) => {
          //         const {id} = treeNode.dataRef; // 获取当前节点的 ID 作为查询的 pcode
          //         const isIdExist = areasDataRef.value.some((node: any) => node.pId === id);
          //         if (isIdExist) {
          //           return resolve();
          //         }
          //         requestClient
          //           .get("/api/system/area/", {params: {pcode: id}}) // 调用后端接口
          //           .then(response => {
          //             const backendData = response.data; // 假设后端返回的数据是一个数组
          //             const newNodes = mapBackendDataToTreeNode(backendData); // 将后端数据映射为前端所需结构
          //             areasDataRef.value = areasDataRef.value.concat(newNodes); // 更新树形数据
          //             resolve();
          //           })
          //           .catch(_error => {
          //             resolve(); // 即使失败，也要调用 resolve，否则会阻塞
          //           });
          //       });
          //     },
          //     treeLine: treeLine.value ? {showLeafIcon: showLeafIcon.value} : false,
          //     showSearch: false,
          //     filterTreeNode: filterTreeNode
          //   }
          // }
          //下面注释掉的是手写组件引用
          form: {
            style: {
              col: {
                span: 1
              }
            },
            component: {
              name: shallowRef(tableSelector),
              vModel: 'modelValue',
              displayLabel: compute(({row}) => {
                if (row) {
                  return row.pcode_info;
                }
                return null;
              }),
              tableConfig: {
                url: '/api/system/area/',
                label: 'name',
                value: 'id',
                isTree: true,
                isMultiple: false,
                lazy: true,
                load: () => {
                },
                columns: [
                  {
                    prop: 'name',
                    label: $t('system.N00116'),
                    width: 150,
                  },
                  {
                    prop: 'code',
                    label: $t('system.N00117'),
                  },
                ],
              }
            }
          },
        },
        code: {
          title: $t('system.N00117'),
          search: {
            show: true,
            col: {
              span: 6
            }
          },
          type: 'text',
          column: {
            width: 300,
          },
          form: {
            rules: [
              // 表单校验规则
              {required: true, message: $t('system.N00118')},
            ],
            component: {
              placeholder: $t('system.N00446'),
            },
          },
        },
        enable: {
          title: $t('system.N00270'),
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
              allowClear: false,
              options: dictionary('button_status_bool').map((item: any) => ({
                value: String(item.value), // 将 value 转换为字符串
                label: item.label
              })),
            },
          },
          type: 'dict-radio',
          column: {
            width: 300,
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
      }
    },
  };
};
