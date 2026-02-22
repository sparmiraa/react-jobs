import styles from "./Footer.module.scss"

export default function Footer() {
  return (
    <footer>
      <div className="container">
        <div className={styles.footerGrid}>
          <div className={styles.footerBrand}>
            <a href="#" className={styles.logo}>
              JobSpace
            </a>
            <p>
              Платформа нового поколения для связи лучших специалистов и
              технологичных компаний.
            </p>
          </div>
          <div className={styles.footerCol}>
            <h4>Кандидатам</h4>
            <ul>
              <li>
                <a href="#">Поиск вакансий</a>
              </li>
              <li>
                <a href="#">Создать профиль</a>
              </li>
              <li>
                <a href="#">Как составить резюме</a>
              </li>
            </ul>
          </div>
          <div className={styles.footerCol}>
            <h4>Работодателям</h4>
            <ul>
              <li>
                <a href="#">Поиск талантов</a>
              </li>
              <li>
                <a href="#">Опубликовать вакансию</a>
              </li>
              <li>
                <a href="#">Тарифы</a>
              </li>
            </ul>
          </div>
          <div className={styles.footerCol}>
            <h4>Поддержка</h4>
            <ul>
              <li>
                <a href="#">FAQ</a>
              </li>
              <li>
                <a href="#">Служба поддержки</a>
              </li>
              <li>
                <a href="#">Telegram-канал</a>
              </li>
            </ul>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <div>&copy; 2026 JobSpace. Все права защищены.</div>
          <div className={styles.footerLegal}>
            <a href="#">Политика конфиденциальности</a>
            <a href="#">Условия использования</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
