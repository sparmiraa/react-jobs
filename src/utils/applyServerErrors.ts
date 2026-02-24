import { FieldValues, UseFormSetError } from "react-hook-form";

export function applyServerErrors<T extends FieldValues>(
  error: any,
  setError: UseFormSetError<T>
) {
  const status = error?.response?.status;
  const data = error?.response?.data;

  if (status === 400 && Array.isArray(data?.errors) && data.errors.length > 0) {
    data.errors.forEach((err: any) => {
      setError(err.field as any, {
        type: "server",
        message: err.message,
      });
    });
    return;
  }

  if (status === 400 && data?.message) {
    setError("root", {
      type: "server",
      message: data.message,
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
