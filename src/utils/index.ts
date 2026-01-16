import { copy, deepClone } from '@zstings/utils';
import { isReactive, isRef, reactive, ref, unref, type Ref } from 'vue';

export function useRef<T>(value: T): [Ref<T>, () => void, T] {
  const initValue = { value: deepClone(unref(value)) };
  const refValue = isRef(value) ? value : ref(value);
  return [refValue as Ref<T>, () => Object.assign(refValue.value, initValue.value), initValue.value] as const;
}

export function useReactive<T extends object>(value: T) {
  const initValue = { value: deepClone(unref(value)) };
  const refValue = isReactive(value) ? value : reactive(value);
  return [refValue, () => Object.assign(refValue, initValue.value), initValue.value] as const;
}

export function copyText(str: string, msgsuc = '复制成功', msgerr = '复制失败') {
  return copy(str)
    .then(() => {
      ElMessage.success(msgsuc);
    })
    .catch(() => ElMessage.error(msgerr));
}
