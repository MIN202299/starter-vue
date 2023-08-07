<script lang="ts" setup>
const box$ = ref()

const { style } = useDraggable(box$, {
  initialValue: { x: 0, y: 0 },
})
</script>

<template>
  <div ref="box$" :style="style" fixed bg-red w-40 h-40 cursor-pointer grid-center text-white select-none shadow-lg>
    <div i-material-symbols:emoji-people text="amber 2em" />
    drag me
  </div>
</template>
