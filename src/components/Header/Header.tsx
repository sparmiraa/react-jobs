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
          <button className={styles.btnLogin}>Войти</button>
          <button className={styles.btnRegister}>Регистрация</button>
        </div>
      </div>
    </header>
  );
}
