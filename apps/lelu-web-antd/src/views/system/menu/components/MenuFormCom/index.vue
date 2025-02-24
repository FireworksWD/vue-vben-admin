<script lang="ts" setup>
import { $t } from "#/locales";
import { Page } from "@vben/common-ui";

import { ref, onMounted, reactive, defineAsyncComponent } from "vue";
import { lazyLoadMenu, AddObj, UpdateObj } from "#/views/system/menu/api";
import { Input, notification } from "ant-design-vue";
import type {
  MenuFormDataType,
  MenuTreeItemType,
  ComponentFileItem
} from "#/views/system/menu/types";
import type { TreeSelectProps } from "ant-design-vue";
import type { Rule } from "ant-design-vue/es/form";

const MultipleIconPicker = defineAsyncComponent(() => import("../MultiIconPicker/MultiIconPicker.vue"));

const showLeafIcon = ref(false);

interface IProps {
  initFormData: Partial<MenuTreeItemType> | null;
  treeData: MenuTreeItemType[];
}


const validateWebPath = (_rule: Rule, value: string, _callback: Function) => {
  let pattern = /^\/.*?/;
  const reg = pattern.test(value);
  if (reg) {
    return Promise.resolve();
  } else {
    return Promise.reject($t("system.N00465"));
  }
};

const validateLinkUrl = (_rule: Rule, value: string, _callback: Function) => {
  let pattern = /^\/.*?/;
  let patternUrl = /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/;
  const reg = pattern.test(value) || patternUrl.test(value);
  if (reg) {
    return Promise.resolve();
  } else {
    return Promise.reject($t("system.N00465"));
  }
};

const props = withDefaults(defineProps<IProps>(), {
  initFormData: () => ({} as Partial<any>),
  treeData: () => []
});
const emit = defineEmits(["drawerClose"]);

const formRef = ref();

const rules: Record<string, Rule[]> = {
  web_path: [{
    required: true,
    message: $t("system.N00465"),
    validator: validateWebPath,
    trigger: "blur"
  }],
  name: [{ required: true, message: $t("system.N00409"), trigger: "blur" }],
  component: [{ required: true, message: $t("system.N00475"), trigger: "blur" }],
  component_name: [{ required: true, message: $t("system.N00474"), trigger: "blur" }],
  link_url: [{
    required: true,
    message: $t("system.N00449"),
    validator: validateLinkUrl,
    trigger: "blur"
  }]
};

let deptDefaultList = ref<MenuTreeItemType[]>([]);
let menuFormData = reactive<MenuFormDataType>({
  parent: undefined,
  name: "",
  component: "",
  web_path: "",
  icon: "",
  cache: true,
  status: true,
  visible: true,
  component_name: "",
  description: "",
  is_catalog: false,
  is_link: false,
  is_iframe: false,
  is_affix: false,
  link_url: ""
});
let menuBtnLoading = ref(false);

const setMenuFormData = () => {
  if (props.initFormData?.id) {
    menuFormData.id = props.initFormData?.id || "";
    menuFormData.name = props.initFormData?.name || "";
    menuFormData.parent = (props.initFormData?.parent as { id: any } | undefined)?.id || undefined;
    menuFormData.component = props.initFormData?.component || "";
    menuFormData.web_path = props.initFormData?.web_path || "";
    menuFormData.icon = props.initFormData?.icon || "";
    menuFormData.status = !!props.initFormData.status;
    menuFormData.visible = !!props.initFormData.visible;
    menuFormData.cache = !!props.initFormData.cache;
    menuFormData.component_name = props.initFormData?.component_name || "";
    menuFormData.description = props.initFormData?.description || "";
    menuFormData.is_catalog = !!props.initFormData.is_catalog;
    menuFormData.is_link = !!props.initFormData.is_link;
    menuFormData.is_iframe = !!props.initFormData.is_iframe;
    menuFormData.is_affix = !!props.initFormData.is_affix;
    menuFormData.link_url = props.initFormData.link_url || "";
  }
};

