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

export default defineConfig({
  presets: [
    presetUno(),
    presetAttributify(),
    presetTypography(),
    presetWebFonts({
      provider: 'none',
      fonts: {
        sans: ['Source Han Sans'],
        mono: ['Fira Code', 'Fira Mono:400,700'],
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
