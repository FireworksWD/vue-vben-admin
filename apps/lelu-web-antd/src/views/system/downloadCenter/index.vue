<template>
  <fs-page>
    <fs-crud ref="crudRef" v-bind="crudBinding">
      <template #cell_url="scope">
        <a-tag size="small">{{ scope.row.url }}</a-tag>
      </template>
    </fs-crud>
  </fs-page>
</template>

<script lang="ts" setup name="downloadCenter">
import { onMounted } from "vue";

import { useFs } from "@fast-crud/fast-crud";
import { createCrudOptions } from "./crud";

//@ts-ignore
const { crudBinding, crudRef, crudExpose } = useFs({ createCrudOptions, context: null });

// 页面打开后获取列表数据
onMounted(async () => {
  await crudExpose.doRefresh();
});
</script>
