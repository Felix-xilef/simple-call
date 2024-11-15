<script setup lang="ts">
const props = defineProps<{
  stream: MediaStream;
  muted?: boolean;
}>();
</script>

<template>
  <video
    ref="videoStreamer"
    :srcObject="stream"
    autoplay
    disablepictureinpicture
    playsinline
    :muted="muted"
    class="video-stream"
  ></video>
</template>

<style scoped lang="scss">
.video-stream {
  height: 300px;

  max-width: 90vw;
}
</style>
