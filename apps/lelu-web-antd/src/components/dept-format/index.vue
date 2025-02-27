<template>
  <div>
    {{ data }}
  </div>
</template>
<script setup lang="ts">
import {$t} from '#/locales'
import {ref, watch} from 'vue'
import {useDeptInfoStore} from '#/store/modules/dept'

const props = defineProps({
  modelValue: {
    type: [Number, String, Object]
  }
})
const data = ref()
watch(() => {
  return props.modelValue
}, async (newVal) => {
  const deptInfoStore = useDeptInfoStore()
  const result = await deptInfoStore.getParentDeptById(newVal)
  if (result?.nodes) {
    let name = ""
    result.nodes.forEach((item: any, index: number) => {
      name += index > 0 ? `/${$t(item.name)}` : $t(item.name)
    })
    data.value = name
  }
}, {immediate: true})
</script>
