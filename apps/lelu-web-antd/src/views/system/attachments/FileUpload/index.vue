<template>
  <div style="display: inline-block">
    <a-button type="primary" @click="handleImport()">
      <slot>{{ $t('system.N00160') }}</slot>
    </a-button>
    <a-spin :spinning="loading">
      <a-modal v-model:open="uploadShow"
               width="35%"
               append-to-body
               :body-style="{ height: 'auto', display: 'flex', flexDirection: 'column' }"
               :after-close="handelClose"
               footer=""
      >
        <div
          style="display: flex; justify-content: space-between; align-items: center; width: 100%;margin-top: -10px">
          <!-- 左侧按钮 -->
          <div style="display: flex;gap: 10px">
            <a-tooltip :title="$t('system.N00214')">
              <a-button type="primary" shape="circle"
                        :disabled="errorCount<=0"
                        @click="batchRemoveFile"
                        :icon="h(DeleteOutlined)"
              />
            </a-tooltip>
          </div>
          <!-- 右侧按钮 -->
          <div style="display: flex;gap: 10px">
            <a-button type="primary" :disabled="fileList?.length === 0" @click="submitUpload">
              {{ $t('system.N00181') }}
            </a-button>
            <a-button type="primary" @click="uploadShow=false">{{ $t('system.N00091') }}</a-button>
          </div>
        </div>
        <a-upload-dragger
          multiple
          :accept="acceptString"
          :max-count="maxCount"
          v-model:file-list="fileList"
          :disabled="isUploading"
          :before-upload="beforeUpload"
          @remove="handleRemove"
          :style="{ height: '50%',marginTop:'10px'}"
        >
          <template #itemRender="{ file, actions }">
            <a-card hoverable :style="getCardStyle(file)">
              <a-space align="start"
                       style="width: 100%; display: flex; justify-content: space-between;">
                <!-- 左侧内容 -->
                <div style="display: flex; align-items: center;">
                  <!-- 图标根据状态显示 -->
                  <a-tooltip :title="$t('system.N00257')">
                    <Icon v-if="file.customStatus === 'failed'" icon="fluent-color:warning-48"
                          width="48" height="48" style="margin-right: 8px"/>
                  </a-tooltip>
                  <Icon v-if="file.customStatus === 'uploading'" icon="svg-spinners:gooey-balls-2"
                        width="48" height="48" style="margin-right: 8px"/>
                  <a-tooltip :title="$t('system.N00003')">
                    <Icon v-if="file.customStatus === 'error'" icon="fluent-color:dismiss-circle-48"
                          width="48" height="48" style="margin-right: 8px"/>
                  </a-tooltip>
                  <Icon v-if="file.customStatus === 'done'" icon="fluent-color:checkmark-circle-48"
                        width="48" height="48" style="margin-right: 8px"/>
                  <a-tooltip :title="$t('system.N00380')">
                    <Icon v-if="file.customStatus === 'pending'" icon="fluent-color:cloud-48"
                          width="48" height="48" style="margin-right: 8px"/>
                  </a-tooltip>
                  <!-- 文件名 -->
                  <span
                    :style="file.customStatus === 'error' ? 'color: red' : ''"
                    :title="file.name"
                    style="display: inline-block; max-width: 300px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                    {{ file.name }}
                  </span>

                </div>

                <!-- 右侧内容 (按钮和进度条) -->
                <div style="display: flex; align-items: center;">
                  <a-tooltip :title="$t('system.N00375')">
                    <a-button danger v-if="file.customStatus==='pending'"
                              @click="removeFile(file, actions.remove)">
                      <Icon icon="icon-park:delete"/>
                    </a-button>
                  </a-tooltip>
                  <a-progress
                    type="circle"
                    v-if="file.customStatus !== 'failed'"
                    :status="file.customStatus === 'error' ? 'exception' : 'active'"
                    :percent="(file.customStatus === 'pending' || file.customStatus === 'uploading') ? file.percent : 100"
                    :stroke-color="{'0%': '#108ee9','100%': '#87d068'}"
                    :stroke-width="10"
                    size="small"
                    style="margin-left: 10px"
                  />
                </div>
              </a-space>
            </a-card>
          </template>
          <div
            style="display: flex; flex-direction: column; justify-content: center; align-items: center; height: 100%;">
            <!-- 图标居中 -->
            <p>
              <Icon icon="line-md:cloud-alt-upload-filled-loop" width="80" height="80"/>
            </p>
            <p>Click or drag file to this area to upload</p>
            <div>
              {{ $t('system.N00609') }}
              <em>{{ $t('system.N00330') }}</em>
            </div>
            <div style="color:red">{{ $t('system.N00230') }}：{{
                $t('system.N00030')
              }}“{{ acceptString }}”{{ $t('system.N00312') }}！{{ $t('system.N00290') }}100{{
                $t('system.N00021')
              }}
            </div>
            <a-divider style="height: 2px; background-color: #7cb305"/>
            <div
              style="margin-top: -20px; align-self: flex-start; display: flex; justify-content: space-between;
              font-size: 14px; font-family: 'Arial', sans-serif; color: #333;">

              <!-- 文件总数 (左边) -->
              <div style="font-weight: bold; color: #2196F3;margin-left: 10px; margin-right: 20px;">
                {{ $t('system.N00255') }}:
                <VbenCountToAnimator :duration="1000" :end-val="fileList.length ?? 0"
                                     :start-val="0"/>
              </div>

              <!-- 不符合的文件数 (左边) -->
              <div style="font-weight: bold; color: #FF5722; margin-right: 20px;">
                {{ $t('system.N00014') }}:
                <VbenCountToAnimator :duration="1000" :end-val="errorCount" :start-val="0"/>
              </div>

              <!-- 成功上传的文件总数 (右边) -->
              <div style="font-weight: bold; color: #4CAF50;margin-left: auto;">
                {{ $t('system.N00202') }}:
                <VbenCountToAnimator :duration="1000" :end-val="successCount" :start-val="0"/>
              </div>
            </div>


          </div>
        </a-upload-dragger>
        <a-empty v-if="(fileList?.length ?? 0) < 1" style="margin-top: 10px"></a-empty>

        <template #title>
          <div style="display: flex; justify-content: center; align-items: center; width: 100%;">
            <p>{{ props.upload.title }}</p>
          </div>
          <a-divider style="height: 2px; border-color: #7cb305" dashed/>
        </template>

      </a-modal>
    </a-spin>
  </div>
