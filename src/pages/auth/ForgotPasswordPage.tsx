import AuthForm from "../../components/auth/AuthForm/AuthForm";
import styles from "./page.module.scss";
import { authApi } from "../../api/authApi/authApi";

type FormDto = { email: string };

export function ForgotPasswordPage() {
  const handleSubmit = async (data: FormDto) => {
    await authApi.forgotPassword({ email: data.email });
    alert("Если аккаунт существует — письмо отправлено.");
  };

  return (
    <div className={styles.formContainer}>
      <span className={styles.badge}>🔁 Восстановление</span>
      <h1>Забыли пароль?</h1>
      <p>Введите email — отправим ссылку для сброса.</p>

      <AuthForm<FormDto>
        submitText="Отправить письмо"
        onSubmit={handleSubmit}
        fields={[
          {
            name: "email",
            label: "Электронная почта",
            placeholder: "name@gmail.com",
            validation: {
              required: "Email обязателен",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Неверный email",
              },
            },
          },
        ]}
      />
    </div>
  );
}
