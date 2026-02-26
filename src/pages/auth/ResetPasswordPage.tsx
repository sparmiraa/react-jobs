import AuthForm from "../../components/auth/AuthForm/AuthForm";
import styles from "./page.module.scss";
import { authApi } from "../../api/authApi/authApi";
import { useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { page } from "../../constants/page";

type FormDto = {
  newPassword: string;
  confirmPassword: string;
};

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

export function ResetPasswordPage() {
  const q = useQuery();
  const navigate = useNavigate();
  const requestId = q.get("requestId") ?? "";

  const handleSubmit = async (data: FormDto) => {
    if (!requestId) {
      throw new Error("Ссылка для сброса пароля некорректна (нет requestId).");
    }
    if (data.newPassword !== data.confirmPassword) {
      throw new Error("Пароли не совпадают");
    }

    await authApi.resetPassword(requestId, { newPassword: data.newPassword });

    alert("Пароль обновлён. Теперь войдите.");
    navigate(page.login, { replace: true });
  };

  return (
    <div className={styles.formContainer}>
      <span className={styles.badge}>🔐 Новый пароль</span>
      <h1>Создайте новый пароль</h1>
      <p>Он должен быть минимум 8 символов.</p>

      {!requestId ? (
        <div>
          <p style={{ marginTop: 12 }}>
            Ссылка невалидна или устарела. Попробуйте запросить новую.
          </p>
          <Link to={page.forgotPassword}>Запросить письмо заново</Link>
        </div>
      ) : (
        <AuthForm<FormDto>
          submitText="Сохранить пароль"
          onSubmit={handleSubmit}
          fields={[
            {
              name: "newPassword",
              label: "Новый пароль",
              type: "password",
              placeholder: "Минимум 8 символов",
              validation: {
                required: "Пароль обязателен",
                minLength: { value: 8, message: "Минимум 8 символов" },
              },
            },
            {
              name: "confirmPassword",
              label: "Повторите пароль",
              type: "password",
              placeholder: "Повторите новый пароль",
              validation: {
                required: "Подтверждение обязательно",
                minLength: { value: 8, message: "Минимум 8 символов" },
              },
            },
          ]}
        />
      )}
    </div>
  );
}
