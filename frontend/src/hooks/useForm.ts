import { useState, useCallback } from 'react'

type Errors<T> = Partial<Record<keyof T, string | null>>
type Touched<T> = Partial<Record<keyof T, boolean>>
type ValidateFn<T> = (values: T) => Errors<T>

const useForm = <T extends Record<string, unknown>>(initialValues: T, validate: ValidateFn<T> | null = null) => {
  const [values, setValues] = useState<T>(initialValues)
  const [errors, setErrors] = useState<Errors<T>>({})
  const [touched, setTouched] = useState<Touched<T>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const setValue = useCallback(
    (name: keyof T, value: T[keyof T]) => {
      setValues(prev => ({ ...prev, [name]: value }))
      if (errors[name]) {
        setErrors(prev => ({ ...prev, [name]: null }))
      }
    },
    [errors],
  )

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value, type } = e.target
      const finalValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
      setValue(name as keyof T, finalValue as T[keyof T])
    },
    [setValue],
  )

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name } = e.target
      setTouched(prev => ({ ...prev, [name]: true }))
      if (validate) {
        const fieldErrors = validate(values)
        if (fieldErrors[name as keyof T]) {
          setErrors(prev => ({
            ...prev,
            [name]: fieldErrors[name as keyof T],
          }))
        }
      }
    },
    [validate, values],
  )

  const validateForm = useCallback(() => {
    if (!validate) return true
    const formErrors = validate(values)
    setErrors(formErrors)
    return Object.keys(formErrors).length === 0
  }, [validate, values])

  const handleSubmit = useCallback(
    (onSubmit: (values: T) => Promise<void> | void) => async (e?: React.FormEvent) => {
      if (e) e.preventDefault()

      setTouched(Object.keys(values).reduce<Touched<T>>((acc, key) => ({ ...acc, [key]: true }), {}))

      if (!validateForm()) return

      setIsSubmitting(true)
      try {
        await onSubmit(values)
      } finally {
        setIsSubmitting(false)
      }
    },
    [values, validateForm],
  )

  const reset = useCallback(() => {
    setValues(initialValues)
    setErrors({})
    setTouched({})
    setIsSubmitting(false)
  }, [initialValues])

  const setAllValues = useCallback((newValues: T) => {
    setValues(newValues)
  }, [])

  return {
    values,
    errors,
    touched,
    isSubmitting,
    setValue,
    setAllValues,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
    validateForm,
  }
}

export default useForm
