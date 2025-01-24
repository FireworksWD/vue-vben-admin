<script setup lang="ts">
import {$t} from '#/locales'
import {defineAsyncComponent, ref, onMounted} from 'vue';
import * as api from './api';
import {Page, VbenButton} from '@vben/common-ui'
import {message, type RadioGroupProps} from 'ant-design-vue';
import {Icon} from "@iconify/vue";

const addTabs = defineAsyncComponent(() => import('./components/addTabs.vue'));
const addContent = defineAsyncComponent(() => import('./components/addContentAnt.vue'));
const formContent = defineAsyncComponent(() => import('./components/formContent.vue'));

const groupsModal = ref(false);
const tabsModal = ref(false);
const contentModal = ref(false);

const formData = ref([]);
const parentOptions = ref([])

const editableTabsValue = ref('base');
const editableTabsOptions: any = ref<RadioGroupProps['options']>([]);
const getTabs = async (parentId = null) => {
  let res;
  if (parentId) {
    res = await api.GetList({parent: parentId, limit: 999});
  } else {
    res = await api.GetList({limit: 999, parent__isnull: true})
  }
  let data = res.data;
  formData.value = res.data
  parentOptions.value = res.data.map((item:any) => ({
    label: $t(item.title),
    value: item.id,
  }))
  data = data.map((item: any) => ({
    ...item,
    label: item.title,
    value: item.key,
  }))
  editableTabsOptions.value = data;
};
const tabId = ref(1)
const addContentId = ref(1)
const updateTabsModal = async (newValue:any) => {
  tabsModal.value = newValue;
  await getTabs();
};
const onOpenTab = () => {
  tabsModal.value = true
}
const updateContentModal = async (newValue:any) => {
  contentModal.value = newValue;
  tabId.value = tabId.value === 1 ? 0 : 1;
};
const onOpenContent = () => {
  contentModal.value = true
}
const onOpenGroups = async () => {
  groupsModal.value = true
  await getTabs();
}
const handleDelete = async (obj: any) => {
  await api.DelObj(obj.id)
  await getTabs()
  message.success($t('system.N00080'))
}
const updateGroupsTitle = async (row:any) => {
  try {
    if (!row?.title) {
      message.error($t('system.N00644'))
      return
    }
    let res;
    res = await api.UpdateObj(row)
    if (res.code === 2000) {
      message.success($t('system.N00056'));
      await getTabs()
      groupsModal.value = false
    } else {
      message.error($t('system.N00658'))
    }
  } catch (error) {
  }
}
const addOnCancel = () => {
  addContentId.value = addContentId.value === 1 ? 0 : 1;
}
onMounted(async () => {
  await getTabs();
});
</script>

<template>
  <Page>
    <!-- 头部部分-->
    <a-row>
      <a-col :span="24">
        <a-card hoverable>
          <a-row align="middle" justify="space-between">
            <a-col>
              <a-tooltip :title="$t('system.N00690')+','+$t('system.N00691')" color="purple"
                         placement="right">
                <a-alert :message="$t('system.N00568')+':'+$t('system.N00654')" type="info"/>
              </a-tooltip>
            </a-col>
            <a-col>
              <VbenButton @click="onOpenTab" style="margin-right: 8px;">{{ $t('system.N00671') }}
              </VbenButton>
              <VbenButton @click="onOpenContent"
                          style="background-color: #e76c40; color: white; border: none;">
                {{ $t('system.N00670') }}
              </VbenButton>
            </a-col>
          </a-row>
        </a-card>

      </a-col>
    </a-row>
    <a-divider style="height: 2px; background-color: #7cb305"/>
    <!-- 主体部分-->
    <a-row>
      <a-col :span="24">
        <a-card hoverable :body-style="{height:'71vh',width:'100%'}">
          <!-- 使用 a-row 同一行布局 -->
          <a-row justify="space-between" align="middle" style="margin-bottom: 16px;">
            <!-- 左侧的 a-radio-group -->
            <a-col>
              <a-radio-group v-model:value="editableTabsValue" button-style="solid"
                             style="width: 100%">
                <a-radio-button
                  v-for="option in editableTabsOptions"
                  :key="option.value"
                  :value="option.value">
                  {{ $t(option.label) }}
                </a-radio-button>
              </a-radio-group>
            </a-col>

            <!-- 右侧的按钮 -->
            <a-col>
              <a-button type="primary" @click="onOpenGroups">{{ $t('system.N00631') }}</a-button>
            </a-col>
          </a-row>

          <a-divider style="height: 2px; background-color: #7cb305"/>
          <a-row v-for="option in editableTabsOptions" :key="option.value">
            <formContent v-if="editableTabsValue === option.value"
                         :options="option" :editableTabsItem="option"
                         :key="tabId"
                         style="width: 100%;height: 100%"/>
          </a-row>
        </a-card>
      </a-col>
    </a-row>

    <a-modal v-model:open="tabsModal" :footer="null" :title="$t('system.N00671')">
      <addTabs @updateTabsModal="updateTabsModal"/>
    </a-modal>
    <a-modal v-model:open="contentModal" :footer="null" :title="$t('system.N00670')"
             style="margin-top: 30px"
             @cancel="addOnCancel">
      <addContent @updateContentModal="updateContentModal" :parentOptions="parentOptions"
                  :key="addContentId"/>
    </a-modal>
    <a-modal v-model:open="groupsModal" :title="$t('system.N00631')" :footer="null">
      <!-- Form 表单 -->
      <a-form :model="formData" layout="horizontal"
              style="margin-top: 20px;max-height: 400px; overflow-y: auto;">
        <a-row
          v-for="(group, index) in formData"
          :key="group.id"
          style="margin-bottom: 16px; display: flex; align-items: center;"
        >
          <!-- 分组名称 -->
          <a-col :span="16">
            <a-form-item :label="$t('system.N00630')">
              <!-- 显示每个条目的 title, 可以编辑 -->
              <a-input v-model:value="group.title"/>
            </a-form-item>
          </a-col>
          <!-- 更新按钮 -->
          <a-col :span="4" style="margin-bottom: 25px;">
            <a-button
              type="primary"
              @click="updateGroupsTitle(group)"
              style="margin-left: 8px;"
            >更新
            </a-button>
          </a-col>
          <!-- 删除按钮 -->
          <a-col :span="4" style="margin-bottom: 25px;">
            <!-- 当 group.children.length === 0 时，显示删除按钮，并且禁用按钮 -->
            <a-tooltip v-if="group.children && group.children.length > 0"
                       :title="$t('system.N00679')">
              <a-button
                danger
                :disabled="group.children && group.children.length > 0"
                style="margin-left: 8px; height: 100%;"
              >
                <Icon icon="icon-park:delete"/>
              </a-button>
            </a-tooltip>
            <!-- 如果 children 为空，则按钮不禁用，直接显示删除按钮 -->
            <a-popconfirm :title="$t('system.N00674')" @confirm="handleDelete(group)">
              <a-button
                v-if="!(group.children && group.children.length > 0)"
                danger
                style="margin-left: 8px; height: 100%;"
              >
                <Icon icon="icon-park:delete"/>
              </a-button>
            </a-popconfirm>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>
  </Page>

</template>

<style scoped lang="scss">

</style>
