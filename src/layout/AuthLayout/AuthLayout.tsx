import { Outlet, Link, useLocation } from "react-router-dom";
import styles from "./AuthLayout.module.scss";
import TestimonialCard from "../../components/auth/TestimonialCard/TestimonialCard";

export default function AuthLayout() {
  const location = useLocation();

  const isCandidate = location.pathname.includes("candidate");
  const isEmployer = location.pathname.includes("employer");
  const isLogin = location.pathname.includes("login");

  const imageClass = [
    styles.imageSide,
    isCandidate && styles.imageCandidate,
    isEmployer && styles.imageEmployer,
    isLogin && styles.imageLogin,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={styles.authLayout}>
      <div className={styles.formSide}>
        <div className={styles.brand}>
          <Link to="/" className={styles.logo}>
            JobSpace
          </Link>
        </div>

        <div className={styles.formWrapper}>
          <Outlet />
        </div>
      </div>

      <div className={imageClass}>
        {isCandidate && (
          <>
            <div className={styles.imageContent}>
              <h2>Твоя новая работа уже ждет</h2>
              <p>Более 150 технологичных компаний ежедневно ищут таланты.</p>
            </div>

            <TestimonialCard
              text="«Заполнил профиль за 5 минут, добавил стек технологий тегами и уже на следующий день получил два приглашения на собеседование. Очень удобный формат без лишней бюрократии!»"
              image="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop"
              name="Алексей Смирнов"
              jobTittle="Frontend Разработчик"
            />
          </>
        )}

        {isEmployer && (
          <>
            <div className={styles.imageContent}>
              <h2>Соберите команду мечты</h2>
              <p>Тысячи специалистов ждут ваших предложений.</p>
            </div>

            <TestimonialCard
              text="«Благодаря платформе мы закрыли позицию Senior Backend разработчика всего за 3 дня! Никаких гор нерелевантных резюме — только кандидаты, которые реально подходят по стеку.»"
              image="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=2070&auto=format&fit=crop"
              name="Мария Лебедева"
              jobTittle="HR-директор, FinTech Solutions"
            />
          </>
        )}

        {isLogin && (
          <>
            <div className={styles.imageContent}>
              <h2>Где таланты встречают возможности</h2>
              <p>Единое пространство для найма и поиска работы.</p>
            </div>

            <div className={styles.statsCard}>
              <div className={styles.statRow}>
                <div className={styles.statIcon}>💼</div>
                <div className={styles.statText}>
                  <h4>150+</h4>
                  <p>Активных компаний</p>
                </div>
              </div>

              <div className={styles.cardDivider} />

              <div className={styles.statRow}>
                <div className={styles.statIcon}>🚀</div>
                <div className={styles.statText}>
                  <h4>10,000+</h4>
                  <p>Откликов за этот месяц</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
