<template>
  <div class="user-info-head"
       @click="editCropper()">
    <a-tooltip :title="$t('system.N00054')" color="purple" placement="bottom">
      <a-avatar :size="100" :src="userStore?.userInfo?.avatar ?? preferences.app.defaultAvatar"/>
    </a-tooltip>
    <a-modal :title="title"
             v-model:open="dialogVisiable"
             width="870px"
             @close="closeDialog"
             footer=""
    >
      <a-row>
        <a-col class="flex justify-center">
          <div class="cropper">
            <vue-cropper
              ref="cropper"
              :img="options.img"
              :info="true"
              :center-box="options.centerBox"
              :auto-crop="options.autoCrop"
              :auto-crop-width="options.autoCropWidth"
              :auto-crop-height="options.autoCropHeight"
              :fixed-box="options.fixedBox"
              :output-type="options.outputType"
              :full="options.full"
              :fixed="options.fixed"
              :can-move="options.canMove"
              :can-move-box="options.canMoveBox"
              :can-scale="options.canScale"
              :output-size="options.size"
              :original="options.original"
              @real-time="realTime"
              v-if="visible"
            />
          </div>
        </a-col>
        <div style="margin-left: 20px">
          <div :style="getPreviewStyle">
            <div :style="previews.div">
              <img :src="previews.url" :style="previews.img" alt=""/>
            </div>
          </div>

        </div>
      </a-row>
      <br/>
      <a-row>
        <a-col :lg="{ span: 1, offset: 0 }" :md="2">
          <a-upload action="#"
                    :show-upload-list="false"
                    :before-upload="beforeUpload"
                    :max-count="1"
                    list-type="picture"
          >
            <a-tooltip :title="$t('system.N00518')">
              <a-button type="text" style="font-size: 32px; padding: 0;">
                <Icon icon="catppuccin:image" style="font-size: inherit;"/>
              </a-button>
            </a-tooltip>
          </a-upload>
        </a-col>
        <a-col :lg="{ span: 1, offset: 2 }" :md="2">
          <a-tooltip :title="$t('system.N00100')">
            <a-button @click="rotateLeft()" type="text" style="font-size: 32px; padding: 0;">
              <Icon icon="codicon:debug-step-back" style="font-size: inherit;"/>
            </a-button>
          </a-tooltip>
        </a-col>

        <a-col :lg="{ span: 1, offset: 2 }" :md="2">
          <a-tooltip :title="$t('system.N00239')">
            <a-button @click="changeScale(1)" type="text" style="font-size: 32px; padding: 0;">
              <Icon icon="icon-park:zoom-in" style="font-size: inherit;"/>
            </a-button>
          </a-tooltip>
        </a-col>
        <a-col :lg="{ span: 1, offset: 2 }" :md="2">
          <a-tooltip :title="$t('system.N00398')">
            <a-button @click="changeScale(-1)" type="text" style="font-size: 32px; padding: 0;">
              <Icon icon="icon-park:zoom-out" style="font-size: inherit;"/>
            </a-button>
          </a-tooltip>
        </a-col>

        <a-col :lg="{ span: 1, offset: 2 }" :md="2">
          <a-tooltip :title="$t('system.N00099')">
            <a-button @click="rotateRight()" type="text" style="font-size: 32px; padding: 0;">
              <Icon icon="codicon:debug-step-over" style="font-size: inherit;"/>
            </a-button>
          </a-tooltip>
        </a-col>
        <a-col :lg="{ span: 2, offset: 2 }" :md="2">
          <a-button type="primary" @click="uploadImg()">{{ $t('system.N00285') }}</a-button>
        </a-col>
      </a-row>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import {$t} from '#/locales'
import type {UploadProps} from 'ant-design-vue';
import {message} from 'ant-design-vue';
import {computed, defineExpose, getCurrentInstance, nextTick, reactive, ref, watch} from 'vue';
import {Icon} from '@iconify/vue';
import 'vue-cropper/dist/index.css';
import {VueCropper} from 'vue-cropper';
import {useUserStore} from '@vben/stores';
import {base64ToFile} from '#/utils/tools';
import {preferences} from '@vben/preferences';

const userStore = useUserStore();
//@ts-ignore
const {proxy} = getCurrentInstance();

