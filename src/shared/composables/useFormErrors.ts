import { ref } from 'vue'
import type { z } from 'zod'
import { normalizeApiError } from '../api/error'

export function useFormErrors<T extends z.ZodTypeAny>(schema?: T) {
  const errors = ref<Record<string, string[]>>({})
  const formError = ref<string | null>(null)

  function clearField(field: string): void {
    if (field in errors.value) {
      const next = { ...errors.value }
      delete next[field]
      errors.value = next
    }
  }

  function clearAll(): void {
    errors.value = {}
    formError.value = null
  }

  function validate(data: unknown): boolean {
    clearAll()
    if (!schema) {
      return true
    }

    const result = schema.safeParse(data)
    if (result.success) {
      return true
    }

    const mapped: Record<string, string[]> = {}
    for (const issue of result.error.issues) {
      const key = issue.path.map(String).join('.') || '_form'
      if (!mapped[key]) {
        mapped[key] = []
      }
      mapped[key].push(issue.message)
    }

    errors.value = mapped
    return false
  }

  function setServerErrors(err: unknown): void {
    const apiErr = normalizeApiError(err)
    errors.value = { ...apiErr.errors }
    formError.value = apiErr.detail || null
  }

  function firstError(field: string): string | undefined {
    return errors.value[field]?.[0]
  }

  return {
    errors,
    formError,
    validate,
    setServerErrors,
    firstError,
    clearField,
    clearAll,
  }
}
