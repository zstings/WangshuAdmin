import { h, ref, createApp, type VNodeChild } from 'vue';
import DynamicDialogForm from '@/components/DynamicDialogForm.vue';
import type { FormProps, DialogProps } from 'element-plus';

interface DialogFormOptions {
  title: string;
  width?: string;
  content?: () => VNodeChild;
  ok?: () => void | Promise<void>;
  okBefore?: () => Promise<any>;
  formModel?: Record<string, any>;
  okText?: string;
  formProps?: Partial<FormProps>;
  dialogProps?: Partial<DialogProps>;
  footer?: boolean;
}

// 动态弹窗管理类
class DialogFormManager {
  private instances = new Map<symbol, { app: any; container: HTMLElement }>();

  // 显示弹窗
  show(options: DialogFormOptions) {
    const id = Symbol();
    // 创建临时容器
    const container = document.createElement('div');
    document.body.appendChild(container);
    // 创建组件实例
    const visible = ref(true);
    // 组件渲染函数
    const app = createApp({
      render: () =>
        h(DynamicDialogForm, {
          options,
          visible: visible.value,
          onClosed: () => this.close(id),
        }),
    });
    app.mount(container);
    // 挂载组件到临时容器
    this.instances.set(id, { app, container });
  }

  // 关闭弹窗
  close(id: symbol) {
    const instance = this.instances.get(id);
    if (instance) {
      // 卸载组件
      instance.app.unmount();
      // 移除临时容器
      document.body.removeChild(instance.container);
      this.instances.delete(id);
    }
  }
}

// 创建单例实例
const dialogFormManager = new DialogFormManager();

// 导出全局调用函数
export const showDialogForm = (options: DialogFormOptions) => {
  dialogFormManager.show(options);
};

export function hVModel<T>(formModel: T, key: keyof T, transform = (val: T[keyof T]) => val): any {
  return {
    modelValue: formModel[key],
    'onUpdate:modelValue': (v: T[keyof T]) => (formModel[key] = transform(v)),
  };
}

// 导出类型
export type { DialogFormOptions };

// // 在Vue应用中注册为全局属性
// const useDialogForm = {
//   install(app: any) {
//     // dialogFormManager.setParent(app);
//     app.config.globalProperties.$showDialogForm = showDialogForm;
//   },
// };
// export default useDialogForm;
