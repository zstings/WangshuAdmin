<template>
  <AppTable ref="appTable" v-model="searchModel" :search-config="searchConfig" :table-data-api="apiGetContractList" okey="userManagement">
    <template #search-right>
      <div class="search-right-btns">
        <el-button type="primary" @click="addContract()">新增合同</el-button>
      </div>
    </template>
    <template #table-column>
      <el-table-column label="合同名称" align="center">
        <template #default="{ row }">
          <div class="flex-center">
            <span>{{ row.name }}</span>
            <app-icon-btn :icon="EditPen" tip="修改合同名称" @click="updateContractName(row)" />
          </div>
        </template>
      </el-table-column>
      <el-table-column label="所属企业" align="center">
        <template #default="{ row }">
          {{ companyList.find(item => item.id == row.companyId)?.name || '--' }}
        </template>
      </el-table-column>
      <el-table-column label="合同类型" align="center">
        <template #default="{ row }">
          {{ typeOptions.find(item => item.value == row.type)?.label || '--' }}
        </template>
      </el-table-column>
      <el-table-column label="合同状态" align="center">
        <template #default="{ row }">
          <div class="flex-center">
            <el-tag :type="statusOptions.find(item => item.value == row.status)?.type as 'success' || 'danger'" effect="plain" size="small">
              {{ statusOptions.find(item => item.value == row.status)?.label || '--' }}
            </el-tag>
            <app-icon-btn :icon="EditPen" tip="修改合同状态" @click="updateContractStatus(row)" />
          </div>
        </template>
      </el-table-column>
      <el-table-column label="合同金额" align="center">
        <template #default="{ row }">
          {{ row.price || '--' }}
        </template>
      </el-table-column>
      <el-table-column label="合同时间" align="center">
        <template #default="{ row }"> {{ formats(row.startTime * 1000) }} 至 {{ formats(row.endTime * 1000) }} </template>
      </el-table-column>
      <el-table-column label="备注" align="center">
        <template #default="{ row }">
          {{ row.remark || '--' }}
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center">
        <template #default="{ row }">
          {{ formats(row.createAt) }}
        </template>
      </el-table-column>
      <el-table-column label="更新时间" align="center">
        <template #default="{ row }">
          {{ row.updateAt ? formats(row.updateAt) : '--' }}
        </template>
      </el-table-column>
      <el-table-column prop="address" label="操作" align="center">
        <template #default="{ row }">
          <el-button type="primary" text size="small" :disabled="row.status == 7" @click="addContract(row)">编辑</el-button>
          <el-button type="danger" text size="small" @click="deleteContract(row)">删除</el-button>
        </template>
      </el-table-column>
    </template>
  </AppTable>
