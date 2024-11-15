import { AlertType } from "~/enums/alert-type";
import type { SnackbarAlertProps } from "~/interfaces/utils/snackbar-alert-props";

export const useAlertsStore = defineStore(
  'alerts',
  () => {
    const alerts = ref<(SnackbarAlertProps & { id: number; })[]>([]);

    function addAlert(alert: SnackbarAlertProps) {
      alerts.value.push({
        ...alert,
        id: Date.now(),
      });

      logAlert(
        alert,
      );
    }

    function removeAlert(id: number) {
      const index = alerts.value.findIndex(
        ({ id: alertId }) => id === alertId,
      );

      if (index > -1) {
        alerts.value.splice(
          index,
          1,
        );
      }
    }

    function logAlert(alert: SnackbarAlertProps) {
      switch (alert.type) {
        case AlertType.Error:
          console.error(
            alert.message,
          );
          break;

        case AlertType.Warn:
          console.warn(
            alert.message,
          );
          break;

        case AlertType.Info:
          console.info(
            alert.message,
          );
      }
    }


    return {
      alerts,
      addAlert,
      removeAlert,
    };
  },
);
