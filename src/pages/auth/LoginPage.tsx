import AuthForm from "../../components/auth/AuthForm/AuthForm";
import { authApi } from "../../api/authApi/authApi";
import { LoginRequestDto } from "../../api/authApi/authTypes";
import styles from "./page.module.scss";
import { Link } from "react-router-dom";

export function LoginPage() {
  const handleLogin = async (data: LoginRequestDto): Promise<void> => {
    await authApi.login(data);
  };
  return (
    <>
      <div className={styles.formContainer}>
        <span className={styles.badge}>🔐 Вход</span>
        <h1>С возвращением!</h1>
        <p>Войдите, чтобы продолжить поиск работы или идеальных кандидатов.</p>
        <AuthForm<LoginRequestDto>
          submitText="Войти"
          onSubmit={handleLogin}
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
            {
              name: "password",
              label: "Пароль",
              type: "password",
              placeholder: "Минимум 8 символов",
              headerRight: (
                <Link
                  to="/auth/forgot-password"
                  className={styles.forgotPassword}
                >
                  Забыли пароль?
                </Link>
              ),
              validation: {
                required: "Пароль обязателен",
                minLength: {
                  value: 8,
                  message: "Минимум 8 символов",
                },
              },
            },
          ]}
        />

        <div className={styles.formFooter}>
          Впервые на JobSpace?
          <div className={styles.registerLinks}>
            <Link to="/auth/registration/candidate">Я ищу работу</Link>
            <Link to="/auth/registration/employer">Я ищу сотрудников</Link>
          </div>
        </div>
      </div>
    </>
  );
}
