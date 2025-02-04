<template>
  <Page>
    <a-row>
      <!-- 个人信息 -->
      <a-col style="width: 59%">
        <a-card hoverable :title="$t('system.N00017')" :body-style="{height:'20vh'}">
          <a-row>
            <a-col :span="3">
              <avatarSelector v-model="selectImgVisible" @uploadImg="uploadImg"
                              ref="avatarSelectorRef"></avatarSelector>
            </a-col>
            <a-divider type="vertical" style="height: auto; background-color: #7cb305;width: 2px"/>

            <a-col :span="20">
              <a-row>
                <a-col :span="24">
                  {{ currentTime }}，{{ state.personalForm.username }}，{{ $t('system.N00340') }}，{{
                    $t('system.N00026')
                  }}！
                </a-col>
              </a-row>
              <a-row style="margin-top: 20px">
                <a-col :span="12">
                  <span style="display: inline-flex;align-items: center;">
                    <Icon icon="vscode-icons:file-type-ember"
                          style="margin-right: 5px"/>{{ $t('system.N00274') }}:</span>&nbsp;
                  <a-tag :color="getRandomColor()">{{ state.personalForm.name }}</a-tag>
                </a-col>
                <a-col :span="12">
                  <span style="display: inline-flex;align-items: center;">
                    <Icon icon="fluent-color:building-people-24"
                          style="margin-right: 5px"/>
                    {{ $t('system.N00522') }}:</span>&nbsp;
                  <a-tag :color="getRandomColor()">{{
                      $t(state.personalForm.dept_info.dept_name)
                    }}
                  </a-tag>
                </a-col>
              </a-row>
              <a-row style="margin-top: 20px">
                <a-col :span="24">
                  <span style="display: inline-flex;align-items: center;">
                    <Icon icon="fluent-color:people-48"
                          style="margin-right: 5px"/>
                    {{ $t('system.N00411') }}:</span>&nbsp;
                  <a-tag :color="getRandomColor()"
                         v-for="(item, index) in state.personalForm.role_info" :key="index">
                    {{ item.name }}
                  </a-tag>
                </a-col>
              </a-row>
            </a-col>
          </a-row>
        </a-card>
      </a-col>

      <a-col style="width: 1%">
      </a-col>
      <!-- 消息通知 -->
      <a-col style="width: 40%;">
        <a-card hoverable :title="$t('system.N00324')"
                :body-style="{ padding: '12px', height: '20vh', overflowY: 'auto' }">
          <template #extra>
            <a-button @click="msgMore" type="primary">{{ $t('system.N00282') }}</a-button>
          </template>

          <ul class="news-list">
            <li
              v-if="state.newsInfoList?.length > 0"
              v-for="(v, k) in state.newsInfoList"
              :key="k"
              class="news-item"
            >
              <div class="news-content">
          <span class="news-meta">
            [{{ v.creator_name }}, {{ formatDate(v.create_datetime) }}]
          </span>
                <span class="news-title">{{ v.title }}</span>
              </div>
            </li>
            <a-empty v-else class="empty-state"/>
          </ul>
        </a-card>
      </a-col>

    </a-row>

    <a-row>
      <!-- 更新信息 -->
      <a-col :span="24" style="margin-top: 20px">
        <a-card hoverable :title="$t('system.N00284')" :body-style="{height:'52vh'}">
          <a-row>
            <a-divider type="vertical" style="height: auto; background-color: #7cb305;width: 4px"/>
            <a-tag :bordered="false" color="#3b5999" style="font-size: 14px">
              <template #icon>
              </template>
              {{ $t('system.N00121') }}
            </a-tag>
          </a-row>
          <a-row style="margin-top: 20px" justify="center" align="middle">
            <a-col :span="24">
              <a-form :model="state.personalForm" ref="userInfoFormRef" :rules="rules"
                      style="height: 100%">
                <a-row justify="center" align="middle" :gutter="16">
                  <a-col :span="5">
                    <a-form-item :label="$t('system.N00274')" name="name">
                      <a-input v-model:value="state.personalForm.name"
                               :placeholder="$t('system.N00462')"
                               clearable>
                        <template #addonBefore>
                          <Icon icon="vscode-icons:file-type-ember"/>
                        </template>
                      </a-input>
                    </a-form-item>
                  </a-col>
                  <a-col :span="5">
                    <a-form-item :label="$t('system.N00521')">
                      <a-input v-model:value="state.personalForm.email"
                               :placeholder="$t('system.N00486')"
                               clearable>
                        <template #addonBefore>
                          <Icon icon="fxemoji:email"/>
                        </template>
                      </a-input>
                    </a-form-item>
                  </a-col>
                  <a-col :span="5">
                    <a-form-item :label="$t('system.N00208')" name="mobile">
                      <a-input v-model:value="state.personalForm.mobile"
                               :placeholder="$t('system.N00456')"
                               clearable>
                        <template #addonBefore>
                          <Icon icon="line-md:phone-call-loop"/>
                        </template>
                      </a-input>
                    </a-form-item>
                  </a-col>
                  <a-col :span="5">
                    <a-form-item :label="$t('system.N00193')">
                      <a-select v-model:value="state.personalForm.gender"
                                :placeholder="$t('system.N00490')"
                                allow-clear>
                        <a-select-option v-for="(item, index) in genderList" :key="index"
                                         :value="item.value">
                          {{ item.label }}
                        </a-select-option>
                      </a-select>
                    </a-form-item>
                  </a-col>
                  <a-col :span="4">
                    <a-form-item>
                      <a-button type="primary" @click="submitForm" shape="round"
                                style="display: flex; align-items: center;">
                        <template #icon>
                          <Icon icon="token-branded:vix" style="margin-right: 4px"/>
                        </template>
                        {{ $t('system.N00283') }}
                      </a-button>
                    </a-form-item>
                  </a-col>
                </a-row>
              </a-form>
            </a-col>
          </a-row>
          <a-divider style="height: 2px; background-color: #7cb305"/>
          <a-row>
            <a-divider type="vertical" style="height: auto; background-color: #7cb305;width: 4px"/>
            <a-tag :bordered="false" color="#cd201f" style="font-size: 14px">
              <template #icon>
              </template>
              {{ $t('system.N00501') }}
            </a-tag>
          </a-row>
          <a-row style="margin-top: 20px" justify="center" align="middle">
            <a-col :span="20">
              <div>{{ $t('system.N00503') }}</div>
              <div>{{ $t('system.N00186') }}：{{ $t('system.N00185') }}</div>
            </a-col>
            <a-col :span="4">
              <a-button type="primary" @click="passwordFormShow = true" shape="round">
                <template #icon>

                </template>
                {{ $t('system.N00055') }}
              </a-button>
            </a-col>
          </a-row>
          <a-divider style="border-color: #7cb305" dashed/>
          <a-row>
            <a-col :span="24">
              <div>{{ $t('system.N00153') }}</div>
              <div>{{ $t('system.N00174') }}：{{ state.personalForm.mobile }}</div>
            </a-col>
          </a-row>
          <a-divider style="border-color: #7cb305" dashed/>
          <a-row>
            <a-col :span="24">
              <div>{{ $t('system.N00392') }}</div>
              <div>{{ $t('system.N00175') }}：{{ state.personalForm.email }}</div>
            </a-col>
          </a-row>
        </a-card>
      </a-col>
    </a-row>

    <!--    密码修改-->
    <a-modal v-model:open="passwordFormShow" :title="$t('system.N00156')">
      <a-form
        ref="userPasswordFormRef"
        :model="userPasswordInfo"
        required-asterisk
        :rules="passwordRules"
        label-align="left"
        :label-col="{span:7}"
        :wrapper-col="{span:17}"
      >
        <a-form-item :label="$t('system.N00085')" required name="oldPassword">
          <a-input-password type="password" v-model:value="userPasswordInfo.oldPassword"
                            :placeholder="$t('system.N00441')" allow-clear>
            <template #addonBefore>
              <Icon icon="carbon:password"/>
            </template>
          </a-input-password>
        </a-form-item>
        <a-form-item required name="newPassword" :label="$t('system.N00260')">
          <a-input-password type="password" v-model:value="userPasswordInfo.newPassword"
                            :placeholder="$t('system.N00461')" allow-clear>
            <template #addonBefore>
              <Icon icon="mdi:password-alert"/>
            </template>
          </a-input-password>
        </a-form-item>
        <a-form-item required name="newPassword2" :label="$t('system.N00369')">
          <a-input-password type="password" v-model:value="userPasswordInfo.newPassword2"
                            :placeholder="$t('system.N00425')" allow-clear>
            <template #addonBefore>
              <Icon icon="mdi:password-alert"/>
            </template>
          </a-input-password>
        </a-form-item>
      </a-form>
      <template #footer>
				<span class="dialog-footer">
					<a-button type="primary" @click="settingPassword"> <i
            class="fa fa-check"></i>{{ $t('system.N00229') }}</a-button>
				</span>
      </template>
    </a-modal>
  </Page>
