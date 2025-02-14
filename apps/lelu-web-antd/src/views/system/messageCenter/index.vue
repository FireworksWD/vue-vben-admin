<template>
  <fs-page>
    <fs-crud ref="crudRef" v-bind="crudBinding">
      <template #actionbar-left>
        <!--          <a-tabs v-model:activeKey="tabActivted" @tab-click="onTabClick">-->
        <!--            <a-tab-pane :tab="$t('system.N00203')" key="send"></a-tab-pane>-->
        <!--            <a-tab-pane :tab="$t('system.N00204')" key="receive"></a-tab-pane>-->
        <!--          </a-tabs>-->
        <a-radio-group
          v-model:value="tabActivted"
          button-style="solid"
          @change="groupChange"
        >
          <a-radio-button value="send">{{ $t('system.N00203') }}</a-radio-button>
          <a-radio-button value="receive">{{ $t('system.N00204') }}</a-radio-button>
        </a-radio-group>
        <a-divider type="vertical"/>
      </template>
    </fs-crud>
  </fs-page>
</template>

<script lang="ts" setup name="messageCenter">
import {$t} from '#/locales'
import {ref, onMounted} from 'vue';
import {useFs} from '@fast-crud/fast-crud';
import createCrudOptions from './crud';

//tab选择
const tabActivted = ref('receive');
// const onTabClick = (tab: any) => {
//   tabActivted.value = tab;
//   crudExpose.doRefresh();
// };
const groupChange = () => {
  crudExpose.doRefresh();
}

const context: any = {tabActivted}; //将 tabActivted 通过context传递给crud.tsx
// 初始化crud配置
const {crudRef, crudBinding, crudExpose} = useFs({createCrudOptions, context});

// 页面打开后获取列表数据
onMounted(() => {
  crudExpose.doRefresh();
});
</script>