const previews = ref<any>({})
const visible = ref(false);
const title = ref($t('system.N00054'));
const emit = defineEmits(['update:modelValue', 'uploadImg']);
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
    required: true,
  },
});
const dialogVisiable = computed({
  get() {
    return props.modelValue;
  },
  set(newVal) {
    emit('update:modelValue', newVal);
  },
});
const realTime = (data: any) => {
  previews.value = data
  const height = data.img.height;
  const width = data.img.width;
  previews.value.div.height = height
  previews.value.div.width = width
};
const getPreviewStyle = computed(() => {
  return {
    'width': previews.value.w + 'px',
    'height': previews.value.h + 'px',
    'overflow': 'hidden',
    'border-radius': '50%'
  }
})

//图片裁剪数据
interface Options {
  img: any;
  fileName: any;
  size: any;
  full: any;
  canMove: any;
  original: any;
  canMoveBox: any;
  autoCrop: any;
  autoCropWidth: any;
  autoCropHeight: any;
  fixed: any;
  centerBox: any;
  fixedBox: any;
  canScale: any;
  outputType: any;
  visible?: any;
}

const options: Options = reactive({
  img: userStore?.userInfo?.avatar ?? preferences.app.defaultAvatar, // 裁剪图片的地址
  // img: 'https://avatars2.githubusercontent.com/u/15681693?s=460&v=4', // 裁剪图片的地址
  fileName: '',
  size: 1,
  full: false,
  canMove: true,
  original: false, // 上传的图片是否按照原始比例渲染
  canMoveBox: true,
  autoCrop: true, // 是否默认生成截图框
  autoCropWidth: 200, // 默认生成截图框宽度
  autoCropHeight: 200, // 默认生成截图框高度
  fixed: false,
  centerBox: true,
  fixedBox: true, // 固定截图框大小 不允许改变
  canScale: true, // 图片是否允许滚轮缩放
  outputType: 'png', // 默认生成截图为PNG格式
});

/** 编辑头像 */
function editCropper() {
  dialogVisiable.value = true;
}

/** 打开弹出层结束时的回调 */
watch(dialogVisiable, (newVal) => {
  if (newVal) {
    visible.value = true;
  }
});

function modalOpened() {
  nextTick(() => {
    visible.value = true;
  });
}

/** 覆盖默认上传行为 */
function requestUpload() {
}

/** 向左旋转 */
function rotateLeft() {
  proxy.$refs.cropper.rotateLeft();
}

/** 向右旋转 */
function rotateRight() {
  proxy.$refs.cropper.rotateRight();
}

/** 图片缩放 */
function changeScale(num: any) {
  num = num || 1;
  proxy.$refs.cropper.changeScale(num);
}

/** 上传预处理 */
const beforeUpload: UploadProps['beforeUpload'] = file => {
  if (file.type.indexOf('image/') === -1) {
    message.error($t('system.N00256') + '，' + $t('system.N00421') + $t('system.N00130') + '：JPG，PNG' + $t('system.N00098') + '。');
  } else {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      options.img = reader.result;
      options.fileName = file.name;
    };
  }
  return false; // 阻止默认上传行为
}

/** 上传图片 */
function uploadImg() {
  // 获取截图的 base64 数据
  proxy.$refs.cropper.getCropData((data: any) => {
    let img = new Image();
    img.src = data;
    img.onload = async () => {
      let _data = compress(img);
      const imgFile = base64ToFile(_data, options.fileName);
      emit('uploadImg', imgFile);
    };
  });
}

// 压缩图片
function compress(img: any) {
  let canvas = document.createElement('canvas');
  let ctx = canvas.getContext('2d');
  if (ctx) {
    // let initSize = img.src.length;
    let width = img.width;
    let height = img.height;
    canvas.width = width;
    canvas.height = height;
    // 铺底色
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, width, height);
    // 进行压缩
    return canvas.toDataURL('image/jpeg', 0.8);
  }
}

/** 关闭窗口 */
function closeDialog() {
  options.visible = false;
  options.img = userStore.userInfo?.avatar ?? preferences.app.defaultAvatar;
}

const updateAvatar = (img: any) => {
  options.img = img;
};

defineExpose({
  updateAvatar,
});
</script>

<style lang="scss" scoped>
.user-info-head {
  position: relative;
  display: inline-block;
  height: 120px;
}

.user-info-head:hover:after {
  position: absolute;
  text-align: center;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  color: #000000;
  font-size: 20px;
  font-style: normal;
  cursor: pointer;
  line-height: 110px;
}

.cropper {
  height: 500px;
  width: 600px;
  margin: 5px auto;
}

</style>
