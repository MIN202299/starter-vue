<script lang="ts" setup>
import { toCanvas } from 'qrcode'

const route = useRoute()
const couponId = ref()
const canvas = ref<HTMLCanvasElement>(null!)
const box = ref<HTMLDivElement>(null!)
onMounted(() => {
  couponId.value = route.query.couponId
  toCanvas(canvas.value,
    couponId.value,
    {
      scale: 12,
      margin: 2,
    },
    cb,
  )
})

function cb(err: any) {
  if (!err)
    console.log('to canvas success')
}
</script>

<template>
  <div relative h-100vh w-100vw flex>
    <div ref="box" ma w-full>
      <!--  -->
      <div text-center font-bold>
        请出示您的核销码
      </div>
      <canvas ref="canvas" ma aspect-square w-full :class="couponId ? '' : 'display-none'" />
      <div text="center ">
        <span v-if="couponId" class="text-black/90">立享七折优惠</span>
        <span v-else text-red-500>找不到优惠券</span>
      </div>
    </div>
    <div absolute bottom-0 left-0 w-full flex items-center justify-between>
      <!-- <img src="@/dropleton-logo.png" alt=""> -->
      <span />
      <span text="3 gray/60">杭州元形水滴科技创新发展有限公司 / 浙ICP备20017538号-1</span>
    </div>
  </div>
</template>
