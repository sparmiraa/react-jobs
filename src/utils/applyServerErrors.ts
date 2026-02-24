import { FieldValues, UseFormSetError } from "react-hook-form";

export function applyServerErrors<T extends FieldValues>(
  error: any,
  setError: UseFormSetError<T>,
) {
  const status = error?.response?.status;
  const data = error?.response?.data;

  if (status === 409) {
    setError("root", {
      type: "server",
      message: data?.message || "Конфликт данных",
    });
    return;
  }

  if (status === 400 && data?.errors) {
    Object.entries(data.errors).forEach(([field, message]) => {
      setError(field as any, {
        type: "server",
        message: message as string,
      });
    });
    return;
  }

  if (status === 401) {
    setError("root", {
      type: "server",
      message: data?.message || "Неверный email или пароль",
    });
    return;
  }

  setError("root", {
    type: "server",
    message: "Произошла ошибка. Попробуйте позже",
  });
}
