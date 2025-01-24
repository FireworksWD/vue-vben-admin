<template>
  <div v-show="!showCount" class="dept-user-com-box dept-info">
    <div class="di-left">
      <h3 v-if="deptInfo.dept_name">{{ $t(deptInfo.dept_name) }}</h3>
      <h3 v-else>''</h3>
      <div class="di-cell">
        <p>{{ $t('system.N00532') }}：</p>
        <p class="content">{{ deptInfo.owner || $t('system.N00261') }}</p>
      </div>
      <div class="di-cell">
        <p>{{ $t('system.N00523') }}：</p>
        <p class="content">{{ deptInfo.dept_user || 0 }} {{ $t('system.N00029') }}</p>
      </div>
      <div class="di-cell">
        <p>{{ $t('system.N00531') }}：</p>
        <p class="content">{{ deptInfo.description || $t('system.N00261') }}</p>
      </div>
      <div class="di-cell">
        <p>{{ $t('system.N00276') }}：</p>
        <a-switch
          v-model:checked="isShowChildFlag"
          inline-prompt
          :checked-children="$t('system.N00267')"
          :un-checked-children="$t('system.N00101')"
          :disabled="!currentDeptId"
          @change="handleSwitchChange"
          style="--ant-switch-on-color: #409EFFFF"
        />
      </div>
    </div>
    <div style="height: 180px; width: 380px" ref="deptCountBar"></div>
    <div style="height: 180px; width: 200px" ref="deptSexPie"></div>
  </div>
  <a-divider v-show="showCount==false"
             style="height: 2px; background-color: #7cb305;margin-top: -5px"/>
  <fs-crud
    ref="crudRef"
    v-bind="crudBinding"
    :customClass="!showCount ? 'dept-user-com-box dept-user-com-table' : 'dept-user-com-box dept-user-com-table-cover'"
  >
    <template #toolbar-left>
      <a-button :icon="!showCount ? 'Hide' : 'View'" type="primary" shape="circle"
                @click="showCount = !showCount"></a-button>
    </template>
    <template #actionbar-right>
      <importExcel api="api/system/user/" v-if="hasAccessByCodes(['user:Import'])">
        {{ $t('system.N00160') }}
      </importExcel>
    </template>
  </fs-crud>

  <a-modal v-model:open="resetPwdVisible" :title="$t('system.N00538')" width="400px"
           :before-close="handleResetPwdClose">
    <div>
      <a-input-password v-model:value="resetPwdFormState.newPassword"
                        :placeholder="$t('system.N00455')"
                        style="margin-bottom: 20px"/>
      <a-input-password v-model:value="resetPwdFormState.newPassword2"
                        :placeholder="$t('system.N00424')"
                        show-password/>
    </div>
    <template #footer>
			<span class="dialog-footer">
				<a-button @click="handleResetPwdClose">{{ $t('system.N00091') }}</a-button>
				<a-button type="primary" @click="handleResetPwdSubmit">{{ $t('system.N00048') }}</a-button>
			</span>
    </template>
  </a-modal>
</template>

<script lang="ts" setup name="user">
import {$t} from '#/locales'
import {ref, reactive, onMounted, computed} from 'vue';
import {useExpose, useCrud} from '@fast-crud/fast-crud';
import {Md5} from 'ts-md5';
import {createCrudOptions} from './crud';
import importExcel from '#/components/importExcel/index.vue';
import * as echarts from 'echarts';
import {init} from 'echarts';
import type {EChartsOption, ECharts} from 'echarts'
import {getDeptInfoById, resetPwd} from './api';
import {notification} from 'ant-design-vue';
import type {HeadDeptInfoType} from '../../types';
import {useAccess} from '@vben/access';


const {hasAccessByCodes} = useAccess();

let deptCountChart: ECharts;
let deptSexChart: ECharts;

// crud组件的ref
const crudRef = ref();
// crud 配置的ref
const crudBinding = ref();
// 暴露的方法
const {crudExpose} = useExpose({crudRef, crudBinding});

let currentDeptId = ref('');
let deptCountBar = ref();
let deptSexPie = ref();
let isShowChildFlag = ref(false);
let deptInfo = ref<Partial<HeadDeptInfoType>>({});
let showCount = ref(false);

let resetPwdVisible = ref(false);
let resetPwdFormState = reactive({
  id: 0,
  newPassword: '',
  newPassword2: '',
});
/**
 * 初始化顶部部门折线图
 */
const initDeptCountBarChart = () => {
  const xAxisData = deptInfo.value.sub_dept_map?.map((item) => item.name) || [];
  const yAxisData = deptInfo.value.sub_dept_map?.map((item) => item.count) || [];

  const option: EChartsOption = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    xAxis: {
      type: 'category',
      data: xAxisData,
      axisTick: {
        alignWithLabel: true,
      },
    },
    yAxis: {
      type: 'value',
    },
    dataZoom: [
      {
        type: 'inside',
      },
    ],
    grid: {
      top: '6%',
      right: '5%',
      bottom: '10%',
      left: '10%',
    },
    series: [
      {
        data: yAxisData,
        type: 'bar',
        barWidth: '60%',
        showBackground: true,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {offset: 0, color: '#83bff6'},
            {offset: 0.5, color: '#188df0'},
            {offset: 1, color: '#188df0'},
          ]),
        },
      },
    ],
  };

  deptCountChart.setOption(option);
};

