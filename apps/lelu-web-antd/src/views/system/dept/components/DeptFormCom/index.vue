<template>
  <a-form ref="formRef" :rules="rules" :model="deptFormData" :label-col="{span:6}"
          label-align="left" class="dept-form-com">
    <a-form-item :label="$t('system.N00336')" name="parent">
      <a-tree-select
        v-model:value="deptFormData.parent"
        :allowClear="true"
        :tree-data="deptDefaultList"
        :load-data="handleTreeLoad"
        :tree-line="{showLeafIcon}"
        style="width: 100%"
      />
    </a-form-item>
    <a-form-item required :label="$t('system.N00526')" name="name">
      <a-input v-model:value="deptFormData.name"/>
    </a-form-item>
    <a-form-item required :label="$t('system.N00529')" name="key">
      <a-input v-model:value="deptFormData.key"/>
    </a-form-item>
    <a-form-item :label="$t('system.N00499')">
      <a-input v-model:value="deptFormData.owner" :placeholder="$t('system.N00434')"/>
    </a-form-item>
    <a-form-item :label="$t('system.N00122')">
      <a-input v-model:value="deptFormData.description" :maxlength="200" show-count
               type="textarea"/>
    </a-form-item>
    <a-form-item>
      <a-button @click="handleUpdateMenu" type="primary" :loading="deptBtnLoading">
        {{ deptFormData.id ? $t('system.N00580') : $t('system.N00258') }}
      </a-button>
      <a-button @click="handleClose" style="margin-left: 10px">{{ $t('system.N00091') }}</a-button>
    </a-form-item>
  </a-form>
</template>

<script lang="ts" setup>
import {$t} from '#/locales'
import {reactive, ref, onMounted} from 'vue';
import {lazyLoadDept, AddObj, UpdateObj} from '../../api';
import {notification} from 'ant-design-vue';
import type {DeptFormDataType, TreeItemType, APIResponseData} from '../../types';
import type {TreeSelectProps} from 'ant-design-vue';
import type {Rule} from 'ant-design-vue/es/form';

const showLeafIcon = ref(false);

interface IProps {
  initFormData: TreeItemType | null;
  treeData: TreeItemType[];
}


const formRef = ref();
const rules: Record<string, Rule[]> = {
  name: [{required: true, message: $t('system.N00527'), trigger: 'blur'}],
  key: [{required: true, message: $t('system.N00530'), trigger: 'blur'}],
};

const props = withDefaults(defineProps<IProps>(), {
  initFormData: () => ({} as Partial<any>),
  treeData: () => [],
});
const emit = defineEmits(['drawerClose']);

let deptDefaultList = ref<TreeItemType[]>([]);
let deptFormData = reactive<DeptFormDataType>({
  key: '',
  parent: undefined,
  name: '',
  owner: '',
  description: '',
});
let deptBtnLoading = ref(false);

const setDeptFormData = () => {
  if (props.initFormData?.id) {
    deptFormData.id = props.initFormData?.id;
    deptFormData.key = props.initFormData?.identity || '';
    deptFormData.parent = props.initFormData.parentId || '';
    deptFormData.name = props.initFormData.name || '';
    deptFormData.owner = props.initFormData.owner || '';
    deptFormData.description = props.initFormData.description || '';
  }
};

/**
 * 树的懒加载
 */
//@ts-ignore
const handleTreeLoad = (treeNode: TreeSelectProps['treeData'][number]) => {
  return new Promise<void>((resolve) => {
    if (treeNode?.dataRef?.children) {
      resolve();
      return;
    }
    lazyLoadDept({parent: treeNode?.dataRef?.id}).then((res) => {
      const resp = res.data.map((item: any) => ({
        ...item,
        title: item.name, // 重命名 name 为 title
        key: item.id,     // 重命名 id 为 key
        children: item.children || [], // 保留子节点
        isLeaf: !item.hasChildren,
        parent: treeNode.dataRef,
        value: item.id,
      }))
      if (treeNode.dataRef) {
        treeNode.dataRef.children = resp
      } else {
        treeNode.children = resp;
      }
      resolve();
    })
  })
};

const handleUpdateMenu = async () => {
  try {
    // 等待 validate 方法完成验证
    await formRef.value.validate();

    deptBtnLoading.value = true;
    let res;
    if (deptFormData.id) {
      res = await UpdateObj(deptFormData); // 更新操作
    } else {
      res = await AddObj(deptFormData); // 添加操作
    }

    // 判断请求是否成功
    if (res?.code === 2000) {
      notification.success({message: res.msg as string, placement: 'top'});
      handleClose('submit');
    }
  } catch (error) {
    // console.log('验证失败:', error);
    // 如果验证失败，你可以在这里处理错误，比如提示用户填写表单
  } finally {
    deptBtnLoading.value = false; // 无论验证成功或失败，都会执行此操作
  }
};

const handleClose = (type: string = '') => {
  emit('drawerClose', type);
  formRef.value?.resetFields();
};

onMounted(async () => {
  props.treeData.map((item) => {
    deptDefaultList.value.push(item);
  });
  setDeptFormData();
});
</script>

<style lang="scss" scoped>
.dept-form-com {
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
}
</style>
