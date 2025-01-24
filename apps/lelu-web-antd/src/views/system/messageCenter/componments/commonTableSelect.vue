<script setup lang="tsx">
import {$t} from '#/locales'
import {computed, defineProps, ref, watch, onMounted, onUnmounted} from 'vue'
import type {VxeGridListeners, VxeGridProps} from '#/adapter/vxe-table';
import {useVbenVxeGrid} from '#/adapter/vxe-table';
import {Page} from '@vben/common-ui';
import {requestClient} from '#/api/request'
import type {VbenFormProps} from '#/adapter/form';
import {SmileTwoTone} from '@ant-design/icons-vue';


const selectedValue = ref()
const tableData = ref<any[]>([]);
const props = defineProps({
  disabledSelect: {
    default: true,
  },
  modelValue: {},
  displayLabel: {},
  tableConfig: {
    url: null,
    label: null,
    value: null,
    columns: [],
    data: [],
    isTree: false,
    lazy: false,
  },
  treeProps: {parentField: 'parent', rowField: 'id'}
} as any)
const emit = defineEmits(['update:modelValue']);
//搜索值
const searchValue = ref('');
/**
 * form表单
 */
const formOptions: VbenFormProps = {
  // 默认展开
  collapsed: false,
  schema: [
    {
      component: 'Input',
      componentProps: {
        placeholder: 'Please enter name',
      },
      fieldName: 'name',
      label: 'Name',
    },
  ],
  // 控制表单是否显示折叠按钮
  showCollapseButton: false,
  submitButtonOptions: {
    content: '查询',
  },
  // 是否在字段值改变时提交表单
  //@ts-ignore
  submitOnChange: false,
  // 按下回车时是否提交表单
  submitOnEnter: false,
};
/**
 * vxe事件方法
 */
const gridEvents: VxeGridListeners = {
  //单机表格事件
  // cellClick({row}) {
  //   selectedValue.value = row.name;
  //   emit('update:modelValue', row.id);
  // },
  checkboxChange({$grid}) {
    const val = $grid.getCheckboxRecords()
    const {tableConfig} = props;
    const result = val.map((item: any) => {
      return item[tableConfig.value];
    });
    selectedValue.value = val.map((item: any) => {
      return item[tableConfig.label];
    });
    emit('update:modelValue', result);
  },
  checkboxAll({$grid}) {
    const val = $grid.getCheckboxRecords()
    const {tableConfig} = props;
    const result = val.map((item: any) => {
      return item[tableConfig.value];
    });
    selectedValue.value = val.map((item: any) => {
      return item[tableConfig.label];
    });
    emit('update:modelValue', result);
  },
}
/**
 * 动态计算列
 */
const gridOptionsColumns = computed(() => {
  return props.tableConfig.columns.map((col: any) => {
    return {
      type: col.type || '', // 默认 type 为 text
      field: col.field || '', // 字段名
      title: col.label || '', // 标题
      minWidth: col.minWidth || 100, // 最小宽度，设置默认值
      width: col.width || 150, // 宽度设置
      sortable: col.sortable || false, // 是否可排序
      treeNode: col.treeNode || false, // 是否是树节点
      align: col.align || 'center', // 对齐方式
    };
  })
});
/**
 * 配置
 */
const gridOptions = computed(() => {
  const options: VxeGridProps = {
    border: true,
    stripe: true,
    columnConfig: {
      isCurrent: true,
      isHover: true,
    },
    rowConfig: {
      isCurrent: true,
      isHover: true,
    },
    columns: gridOptionsColumns.value,
    data: tableData.value,
    pagerConfig: {
      total: 0,
      currentPage: 1,
      pageSize: 20,
    },
    proxyConfig: {
      ajax: {
        query: async ({page}) => {
          return await getTableDataPage({
            page: page.currentPage,
            limit: page.pageSize,
            ...{name: searchValue.value},
          });
        },
      },
    },
    keepSource: true,
  };

  // 如果是树形结构，添加 treeConfig 配置
  if (props.tableConfig.isTree) {
    options.treeConfig = {
      parentField: props.treeProps.parentField, // 父节点字段
      rowField: props.treeProps.rowField, // 当前节点字段
      transform: true, // 是否转换树结构
    };
  }

  return options;
});

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: gridOptions.value,
  gridEvents
});
const getTableDataPage = async (query: any = {}) => {
  return new Promise<{ items: any; total: number }>(async (resolve) => {
    const resp = await requestClient.get(props.tableConfig.url, {params: query});
    resolve({
      total: resp.total,
      items: resp.data,
    });
  });
}
// 监听displayLabel的变化，更新数据
watch(
  () => {
    return props.displayLabel;
  },
  (value: any) => {
    const {tableConfig} = props;
    selectedValue.value = value
      ? value.map((item: any) => {
        return item[tableConfig.label];
      })
      : null;
  },
  {immediate: true}
);
onMounted(() => {
  if (!props.disabledSelect) {
    selectedValue.value = []
  }
});
/**
 * 标签渲染函数
 * @param label
 * @param value
 */
const colors = [
  "orange",
  "green",
  "purple",
  "#3b5999",
  "#2db7f5",
  "#87d068",
  "#108ee9"
];

/**
 * 自定义label标签
 * @param label
 * @param value
 */
//@ts-ignore
function tagRender({label, value}: { label: any, value: any }) {
  return (
    <span
      style={{
        backgroundColor: colors[Math.floor(Math.random() * colors.length)], // 设置随机背景颜色
        padding: '2px 6px',
        borderRadius: '5px',
        color: '#fff',
        marginRight: '2px',
      }}
    >
  {label}
  </span>
  );
}

/**
 * 自定义搜索事件
 */
const onSearch = () => {
  gridApi.query()
}
const handleMouseDown = (e) => {
  e.stopPropagation();  // 阻止事件传播
  e.preventDefault();   // 阻止默认行为
}
</script>

<template>
  <Page style="margin-top: -14px;margin-left: -15px">
    <div @mousedown="handleMouseDown">
      <a-select
        :disabled="props.disabledSelect"
        mode="multiple"
        allow-clear
        style="width: 100%;"
        v-model:value="selectedValue"
        :placeholder="$t('system.N00488')"
        :dropdownMatchSelectWidth="false"
        :max-tag-text-length="10"
        :max-tag-count="10"
        :tagRender="tagRender"
        :showSearch="false"
        show-arrow
      >
        <template #notFoundContent>
          <a-input-search
            v-model:value="searchValue"
            placeholder="Please enter name"
            enter-button
            @search="onSearch"
            style="margin-bottom: 10px;margin-top: 5px;padding-left: 8px;padding-right: 8px;"
            allowClear
            @click="e=>e.target.focus()"
          >
            <template #prefix>
              <SmileTwoTone/>
            </template>
          </a-input-search>
          <Grid style="height: 350px; overflow: auto;width: auto"/>
        </template>
      </a-select>
    </div>
  </Page>
</template>

<style scoped lang="scss">

</style>
