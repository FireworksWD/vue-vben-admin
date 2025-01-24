<template>
    <fs-page>
        <fs-crud ref="crudRef" v-bind="crudBinding"></fs-crud>
    </fs-page>
</template>

<script lang="ts" setup name="operationLog">
import {onMounted} from 'vue';
import {useFsAsync ,useFsRef} from '@fast-crud/fast-crud';
import {createCrudOptions} from './crud';

const { crudRef, crudBinding, context } = useFsRef();

// 页面打开后获取列表数据
onMounted(async () => {
  const { crudExpose } = await useFsAsync({  crudRef, crudBinding,  context, createCrudOptions});
    await crudExpose.doRefresh();
});

</script>
