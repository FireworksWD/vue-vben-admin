<template>
  <a-select
    v-model:value="selectedValue"
    :style="{ width: '100%' }"
    :mode="multiple ? 'multiple' : 'default'"
    :placeholder="placeholder"
    :pagination="pagination"
    :options="options"
    :label-in-value="true"
  >
    <a-select-option
      v-for="option in options"
      :key="option.value"
      :value="option.value"
    >
      {{ option.label }}
    </a-select-option>
  </a-select>
</template>

<script setup>
import {$t} from '#/locales'
import {ref, watch, onMounted} from 'vue';
import {requestClient} from '#/api/request'

// Props from the parent component
const props = defineProps({
  modelValue: {
    type: [String, Array],
    default: '',
  },
  elProps: {
    type: Object,
    default: () => ({}),
  },
  dict: {
    type: Object,
    required: true,
  },
  pagination: {
    type: Boolean,
    default: false,
  },
  multiple: {
    type: Boolean,
    default: false,
  },
});

// Emitting event to the parent component
const emit = defineEmits();

// Local state
const selectedValue = ref(props.modelValue);
const options = ref([]);
const placeholder = $t('system.N00488');

// Fetch data when the component is mounted
onMounted(() => {
  fetchOptions();
});

// Watch the `modelValue` to keep the `selectedValue` in sync
watch(() => props.modelValue, (newValue) => {
  selectedValue.value = newValue;
});

// Function to fetch options based on the `dict` prop
const fetchOptions = async () => {
  try {
    const response = await requestClient.get(props.dict.url);
    options.value = response.data.map((item) => ({
      value: item[props.dict.value],
      label: item[props.dict.label],
    }));
  } catch (error) {
    console.error('Error fetching options:', error);
  }
};

// Watch for changes in the selected value and emit them back to the parent
watch(selectedValue, (newValue) => {
  emit('update:modelValue', newValue);
});
</script>

<style scoped>
/* You can add custom styles for the component */
</style>