const querySearch = (queryString: string, cb: any) => {
  const files: any = import.meta.glob("../../../../views/**/*.vue");
  let fileLists: Array<any> = [];
  Object.keys(files).forEach((queryString: string) => {
    fileLists.push({
      label: queryString.replace(/(\.\/|\.vue)/g, ""),
      value: queryString.replace(/(\.\/|\.vue)/g, "")
    });
  });
  const results = queryString ? fileLists.filter(createFilter(queryString)) : fileLists;
  // 统一去掉/src/views/前缀
  results.forEach((val) => {
    val.label = val.label.replace("/src/views/", "");
    val.value = val.value.replace("/src/views/", "");
  });
  cb(results);
};

const createFilter = (queryString: string) => {
  return (file: ComponentFileItem) => {
    return file.value.toLowerCase().indexOf(queryString.toLowerCase()) !== -1;
  };
};

/**
 * 树的懒加载
 */
//@ts-ignore
const handleTreeLoad = (treeNode: TreeSelectProps["treeData"][number]) => {
  return new Promise<void>((resolve) => {
    if (treeNode?.dataRef?.children) {
      resolve();
      return;
    }
    lazyLoadMenu({ parent: treeNode?.dataRef?.id }).then((res) => {
      const resp = res.data.map((item: any) => ({
        ...item,
        title: item.name, // 重命名 name 为 title
        key: item.id,     // 重命名 id 为 key
        children: item.children || [], // 保留子节点
        isLeaf: !item.hasChildren,
        parent: treeNode.dataRef,
        value: item.id
      }));
      if (treeNode.dataRef) {
        treeNode.dataRef.children = resp;
      } else {
        treeNode.children = resp;
      }
      resolve();
    });
  });
};

const handleSubmit = async () => {
  try {
    // 等待 validate 方法完成验证
    await formRef.value.validate();

    menuBtnLoading.value = true;
    let res;
    if (menuFormData.id) {
      res = await UpdateObj(menuFormData); // 更新操作
    } else {
      res = await AddObj(menuFormData); // 添加操作
    }

    // 判断请求是否成功
    if (res?.code === 2000) {
      notification.success({ message: res.msg as string, placement: "top" });
      handleCancel("submit");
    }
  } catch (error) {
    // console.log('验证失败:', error);
    // 如果验证失败，你可以在这里处理错误，比如提示用户填写表单
  } finally {
    menuBtnLoading.value = false; // 无论验证成功或失败，都会执行此操作
  }
};

const handleCancel = (type: string = "") => {
  emit("drawerClose", type);
  formRef.value?.resetFields();
};

onMounted(async () => {
  props.treeData.map((item: any) => {
    deptDefaultList.value.push(item);
  });
  setMenuFormData();
});
</script>


