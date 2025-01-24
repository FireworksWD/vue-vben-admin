<script lang="ts" setup>
import {onMounted, ref} from 'vue';
import {$t} from '#/locales'

import {
  EchartsUI,
  type EchartsUIType,
  useEcharts,
} from '@vben/plugins/echarts';

const chartRef = ref<EchartsUIType>();
const {renderEcharts} = useEcharts(chartRef);

onMounted(() => {
  renderEcharts({
    legend: {
      bottom: 0,
      data: [$t('system.N00415'), $t('system.N00504')],
    },
    radar: {
      indicator: [
        {
          name: $t('system.N00399'),
        },
        {
          name: $t('system.N00373'),
        },
        {
          name: 'Ipad',
        },
        {
          name: $t('system.N00152'),
        },
        {
          name: $t('system.N00379'),
        },
        {
          name: $t('system.N00064'),
        },
      ],
      radius: '60%',
      splitNumber: 8,
    },
    series: [
      {
        areaStyle: {
          opacity: 1,
          shadowBlur: 0,
          shadowColor: 'rgba(0,0,0,.2)',
          shadowOffsetX: 0,
          shadowOffsetY: 10,
        },
        data: [
          {
            itemStyle: {
              color: '#b6a2de',
            },
            name: $t('system.N00415'),
            value: [90, 50, 86, 40, 50, 20],
          },
          {
            itemStyle: {
              color: '#5ab1ef',
            },
            name: $t('system.N00504'),
            value: [70, 75, 70, 76, 20, 85],
          },
        ],
        itemStyle: {
          // borderColor: '#fff',
          borderRadius: 10,
          borderWidth: 2,
        },
        symbolSize: 0,
        type: 'radar',
      },
    ],
    tooltip: {},
  });
});
</script>

<template>
  <EchartsUI ref="chartRef"/>
</template>
