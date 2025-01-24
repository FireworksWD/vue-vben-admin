// 引入fast-crud
import {FastCrud, useTypes} from '@fast-crud/fast-crud';

const {getType} = useTypes();
import '@fast-crud/fast-crud/dist/style.css';
import {setLogger} from '@fast-crud/fast-crud';
import {getBaseURL} from '#/utils/baseUrl';
// ant
import ui from '@fast-crud/ui-antdv4';
import {requestClient} from '#/api/request';
//扩展包
import {FsExtendsEditor, FsExtendsUploader} from '@fast-crud/fast-extends';
import '@fast-crud/fast-extends/dist/style.css';
import {notification, message} from 'ant-design-vue';
import XEUtils from "xe-utils";
import {$t} from '#/locales'
import {auth} from "#/utils/authFunction";
//页脚
const showTotal = (total: number) => `${$t('system.N00554')} ${total} ${$t('system.N00555')}`;
export default {
  // @ts-ignore
  async install(app: any, options: any) {
    // 先安装ui
    app.use(ui);
    // 然后安装FastCrud
    app.use(FastCrud, {
      //i18n, //i18n配置，可选，默认使用中文，具体用法请看demo里的 src/i18n/index.js 文件
      // 此处配置公共的dictRequest（字典请求）
      async dictRequest({dict, url}: any) {
        const {isTree} = dict
        //根据dict的url，异步返回一个字典数组
        return await requestClient.get(url, {params: dict.params || {}}).then((res: any) => {
          if (isTree) {
            return XEUtils.toArrayTree(res.data, {parentKey: 'parent'})
          }
          return res.data
        });
      },

      //公共crud配置
      commonOptions() {
        return {
          request: {
            //接口请求配置
            //你项目后台接口大概率与fast-crud所需要的返回结构不一致，所以需要配置此项
            //请参考文档http://fast-crud.docmirror.cn/api/crud-options/request.html
            transformQuery: ({page, form, sort}: any) => {
              if (sort.asc !== undefined) {
                form['ordering'] = `${sort.asc ? '' : '-'}${sort.prop}`;
              }
              //转换为你pageRequest所需要的请求参数结构
              return {page: page.currentPage, limit: page.pageSize, ...form};
            },
            transformRes: ({res}: any) => {
              //将pageRequest的返回数据，转换为fast-crud所需要的格式
              //return {records,currentPage,pageSize,total};
              return {
                records: res.data,
                currentPage: res.page,
                pageSize: res.limit,
                total: res.total
              };
            },
          },
          viewForm: {
            wrapper: {
              title: $t('system.N00307'),
              buttons: {
                ok: {
                  text: $t('system.N00362'),
                },
                cancel: {
                  text: $t('system.N00091'),
                },
                reset: {
                  text: $t('system.N00549'),
                }
              }
            },
          },
          editForm: {
            wrapper: {
              title: $t('system.N00395'),
              buttons: {
                ok: {
                  text: $t('system.N00362'),
                },
                cancel: {
                  text: $t('system.N00091'),
                },
                reset: {
                  text: $t('system.N00549'),
                }
              }
            },
          },
          addForm: {
            wrapper: {
              title: $t('system.N00547'),
              buttons: {
                ok: {
                  text: $t('system.N00362'),
                },
                cancel: {
                  text: $t('system.N00091'),
                },
                reset: {
                  text: $t('system.N00549'),
                }
              }
            },
          },
          form: {
            afterSubmit(ctx: any) {
              // 增加crud提示
              if (ctx.res.code == 2000) {
                // notification.success({message: ctx.res.msg,placement:'topLeft'});
                message.success(ctx.res.msg)
              }
            },
          },
          //全局操作栏的按钮配置
          rowHandle: {
            title: $t('system.N00235'),
            buttons: {
              view: {
                text: '',
                title: '',
                iconRight: 'emojione:eye-in-speech-bubble',
                tooltip: {
                  is: 'a-tooltip',
                  placement: 'top',
                  title: $t('system.N00307'),
                },
              },
              edit: {
                text: '',
                title: '',
                iconRight: "fluent-color:clipboard-text-edit-20",
                tooltip: {
                  is: 'a-tooltip',
                  placement: 'top',
                  title: $t('system.N00395'),
                },
              },
              remove: {
                text: '',
                title: '',
                iconRight: 'icon-park:delete',
                tooltip: {
                  is: 'a-tooltip',
                  placement: 'top',
                  title: $t('system.N00078'),
                },
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
              span: 5,
            },
            options: {
              labelCol: {
                style: {
                  width: '50%'
                }
              },
              wrapperCol: {
                style: {
                  width: '30%'
                }
              },
              labelAlign: 'right'
            },
          },
          actionbar: {
            buttons: {
              add: {
                text: $t('system.N00547'),
              },
            },
          },
          toolbar: {
            buttons: {
              //查询按钮
              search: {
                title: $t('system.N00551'),
              },
              // 刷新按钮s
              refresh: {
                title: $t('system.N00550'),
              },
              // 紧凑模式
              compact: {
                title: $t('system.N00552'),
              },
              // 导出按钮
              export: {
                title: $t('system.N00162'),
              },
              // 列设置按钮
              columns: {
                title: $t('system.N00553'),
              },
            }
          },
          pagination: {
            showTotal: showTotal
          }
        };
      },
      logger: {off: {tableColumns: false}}
    });
    //富文本
    app.use(FsExtendsEditor, {
      wangEditor: {
        width: 300,
      },
    });
    // 文件上传
    app.use(FsExtendsUploader, {
      defaultType: "form",
      form: {
        action: `/api/system/file/`,
        name: "file",
        withCredentials: false,
        uploadRequest: async ({action, file, onProgress}: {
          action: string;
          file: any;
          onProgress: Function
        }) => {
          // @ts-ignore
          const data = new FormData();
          data.append("file", file);
          return await requestClient.post(action, {
            timeout: 60000,
            headers: {
              "Content-Type": "multipart/form-data"
            },
            data,
            onUploadProgress: (p: any) => {
              onProgress({percent: Math.round((p.loaded / p.total) * 100)});
            }
          });
        },
        successHandle(ret: any) {
          // 上传完成后的结果处理， 此处应返回格式为{url:xxx,key:xxx}
          return {
            url: getBaseURL(ret.data.url),
            key: ret.data.id,
            ...ret.data
          };
        }
      },
      valueBuilder(context: any) {
        const {row, key} = context
        return getBaseURL(row[key])
      }
    })

    setLogger({level: 'error'});
// 设置自动染色和对齐方式
    const dictComponentList = ['dict-cascader', 'dict-checkbox', 'dict-radio', 'dict-select', 'dict-switch', 'dict-tree'];
    dictComponentList.forEach((val) => {
      const type = getType(val);
      if (type?.column?.component) {
        type.column.component.color = 'auto';
      }
      if (type?.column) {
        type.column.align = 'center';
      }
    });

// // 设置 placeholder 的默认值
//     const placeholderComponentList = [
//       {key: 'text', placeholder: $t('system.N00434')},
//       {key: 'textarea', placeholder: $t('system.N00434')},
//       // { key: 'input', placeholder: $t('system.N00434') },
//       {key: 'password', placeholder: $t('system.N00434')},
//       {key: 'dict-select', placeholder: $t('system.N00488')},
//       {key: 'dict-radio', placeholder: $t('system.N00488')}
//     ];
//     placeholderComponentList.forEach(({key, placeholder}) => {
//       const type = getType(key);
//
//       if (type?.search?.component) {
//         type.search.component.placeholder = placeholder;
//       } else if (type?.search) {
//         type.search.component = {placeholder};
//       }
//
//       if (type?.form?.component) {
//         type.form.component.placeholder = placeholder;
//       } else if (type?.form) {
//         type.form.component = {placeholder};
//       }
//
//       if (type?.column) {
//         type.column.align = 'center';
//       } else if (type) {
//         type.column = {align: 'center'};
//       }
//     });

    // 在这里监听 i18n 的语言变化
    app.config.globalProperties.$i18n.onLanguageSwitched = () => {
      // 更新所有需要更新的组件或字段
      const placeholderComponentList = [
        {key: 'text', placeholder: $t('system.N00434')},
        {key: 'textarea', placeholder: $t('system.N00434')},
        {key: 'password', placeholder: $t('system.N00434')},
        {key: 'dict-select', placeholder: $t('system.N00488')},
        {key: 'dict-radio', placeholder: $t('system.N00488')}
      ];

      placeholderComponentList.forEach(({key, placeholder}) => {
        const type = getType(key);

        if (type?.search?.component) {
          type.search.component.placeholder = placeholder;
        } else if (type?.search) {
          type.search.component = {placeholder};
        }

        if (type?.form?.component) {
          type.form.component.placeholder = placeholder;
        } else if (type?.form) {
          type.form.component = {placeholder};
        }

        if (type?.column) {
          type.column.align = 'center';
        } else if (type) {
          type.column = {align: 'center'};
        }
      });
    };
  },


};
