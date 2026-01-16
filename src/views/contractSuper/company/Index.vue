<template>
  <AppTable ref="appTable" v-model="searchModel" :search-config="searchConfig" :table-data-api="apiGetCompanyList" okey="userManagement">
    <template #search-right>
      <div class="search-right-btns">
        <el-button type="primary" @click="addCompany()">新增企业</el-button>
      </div>
    </template>
    <template #table-column>
      <el-table-column label="企业名称" align="center">
        <template #default="{ row }">
          <div class="flex-center">
            <span>{{ row.name }}</span>
            <app-icon-btn :icon="EditPen" tip="修改企业名称" @click="updateCompanyName(row)" />
          </div>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center">
        <template #default="{ row }">
          <span class="whitespace-break-spaces">{{ row.remark || '--' }}</span>
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
          <el-button type="primary" text size="small" @click="addCompany(row)">编辑</el-button>
          <el-button type="danger" text size="small" @click="deleteCompany(row)">删除</el-button>
        </template>
      </el-table-column>
    </template>
  </AppTable>
</template>
<script setup lang="ts">
import { apiGetCompanyList, apiAddCompany, apiDeleteCompany, apiUpdateCompanyName } from '@/api/contractSuper/company';
import { showDialogForm } from '@/utils/dialogForm';
import { reactive, ref, h } from 'vue';
import { formats, assignMin } from '@zstings/utils';
import { EditPen } from '@element-plus/icons-vue';
const appTable = ref<InstanceType<typeof AppTable>>();
const searchModel = ref({
  name: '',
});
const searchConfig = reactive([
  {
    key: 'name',
    type: 'el-input',
    label: '企业名称',
  },
]);
function addCompany(row = {}) {
  const formModel = reactive(assignMin({ name: '', remark: '', id: '' }, row));
  showDialogForm({
    title: '新增企业',
    formModel: formModel,
    content: () => [
      h(ElFormItem, { label: '企业名称', prop: 'name', rules: [{ required: true, message: '请输入企业名称', trigger: ['blur'] }] }, () => [
        h(ElInput, { modelValue: formModel.name, 'onUpdate:modelValue': (val: string) => (formModel.name = val) }),
      ]),
      h(ElFormItem, { label: '备注' }, () => [h(ElInput, { type: 'textarea', modelValue: formModel.remark, 'onUpdate:modelValue': (val: string) => (formModel.remark = val) })]),
    ],
    okBefore: async () => {
      await apiAddCompany(formModel, { showOKMsg: true }).then(() => {
        appTable.value?.getData();
      });
    },
  });
}
function deleteCompany(row: any) {
  ElMessageBox.confirm(`确认删除企业[${row.companyName}]吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    apiDeleteCompany(row.id, { showOKMsg: true }).then(() => {
      appTable.value?.getData();
    });
  });
}
function updateCompanyName(row: { name: string; id: string } | Record<string, any> = {}) {
  const formModel = reactive(assignMin({ name: '', id: '' }, row));
  showDialogForm({
    title: '修改企业名称',
    formModel: formModel,
    content: () => [
      h(ElFormItem, { label: '企业名称', prop: 'name', rules: [{ required: true, message: '请输入企业名称', trigger: ['blur'] }] }, () => [
        h(ElInput, { modelValue: formModel.name, 'onUpdate:modelValue': (val: string) => (formModel.name = val) }),
      ]),
    ],
    okBefore: async () => {
      await apiUpdateCompanyName(formModel, { showOKMsg: true }).then(() => {
        row.name = formModel.name;
      });
    },
  });
}
</script>
