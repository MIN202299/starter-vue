<script lang="ts" setup>
import { request } from '~/api'

const router = useRouter()

const waitCaptcha = ref(0)
const firstGetCaptcha = ref(true)
const agreement = ref(false)
const playHeadShake = ref(false)
const errorMsg = ref('')
const phone = ref('')
const captcha = ref('')
let timer: NodeJS.Timer
async function getCaptcha() {
  if (!onValidPhone())
    return

  if (phone.value === '19550114082')
    return

  request.post('/auth/sendCaptcha', { phone: phone.value }, {
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (firstGetCaptcha.value)
    firstGetCaptcha.value = false

  waitCaptcha.value = 60
  timer = setInterval(() => {
    waitCaptcha.value--
    if (waitCaptcha.value === 0)
      clearInterval(timer)
  }, 1000)
}

async function login() {
  if (!agreement.value)
    return playHeadShake.value = true

  if (!onValidPhone())
    return

  try {
    const { data } = await request.post('/auth/registerOrLogin', {
      phone: phone.value,
      captcha: captcha.value,
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    window.localStorage.setItem('token', data.token)
    if (phone.value === '19550114082')
      router.replace('/writeOff')
    else
      router.replace('/home')
  }
  catch (err: any) {
    errorMsg.value = err.error.detail
  }
}

function onValidPhone() {
  if (!validPhoneCN.test(phone.value)) {
    errorMsg.value = '手机号输入有误!'
    return false
  }
  errorMsg.value = ''
  return true
}

watch(playHeadShake, (val) => {
  if (val) {
    setTimeout(() => {
      playHeadShake.value = false
    }, 1000)
  }
})

onMounted(() => {
  const token = window.localStorage.getItem('token')
  if (token) {
    const payload = JSON.parse(atob(token.split('.')[1]))
    payload.phone === '19550114082'
      ? router.push('/writeOff')
      : router.push('/home')
  }
})

onBeforeUnmount(() => {
  if (timer)
    clearInterval(timer)
})
</script>

<template>
  <div bg="[url(@/bg_01.png)] no-repeat cover top" box-border h-100vh w-100vw px-5 pt-50>
    <div>
      <h1 text-center text="6 #2c2952" font-bold tracking-wider>
        手机号码登陆
      </h1>
      <div mt-2 h-3 text="3 center #c81313">
        {{ errorMsg }}
      </div>
      <form action="">
        <div mt-3 h-10 flex bg="[url(@/bg_iphonenum.png)] contain no-repeat center">
          <input
            v-model="phone"
            type="text"
            maxlength="11"
            text="#423f60" w="90%"
            placeholder="请输入您的手机号"
            my-a ml-8 h-full select-none border-none bg-transparent px-4 outline-none
            class="placeholder:text-#d0cce4"
            @blur="onValidPhone"
          >
        </div>
        <div mt-4 h-10 flex>
          <div h-full flex-1 bg="[url(@/bg_txtnum.png)] contain no-repeat center">
            <input v-model="captcha" type="text" maxlength="4" w="100%" text="#423f60" placeholder="请输入短信验证码" my-a h-full select-none border-none bg-transparent px-5 outline-none class="placeholder:text-#d0cce4">
          </div>
          <div>
            <div ml-2 h-full w-35 flex bg="[url(@/btn_getnum.png)] contain no-repeat center" text="white 4">
              <span v-if="waitCaptcha <= 0" ma block h-full w-full text-center leading-10 @click="getCaptcha"> {{ firstGetCaptcha ? '获取验证码' : '再次发送' }}</span>
              <span v-else ma> {{ waitCaptcha.toString().padStart(2, '0') }}s </span>
            </div>
          </div>
        </div>
        <div items="center" text="#bcb8cd 3 center" mt-10 h-5 flex justify-center :class="playHeadShake ? 'headShake' : ''">
          <span mt-0.5 h-5 w-5 :class="agreement ? 'bg-[url(@/btn_choose.png)]' : 'bg-[url(@/btn_choosebg.png)]'" bg="no-repeat center contain" @click="agreement = !agreement" />
          <span @click="agreement = !agreement">我已阅读并同意</span>
          <strong font-normal text="#423f60">
            <a href="#">《用户服务协议》</a>
          </strong>
          <span>和</span>
          <strong font-normal text="#423f60">
            <a href="#">《隐私政策》</a>
          </strong>
        </div>
        <div mt-2 h-11.4 flex text-white bg="[url(@/btn_loading.png)] no-repeat contain center" @click="login">
          <div ma flex gap-4 text="center">
            <span>登</span>
            <span>录</span>
          </div>
        </div>
      </form>
    </div>
    <div absolute bottom-0 left-0 w-full flex items-center justify-between>
      <!-- <img src="@/dropleton-logo.png" alt=""> -->
      <span />
      <span text="3 gray/60">杭州元形水滴科技创新发展有限公司 / 浙ICP备20017538号-1</span>
    </div>
  </div>
</template>
