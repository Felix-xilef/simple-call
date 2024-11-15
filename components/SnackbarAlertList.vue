<script setup lang="ts">
import { useAlertsStore } from '~/stores/alerts';
import SnackbarAlert from './SnackbarAlert.vue';

const alertsStore = useAlertsStore();

const alerts = computed(
  () => alertsStore.alerts,
);
</script>

<template>
  <div class="alerts-list-wrapper">
    <TransitionGroup
      name="alerts-list-transition"
      tag="ul"
      class="alerts-list"
    >
      <li
        v-for="alert in alerts"
        :key="`alert-${alert.id}`"
      >
        <SnackbarAlert
          v-bind="alert"
          @close="alertsStore.removeAlert(alert.id)"
          class="alert-item"
        />
      </li>
    </TransitionGroup>
  </div>
</template>

<style scoped lang="scss">
.alerts-list-wrapper {
  position: fixed;
  bottom: 0;
  right: 0;

  .alerts-list {
    position: relative;
    list-style-type: none;

    padding-bottom: 25px;
    padding-right: 25px;

    .alert-item {
      margin-top: 8px;
    }


    .alerts-list-transition-move,
    .alerts-list-transition-enter-active,
    .alerts-list-transition-leave-active {
      transition: all .5s ease;
    }

    .alerts-list-transition-enter-from,
    .alerts-list-transition-leave-to {
      opacity: 0;
      transform: translateX(30px);
    }

    .alerts-list-transition-leave-active:not(:only-child) {
      position: absolute;
    }
  }
}
</style>
