import { getCurrentScope, onScopeDispose, ref, watch } from 'vue'
import { useDocumentVisibility } from '@vueuse/core'

export interface UsePollingOptions<T> {
  intervalMs: number
  timeoutMs?: number
  stopWhen?: (result: T) => boolean
  immediate?: boolean
}

export function usePolling<T>(fn: () => Promise<T>, options: UsePollingOptions<T>) {
  const isPolling = ref(false)
  const isTimedOut = ref(false)
  const lastError = ref<unknown>(null)

  const visibility = useDocumentVisibility()

  let intervalId: ReturnType<typeof setInterval> | null = null
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  function clearTimers(): void {
    if (intervalId !== null) {
      clearInterval(intervalId)
      intervalId = null
    }
    if (timeoutId !== null) {
      clearTimeout(timeoutId)
      timeoutId = null
    }
  }

  function clearIntervalOnly(): void {
    if (intervalId !== null) {
      clearInterval(intervalId)
      intervalId = null
    }
  }

  async function pollOnce(): Promise<T | undefined> {
    try {
      const result = await fn()
      lastError.value = null
      if (options.stopWhen?.(result)) {
        stop()
      }
      return result
    } catch (err) {
      lastError.value = err
      return undefined
    }
  }

  function scheduleInterval(): void {
    clearIntervalOnly()
    if (!isPolling.value || visibility.value === 'hidden') {
      return
    }
    intervalId = setInterval(() => {
      void pollOnce()
    }, options.intervalMs)
  }

  function start(): void {
    clearTimers()
    isPolling.value = true
    isTimedOut.value = false
    lastError.value = null

    if (options.timeoutMs && options.timeoutMs > 0) {
      timeoutId = setTimeout(() => {
        if (isPolling.value) {
          isTimedOut.value = true
          stop()
        }
      }, options.timeoutMs)
    }

    if (options.immediate) {
      void pollOnce()
    }

    if (isPolling.value) {
      scheduleInterval()
    }
  }

  function stop(): void {
    isPolling.value = false
    clearTimers()
  }

  const stopVisibilityWatch = watch(visibility, (current, previous) => {
    if (!isPolling.value) return
    if (current === 'hidden') {
      clearIntervalOnly()
    } else if (current === 'visible' && previous === 'hidden') {
      void pollOnce()
      if (isPolling.value) {
        scheduleInterval()
      }
    }
  })

  if (getCurrentScope()) {
    onScopeDispose(() => {
      stop()
      stopVisibilityWatch()
    })
  }

  return {
    isPolling,
    isTimedOut,
    lastError,
    start,
    stop,
    pollOnce,
  }
}
