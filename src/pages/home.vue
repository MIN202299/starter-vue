<script lang="ts" setup>
import { request } from '~/api'

const loading = ref(true)
const route = useRoute()
const errorMsg = ref('')
const imgSrc = ref('')

const couponId = ref('')
onMounted(() => {
  console.log(route.query.couponId)
  if (!route.query.couponId)
    errorMsg.value = '找不到测试结果'
  else
    couponId.value = route.query.couponId as string
})

watch(couponId, (id) => {
  loading.value = true
  // setTimeout(() => {
  //   loading.value = false
  // }, 2000)
  const fileUrl = `https://dropletonverse.com/result/${id}.jpg`
  const image = new Image()
  image.src = fileUrl
  imgSrc.value = fileUrl
  image.onload = function () {
    loading.value = false
    console.log('load')
  }
})

async function onDownload() {
  const res = await fetch(imgSrc.value)
  const blob = await res.blob()
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.style.display = 'none'
  a.setAttribute('download', `${couponId.value}.jpg`)
  document.body.appendChild(a)
  a.click()
  a.remove()
}
function onPrint() {
  request.post('/print', {
    fileUrl: imgSrc.value,
  })
}
</script>

<template>
  <div relative h-100vh w-100vw>
    <div h-full w-full flex :class="loading ? 'bg-dark' : ''">
      <div v-if="errorMsg" ma text="center red-500">
        <div i-clarity:error-standard-solid ma text="2em" />
        <div mt-4>
          {{ errorMsg }}
        </div>
      </div>
      <div v-else relative h-100vh w-100vw flex>
        <div v-if="loading" ma text-center>
          <div i-svg-spinners:180-ring-with-bg ma text="2em white" />
          <div text="white/80" mt-4>
            正在获取测试结果
          </div>
        </div>
        <div v-else absolute inset-0>
          <img :src="imgSrc" h-full w-full object-cover filter-blur-30 alt="">
          <img :src="imgSrc" absolute top-20 z-100 w="80%" border="10px solid white" left="1/2" translate-x="-1/2" shadow-md alt="">
          <div text="#2f1f53" absolute bottom-30 left-0 w-full flex justify-between px-8 font-bold>
            <div bg="white" rounded-9 px-9 py-3 @click="onDownload">
              <span>一键保存</span>
            </div>
            <div bg="white" rounded-9 px-9 py-3 @click="onPrint">
              <span>一键打印</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div absolute bottom-0 left-0 w-full flex items-center justify-between>
      <!-- <img src="@/dropleton-logo.png" alt=""> -->
      <span />
      <span text="3 white/60">杭州元形水滴科技创新发展有限公司 / 浙ICP备20017538号-1</span>
    </div>
  </div>
</template>