<template>
  <Page>
    <a-form ref="formRef" :rules="rules" :model="menuFormData" :label-col="{span:6}"
            label-align="left">
      <a-form-item :label="$t('system.N00408')" name="name">
        <a-input v-model:value="menuFormData.name" :placeholder="$t('system.N00478')" />
      </a-form-item>
      <a-form-item :label="$t('system.N00335')" name="parent">
        <a-tree-select
          v-model:value="menuFormData.parent"
          :placeholder="$t('system.N00492')"
          :tree-data="deptDefaultList"
          :allowClear="true"
          show-search
          :tree-line="{showLeafIcon}"
          :load-data="handleTreeLoad"
          style="width: 100%"
        />
      </a-form-item>

      <a-form-item :label="$t('system.N00506')" name="web_path">
        <a-input v-model:value="menuFormData.web_path"
                 :placeholder="$t('system.N00484')+'，'+$t('system.N00422')+'/'+$t('system.N00180')" />
      </a-form-item>

      <a-form-item :label="$t('system.N00111')" name="icon">
        <MultipleIconPicker clearable v-model="menuFormData.icon" />
        <!--        <Input-->
        <!--          v-model:value="menuFormData.icon"-->
        <!--          allow-clear-->
        <!--          placeholder="点击这里选择图标"-->
        <!--          style="width: 300px"-->
        <!--        >-->
        <!--          <template #addonAfter>-->
        <!--            <IconPicker v-model="menuFormData.icon" prefix="mdi-light" type="icon" />-->
        <!--          </template>-->
        <!--        </Input>-->
      </a-form-item>

      <a-row>
        <a-col :span="12">
          <a-form-item required :label="$t('system.N00337')">
            <a-switch v-model:checked="menuFormData.status" width="60"
                      :checked-children="$t('system.N00102')"
                      :un-checked-children="$t('system.N00371')" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item v-if="menuFormData.status" required :label="$t('system.N00047')">
            <a-switch v-model:checked="menuFormData.visible" width="60"
                      :checked-children="$t('system.N00275')"
                      :un-checked-children="$t('system.N00541')" />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row>
        <a-col :span="12">
          <a-form-item required :label="$t('system.N00273')">
            <a-switch v-model:checked="menuFormData.is_catalog" width="60"
                      :checked-children="$t('system.N00267')"
                      :un-checked-children="$t('system.N00101')" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item v-if="!menuFormData.is_catalog" required :label="$t('system.N00124')">
            <a-switch v-model:checked="menuFormData.is_link" width="60"
                      :checked-children="$t('system.N00267')"
                      :un-checked-children="$t('system.N00101')" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item required v-if="!menuFormData.is_catalog" :label="$t('system.N00271')">
            <a-switch v-model:checked="menuFormData.is_affix" width="60"
                      :checked-children="$t('system.N00267')"
                      :un-checked-children="$t('system.N00101')" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item v-if="!menuFormData.is_catalog && menuFormData.is_link" required
                       :label="$t('system.N00268')">
            <a-switch v-model:checked="menuFormData.is_iframe" width="60"
                      :checked-children="$t('system.N00267')"
                      :un-checked-children="$t('system.N00101')" />
          </a-form-item>
        </a-col>
      </a-row>

      <a-form-item :label="$t('system.N00122')">
        <a-textarea v-model:value="menuFormData.description" :maxlength="200" show-count
                    :placeholder="$t('system.N00448')" />
      </a-form-item>

      <a-divider style="border-color: #7cb305;margin-top: 0" dashed />

      <div style="min-height: 184px">
        <a-form-item v-if="!menuFormData.is_catalog && !menuFormData.is_link"
                     :label="$t('system.N00389')"
                     name="component">
          <a-auto-complete
            class="w-full"
            v-model:value="menuFormData.component"
            :fetch-suggestions="querySearch"
            :trigger-on-focus="false"
            clearable
            :debounce="100"
            :placeholder="$t('system.N00509')"
          />
        </a-form-item>

        <a-form-item v-if="!menuFormData.is_catalog && !menuFormData.is_link"
                     :label="$t('system.N00388')"
                     name="component_name">
          <a-input v-model:value="menuFormData.component_name" :placeholder="$t('system.N00474')" />
        </a-form-item>

        <a-form-item v-if="!menuFormData.is_catalog && menuFormData.is_link"
                     :label="$t('system.N00124')"
                     name="link_url">
          <a-input v-model:value="menuFormData.link_url" :placeholder="$t('system.N00449')" />
        </a-form-item>

        <a-form-item v-if="!menuFormData.is_catalog" :label="$t('system.N00394')">
          <a-switch v-model:checked="menuFormData.cache" width="60"
                    :checked-children="$t('system.N00102')"
                    :un-checked-children="$t('system.N00371')" />
        </a-form-item>
      </div>
      <a-divider style="height: 2px; background-color: #7cb305;margin-top: 0;" />
    </a-form>

    <a-row>
      <a-col :span="6" :offset="18">
        <a-button @click="handleSubmit" type="primary" :loading="menuBtnLoading"
                  style="margin-right: 20px;">{{ $t("system.N00048") }}
        </a-button>
        <a-button @click="handleCancel">{{ $t("system.N00091") }}</a-button>
      </a-col>
    </a-row>

  </Page>
</template>

