<template>
  <fs-page>
    <fs-crud ref="crudRef" v-bind="crudBinding">
      <template #cell_url="scope">
        <a-tag size="small">{{ scope.row.url }}</a-tag>
      </template>
    </fs-crud>

<!--    <permission ref="rolePermission"></permission>-->
    <PermissionComNew :drawerVisible="drawerVisible" :roleId="roleId" :roleName="roleName"
                      @drawerClose="handleDrawerClose"/>
  </fs-page>
</template>

<script lang="ts" setup name="role">
import {ref, onMounted, defineAsyncComponent} from 'vue';

import {GetPermission} from './api';
import {useExpose, useCrud} from '@fast-crud/fast-crud';
import {createCrudOptions} from './crud';
import {handleColumnPermission} from "#/utils/columnPermission";


const PermissionComNew=defineAsyncComponent(()=>import('./components/PermissionComNew/index.vue'))
let drawerVisible = ref(false);
let roleId = ref(null);
let roleName = ref(null);

const rolePermission = ref();
// crud组件的ref
const crudRef = ref();
// crud 配置的ref
const crudBinding = ref();


const handleDrawerOpen = (row: any) => {
  roleId.value = row.id;
  roleName.value = row.name;
  drawerVisible.value = true;
};

const handleDrawerClose = () => {
  drawerVisible.value = false;
};

const {crudExpose} = useExpose({crudRef, crudBinding});

// crud配置
const {crudOptions} = createCrudOptions({
  crudExpose: crudExpose,
  handleDrawerOpen
});

// 初始化crud配置
const {resetCrudOptions}= useCrud({crudExpose:crudExpose, crudOptions:crudOptions});

// 页面打开后获取列表数据
onMounted(async () => {

  const newOptions = await handleColumnPermission(GetPermission, crudOptions)

  //重置crudBinding
  //resetCrudOptions(newOptions);
  await crudExpose.doRefresh();
});

// defineExpose(rolePermission);
</script>
