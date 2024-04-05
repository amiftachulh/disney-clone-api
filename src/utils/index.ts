export function res(message: string, data?: any, errors?: any) {
  return {
    message,
    data,
    errors,
  };
}