</template>

<script setup lang="ts" name="personal">
import {$t} from '#/locales'
import {Icon} from '@iconify/vue';
import {Page} from '@vben/common-ui';
import {reactive, computed, onMounted, ref, defineAsyncComponent} from 'vue';
import {formatAxis} from '#/utils/formatTime';
import * as api from './api';
import {message} from 'ant-design-vue';
import {useRouter} from 'vue-router';
import {useAccessStore, useUserStore} from '@vben/stores';
import {dictionary} from "#/utils/dictionary";
import {getUserInfoApi} from "#/api";
import type {Rule} from 'ant-design-vue/es/form';
import {preferences} from "@vben/preferences";

const router = useRouter();
/**
 * 日期
 */
const formatDate = (dateString: string): string => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  };
  return new Date(dateString).toLocaleDateString('zh-CN', options);
};

/**
 * 随机获取颜色
 */
const getRandomColor = () => {
  const colors = [
    "pink",
    "red",
    "orange",
    "green",
    "cyan",
    "blue",
    "purple",
    "#3b5999",
    "#2db7f5",
    "#87d068",
    "#108ee9"
  ];
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
};

// 头像裁剪组件
const avatarSelector = defineAsyncComponent(() => import('#/components/avatarSelector/index.vue'));
const avatarSelectorRef = ref(null);
// 当前时间提示语
const currentTime = computed(() => {
  return formatAxis(new Date());
});
const userInfoFormRef = ref();
const rules: Record<string, Rule[]> = {
  name: [{required: true, message: $t('system.N00462'), trigger: 'blur'}],
  mobile: [{pattern: /^1[3-9]\d{9}$/, message: $t('system.N00464')}],
};

