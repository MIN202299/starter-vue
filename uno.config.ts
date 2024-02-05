// uno.config.ts
import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetUno,
  presetWebFonts,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

// 自定义 web font provider
import type { Provider, WebFontsProviders } from 'unocss/preset-web-fonts'

function createDcwjoyCompatibleProvider(name: WebFontsProviders, host: string): Provider {
  return {
    name,
    getImportUrl(fonts) {
      const sort = (weights: string[][]) => {
        const firstW = weights.map(w => w[0])
        const lastW = weights.map(w => w[1])
        return `${firstW.join(';')};${lastW.join(';')}`
      }

      const strings = fonts
        .map((i) => {
          let name = i.name.replace(/\s+/g, '+')
          if (i.weights?.length) {
            name += i.italic
              ? `:ital,wght@${sort(i.weights.map(w => [`0,${w}`, `1,${w}`]))}`
              : `:wght@${i.weights.join(';')}`
          }
          return `family=${name}`
        }).join('&')
      return `${host}/css?${strings}&display=swap`
    },
  }
}

const MyFontsProvider: Provider = createDcwjoyCompatibleProvider('dcwjoy' as WebFontsProviders, 'https://fonts.appspack.cn')

export default defineConfig({
  presets: [
    presetUno(),
    presetAttributify(),
    presetTypography(),
    presetWebFonts({
      // details https://fonts.appspack.cn
      provider: MyFontsProvider,
      fonts: {
        sans: ['Source Han Sans SC VF:300'],
      },
    }),
    presetIcons({
      scale: 1.2,
      warn: true,
    }),
  ],
  shortcuts: [
    { 'grid-center': 'grid place-items-center' },
    { btn: 'outline-none p-2 bg-blue-500 rounded text-white shadow-sm hover:brightness-110 active:brightness-90 cursor-pointer' },
    { 'a-center': 'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2' },
  ],
  rules: [],
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
  ],
  safelist: 'prose m-auto text-left'.split(' '),
})