</template>
<script setup lang="tsx">
import { apiGetContractList, apiAddContract, apiDeleteContract, apiUpdateContractStatus, apiUpdateContractName } from '@/api/contractSuper/contract';
import { showDialogForm } from '@/utils/dialogForm';
import { computed, reactive, ref } from 'vue';
import { formats, assignMin } from '@zstings/utils';
import { apiGetCompanyList } from '@/api/contractSuper/company';
import { EditPen } from '@element-plus/icons-vue';
const { companyList } = getCompanyList();
const appTable = ref<InstanceType<typeof AppTable>>();
const searchModel = ref({
  name: '',
  type: '',
  status: '',
  startTime: '',
  endTime: '',
  _startEndTime: [],
  companyId: '',
});
const typeOptions = [
  {
    label: '销售合同',
    value: 1,
  },
  {
    label: '采购合同',
    value: 0,
  },
];
const statusOptions = [
  {
    label: '已完成',
    value: 7,
    type: 'success',
  },
  {
    label: '履行中',
    value: 6,
    type: 'primary',
  },
  {
    label: '待履行',
    value: 5,
    type: 'info',
  },
  {
    label: '待审核',
    value: 0,
    type: 'info',
  },
  {
    label: '审核中',
    value: 1,
    type: 'primary',
  },
  {
    label: '审核失败',
    value: 2,
    type: 'danger',
  },
];
const searchConfig = reactive([
  {
    key: 'name',
    type: 'el-input',
    label: '合同名称',
  },
  {
    key: 'type',
    type: 'el-select',
    label: '合同类型',
    default: '',
    options: typeOptions,
  },
  {
    key: 'status',
    type: 'el-select',
    label: '状态',
    default: '',
    options: statusOptions,
  },
  {
    key: 'companyId',
    type: 'el-select',
    label: '所属企业',
    config: {
      value: 'id',
      label: 'name',
    },
    options: computed(() => companyList.value),
  },
  {
    key: '_startEndTime',
    type: 'el-date-picker',
    label: '合同时间',
    uiOn: {
      change: (val: [string, string]) => {
        searchModel.value.startTime = val?.[0] || '';
        searchModel.value.endTime = val?.[1] || '';
      },
    },
  },
]);
function addContract(row: { startTime: string; endTime: string; _startEndTime: [string, string] } | Record<string, any> = {}) {
  row._startEndTime = row.startTime ? [formats(row.startTime * 1000), formats(row.endTime * 1000)] : [];
  const formModel = reactive(assignMin({ id: '', name: '', type: 1, price: '', companyId: '', startTime: '', endTime: '', _startEndTime: [], status: '0' }, row));
  const date = new Date();
  const defaultTime: [Date, Date] = [new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0), new Date(date.getFullYear(), date.getMonth() + 1, 1, 23, 59, 59)];
  showDialogForm({
    title: '新增合同',
    formModel: formModel,
    content: () => (
      <>
        <ElFormItem label='合同名称' prop='name' rules={[{ required: true, message: '请输入合同名称', trigger: ['blur', 'change'] }]}>
          <ElInput v-model={formModel.name} showWordLimit maxlength={20} />
        </ElFormItem>
        <ElFormItem label='合同类型' prop='type' rules={[{ required: true, message: '请选择合同类型', trigger: ['blur', 'change'] }]}>
          <ElSelect v-model={formModel.type} options={typeOptions || []} />
        </ElFormItem>
        <ElFormItem label='合同金额' prop='price' rules={[{ required: true, message: '请输入合同金额', trigger: ['blur', 'change'] }]}>
          <ElInput v-model={formModel.price} />
        </ElFormItem>
        <ElFormItem label='合同时间' prop='_startEndTime' rules={[{ required: true, message: '请输入合同时间', trigger: ['blur', 'change'] }]}>
          <ElDatePicker
            v-model={formModel._startEndTime}
            type='datetimerange'
            value-format='YYYY-MM-DD HH:mm:ss'
            range-separator='至'
            start-placeholder='开始日期'
            end-placeholder='结束日期'
            default-time={defaultTime}
            onUpdate:modelValue={(val: [string, string]) => {
              formModel.startTime = val?.[0] || '';
              formModel.endTime = val?.[1] || '';
            }}
          />
        </ElFormItem>
        <ElFormItem label='所属企业' prop='companyId' rules={[{ required: true, message: '请选择所属企业', trigger: ['blur', 'change'] }]}>
          <ElSelect v-model={formModel.companyId} options={companyList.value} props={{ value: 'id', label: 'name' }} />
        </ElFormItem>
        {formModel.id && (
          <ElFormItem label='合同状态' prop='status' rules={[{ required: true, message: '请选择合同状态', trigger: ['blur', 'change'] }]}>
            <ElSelect v-model={formModel.status} options={statusOptions || []} />
          </ElFormItem>
        )}
      </>
    ),
    okBefore: async () => {
      formModel._startEndTime = undefined;
      await apiAddContract(formModel, { showOKMsg: true }).then(() => {
        appTable.value?.getData();
      });
    },
  });
}
function deleteContract(row: any) {
  ElMessageBox.confirm(`确认删除合同[${row.name}]吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    apiDeleteContract({ id: row.id }, { showOKMsg: true }).then(() => {
      appTable.value?.getData();
    });
  });
}
function updateContractName(row: any) {
  const formModel = reactive({ id: row.id, name: row.name });
  showDialogForm({
    title: '修改合同名称',
    formModel: formModel,
    content: () => (
      <>
        <ElFormItem label='合同名称' prop='name' rules={[{ required: true, message: '请输入合同名称', trigger: ['blur', 'change'] }]}>
          <ElInput v-model={formModel.name} showWordLimit maxlength={20} />
        </ElFormItem>
      </>
    ),
    okBefore: async () => {
      await apiUpdateContractName(formModel, { showOKMsg: true }).then(() => {
        row.name = formModel.name;
      });
    },
  });
}
function updateContractStatus(row: any) {
  const formModel = reactive({ id: row.id, status: row.status });
  showDialogForm({
    title: '修改合同状态',
    formModel: formModel,
    content: () => (
      <>
        <ElFormItem label='合同状态' prop='status' rules={[{ required: true, message: '请选择合同状态', trigger: ['blur', 'change'] }]}>
          <ElSelect v-model={formModel.status} options={statusOptions || []} />
        </ElFormItem>
      </>
    ),
    okBefore: async () => {
      await apiUpdateContractStatus(formModel, { showOKMsg: true }).then(() => {
        row.status = formModel.status;
      });
    },
  });
}

function getCompanyList() {
  const companyList = ref<{ name: string; id: number }[]>([]);
  apiGetCompanyList().then(res => {
    companyList.value = res.list;
  });
  return { companyList };
}
</script>
