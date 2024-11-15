import type { AlertType } from "~/enums/alert-type";

export interface SnackbarAlertProps {
  type: AlertType;
  message: string;
  timeout?: number;
}
