import {Link} from "react-router-dom";
import styles from "./Header.module.scss";
import {page} from "../../../constants/page";

export default function Header() {
  return (
    <header>
      <div className={`container ${styles.headerContent}`}>
        <Link to={page.home} className={styles.logo}>
          JobSpace
        </Link>
        <div className={styles.authButtons}>
          <Link to={page.login}>
            <button className={styles.btnLogin}>Войти</button>
          </Link>

          <Link to={page.candidateRegistration}>
            <button className={styles.btnRegister}>Регистрация</button>
          </Link>
        </div>
      </div>
    </header>
  );
}
