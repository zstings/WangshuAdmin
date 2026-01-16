<template>
  <div class="app-table flex flex-col">
    <div v-if="searchConfig.length > 0" class="search flex" :class="'search-' + searchAlign">
      <div class="search-left">
        <el-form ref="formInlineRef" :inline="true" :model="searchModel" @submit.prevent>
          <el-form-item v-for="search in searchConfig" :key="search.key" :label="search.label">
            <template v-if="search.type == 'el-input'">
              <el-input
                v-model="searchModel[search.key]"
                :placeholder="`请输入${search.label}`"
                clearable
                style="width: 180px"
                v-bind="search.uiAttrOption"
                @keyup.enter="getData()"
                @clear="getData()"></el-input>
            </template>
            <template v-if="search.type == 'el-select'">
              <el-select
                v-model="searchModel[search.key]"
                :placeholder="`请选择${search.label}`"
                :empty-values="[null, undefined]"
                style="width: 180px"
                v-bind="search.uiAttrOption">
                <el-option v-if="search.isAll !== false" label="全部" :value="search.defaule || ''" />
                <el-option
                  v-for="item in search.options"
                  :key="item[search?.config?.value || 'value']"
                  :label="item[search?.config?.label || 'label']"
                  :value="item[search?.config?.value || 'value']" />
              </el-select>
            </template>
            <template v-if="search.type == 'el-date-picker'">
              <el-date-picker
                v-model="searchModel[search.key]"
                format="YYYY-MM-DD HH:mm:ss"
                value-format="YYYY-MM-DD HH:mm:ss"
                type="datetimerange"
                range-separator="~"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                :default-time="defaultTime"
                :disabled-date="disabledDate"
                clearable
                style="width: 380px"
                v-bind="search.uiAttrOption"
                v-on="search.uiOn || {}"
                @calendar-change="calendarChange" />
            </template>
            <template v-if="search.type == 'el-input-select'">
              <el-input
                v-model="searchModel[search.keys[search.select.key]]"
                :placeholder="'请输入' + search.select.options[search.select.key].label"
                clearable
                style="width: 280px"
                v-bind="search.uiAttrOption">
                <template #prepend>
                  <el-select
                    v-model="search.select.key"
                    :empty-values="[null, undefined]"
                    placeholder="请选择"
                    style="width: 100px"
                    v-bind="search.select.uiAttrOption"
                    @change="() => search.keys.forEach((key: any) => (searchModel[key] = ''))">
                    <el-option v-for="item in search.select.options" :key="item.value" :label="item.label" :value="item.value" />
                  </el-select>
                </template>
              </el-input>
            </template>
            <template v-if="search.slot">
              <slot :name="search.slot" :search="search"></slot>
            </template>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getData()">搜索</el-button>
            <el-button @click="resetFields">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="search-right">
        <slot name="search-right"></slot>
      </div>
    </div>
    <slot v-bind="{ tableColumns, total }"></slot>
    <div class="body flex flex-1">
      <div class="body-sidebar shrink-0"><slot name="body-sidebar"></slot></div>
      <div v-loading="loading" class="body-content flex flex-1 flex-col">
        <el-table
          ref="tableRef"
          v-tablesl="tableColumns"
          :data="tableColumns"
          class="table-content"
          :class="tableColumns.length ? '' : 'table-empty'"
          border
          stripe
          @selection-change="tableSelectChange"
          @header-dragend="handleHeaderDragend">
          <slot name="table-column" v-bind="{ tableColumns, total, setWidth }"></slot>
          <template #empty>
            <div v-show="!loading">
              <slot name="table-empty"><el-empty description="暂无数据" /></slot>
            </div>
          </template>
        </el-table>
        <el-pagination
          v-if="total > 0"
          v-model:page-size="basePagination.pageSize"
          v-model:current-page="basePagination.page"
          background
          class="table-pagination flex justify-end"
          layout="prev, pager, next, sizes, total"
          :page-sizes="[10, 20, 50, 100]"
          :hide-on-single-page="true"
          :total="total"
          @update:current-page="getData(false)"
          @size-change="getData(true)" />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { reactive, ref, useTemplateRef } from 'vue';
