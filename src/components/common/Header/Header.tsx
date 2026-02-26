import {NavLink, Link} from "react-router-dom";

import styles from "./Header.module.scss";
import {page} from "../../../constants/page";
import {MeResponseDto, UserRole} from "../../../api/authApi/authTypes";
import {useAppSelector} from "../../../redux/store";

const roleNames: Record<UserRole, string> = {
  CANDIDATE: "Кандидат",
  EMPLOYER: "Работодатель",
  ADMIN: "Админ",
};

const editPages: Record<UserRole, string> = {
  CANDIDATE: page.candidateEdit,
  EMPLOYER: page.employerEdit,
  ADMIN: "/",
};

export default function Header() {
  const user = useAppSelector((s) => s.auth.user);

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
              <button className={styles.btnLogin}>Войти</button>
              {" "}
            </Link>{" "}
            <Link to={page.candidateRegistration}>
              {" "}
              <button className={styles.btnRegister}>Регистрация</button>
              {" "}
            </Link>
          </div>
        )}

        {user && (
          <>
            {user.role === "CANDIDATE" && (
              <nav className={styles.mainNav}>
                <NavLink
                  to={page.vacancies}
                  className={({isActive}) =>
                    isActive ? styles.active : undefined
                  }
                >
                  Вакансии
                </NavLink>
                <NavLink
                  to={page.companies}
                  className={({isActive}) =>
                    isActive ? styles.active : undefined
                  }
                >
                  Компании
                </NavLink>
                <NavLink
                  to={page.candidateMyApplies}
                  className={({isActive}) =>
                    isActive ? styles.active : undefined
                  }
                >
                  Мои отклики
                </NavLink>
              </nav>
            )}

            {user.role === "EMPLOYER" && (
              <nav className={styles.mainNav}>
                <NavLink
                  to={page.candidateBase}
                  className={({isActive}) =>
                    isActive ? styles.active : undefined
                  }
                >
                  База кандидатов
                </NavLink>
                <NavLink
                  to={page.myVacancies}
                  className={({isActive}) =>
                    isActive ? styles.active : undefined
                  }
                >
                  Мои вакансии
                </NavLink>
                <NavLink
                  to={page.employerMyApplies}
                  className={({isActive}) =>
                    isActive ? styles.active : undefined
                  }
                >
                  Отклики
                </NavLink>
              </nav>
            )}
            <Link to={editPages[user.role]}>
              <div className={styles.userMenu}>
                <div className={styles.userAvatar}>{getAvatar(user)}</div>
                <div className={styles.userInfo}>
                  <span className={styles.userName}>{user.name}</span>
                  <span className={styles.userRole}>
                  {roleNames[user.role]}
                </span>
                </div>
              </div>
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
