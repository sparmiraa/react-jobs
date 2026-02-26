import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./MyVacanciesPage.module.scss";

import { useAppSelector } from "../../../redux/store";
import type { MeResponseDto } from "../../../api/authApi/authTypes";

import { vacancyApi } from "../../../api/vacancyApi/vacancyApi";
import type { VacancyListItem } from "../../../api/vacancyApi/vacancyTypes";

import { employerApi } from "../../../api/employerApi/employerApi";
import type { EmployerProfileDTO } from "../../../api/employerApi/employerTypes";

import LoadMore from "../../../components/common/LoadMore/LoadMore";

type TabKey = "active" | "archived" | "all";

function formatSalary(v: VacancyListItem) {
  const from = v.salaryFrom;
  const to = v.salaryTo;

  if (from != null && to != null)
    return `${from.toLocaleString("ru-RU")} — ${to.toLocaleString("ru-RU")} ₽`;
  if (from != null) return `от ${from.toLocaleString("ru-RU")} ₽`;
  if (to != null) return `до ${to.toLocaleString("ru-RU")} ₽`;
  return "Зарплата не указана";
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function MyVacanciesPage() {
  const me = useAppSelector((s) => s.auth.user) as MeResponseDto | null;
  const authStatus = useAppSelector((s) => s.auth.status);

  const [employer, setEmployer] = useState<EmployerProfileDTO | null>(null);
  const employerId = employer?.id ?? null;

  const [tab, setTab] = useState<TabKey>("active");

  const [items, setItems] = useState<VacancyListItem[]>([]);
  const [total, setTotal] = useState(0);

  const [page, setPage] = useState(1);
  const limit = 12;

  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canLoadMore = items.length < total;

  useEffect(() => {
    if (!me) return;
    if (me.role !== "EMPLOYER") return;

    (async () => {
      try {
        setError(null);
        const p =
          (await employerApi.getCurrentEmployerProfile()) as EmployerProfileDTO;
        setEmployer(p);
      } catch (e: any) {
        setError(e?.message ?? "Ошибка загрузки профиля работодателя");
      }
    })();
  }, [me]);

  const fetchPage = async (nextPage: number, mode: "replace" | "append") => {
    if (!employerId) return;

    try {
      setError(null);
      if (mode === "replace") setLoading(true);
      else setLoadingMore(true);

      const res = await vacancyApi.getAllByEmployerId(employerId, {
        page: nextPage,
        limit,
      });

      setTotal(res.pagination.total);
      setPage(res.pagination.page);

      setItems((prev) =>
        mode === "replace" ? res.items : [...prev, ...res.items]
      );
    } catch (e: any) {
      setError(e?.message ?? "Ошибка загрузки вакансий");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    if (!employerId) return;
    fetchPage(1, "replace");
  }, [employerId]);

  const onLoadMore = async () => {
    if (!canLoadMore || loadingMore || loading) return;
    await fetchPage(page + 1, "append");
  };

  const { activeCount, archivedCount } = useMemo(() => {
    let a = 0;
    let r = 0;
    for (const v of items) {
      if (v.isActive) a += 1;
      else r += 1;
    }
    return { activeCount: a, archivedCount: r };
  }, [items]);

  const visible = useMemo(() => {
    if (tab === "all") return items;
    if (tab === "active") return items.filter((v) => v.isActive);
    return items.filter((v) => !v.isActive);
  }, [items, tab]);

  async function onArchiveToggle(v: VacancyListItem) {
    const next = !v.isActive;
    await vacancyApi.changeStatus(v.id, next);

    setItems((prev) =>
      prev.map((x) => (x.id === v.id ? { ...x, isActive: next } : x))
    );
  }

  const subtitle = useMemo(() => {
    if (authStatus === "loading") return "Проверяем сессию…";
    if (!me) return "Вы не авторизованы";
    if (me.role !== "EMPLOYER")
      return "Эта страница доступна только работодателю";
    if (!employerId && !error) return "Загружаем профиль работодателя…";
    if (loading) return "Загружаем вакансии…";
    if (error) return error;
    return "Управляйте своими публикациями";
  }, [authStatus, me, employerId, loading, error]);

  return (
    <main className={styles.container}>
      <div className={styles.pageHeader}>
        <div className={styles.pageTitle}>
          <h1>Мои вакансии</h1>
          <p>{subtitle}</p>
        </div>

        <Link to="/employer/vacancies/new" className={styles.btnPrimary}>
          <span>+</span> Создать вакансию
        </Link>
      </div>

      <div className={styles.filterTabsWrapper}>
        <div className={styles.filterTabs}>
          <button
            className={[
              styles.tabBtn,
              tab === "active" ? styles.tabBtnActive : "",
            ].join(" ")}
            onClick={() => setTab("active")}
            type="button"
          >
            Активные ({activeCount})
          </button>

          <button
            className={[
              styles.tabBtn,
              tab === "archived" ? styles.tabBtnActive : "",
            ].join(" ")}
            onClick={() => setTab("archived")}
            type="button"
          >
            В архиве ({archivedCount})
          </button>

          <button
            className={[
              styles.tabBtn,
              tab === "all" ? styles.tabBtnActive : "",
            ].join(" ")}
            onClick={() => setTab("all")}
            type="button"
          >
            Все ({items.length})
          </button>
        </div>
      </div>

      {loading && <div className={styles.loading}>Загрузка...</div>}
      {!!error && !loading && <div className={styles.empty}>{error}</div>}

      {!loading &&
        !error &&
        me?.role === "EMPLOYER" &&
        employerId &&
        visible.length === 0 && (
          <div className={styles.empty}>Пока нет вакансий</div>
        )}

      <div className={styles.vacancyList}>
        {visible.map((v) => (
          <div
            key={v.id}
            className={[
              styles.vacancyCard,
              !v.isActive ? styles.archived : "",
            ].join(" ")}
          >
            <div className={styles.vacancyInfo}>
              <Link
                to={`/employer/vacancies/${v.id}/edit`}
                className={styles.vacancyTitle}
              >
                {v.title}
              </Link>

              <div className={styles.vacancySalary}>{formatSalary(v)}</div>

              <div className={styles.vacancyMeta}>
                <span>
                  {v.cityName ? `г. ${v.cityName}` : "Локация не указана"}
                </span>
                <span className={styles.metaDot} />
                <span>Создана: {formatDate(v.createdAt)}</span>
              </div>
            </div>

            <div className={styles.vacancyActions}>
              <div
                className={[
                  styles.statusBadge,
                  v.isActive ? styles.statusActive : styles.statusInactive,
                ].join(" ")}
              >
                {v.isActive ? "Активна" : "В архиве"}
              </div>

              <div className={styles.actionLinks}>
                <Link to={`/employer/vacancies/${v.id}/edit`}>
                  Редактировать
                </Link>

                {v.isActive ? (
                  <button
                    className={styles.dangerLink}
                    type="button"
                    onClick={() => onArchiveToggle(v)}
                  >
                    В архив
                  </button>
                ) : (
                  <button
                    className={styles.linkBtn}
                    type="button"
                    onClick={() => onArchiveToggle(v)}
                  >
                    Опубликовать снова
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {me?.role === "EMPLOYER" && employerId && (
        <LoadMore
          total={total}
          limit={limit}
          loaded={items.length}
          loading={loading}
          loadingMore={loadingMore}
          onLoadMore={onLoadMore}
          nounForms={["вакансия", "вакансии", "вакансий"]}
        />
      )}
    </main>
  );
}
