<script setup lang="ts">
const props = defineProps<{
  iconActive: string;
  iconInactive: string;
  mediaName: string;
}>();

const model = defineModel<boolean>();
</script>

<template>
  <v-btn
    variant="tonal"
    icon
    :aria-label="`Toggle ${mediaName} ${model ? 'off' : 'on'}`"
    @click="model = !model"
  >
    <Transition
      name="y-flip-transition"
      mode="out-in"
    >
      <v-icon
        v-if="model"
        :icon="iconActive"
      ></v-icon>
      <v-icon
        v-else
        :icon="iconInactive"
      ></v-icon>
    </Transition>
  </v-btn>
</template>

<style scoped lang="scss">
</style>
