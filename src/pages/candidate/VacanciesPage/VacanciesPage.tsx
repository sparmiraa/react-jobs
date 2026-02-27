import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import styles from "./VacanciesPage.module.scss";

import InputField from "../../../components/common/InputField/InputField";
import {
  vacancyApi,
  type VacancyListItemDto,
} from "../../../api/vacancyApi/vacancyApi";
import { mainApi } from "../../../api/mainApi/mainApi";
import type { City, Skill } from "../../../api/mainApi/mainTypes";

const PAGE_LIMIT = 12;

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

export default function VacanciesPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // справочники
  const [cities, setCities] = useState<City[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);

  // фильтры (UI state)
  const [q, setQ] = useState(searchParams.get("q") ?? "");
  const [cityId, setCityId] = useState<number | null>(
    searchParams.get("cityId") ? Number(searchParams.get("cityId")) : null,
  );
  const [salaryFrom, setSalaryFrom] = useState<number | null>(
    searchParams.get("salaryFrom")
      ? Number(searchParams.get("salaryFrom"))
      : null,
  );
  const [salaryTo, setSalaryTo] = useState<number | null>(
    searchParams.get("salaryTo") ? Number(searchParams.get("salaryTo")) : null,
  );
  const [skillIds, setSkillIds] = useState<number[]>(() => {
    const raw = searchParams.get("skillIds");
    if (!raw) return [];
    return raw
      .split(",")
      .map((x) => Number(x.trim()))
      .filter((n) => Number.isFinite(n) && n > 0);
  });

  // данные
  const [items, setItems] = useState<VacancyListItemDto[]>([]);
  const [page, setPage] = useState<number>(
    Number(searchParams.get("page")) > 0 ? Number(searchParams.get("page")) : 1,
  );
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canLoadMore = page < totalPages;

  // ✅ кнопка без цифр
  const applyBtnLabel = useMemo(() => {
    if (loading) return "Загрузка...";
    return "Показать вакансии";
  }, [loading]);

  useEffect(() => {
    (async () => {
      try {
        const [citiesRes, skillsRes] = await Promise.all([
          mainApi.getCities(),
          mainApi.getSkills(),
        ]);
        setCities(citiesRes);
        setSkills(skillsRes);
      } catch {
        // ignore
      }
    })();
  }, []);

  async function fetchList(nextPage: number, mode: "replace" | "append") {
    try {
      if (mode === "replace") setLoading(true);
      else setLoadingMore(true);

      setError(null);

      const res = await vacancyApi.getAllForCandidate({
        page: nextPage,
        limit: PAGE_LIMIT,
        q,
        cityId,
        salaryFrom,
        salaryTo,
        skillIds,
      });

      setTotal(res.pagination.total);
      setTotalPages(res.pagination.totalPages);

      if (mode === "replace") setItems(res.items);
      else setItems((prev) => [...prev, ...res.items]);
    } catch (e: any) {
      setError(e?.response?.data?.message ?? "Не удалось загрузить вакансии");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }

  // первичная загрузка / когда меняется page
  useEffect(() => {
    fetchList(page, "replace");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  function applyFilters() {
    const sp = new URLSearchParams();

    if (q.trim()) sp.set("q", q.trim());
    if (cityId) sp.set("cityId", String(cityId));
    if (salaryFrom) sp.set("salaryFrom", String(salaryFrom));
    if (salaryTo) sp.set("salaryTo", String(salaryTo));
    if (skillIds.length > 0) sp.set("skillIds", skillIds.join(","));
    sp.set("page", "1");

    setSearchParams(sp);
    setPage(1);
    fetchList(1, "replace");
  }

  function resetFilters() {
    setQ("");
    setCityId(null);
    setSalaryFrom(null);
    setSalaryTo(null);
    setSkillIds([]);

    setSearchParams(new URLSearchParams({ page: "1" }));
    setPage(1);
    fetchList(1, "replace");
  }

  function toggleSkill(id: number) {
    setSkillIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  // ✅ fix: чтобы не было replace из useEffect поверх append
  async function loadMore() {
    if (!canLoadMore || loadingMore) return;
    const next = page + 1;

    await fetchList(next, "append");
    setPage(next);
  }

  return (
    <div className={styles.container}>
      <div className={styles.dashboard}>
        {/* Sidebar filters */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <h2>Фильтры</h2>
            <button
              type="button"
              className={styles.resetBtn}
              onClick={resetFilters}
              disabled={loading || loadingMore}
            >
              Сбросить
            </button>
          </div>

          <div className={styles.filterGroup}>
            <h3>🔍 Ключевое слово</h3>
            <InputField
              needMargin={false}
              placeholder="Должность или компания"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>

          <div className={styles.filterGroup}>
            <h3>📍 Город</h3>
            <select
              className={styles.select}
              value={cityId ?? ""}
              onChange={(e) =>
                setCityId(e.target.value ? Number(e.target.value) : null)
              }
            >
              <option value="">Любой</option>
              {cities.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.filterGroup}>
            <h3>💰 Уровень дохода</h3>
            <div className={styles.salaryRow}>
              <input
                className={styles.filterInput}
                type="number"
                placeholder="От"
                value={salaryFrom ?? ""}
                onChange={(e) =>
                  setSalaryFrom(e.target.value ? Number(e.target.value) : null)
                }
              />
              <span>—</span>
              <input
                className={styles.filterInput}
                type="number"
                placeholder="До"
                value={salaryTo ?? ""}
                onChange={(e) =>
                  setSalaryTo(e.target.value ? Number(e.target.value) : null)
                }
              />
            </div>
          </div>

          <div className={styles.filterGroup}>
            <h3>⚡ Навыки</h3>
            <div className={styles.skillsChips}>
              {skills.map((s) => {
                const checked = skillIds.includes(s.id);
                return (
                  <label key={s.id} className={styles.chipLabel}>
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleSkill(s.id)}
                    />
                    <span className={styles.chipText}>{s.name}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <button
            type="button"
            className={styles.btnFilter}
            onClick={applyFilters}
            disabled={loading || loadingMore}
          >
            {applyBtnLabel}
          </button>

          {error && <div className={styles.errorBox}>{error}</div>}
        </aside>

        {/* Feed */}
        <section className={styles.feed}>
          <div className={styles.feedHeader}>
            <h1>Вакансии</h1>
            <div className={styles.metaRight}>
              <span className={styles.smallMuted}>
                {loading ? "..." : `${items.length} из ${total}`}
              </span>
            </div>
          </div>

          {/* ✅ во время загрузки НЕ показываем карточки */}
          {loading ? (
            <div className={styles.loading}>Загрузка вакансий...</div>
          ) : items.length === 0 ? (
            <div className={styles.empty}>
              По вашему запросу ничего не найдено.
            </div>
          ) : (
            <>
              {items.map((v) => (
                <div key={v.id} className={styles.jobCard}>
                  <div className={styles.jobHeader}>
                    <div>
                      <Link
                        to={`/vacancies/${v.id}`}
                        className={styles.jobTitle}
                      >
                        {v.title}
                      </Link>

                      <div className={styles.jobMeta}>
                        <span>🏢 {v.employerName ?? "Компания"}</span>
                        <span>📍 {v.cityName ?? "Город не указан"}</span>
                        <span>🕒 {formatDate(v.createdAt)}</span>
                      </div>
                    </div>

                    <div className={styles.jobSalary}>
                      {formatMoneyRange(v.salaryFrom, v.salaryTo)}
                    </div>
                  </div>

                  {!!v.skills?.length && (
                    <div className={styles.tags}>
                      {v.skills.slice(0, 6).map((s) => (
                        <span key={s.id} className={styles.tag}>
                          {s.name}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className={styles.jobFooter}>
                    <div className={styles.mutedHint}>
                      Нажмите «Подробнее», чтобы открыть полное описание
                    </div>

                    <Link
                      to={`/vacancies/${v.id}`}
                      className={styles.btnDetails}
                    >
                      Подробнее
                    </Link>
                  </div>
                </div>
              ))}

              {canLoadMore && (
                <div className={styles.loadMoreContainer}>
                  <button
                    type="button"
                    className={styles.btnLoadMore}
                    onClick={loadMore}
                    disabled={loadingMore}
                  >
                    {loadingMore ? "Загрузка..." : "Показать еще вакансии ↓"}
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
}
