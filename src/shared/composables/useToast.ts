import { ref } from 'vue'

export type ToastVariant = 'info' | 'success' | 'warning' | 'error'

const visible = ref(false)
const message = ref('')
const variant = ref<ToastVariant>('info')
const timeout = ref(4000)

export function useToast() {
  function show(msg: string, toastVariant: ToastVariant = 'info', duration = 4000): void {
    message.value = msg
    variant.value = toastVariant
    timeout.value = duration
    visible.value = true
  }

  function success(msg: string, duration = 4000): void {
    show(msg, 'success', duration)
  }

  function error(msg: string, duration = 5000): void {
    show(msg, 'error', duration)
  }

  function warning(msg: string, duration = 4500): void {
    show(msg, 'warning', duration)
  }

  function info(msg: string, duration = 4000): void {
    show(msg, 'info', duration)
  }

  function dismiss(): void {
    visible.value = false
  }

  return {
    visible,
    message,
    variant,
    timeout,
    show,
    success,
    error,
    warning,
    info,
    dismiss,
  }
}
