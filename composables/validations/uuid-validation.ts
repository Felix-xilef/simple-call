const uuidRegExp = new RegExp(
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/,
  'g',
);

export function useUuidValidation(value: any): true | string {
  if (typeof value == 'string') {
    value = value.trim();

    if (
      value &&
      !uuidRegExp.test(value)
    ) {
      return 'The code is invalid';
    }
  }

  return true;
}
