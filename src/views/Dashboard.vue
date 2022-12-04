<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { onBeforeRouteUpdate, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

onMounted(async () => {
  await authStore.fetchUser()

  if (!authStore.user) router.push('/login')
})

onBeforeRouteUpdate(async () => {
  await authStore.fetchUser()

  return !!authStore.user
})
</script>

<template>
  <div v-if="authStore.user">
    <p>Welcome {{ authStore.user.name }}</p>
  </div>
  <div v-else>
    <p>Loading user data...</p>
  </div>
</template>
