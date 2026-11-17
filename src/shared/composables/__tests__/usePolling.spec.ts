import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { effectScope } from 'vue'
import { usePolling } from '../usePolling'

describe('shared/composables/usePolling', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('polls at the configured interval and stops when stopWhen returns true', async () => {
    let count = 0
    const fn = vi.fn(async () => {
      count += 1
      return { status: count >= 3 ? 'ACCEPTED' : 'REQUESTED' }
    })

    const { isPolling, start } = usePolling(fn, {
      intervalMs: 1000,
      stopWhen: (res) => res.status === 'ACCEPTED',
    })

    start()
    expect(isPolling.value).toBe(true)
    expect(fn).toHaveBeenCalledTimes(0)

    await vi.advanceTimersByTimeAsync(1000)
    expect(fn).toHaveBeenCalledTimes(1)
    expect(isPolling.value).toBe(true)

    await vi.advanceTimersByTimeAsync(1000)
    expect(fn).toHaveBeenCalledTimes(2)
    expect(isPolling.value).toBe(true)

    await vi.advanceTimersByTimeAsync(1000)
    expect(fn).toHaveBeenCalledTimes(3)
    expect(isPolling.value).toBe(false)

    await vi.advanceTimersByTimeAsync(2000)
    expect(fn).toHaveBeenCalledTimes(3)
  })

  it('supports immediate execution on start and records lastError on failure', async () => {
    const fn = vi
      .fn<() => Promise<string>>()
      .mockRejectedValueOnce(new Error('Temporary network glitch'))
      .mockResolvedValueOnce('OK')

    const { start, stop, lastError, isPolling } = usePolling(fn, {
      intervalMs: 2000,
      immediate: true,
    })

    start()
    await vi.advanceTimersByTimeAsync(0)
    expect(fn).toHaveBeenCalledTimes(1)
    expect(lastError.value).toBeInstanceOf(Error)
    expect(isPolling.value).toBe(true)

    await vi.advanceTimersByTimeAsync(2000)
    expect(fn).toHaveBeenCalledTimes(2)
    expect(lastError.value).toBeNull()

    stop()
    expect(isPolling.value).toBe(false)
  })

  it('marks isTimedOut and stops polling when timeoutMs elapses', async () => {
    const fn = vi.fn(async () => 'PENDING')

    const { start, isPolling, isTimedOut } = usePolling(fn, {
      intervalMs: 1000,
      timeoutMs: 3500,
    })

    start()
    await vi.advanceTimersByTimeAsync(3000)
    expect(fn).toHaveBeenCalledTimes(3)
    expect(isPolling.value).toBe(true)
    expect(isTimedOut.value).toBe(false)

    await vi.advanceTimersByTimeAsync(600)
    expect(isPolling.value).toBe(false)
    expect(isTimedOut.value).toBe(true)
  })

  it('cleans up active polling timers when enclosing Vue effectScope is disposed', async () => {
    const fn = vi.fn(async () => 'PENDING')
    const scope = effectScope()

    const polling = scope.run(() =>
      usePolling(fn, {
        intervalMs: 1000,
      }),
    )!

    polling.start()
    await vi.advanceTimersByTimeAsync(1000)
    expect(fn).toHaveBeenCalledTimes(1)

    scope.stop()
    expect(polling.isPolling.value).toBe(false)

    await vi.advanceTimersByTimeAsync(3000)
    expect(fn).toHaveBeenCalledTimes(1)
  })
})