/**
 * 初始化顶部性别统计
 */
const initDeptSexPieChart = () => {
  const option: EChartsOption = {
    tooltip: {
      trigger: 'item',
    },
    legend: {
      orient: 'vertical',
      right: '0%',
      left: '65%',
      top: 'center',
      itemWidth: 12,
      itemHeight: 12,
    },
    series: [
      {
        type: 'pie',
        radius: '65%',
        center: ['32%', '50%'],
        label: {
          show: false,
          position: 'center',
        },
        color: ['#188df0', '#f56c6c', '#dcdfe6'],
        data: [
          {value: deptInfo.value.gender?.male || 0, name: $t('system.N00346')},
          {value: deptInfo.value.gender?.female || 0, name: $t('system.N00129')},
          {value: deptInfo.value.gender?.unknown || 0, name: $t('system.N00294')},
        ],
      },
    ],
  };
  deptSexChart.setOption(option);
};

/**
 * 获取顶部部门信息
 */
const getDeptInfo = async () => {
  const res = await getDeptInfoById(currentDeptId.value, isShowChildFlag.value ? '1' : '0');
  if (res?.code === 2000) {
    deptInfo.value = res.data;
    initDeptCountBarChart();
    initDeptSexPieChart();
  }
};

/**
 * 部门切换刷新用户列表
 */
const handleDoRefreshUser = (id: string) => {
  currentDeptId.value = id;
  crudExpose.doSearch({form: {dept: id}});
  getDeptInfo();
};

const handleSwitchChange = () => {
  handleDoRefreshUser(currentDeptId.value);
};

const handleResetPwdOpen = ({id}: { id: number }) => {
  resetPwdFormState.id = id;
  resetPwdVisible.value = true;
};
const handleResetPwdClose = () => {
  resetPwdVisible.value = false;
  resetPwdFormState.id = 0;
  resetPwdFormState.newPassword = '';
  resetPwdFormState.newPassword2 = '';
};
const handleResetPwdSubmit = async () => {
  if (!resetPwdFormState.id) {
    notification.warning({message: $t('system.N00493') + '！', placement: 'top'});
    return;
  }
  if (!resetPwdFormState.newPassword || !resetPwdFormState.newPassword2) {
    notification.warning({message: $t('system.N00455') + '！', placement: 'top'});
    return;
  }
  if (resetPwdFormState.newPassword !== resetPwdFormState.newPassword2) {
    notification.warning({message: $t('system.N00016'), placement: 'top'});
    return;
  }
  const pwdRegex = new RegExp('(?=.*[0-9])(?=.*[a-zA-Z]).{8,30}');
  if (!pwdRegex.test(resetPwdFormState.newPassword) || !pwdRegex.test(resetPwdFormState.newPassword2)) {
    notification.warning({
      message: $t('system.N00198') + '(' + $t('system.N00155') + '、)' + $t('system.N00240'),
      placement: 'top'
    });
    return;
  }
  const res = await resetPwd(resetPwdFormState.id, {
    newPassword: Md5.hashStr(resetPwdFormState.newPassword),
    newPassword2: Md5.hashStr(resetPwdFormState.newPassword2),
  });

  if (res?.code === 2000) {
    notification.success({message: res.msg || $t('system.N00056') + '！', placement: 'top'});
    handleResetPwdClose();
  }
};

onMounted(() => {
  deptCountChart = init(deptCountBar.value as HTMLElement);
  deptSexChart = init(deptSexPie.value as HTMLElement);
  getDeptInfo();
  crudExpose.doRefresh();
});

defineExpose({
  handleDoRefreshUser,
});

// crud配置
const {crudOptions} = createCrudOptions({
  crudExpose,
  context: {getDeptInfo, isShowChildFlag, handleResetPwdOpen}
});

// 初始化crud配置
const {resetCrudOptions} = useCrud({
  crudExpose,
  crudOptions,
  context: {},
});
</script>

<style lang="scss" scoped>
.dept-user-com-box {
  padding: 0 10px;
  border-radius: 8px 0 0 8px;
  box-sizing: border-box;
}

.dept-user-com-table {
  height: calc(100% - 200px);
}

.dept-user-com-table-cover {
  height: 100%;
}

.dept-info {
  width: 100%;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  margin-bottom: 10px;
}

.dept-info .di-left {
  h3 {
    font-size: 18px;
    font-weight: 900;
  }

  /* 注意：这里的 h3 规则需要移动到外部，因为 CSS 不支持嵌套规则（除非使用预处理器） */
}

.dept-info .di-left h3 {
  font-size: 18px;
  font-weight: 900;
}

.dept-info .di-left .di-cell {
  margin-top: 6px;
  display: flex;
  align-items: center;
}

.dept-info .di-left .di-cell p:first-of-type {
  flex: 0 0 auto;
  margin-right: 10px;
  text-align: right;
}

.dept-info .di-left .di-cell .content {
  max-width: calc(100% - 95px);
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
