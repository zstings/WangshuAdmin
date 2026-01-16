<template>
  <el-config-provider :locale="zhCn">
    <el-dialog v-model="visible" :title="options.title" :width="options.width || '500px'" align-center @closed="emit('closed')">
      <el-form v-if="options.formModel" ref="formRef" :model="options.formModel" label-width="auto" :hide-required-asterisk="true" v-bind="options.formProps">
        <component :is="options.content" v-if="options.content"></component>
      </el-form>
      <template v-else>
        <component :is="options.content" v-if="options.content"></component>
      </template>
      <template v-if="!(options.footer === false)" #footer>
        <div class="dialog-footer">
          <el-button @click="handleCancel">取消</el-button>
          <el-button type="primary" :loading="loading" @click="handleOk">{{ options.okText || '确定' }}</el-button>
        </div>
      </template>
    </el-dialog>
  </el-config-provider>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { type DialogFormOptions } from '@/utils/dialogForm';
import { type ElForm } from 'element-plus';
import zhCn from 'element-plus/es/locale/lang/zh-cn';
const visible = defineModel<boolean>('visible', { default: false });

const emit = defineEmits(['closed']);

const props = defineProps<{
  options: DialogFormOptions;
}>();

// 表单引用
const formRef = ref<InstanceType<typeof ElForm> | null>(null);
// 加载状态
const loading = ref(false);

// 取消按钮点击事件
const handleCancel = () => {
  visible.value = false;
};

// 确定按钮点击事件
const handleOk = async () => {
  try {
    if (props.options.formModel) await formRef.value?.validate();
    if (props.options.okBefore) {
      try {
        loading.value = true;
        // 把返回结果 Promise 化
        const result = await Promise.resolve(props.options.okBefore());
        // 如果返回 false → 阻止关闭
        if (result === false) return;
        visible.value = false;
      } catch (e: any) {
        console.log(e);
        return;
      } finally {
        loading.value = false;
      }
    }
    if (props.options.ok) {
      props.options.ok();
      visible.value = false;
    }
  } catch (e: any) {
    const val: any = Object.values(e)[0];
    const errmsg = val[0]?.message;
    if (val && errmsg) ElMessage.error(errmsg);
  } finally {
    loading.value = false;
  }
};
</script>
