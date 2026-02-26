import React from "react";
import styles from "./SideImage.module.scss";
import TestimonialCard from "../TestimonialCard/TestimonialCard";
import { AuthFormModeType } from "../types";

type SideImageProps = {
  mode: AuthFormModeType;
};

export default function SideImage({ mode }: SideImageProps) {
  const imageClass = [
    styles.imageSide,
    mode === "candidate" && styles.imageCandidate,
    mode === "employer" && styles.imageEmployer,
    mode === "login" && styles.imageLogin,
    mode === "forgotPassword" && styles.imageForgotPassword,
    mode === "resetPassword" && styles.imageResetPassword,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={imageClass}>
      {mode === "candidate" && (
        <>
          <div className={styles.imageContent}>
            <h2>Твоя новая работа уже ждет</h2>
            <p>Более 150 компаний ежедневно ищут таланты.</p>
          </div>

          <TestimonialCard
            text="«Заполнил профиль за 5 минут, добавил стек технологий и уже на следующий день получил два приглашения на собеседование. Очень удобный формат без лишней бюрократии!»"
            image="https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100&auto=format&fit=crop"
            name="Алексей Смирнов"
            jobTitle="Frontend Разработчик"
          />
        </>
      )}

      {mode === "employer" && (
        <>
          <div className={styles.imageContent}>
            <h2>Соберите команду мечты</h2>
            <p>Тысячи специалистов ждут ваших предложений.</p>
          </div>

          <TestimonialCard
            text="«Мы закрыли позицию Senior Backend разработчика всего за 3 дня! Никаких гор нерелевантных резюме, только кандидаты, которые реально подходят по стеку.»"
            image="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=100&auto=format&fit=crop"
            name="Мария Лебедева"
            jobTitle="HR-директор, FinTech Solutions"
          />
        </>
      )}

      {mode === "login" && (
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

      {mode === "forgotPassword" && (
        <>
          <div className={styles.imageContent}>
            <h2>Восстановление доступа</h2>
            <p>Мы отправим ссылку на почту — она будет действовать 1 час.</p>
          </div>

          <div className={styles.statsCard}>
            <div className={styles.statRow}>
              <div className={styles.statIcon}>📩</div>
              <div className={styles.statText}>
                <h4>Быстро</h4>
                <p>Письмо приходит за минуты</p>
              </div>
            </div>
          </div>
        </>
      )}

      {mode === "resetPassword" && (
        <>
          <div className={styles.imageContent}>
            <h2>Новый пароль</h2>
            <p>Придумайте надежный пароль и подтвердите его.</p>
          </div>

          <TestimonialCard
            text="«Сбросил пароль за минуту и сразу вернулся к откликам. Удобно!»"
            image="https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=100&auto=format&fit=crop"
            name="Илья"
            jobTitle="Fullstack Developer"
          />
        </>
      )}
    </div>
  );
}
