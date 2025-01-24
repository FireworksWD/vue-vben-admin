<template>
	<div class="icon-selector-warp-row">
      <!-- 列表内容 -->
      <a-row :gutter="10" v-if="list.length > 0">
        <a-col
          :xs="8"
          :sm="4"
          :md="4"
          :lg="4"
          :xl="4"
          v-for="(v, k) in paginatedList"
          :key="k"
          @click="onColClick(v)"
        >
          <div class="icon-selector-warp-item" :class="{ 'icon-selector-active': prefix === v }">
            <Icon :icon="v" />
          </div>
        </a-col>
      </a-row>
      <!-- 空数据提示 -->
      <a-empty :image-size="100" v-if="list.length <= 0" :description="empty" />
    <!-- 分页器 -->
    <a-pagination
      v-model:current="currentPage"
      :total="totalItems"
      :page-size="pageSize"
      @change="onPageChange"
      show-less-items
      :show-size-changer="false"
      show-quick-jumper
      simple
    />
	</div>
</template>

<script setup lang="ts" name="iconSelectorList">
import {$t} from '#/locales'
import {Icon} from '@iconify/vue';
import { ref, computed } from 'vue';

// 响应式数据
const currentPage = ref(1); // 当前页
const pageSize = ref(30); // 每页显示的项目数
const totalItems = computed(() => props.list.length); // 总条数
// const list = ref([]); // 所有的图标数据
const empty = '没有数据'; // 空数据描述
const prefix = ref(''); // 当前选择的图标
// 计算属性：计算分页后的图标列表
const paginatedList = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  return props.list.slice(start, start + pageSize.value);
});
// 方法：页码改变时触发
const onPageChange = (page:any) => {
  currentPage.value = page;
};

// 定义父组件传过来的值
const props = defineProps({
	// 图标列表数据
	list: {
		type: Array,
		default: () => [],
	},
	// 自定义空状态描述文字
	empty: {
		type: String,
		default: () => $t('system.N00262'),
	},
	// 高亮当前选中图标
	prefix: {
		type: String,
		default: () => '',
	},
});

// 定义子组件向父组件传值/事件
const emit = defineEmits(['get-icon']);

// 当前 icon 图标点击时
const onColClick = (v: unknown | string) => {
	emit('get-icon', v);
};


</script>

<style scoped lang="scss">
.icon-selector-warp-row {
	height: 240px;
  width: 480px;
	overflow: hidden;
  overflow-y: auto;
	.a-row {
		padding: 15px;
	}
	.icon-selector-warp-item {
		display: flex;
		justify-content: center;
		align-items: center;
		border: 1px solid #DCDFE6FF;
		border-radius: 5px;
		margin-bottom: 10px;
		height: 30px;
		i {
			font-size: 20px;
			color: #606266FF;
		}
		&:hover {
			cursor: pointer;
			background-color: #ECF5FFFF;
			border: 1px solid #A0CFFFFF;
			i {
				color: #409EFFFF;
			}
		}
	}
	.icon-selector-active {
		background-color: #ECF5FFFF;
		border: 1px solid #A0CFFFFF;
		i {
			color: #409EFFFF;
		}
	}
}
</style>
