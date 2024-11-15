import { AlertType } from "./alert-type";

export const AlertStyle = {
  [AlertType.Success]: {
    icon: 'mdi-check-circle',
    color: 'success',
  },
  [AlertType.Warn]: {
    icon: 'mdi-alert-circle',
    color: 'warn',
  },
  [AlertType.Error]: {
    icon: 'mdi-close-circle',
    color: 'danger',
  },
  [AlertType.Info]: {
    icon: 'mdi-information',
    color: 'info',
  },
}
