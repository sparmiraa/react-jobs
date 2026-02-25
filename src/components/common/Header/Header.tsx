import { NavLink, Link } from "react-router-dom";

import styles from "./Header.module.scss";
import { page } from "../../../constants/page";
import { MeResponseDto } from "../../../api/authApi/authTypes";

interface Props {
  user?: MeResponseDto | null;
}

const roleNames: Record<string, string> = {
  CANDIDATE: "Кандидат",
  EMPLOYER: "Работодатель",
  ADMIN: "Админ",
};

export default function Header({ user }: Props) {
  const getAvatar = (user: MeResponseDto) => {
    return user.name.slice(0, 1).toUpperCase();
  };

  return (
    <header>
      <div className={`container ${styles.headerContent}`}>
        <NavLink to={page.home} className={styles.logo}>
          JobSpace
        </NavLink>

        {!user && (
          <div className={styles.authButtons}>
            <Link to={page.login}>
              {" "}
              <button className={styles.btnLogin}>Войти</button>{" "}
            </Link>{" "}
            <Link to={page.candidateRegistration}>
              {" "}
              <button className={styles.btnRegister}>Регистрация</button>{" "}
            </Link>
          </div>
        )}

        {user && (
          <>
            {user.role === "CANDIDATE" && (
              <nav className={styles.mainNav}>
                <NavLink
                  to={page.vacancies}
                  className={({ isActive }) =>
                    isActive ? styles.active : undefined
                  }
                >
                  Вакансии
                </NavLink>
                <NavLink
                  to={page.myApplies}
                  className={({ isActive }) =>
                    isActive ? styles.active : undefined
                  }
                >
                  Мои отклики
                </NavLink>
                <NavLink
                  to={page.candidateProfile}
                  className={({ isActive }) =>
                    isActive ? styles.active : undefined
                  }
                >
                  Профиль
                </NavLink>
              </nav>
            )}

            {user.role === "EMPLOYER" && (
              <nav className={styles.mainNav}>
                <NavLink
                  to={page.candidateBase}
                  className={({ isActive }) =>
                    isActive ? styles.active : undefined
                  }
                >
                  База кандидатов
                </NavLink>
                <NavLink
                  to={page.myVacancies}
                  className={({ isActive }) =>
                    isActive ? styles.active : undefined
                  }
                >
                  Мои вакансии
                </NavLink>
                <NavLink
                  to={page.employerProfile}
                  className={({ isActive }) =>
                    isActive ? styles.active : undefined
                  }
                >
                  Профиль
                </NavLink>
              </nav>
            )}

            <div className={styles.userMenu}>
              <div className={styles.userAvatar}>{getAvatar(user)}</div>
              <div className={styles.userInfo}>
                <span className={styles.userName}>{user.name}</span>
                <span className={styles.userRole}>
                  {roleNames[user.role] || user.role}
                </span>
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
