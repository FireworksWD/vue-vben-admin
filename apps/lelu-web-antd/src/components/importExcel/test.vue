<template>
  <a-upload
    :file-list="fileList"
    :custom-request="customRequest"
    :before-upload="handleBeforeUpload"
    :show-upload-list="{ showRemoveIcon: true }"
    :progress="progress"
    list-type="picture"
  >
    <a-button type="primary" @click="handleAddFile">{{ $t('system.N00325') }}</a-button>
    <a-button type="default" @click="handleUpload" :disabled="uploadDisabled" style="margin-left: 10px;">{{ $t('system.N00181') }}</a-button>
  </a-upload>
</template>

<script setup lang="ts">
import {$t} from '#/locales'
import { computed, ref } from 'vue';
import type {UploadFile, UploadChangeParam, UploadProps} from 'ant-design-vue';
const progress: UploadProps['progress'] = {
  strokeColor: {
    '0%': '#108ee9',
    '100%': '#87d068',
  },
  strokeWidth: 10,
  format: (percent = 0) => `${parseFloat(percent.toFixed(2))}%`,
};

const fileList = ref<UploadFile[]>([
  {
    uid: '-1',
    name: 'example.txt',
    status: 'uploading', // 自定义状态：'waiting' 表示待上传
    percent: 0,
  },
]);

const uploadDisabled = computed(() => {
  return !fileList.value.some((file) => file.status === 'uploading');
});

// 模拟手动触发上传
const customRequest = async (options: {file:any}) => {
  const file = fileList.value.find((f) => f.uid === options.file.uid);
  if (!file) return;

  file.status = 'uploading';
  let percent = 0;

  // 模拟上传进度
  const interval = setInterval(() => {
    percent += 10;
    file.percent = percent;
    if (percent >= 100) {
      clearInterval(interval);
      const isSuccess = Math.random() > 0.3; // 模拟成功或失败（70% 成功率）
      file.status = isSuccess ? 'done' : 'error';
      file.percent = isSuccess ? 100 : 0;
    }
  }, 300);
};

// 阻止自动上传，添加到待上传列表
const handleBeforeUpload = (file: File) => {
  fileList.value.push({
    uid: String(Date.now()), // 唯一标识
    name: file.name,
    status: 'uploading', // 待上传状态
    percent: 0,
  });
  return false; // 阻止默认上传
};

// 手动触发上传
const handleUpload = () => {
  fileList.value
    .filter((file) => file.status === 'uploading')
    .forEach((file) => {
      customRequest({ file });
    });
};

// 添加文件到待上传列表
const handleAddFile = () => {
  const file = new File(['example content'], `example_${Date.now()}.txt`);
  handleBeforeUpload(file);
};
</script>
