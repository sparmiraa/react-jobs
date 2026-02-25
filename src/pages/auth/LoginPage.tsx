import AuthForm from "../../components/auth/AuthForm/AuthForm";
import { authApi } from "../../api/authApi/authApi";
import { LoginRequestDto } from "../../api/authApi/authTypes";
import styles from "./page.module.scss";
import { Link, useNavigate } from "react-router-dom";
import { page } from "../../constants/page";
import { accessTokenService } from "../../services/localStorage/accessTokenService";
import { useAppDispatch } from "../../redux/store";
import { getMeThunk } from "../../redux/user/userThunks";

export function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleLogin = async (data: LoginRequestDto) => {
    try {
      const res = await authApi.login(data);

      accessTokenService.set(res.accessToken);

      const user = await dispatch(getMeThunk()).unwrap();

      if (user.role === "EMPLOYER") {
        navigate("/my-vacancies", { replace: true });
      } else if (user.role === "CANDIDATE") {
        navigate("/vacancies", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch (e) {
      console.error("Registration failed:", e);
    }
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
                  to={page.forgotPassword}
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
      </div>
    </>
  );
}