let selectImgVisible = ref(false);

const state = reactive<PersonalState>({
  newsInfoList: [],
  personalForm: {
    avatar: '',
    username: '',
    name: '',
    email: '',
    mobile: '',
    gender: '',
    dept_info: {
      dept_id: 0,
      dept_name: '',
    },
    role_info: [
      {
        id: 0,
        name: '',
      },
    ],
  },
});

/**
 * 跳转消息中心
 */
const route = useRouter();
const msgMore = async () => {
  await route.push('/messageCenter');
};

const genderList = ref();
/**
 * 获取用户个人信息
 */
const getUserInfo = function () {
  api.GetUserInfo({}).then((res: any) => {
    const {data} = res;
    genderList.value = dictionary('gender')
    state.personalForm.avatar = data.avatar || '';
    state.personalForm.username = data.username || '';
    state.personalForm.name = data.name || '';
    state.personalForm.email = data.email || '';
    state.personalForm.mobile = data.mobile || '';
    state.personalForm.gender = data.gender;
    state.personalForm.dept_info.dept_name = data.dept_info.dept_name || '';
    state.personalForm.role_info = data.role_info || [];
  });
};

/**
 * 更新用户信息
 */
const submitForm = async () => {
  try {
    await userInfoFormRef.value.validate();
    let res;
    res = await api.updateUserInfo(state.personalForm);
    if (res.code === 2000) {
      message.success(res.msg);
      getUserInfo();
    }
  } catch (error) {
  }
};

