<template>
  <AppTable ref="appTable" v-model="searchModel" :search-config="searchConfig" :table-data-api="apiGetIpBlackList" okey="userManagement">
    <template #search-right>
      <div class="search-right-btns">
        <el-button type="primary" @click="addIpBlack()">新增IP黑名单</el-button>
      </div>
    </template>
    <template #table-column>
      <el-table-column label="IP地址" align="center">
        <template #default="{ row }">
          {{ row.ip }}
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center">
        <template #default="{ row }">
          <el-tag :type="row.status == 1 ? 'success' : 'danger'" effect="plain" size="small">{{ row.status == 1 ? '启用' : '停用' }}</el-tag>
        </template>
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
          <el-button type="primary" text size="small" @click="addIpBlack(row)">编辑</el-button>
          <el-button type="danger" text size="small" @click="deleteIpBlack(row)">删除</el-button>
        </template>
      </el-table-column>
    </template>
  </AppTable>
</template>
<script setup lang="ts">
import { apiGetIpBlackList, apiAddIpBlack, apiDeleteIpBlack } from '@/api';
import { showDialogForm } from '@/utils/dialogForm';
import { reactive, ref, h } from 'vue';
import { formats, assignMin } from '@zstings/utils';
const appTable = ref<InstanceType<typeof AppTable>>();
const searchModel = ref({
  status: '',
  ip: '',
});
const searchConfig = reactive([
  {
    key: 'ip',
    type: 'el-input',
    label: 'IP地址',
  },
  {
    key: 'status',
    type: 'el-select',
    label: '状态',
    default: '',
    options: [
      {
        label: '启用',
        value: '1',
      },
      {
        label: '停用',
        value: '0',
      },
    ],
  },
]);
function addIpBlack(row = {}) {
  const formModel = reactive(assignMin({ ip: '', remark: '', status: 1, id: '' }, row));
  showDialogForm({
    title: '新增IP黑名单',
    formModel: formModel,
    content: () => [
      h(ElFormItem, { label: 'IP地址', prop: 'ip', rules: [{ required: true, message: '请输入IP地址', trigger: ['blur'] }] }, () => [
        h(ElInput, { modelValue: formModel.ip, 'onUpdate:modelValue': (val: string) => (formModel.ip = val) }),
      ]),
      ...(!formModel.id
        ? []
        : [
            h(ElFormItem, { label: '状态', prop: 'status', rules: [{ required: true, message: '请选择状态', trigger: ['change'] }] }, () => [
              h(ElSelect, { modelValue: formModel.status, 'onUpdate:modelValue': (val: number) => (formModel.status = val) }, () => [
                h(ElOption, { label: '启用', value: 1 }),
                h(ElOption, { label: '停用', value: 0 }),
              ]),
            ]),
          ]),
      h(ElFormItem, { label: '备注' }, () => [h(ElInput, { type: 'textarea', modelValue: formModel.remark, 'onUpdate:modelValue': (val: string) => (formModel.remark = val) })]),
    ],
    okBefore: async () => {
      await apiAddIpBlack(formModel, { showOKMsg: true }).then(() => {
        appTable.value?.getData();
      });
    },
  });
}
function deleteIpBlack(row: any) {
  ElMessageBox.confirm(`确认删除IP[${row.ip}]吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    apiDeleteIpBlack(row.id, { showOKMsg: true }).then(() => {
      appTable.value?.getData();
    });
  });
}
</script>
