<script lang="ts" setup>
// import { Html5QrcodeScanner } from 'html5-qrcode'

// const render$ = ref<HTMLDivElement>(null!)

// onMounted(() => {
//   const scanner = new Html5QrcodeScanner(
//     'scanner-container',
//     {
//       fps: 10,
//       qrbox: {
//         width: render$.value.offsetWidth,
//         height: render$.value.offsetHeight,
//       },
//     },
//     false,
//   )

//   scanner.render(onScanSuccess, onScanFailure)
// })

import { Html5Qrcode } from 'html5-qrcode'
import gsap from 'gsap'
import type { Response } from '~/api/index'
import { request } from '~/api/index'
import router from '~/router/router'

const render$ = ref<HTMLDivElement>(null!)
onMounted(() => {

})

interface Device {
  id: string
  label: string
}

const scanning = ref(false)
const qrResult = ref('')
const loading = ref(false)
const errorMsg = ref('')
let html5QrCode: Html5Qrcode
let devices: Device[]
onMounted(() => {
  html5QrCode = new Html5Qrcode('render-container')
})
async function handleScan() {
  qrResult.value = ''
  if (!scanning.value) {
    if (!devices || !devices.length)
      devices = await Html5Qrcode.getCameras()
    if (!devices || !devices.length || !html5QrCode)
      return

    html5QrCode.start(
      devices[0].id,
      {
        fps: 10,
        qrbox: {
          width: 400,
          height: 400,
        },
      },
      onScanSuccess,
      onScanFailure,
    )
    playScanAnimation()
  }
  else {
    stopScan()
    stopScanAnimation()
  }
  scanning.value = !scanning.value
}

function onScanSuccess(decodedText: string) {
  // handle the scanned code as you like, for example:
  console.log(`Code matched = ${decodedText}`)
  qrResult.value = decodedText
  scanning.value = false
  stopScan()
  stopScanAnimation()
  writeOff(decodedText)
}

function onScanFailure(error: any) {
  // handle scan failure, usually better to ignore and keep scanning.
  // for example:
  console.warn(`Code scan error = ${error}`)
}

function stopScan() {
  try {
    html5QrCode.stop()
  }
  catch (err: any) {}
}

const qrAni$ = ref<HTMLCanvasElement>(null!)
let ctx: CanvasRenderingContext2D
let width: number
let height: number
let dpr: number
onMounted(() => {
  initCanvas()
})
function initCanvas() {
  dpr = window.devicePixelRatio
  width = render$.value.offsetWidth * dpr
  height = render$.value.offsetHeight * dpr
  qrAni$.value.width = width
  qrAni$.value.height = height
  ctx = qrAni$.value.getContext('2d')!
}

function draw(h: number) {
  const gradient = ctx.createLinearGradient(0, 0, width, 0)
  gradient.addColorStop(0, 'transparent')
  gradient.addColorStop(0.15, 'rgb(59 184 246 / 0.4)')
  gradient.addColorStop(0.5, 'rgb(59 184 246 / 0.8)')
  gradient.addColorStop(0.85, 'rgb(59 184 246 / 0.4)')
  gradient.addColorStop(1, 'transparent')
  ctx.clearRect(0, 0, width, height)
  ctx.beginPath()
  ctx.moveTo(0, h)
  ctx.lineTo(width, h)
  ctx.strokeStyle = gradient
  ctx.lineWidth = 2 * dpr
  ctx.stroke()
}
let tween: any
function playScanAnimation() {
  const val = { h: 0 }
  tween = gsap.fromTo(
    val,
    { h: 0 },
    {
      h: height,
      duration: 1.5,
      repeat: -1,
      ease: 'sine.inOut',
      delay: 0.1,
      onUpdate: () => {
        draw(val.h)
      },
    },
  )
}
function stopScanAnimation() {
  if (tween) {
    tween.kill()
    ctx.clearRect(0, 0, width, height)
  }
}

async function writeOff(id: string) {
  loading.value = true
  errorMsg.value = ''
  try {
    const { data, code } = await request.put(`/coupon/writeOffs/${id}`) as Response
    console.log(data, code)
  }
  catch (err: any) {
    console.log(err)
    let msg = '核销失败'
    if (err.error)
      msg = err.error.detail
    errorMsg.value = msg
    if (err.code === 401) {
      window.localStorage.removeItem('token')
      router.replace('/login')
    }
  }
  loading.value = false
}
</script>

<template>
  <div relative grid h-100vh w-100vw place-items-center bg-dark>
    <div class="qr" relative h-70 w-70>
      <div id="render-container" ref="render$" h-full w-full />
      <canvas id="qr-animation" ref="qrAni$" absolute inset-0 z-100 />
      <div :class="scanning ? 'opacity-100' : 'opacity-0'" transition-all>
        <div
          border="3 solid gray-300" absolute h-6 w-6 border-b-none border-r-none
          class="-left-1.5 -top-1.5"
        />
        <div
          border="3 solid gray-300" absolute h-6 w-6
          class="border-b-none border-l-none -right-1.5 -top-1.5"
        />
        <div
          border="3 solid gray-300" absolute h-6 w-6
          class="border-r-none border-t-none -bottom-1.5 -left-1.5"
        />
        <div
          border="3 solid gray-300" absolute h-6 w-6
          class="border-l-none border-t-none -bottom-1.5 -right-1.5"
        />
      </div>
      <div absolute inset-0 z-200 flex bg="white/0" :class="qrResult ? 'opacity-100' : 'opacity-0'">
        <div v-if="loading" i-svg-spinners:180-ring-with-bg ma text="2em blue" />
        <div v-else ma text="center" :class="!errorMsg ? 'text-green' : 'text-red-500'">
          <div ma text-2em :class="!errorMsg ? 'i-clarity:success-standard-solid' : 'i-clarity:error-standard-solid'" />
          <div mt-2>
            {{ !errorMsg ? '核销成功' : errorMsg }}
          </div>
        </div>
      </div>
    </div>

    <button

      :class="scanning ? 'bottom-20 bg-red-500' : 'bottom-20'"
      top-auto transition-all a-center btn
      @click="handleScan"
    >
      {{ !scanning ? '开始扫码' : '停止扫码' }}
    </button>
  </div>
</template>

<style lang="scss" scoped>
#render-container {
  :deep(video) {
    height: 100%!important;
    object-fit: cover;
  }

}

.qr  {
  > canvas {
    width: 100%;
    height: 100%;
  }
}
</style>