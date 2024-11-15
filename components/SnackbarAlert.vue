<script setup lang="ts">
import { AlertStyle } from '~/enums/alert-style';
import type { SnackbarAlertProps } from '~/interfaces/utils/snackbar-alert-props';

const props = withDefaults(
  defineProps<SnackbarAlertProps>(),
  {
    timeout: -1,
  },
);

const currentStyle = computed(
  () => AlertStyle[props.type],
);

const emits = defineEmits([
  'close',
]);

onMounted(() => {
  if (props.timeout > 0) {
    setTimeout(
      () => emits('close'),
      props.timeout,
    );
  }
});
</script>

<template>
  <v-alert
    :type="type"
    :icon="false"
    class="snackbar-alert"
  >
    <v-row
      align="center"
      no-gutters
      class="snackbar-alert-content"
    >
      <v-col cols="auto">
        <v-icon
          :icon="currentStyle.icon"
        ></v-icon>
      </v-col>

      <v-col cols="auto">
        <div class="message-container">
          {{ message }}
        </div>
      </v-col>

      <v-col cols="auto">
        <v-btn
          variant="text"
          icon="mdi-close-circle-outline"
          aria-label="Close alert"
          @click="emits('close')"
        ></v-btn>
      </v-col>
    </v-row>
  </v-alert>
</template>

<style scoped lang="scss">
.snackbar-alert {
  padding: 4px 12px;

  .snackbar-alert-content {
    gap: 10px;
    flex-wrap: nowrap;

    .message-container {
      min-width: 140px;
      max-width: 85vw;
    }
  }
}
</style>