import { type AppRequestConfig } from '@/https';
import { useRef } from '@/utils';
import { downloadFile, formats, timeStamp } from '@zstings/utils';
const emit = defineEmits(['selection-change']);
const tableRef = useTemplateRef<InstanceType<typeof ElTable>>('tableRef');
const defaultTime = [new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 2, 1, 23, 59, 59)];
const searchModel = defineModel<any>({});
const tableSelect = defineModel<any[]>('select');
const props = withDefaults(
  defineProps<{
    searchConfig?: any[];
    tableDataApi?: (_params?: Record<string, any>, _config?: AppRequestConfig) => Promise<any>;
    pageSize?: number;
    searchCb?: any;
    listCb?: any;
    downFileName?: string;
    okey?: string;
    searchAlign?: 'linear' | 'vertical'; // 左右 or 上下
  }>(),
  {
    searchConfig: () => [],
    tableDataApi: (_params?: Record<string, any>, _config?: AppRequestConfig) => Promise.resolve(),
    pageSize: 20,
    searchCb: null,
    listCb: null,
    downFileName: '文件名称',
    okey: '',
    searchAlign: 'linear',
  },
);
const sTime = ref<Date | undefined>(undefined);
const disabledDate = (time: Date) => {
  const today = formats(Date.now(), 'YYYY-MM-DD');
  const maxTime = timeStamp(`${today} 00:00:00`);
  const minTime = timeStamp(`${today} 00:00:00`) - 8.64e7 * 366;
  if (sTime.value) {
    const sDay = formats(sTime.value, 'YYYY-MM-DD');
    const sMaxTime = timeStamp(`${sDay} 00:00:00`) + 8.64e7 * 30;
    const sMinTime = timeStamp(`${sDay} 00:00:00`) - 8.64e7 * 30;
    return time.getTime() < Math.max(sMinTime, minTime) || time.getTime() > Math.min(sMaxTime, maxTime);
  }
  return time.getTime() < minTime || time.getTime() > maxTime;
};
const calendarChange = (time: [Date, Date?]) => {
  sTime.value = time[0];
  if (time[1]) sTime.value = undefined;
};
const [_, resetSearchModel] = useRef(searchModel);

const basePagination = reactive({
  page: 1,
  pageSize: props.pageSize,
});
const tableColumns = ref([]);
const total = ref(0);
const loading = ref(true);
function getData(isRest = true, type: 'blob' | 'json' = 'json') {
  if (isRest) basePagination.page = 1;
  // 搜索前回调函数
  if (props.searchCb) props.searchCb(searchModel.value, basePagination);
  loading.value = true;
  // 移除自定义（以下划线开头的）字段
  const data = Object.assign({}, basePagination, searchModel.value);
  Object.keys(data).forEach(key => {
    if (key.startsWith('_')) delete data[key];
  });
  props
    .tableDataApi(data, { responseType: type })
    .then(res => {
      if (type == 'blob') return downloadFile(props.downFileName, res as any);
      if (props.listCb) props.listCb(res);
      total.value = Number(res.total || 0);
      tableColumns.value = res.list || [];
    })
    .finally(() => {
      loading.value = false;
    });
}
getData();

function resetFields() {
  resetSearchModel();
  getData();
}

function tableSelectChange(n: any) {
  tableSelect.value = n;
  emit('selection-change', n);
}

// 是否需要记录宽度变化
const isSetWidth = ref(false);
// 是否首次渲染
const isFirstRender = ref(true);
function handleHeaderDragend() {
  if (!isSetWidth.value) return;
  const data: Record<string, any> = {};
  tableRef.value?.columns.forEach((item: any) => {
    data[item.label] = { minWidth: item.minWidth, width: item.width, realWidth: item.realWidth, label: item.label };
  });
  const nkey = `${props.okey}`;
  localStorage.setItem(nkey, JSON.stringify(data));
}
function setWidth(key: string) {
  isSetWidth.value = true;
  if (isFirstRender.value == false) return;
  if (!tableRef.value?.columns || !tableRef.value?.columns.length) return;
  if (!props.okey) console.warn('调用 setWidth 请设置 okey, okey 为表格的唯一标识');
  const nkey = `${props.okey}`;
  const xitem = tableRef.value?.columns.find((item: any) => item.label == key)!;
  const yitem = localStorage.getItem(nkey) ? JSON.parse(localStorage.getItem(nkey) || '{}') : '';
  if (yitem && yitem[key]) {
    xitem.minWidth = yitem[key].minWidth;
    xitem.realWidth = yitem[key].realWidth;
    xitem.width = yitem[key].width;
  }
  // 每个el-table-column都会执行，所以会执行多次，只有最后一个执行完了，才会设置为false
  const times = setTimeout(() => {
    clearTimeout(times);
    isFirstRender.value = false;
  }, 500);
}

defineExpose({
  getData,
  tableRef,
});
</script>
<style lang="less">
.app-table {
  // height: calc(100vh - 174px);
  flex: 1;
  min-height: 0;
  .search {
    margin-bottom: 15px;
    &-vertical {
      flex-direction: column;
      .search-right {
        margin-top: 15px;
      }
      .search-right-btns .el-button {
        margin-bottom: 0;
      }
    }
    &-left {
      flex: 1;
      .el-form {
        margin-bottom: -15px;
      }
      .el-form-item {
        margin-bottom: 15px !important;
        margin-right: 24px;
      }
    }
    &-right {
      margin-left: auto;
    }
  }
  .body {
    overflow: hidden;
    &-sidebar {
      height: 100%;
      overflow-y: auto;
      overflow-x: hidden;
    }
    &-content {
      & > div:not(:only-child):first-child {
        margin-bottom: 15px;
      }
    }
  }
  .table-pagination {
    margin-top: auto;
  }
  .body-content {
    width: 100%;
    .table-content {
      width: 100%;
    }
  }

  .table-empty {
    &.el-table--border:after,
    &.el-table--border:before,
    .el-table__inner-wrapper:before {
      background-color: transparent;
    }
    .el-table__border-left-patch {
      height: 32px;
    }
  }
}
</style>