</template>

<script lang="ts" setup name="importExcel">
import {$t} from '#/locales'
import {Icon} from '@iconify/vue';
import {requestClient} from '#/api/request';
import {ref, h, defineEmits} from "vue";
import {DeleteOutlined} from '@ant-design/icons-vue'
import {getBaseURL} from '#/utils/baseUrl';
import {useAccessStore} from "@vben/stores";
import type {UploadProps, UploadFile} from 'ant-design-vue';
import {message} from 'ant-design-vue'
import {VbenCountToAnimator} from '@vben/common-ui';
// 定义事件
const emit = defineEmits();

const getCardStyle = (file: { customStatus: string }) => {
  let borderColor = '';
  switch (file.customStatus) {
    case 'error':
      borderColor = '#FF5722';
      break;
    case 'done':
      borderColor = '#388e3c';
      break;
    case 'failed':
      borderColor = '#f57c00';
      break;
    default:
      borderColor = '';
      break;
  }
  return {border: `2px solid ${borderColor}`, marginTop: "5px"};
};

interface CustomUploadFile extends UploadFile {
  customStatus?: 'pending' | 'uploading' | 'done' | 'error' | 'failed';  // 可选的自定义字段,failed表示文件类型不匹配
}

const fileList = ref<CustomUploadFile[]>([]);
const acceptType = ref(['.xls', '.xlsx', '.csv', '.html', '.pdf', '.txt', '.TXT', '.zip'])
// 将 acceptType 转换为以逗号分隔的字符串
const acceptString = acceptType.value.join(',');
//成功的文件数
const successCount = ref(0)

let props = defineProps({
  upload: {
    type: Object,
    default() {
      return {
        // 是否显示弹出层
        open: true,
        // 弹出层标题
        title: $t('system.N00249'),
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的用户数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: {Authorization: 'JWT ' + useAccessStore().accessToken},
        // 上传的地址
        url: getBaseURL() + 'api/system/file/'
      }
    }
  },
  api: { // 导入接口地址
    type: String,
    default() {
      return undefined
    }
  }
})
const maxCount = ref(100)

