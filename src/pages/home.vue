<script lang="ts" setup>
const router = useRouter()
onMounted(() => {
  const token = window.localStorage.getItem('token')
  if (!token) {
    router.replace('/login')
  }
  else {
    const payload = JSON.parse(atob(token.split('.')[1]))
    payload.phone === '19550114082'
      ? router.push('/writeOff')
      : router.push('/home')
  }
})
</script>

<template>
  <div />
</template>
