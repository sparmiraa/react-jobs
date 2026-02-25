import AuthForm from "../../components/auth/AuthForm/AuthForm";
import {authApi} from "../../api/authApi/authApi";
import {RegisterRequestDto} from "../../api/authApi/authTypes";
import styles from "./page.module.scss";
import {Link, useNavigate} from "react-router-dom";
import {accessTokenService} from "../../services/localStorage/accessTokenService";
import {page} from "../../constants/page";
import { getMeThunk } from "../../redux/user/userThunks";
import { useAppDispatch } from "../../redux/store";

export function EmployerRegistrationPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleRegister = async (data: RegisterRequestDto) => {
      const res = await authApi.registerEmployer(data);
      accessTokenService.set(res.accessToken);
      await dispatch(getMeThunk());
      navigate("/my-vacancies", { replace: true });
  };

  return (
    <>
      <div className={styles.formContainer}>
        <span className={styles.badge}>🏢 Работодатель</span>
        <h1>Соберите команду</h1>
        <p>
          Создайте профиль компании, чтобы публиковать вакансии и находить
          идеальных кандидатов.
        </p>
        <AuthForm<RegisterRequestDto>
          submitText="Зарегистрироваться"
          onSubmit={handleRegister}
          fields={[
            {
              name: "name",
              label: "Название компании",
              placeholder: "Например, ООО Тех Слюшнс",
              validation: {
                required: "Название обязательно",
                minLength: {
                  value: 2,
                  message: "Минимум 2 символа",
                },
              },
            },
            {
              name: "email",
              label: "Электронная почта",
              placeholder: "company@gmail.com",
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
