<script lang="ts" setup>
const router = useRouter()
onMounted(() => {
  const token = window.localStorage.getItem('token')
  if (!token)
    router.replace('/login')
})
</script>

<template>
  <div />
</template>
