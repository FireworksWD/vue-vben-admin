<script setup lang="ts">
import { ref, onMounted, defineProps, defineEmits, watch, watchEffect } from "vue";
import { IconPicker, Page } from "@vben/common-ui";
import { Input } from "ant-design-vue";

interface Props {
  /** 图标集的名字数组 */
  prefixes?: string[];
  modelValueProp?: string;

  [any: string]: any;
}

const props = withDefaults(defineProps<Props>(), {
  //@ts-ignore
  prefixes: ["ant-design", "mdi-light", "logos", "circle-flags",
    "vscode-icons", "streamline-emojis", "token-branded", "devicon"] as string[],
  modelValueProp: "modelValue"
});
const currentSelect = ref("");
const modelValue = defineModel({ default: "", type: String });
const emit = defineEmits(["change"]);
const activePrefix = ref("");

const activePrefixFunc = () => {
  const modelValueFirstPart = getFirstPart(modelValue.value);
  for (let prefix of props.prefixes) {
    if (getFirstPart(prefix) === modelValueFirstPart) {
      return prefix;  // 如果找到匹配的部分，返回该前缀
    }
  }
  return "ant-design";  // 默认值
};


const getFirstPart = (value: any) => {
  return value.split("-")[0];
};

watchEffect(() => {
  currentSelect.value = modelValue.value;
});

watch(
  () => currentSelect.value,
  (v) => {
    emit("change", v);
  }
);
onMounted(() => {
  activePrefix.value = activePrefixFunc();
});
</script>

<template>
    <Input
      v-model:value="modelValue"
      allow-clear
      placeholder="点击这里选择图标"
      style="width: 100%"
    >

      <template #addonBefore>
        <a-select v-model:value="activePrefix"
                  :dropdownStyle="{ maxHeight: '100px', overflow: 'auto' }">
          <a-select-option
            v-for="(prefix, index) in props.prefixes"
            :key="index"
            :value="prefix"
          >
            {{ getFirstPart(prefix) }}
          </a-select-option>
        </a-select>
      </template>
      <template #addonAfter>
        <IconPicker v-model="modelValue" :prefix="activePrefix" type="icon" />
      </template>
    </Input>

</template>
