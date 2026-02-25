import { Link } from "react-router-dom";
import styles from "./Header.module.scss";

export default function Header() {
  return (
    <header>
      <div className={`container ${styles.headerContent}`}>
        <Link to="/" className={styles.logo}>
          JobSpace
        </Link>
        <div className={styles.authButtons}>
          <Link to="/auth/login">
            <button className={styles.btnLogin}>Войти</button>
          </Link>

          <Link to="/auth/registration/candidate">
            <button className={styles.btnRegister}>Регистрация</button>
          </Link>
        </div>
      </div>
    </header>
  );
}
