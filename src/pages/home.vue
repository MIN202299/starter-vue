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
  <div relative h-full w-full>
    <div absolute bottom-0 left-0 w-full flex items-center justify-between bg-dark>
      <img src="@/dropleton-logo.png" alt="">
      <span text="3 white">杭州元形水滴科技创新发展有限公司 / 浙ICP备20017538号-1</span>
    </div>
  </div>
</template>
