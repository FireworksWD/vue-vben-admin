<script setup lang="ts">
import {$t} from '#/locales'
import {Page} from '@vben/common-ui'
import {defineAsyncComponent, ref} from 'vue'


const DemoTreeTable = defineAsyncComponent(() => import('#/views/system/messageCenter/componments/commonTableSelect.vue'))
const tableConfig = {
  url: '/api/system/user/',
  label: 'name',
  value: 'id',
  isMultiple: true,
  columns: [
    {
      field: '#',
      type: 'checkbox',
      width: 50,
    },
    {
      field: 'name',
      label: $t('system.N00342'),
      width: 120,
    },
    {
      field: 'phone',
      label: $t('system.N00343'),
      width: 120,
    },
  ],
}
const modelValue = ref()
const displayLabel = ref()
</script>

<template>
  <Page>
    <DemoTreeTable :tableConfig="tableConfig" :modelValue="modelValue"
                   :displayLabel="displayLabel"/>
  </Page>
</template>

<style scoped lang="scss">

</style>
