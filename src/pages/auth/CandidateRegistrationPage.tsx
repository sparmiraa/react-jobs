import AuthForm from "../../components/auth/AuthForm/AuthForm";
import { authApi } from "../../api/authApi/authApi";
import { RegisterRequestDto } from "../../api/authApi/authTypes";
import styles from "./page.module.scss";
import { Link, useNavigate } from "react-router-dom";
import { accessTokenService } from "../../services/localStorage/accessTokenService";
import { page } from "../../constants/page";
import { useAppDispatch } from "../../redux/store";
import { getMeThunk } from "../../redux/user/userThunks";


export function CandidateRegistrationPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleRegister = async (data: RegisterRequestDto) => {
      const res = await authApi.registerCandidate(data);
      accessTokenService.set(res.accessToken);
      await dispatch(getMeThunk());
      navigate("/vacancies", { replace: true });
  };
  return (
    <>
      <div className={styles.formContainer}>
        <span className={styles.badge}>👋 Соискатель</span>
        <h1>Начни свою карьеру</h1>
        <p>
          Создай аккаунт, чтобы откликаться на вакансии и получать приглашения
          от компаний.
        </p>
        <AuthForm<RegisterRequestDto>
          submitText="Зарегистрироваться"
          onSubmit={handleRegister}
          fields={[
            {
              name: "name",
              label: "Ваше имя",
              placeholder: "Например, Иван Иванов",
              validation: {
                required: "Имя обязательно",
                minLength: {
                  value: 2,
                  message: "Минимум 2 символа",
                },
              },
            },
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
          Уже есть аккаунт? <Link to={page.login}>Войти</Link>
        </div>
      </div>
    </>
  );
}
