import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import styles from "./VacancyViewPage.module.scss";

import {
  vacancyApi,
  type VacancyViewDto,
} from "../../../api/vacancyApi/vacancyApi";

function formatMoneyRange(from: number | null, to: number | null) {
  if (!from && !to) return "ЗП не указана";
  const fmt = (n: number) => n.toLocaleString("ru-RU");
  if (from && to) return `${fmt(from)} — ${fmt(to)} ₸`;
  if (from) return `от ${fmt(from)} ₸`;
  return `до ${fmt(to!)} ₸`;
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function firstLetter(name?: string | null) {
  const s = (name ?? "").trim();
  return s ? s[0].toUpperCase() : "🏢";
}

export default function VacancyViewPage() {
  const { id } = useParams();
  const vacancyId = Number(id);

  const [data, setData] = useState<VacancyViewDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const createdLabel = useMemo(
    () => (data?.createdAt ? formatDate(data.createdAt) : ""),
    [data?.createdAt],
  );

  useEffect(() => {
    if (!vacancyId || !Number.isFinite(vacancyId)) {
      setError("Некорректный id вакансии");
      setLoading(false);
      return;
    }

    (async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await vacancyApi.getPublicById(vacancyId);
        setData(res);
      } catch (e: any) {
        setError(e?.response?.data?.message ?? "Не удалось загрузить вакансию");
      } finally {
        setLoading(false);
      }
    })();
  }, [vacancyId]);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Загрузка...</div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className={styles.container}>
        <div className={styles.errorBox}>{error ?? "Вакансия не найдена"}</div>
        <Link to="/vacancies" className={styles.backBtn}>
          ← Назад к вакансиям
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.topNav}>
        <Link to="/vacancies" className={styles.backBtn}>
          ← Назад к поиску
        </Link>
      </div>

      <main className={styles.layout}>
        {/* left */}
        <article className={styles.mainCard}>
          <div className={styles.header}>
            <h1 className={styles.title}>{data.title}</h1>

            <div className={styles.salary}>
              {formatMoneyRange(data.salaryFrom, data.salaryTo)}
            </div>

            <div className={styles.meta}>
              <div className={styles.metaItem}>
                🏢 {data.employerName ?? "Компания"}
              </div>
              <div className={styles.metaItem}>
                📍 {data.cityName ?? "Город не указан"}
              </div>
              <div className={styles.metaItem}>
                🕒 Опубликовано: {createdLabel}
              </div>
            </div>
          </div>

          {!!data.skills?.length && (
            <div className={styles.skillsSection}>
              <h3>Ключевые навыки</h3>
              <div className={styles.tags}>
                {data.skills.map((s) => (
                  <span key={s.id} className={styles.tag}>
                    {s.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {data.responsibilities && (
            <section className={styles.block}>
              <h3>Обязанности</h3>
              <p>{data.responsibilities}</p>
            </section>
          )}

          {data.requiredText && (
            <section className={styles.block}>
              <h3>Необходимые навыки и опыт</h3>
              <p>{data.requiredText}</p>
            </section>
          )}

          {data.plusText && (
            <section className={styles.block}>
              <h3>Будет плюсом</h3>
              <p>{data.plusText}</p>
            </section>
          )}

          {data.assumptions && (
            <section className={styles.block}>
              <h3>Условия / ожидания</h3>
              <p>{data.assumptions}</p>
            </section>
          )}
        </article>

        {/* right */}
        <aside className={styles.sidebar}>
          <div className={styles.actionCard}>
            <div className={styles.employerInfo}>
              <div className={styles.employerLogo}>
                {firstLetter(data.employerName)}
              </div>
              <div className={styles.employerName}>
                {data.employerName ?? "Компания"}
              </div>

              {(data.employerShortBio || data.employerBio) && (
                <p className={styles.employerDesc}>
                  {data.employerShortBio ?? data.employerBio}
                </p>
              )}
            </div>

            {/* пока нет endpoint отклика — сделаю кнопку как заглушку */}
            <button type="button" className={styles.btnApply} disabled>
              Откликнуться (скоро)
            </button>

            <div className={styles.status}>Вакансия активна</div>
          </div>
        </aside>
      </main>
    </div>
  );
}