let loading = ref(false)
const uploadShow = ref(false)
const isUploading = ref(false)
/** 导入按钮操作 */
const handleImport = function () {
  uploadShow.value = true
}

/**
 * 上传前的处理
 * @param file
 */
let errorCount = ref(0);
const beforeUpload: UploadProps['beforeUpload'] = (file: any) => {
  // 获取文件的扩展名
  const fileExtension = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
  if (!acceptType.value.includes(fileExtension)) {
    errorCount.value++; // 增加错误文件计数
    file.customStatus = 'failed';
    return false;
  }

  // 判断文件数是否超过最大数量
  if (!fileList.value) {
    fileList.value = [];
  }
  if (fileList.value.length >= maxCount.value) {
    fileList.value.shift(); // 删除第一个文件
  }
  file.customStatus = 'pending';
  file.percent = 0;
  fileList.value = [...(fileList.value || []), file];
  return false;
};

/**
 * 列表删除的处理
 * @param file
 */
const handleRemove: UploadProps['onRemove'] = file => {
  if (!fileList.value || fileList.value.length === 0) {
    message.error($t('system.N00317'));
    return;
  }
  const index = fileList.value.indexOf(file);
  const newFileList = fileList.value.slice();
  newFileList.splice(index, 1);
  fileList.value = newFileList;
};

/**
 *自定义上传进度条样式
 */
const progress: UploadProps['progress'] = {
  strokeColor: {
    '0%': '#108ee9',
    '100%': '#87d068',
  },
  strokeWidth: 10,
  format: (percent = 0) => `${parseFloat(percent.toFixed(2))}%`,
};

/**
 * 覆盖原本上传的请求
 */
const customRequest = async (options: { file: any }) => {
  const file = fileList.value.find((f) => f.uid === options.file.uid);
  if (!file) return;
  file.customStatus = 'uploading';
  const formData = new FormData();
  formData.append('file', file.originFileObj as any);
  try {
    // 发起单个文件上传请求
    const response = await requestClient.post(props.upload.url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 60_000, //文件上传的请求时间设置长一些
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total && fileList.value) {
          // 如果 total 存在，计算上传进度
          file.percent = Math.round((progressEvent.loaded / progressEvent.total) * 100);

        } else {
          console.log(`文件 ${file.name} 上传进度不可用`);
        }
      },
    });
    file.response = response;
    file.customStatus = 'done';
  } catch (error) {
    // 上传失败后处理逻辑
    console.error(`文件 ${file.name} 上传失败`, error);
    file.customStatus = 'error';
    message.error(`${file.name} ${$t('system.N00003')}`);
  }
};

/**
 * 提交上传的文件
 */
const submitUpload = async () => {
  try {
    if (fileList.value.length < 1) {
      return
    }
    const uploadPromises = fileList.value
      .filter((file) => file.customStatus === 'pending')
      .map((file) => customRequest({file}));
    if (uploadPromises.length <= 0) {
      message.warning($t('system.N00281'));
      return
    }
    await Promise.all(uploadPromises);
    const successFile = fileList.value.filter((file) => file.customStatus === 'done')
    successCount.value = successFile.length;
    message.info(`${uploadPromises.length ?? 0} ${$t('system.N00020')}`);
    // 触发父组件的刷新事件
    emit('refreshData');
  } catch (error) {

  }
}
/**
 * 关闭事件
 */
const handelClose = () => {
  fileList.value = [];
  errorCount.value = 0;
  successCount.value = 0;
}
/**
 * 批量移除不符合的问文件
 */
const batchRemoveFile = () => {
  fileList.value = fileList.value.filter((file) => file.customStatus !== 'failed')
  errorCount.value = 0
  message.success($t('system.N00374') + '!')
}
/**
 * 单个文件的删除
 *
 */
const removeFile = (file: any, removeAction: Function) => {
  // 先执行删除操作
  removeAction();

  // 如果文件的状态是 'failed'，减少 errorCount
  if (file.customStatus === 'failed') {
    errorCount.value--;
  }
}
</script>

<style scoped>
</style>
