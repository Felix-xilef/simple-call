<script setup lang="ts">
import type { VBtn } from 'vuetify/components';
import { AlertType } from '~/enums/alert-type';

const props = defineProps<{
  variant?: VBtn['$props']['variant'];
  color: string;
  text: string;
  contentToCopy?: string;
}>();


const successTimout = 2000;

const alertsStore = useAlertsStore();

const contentCopied = ref(false);


function copyContent() {
  navigator.clipboard.writeText(
    props.contentToCopy || props.text,
  );

  contentCopied.value = true;

  setTimeout(
    () => contentCopied.value = false,
    successTimout,
  );

  alertsStore.addAlert({
    type: AlertType.Success,
    message: 'Content successfully copied!',
    timeout: successTimout,
  });
}
</script>

<template>
  <v-btn
    :variant="variant"
    :color="color"
    :text="text"
    @click="copyContent()"
    :append-icon="
      contentCopied ?
        'mdi-check' :
      'mdi-content-copy'
    "
  >
    <template #append>
      <Transition
        name="rotate-away"
        mode="out-in"
      >
        <v-icon
          v-if="contentCopied"
          icon="mdi-check"
        ></v-icon>
        <v-icon
          v-else
          icon="mdi-content-copy"
        ></v-icon>
      </Transition>
    </template>
  </v-btn>
</template>

<style scoped lang="scss">
$rotation: 90deg;

.rotate-away-enter-active,
.rotate-away-leave-active {
  transition: all .1s;
}

.rotate-away-enter-from {
  transform: rotateY(-$rotation);
}

.rotate-away-leave-to {
  transform: rotateY($rotation);
}
</style>