/**
 * 获取消息通知
 */
const getMsg = () => {
  api.GetSelfReceive({}).then((res: any) => {
    const {data} = res;
    state.newsInfoList = data || [];
  });
};
onMounted(() => {
  getUserInfo();
  getMsg();
});

/**************************密码修改部分************************/
const passwordFormShow = ref(false);
const userPasswordFormRef = ref();
const userPasswordInfo = reactive({
  oldPassword: '',
  newPassword: '',
  newPassword2: '',
});

const validatePass = (_rule: Rule, value: string, _callback: Function) => {
  const pwdRegex = new RegExp('(?=.*[0-9])(?=.*[a-zA-Z]).{8,30}');
  if (value === '') {
    return Promise.reject($t('system.N00455'));
  } else if (value === userPasswordInfo.oldPassword) {
    return Promise.reject($t('system.N00086'));
  } else if (!pwdRegex.test(value)) {
    return Promise.reject($t('system.N00198') + '(' + $t('system.N00155') + '、' + $t('system.N00240') + ')');
  } else {
    if (userPasswordInfo.newPassword2 !== '') {
      userPasswordFormRef.value.validate('newPassword2');
    }
    return Promise.resolve();
  }
};
const validatePass2 = (_rule: Rule, value: string, _callback: Function) => {
  if (value === '') {

    return Promise.reject($t('system.N00424'));
  } else if (value !== userPasswordInfo.newPassword) {
    return Promise.reject($t('system.N00016'));
  } else {
    return Promise.resolve();
  }
};

const passwordRules: Record<string, Rule[]> = {
  oldPassword: [
    {
      required: true,
      message: $t('system.N00442'),
      trigger: 'blur',
    },
  ],
  newPassword: [{validator: validatePass, trigger: 'blur'}],
  newPassword2: [{validator: validatePass2, trigger: 'blur'}],
};

/**
 * 重新设置密码
 */
const settingPassword = async () => {
  try {
    await userPasswordFormRef.value.validate();
    const res = await api.UpdatePassword(userPasswordInfo)
    if (res.code === 2000) {
      passwordFormShow.value = false;
      message.success($t('system.N00157'));
      useAccessStore().setAccessToken(null);
      if (
        preferences.app.loginExpiredMode === 'modal'
      ) {
        setTimeout(() => {
          useAccessStore().setLoginExpired(true);
        }, 1000);
      } else {
        setTimeout(() => {
          router.push('/login');
        }, 1000);
      }
    }
  } catch (error) {
  }
};

const uploadImg = (data: any) => {
  let formdata = new FormData();
  formdata.append('file', data);
  api.uploadAvatar(formdata).then((res: any) => {
    if (res.code === 2000) {
      selectImgVisible.value = false;
      //getBaseURL()
      state.personalForm.avatar = res.data.url;
      api.updateUserInfo(state.personalForm).then(async (_res: any) => {
        message.success($t('system.N00286'));
        getUserInfo();
        const res = await getUserInfoApi();
        const userInfo = res.data;
        useUserStore().setUserInfo(userInfo);

        // @ts-ignore
        avatarSelectorRef.value.updateAvatar(state.personalForm.avatar);
      });
    }
  });
};
</script>


<style scoped lang="scss">
.news-list {
  padding: 0;
  margin: 0;
  list-style: none;
}

.news-item {
  padding: 8px;
  margin-bottom: 8px;
  background: #f5f5f5;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.news-item:hover {
  transform: translateY(-2px);
}

.news-content {
  display: flex;
  flex-direction: column;
}

.news-meta {
  font-size: 12px;
  color: #888;
}

.news-title {
  margin-top: 4px;
  font-weight: bold;
  color: #333;
}

.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: #aaa;
}

</style>
