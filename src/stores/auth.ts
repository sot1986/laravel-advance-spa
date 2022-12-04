import { ref } from 'vue'
import { defineStore } from 'pinia'
import type {
  UserI,
  LoginCredentialsI,
  RegisterCredentialsI,
} from '@/types/Auth'
import usePromise from '@/composables/usePromise'
import apiClient from '@/services/api'
import type { ApiErrorsI, ApiResponseI } from '@/types/Api'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<null | UserI>(null)

  const loading = ref(false)

  const errorMsg = ref('')

  const setErrorMsg = (error: ApiErrorsI | null) => {
    errorMsg.value = error?.response.data.message ?? ''
  }

  const fetchCsrfToken = async () => {
    const prom = usePromise<void, [string], ApiErrorsI>(apiClient.get)

    await prom.createPromise('/sanctum/csrf-cookie')
    if (prom.error.value) {
      setErrorMsg(prom.error.value)
      loading.value = false
    }
  }

  const login = async (credentials: LoginCredentialsI) => {
    setErrorMsg(null)
    loading.value = true

    await fetchCsrfToken()

    if (errorMsg.value) return

    const prom = usePromise<UserI, [string, LoginCredentialsI], ApiErrorsI>(
      apiClient.post
    )

    await prom.createPromise('/login', { ...credentials })

    loading.value = false

    if (prom.error.value) setErrorMsg(prom.error.value)
  }

  const register = async (credentials: RegisterCredentialsI) => {
    setErrorMsg(null)
    loading.value = true

    await fetchCsrfToken()

    if (errorMsg.value) return

    const prom = usePromise<
      RegisterCredentialsI,
      [string, RegisterCredentialsI],
      ApiErrorsI
    >(apiClient.post)

    await prom.createPromise('/register', { ...credentials })

    if (prom.error.value)
      errorMsg.value = prom.error.value.response.data.message
  }

  const fetchUser = async () => {
    if (user.value) return

    setErrorMsg(null)
    loading.value = true

    const prom = usePromise<ApiResponseI<UserI>, [string], ApiErrorsI>(
      apiClient.get
    )

    await prom.createPromise('/api/user')

    loading.value = false

    if (prom.error.value) {
      setErrorMsg(prom.error.value)
      user.value = null
      return
    }

    if (!prom.results.value) {
      errorMsg.value = 'No user data available.'
      loading.value = false
      user.value = null
      return
    }

    user.value = prom.results.value.data
  }

  const logout = async () => {
    setErrorMsg(null)
    loading.value = true

    const prom = usePromise<void, [string], ApiErrorsI>(apiClient.post)
    await prom.createPromise('/logout')

    loading.value = false
    user.value = null

    if (prom.error.value) setErrorMsg(prom.error.value)
  }
  return { user, errorMsg, login, register, fetchUser, logout }
})
