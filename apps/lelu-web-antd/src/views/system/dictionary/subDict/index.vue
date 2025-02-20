<template>
  <a-drawer :width="'70%'" :maskClosable="false" v-model:open="drawer" @change="handleDrawerChange"
            direction="rtl" destroy-on-close :title="$t('system.N00143')">
    <fs-crud v-if="drawer" ref="crudRef" v-bind="crudBinding"></fs-crud>
  </a-drawer>
</template>

<script lang="ts" setup>
import { $t } from "#/locales";
import { ref, onMounted } from "vue";
import { useFs } from "@fast-crud/fast-crud";
import { createCrudOptions } from "./crud";
import { Modal } from "ant-design-vue";

//抽屉是否显示
const drawer = ref(false);

//抽屉关闭确认
const handleClose = () => {
  Modal.confirm({
    title: "您确定要关闭?",
    content: "确认后将关闭窗口",
    okText: $t("system.N00362"),
    cancelText: $t("system.N00091"),
    onOk() {
    },
    onCancel() {
    }
  });
};

const { crudBinding, crudRef, crudExpose } = useFs({ createCrudOptions, context: {} });
const { setSearchFormData, doRefresh } = crudExpose;

defineExpose({ drawer, setSearchFormData, doRefresh });
//页面打开后获取列表数据
// onMounted(() => {
// 	crudExpose.doRefresh();
// });

const handleDrawerChange = () => {
  crudExpose.doRefresh();
};
</script>
