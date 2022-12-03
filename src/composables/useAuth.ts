import usePromise from '@/composables/usePromise'
import apiClient from '@/services/api'

export const getCsrftoken = async () => {
    const prom = usePromise(apiClient.get)
      
    await prom.createPromise('/sanctum/csrf-cookie')
        if (prom.error.value) {
          console.log(prom.error.value)
          return false
        }
        return true
      }


