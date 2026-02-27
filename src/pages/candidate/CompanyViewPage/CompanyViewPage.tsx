import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import styles from "./CompanyViewPage.module.scss";

import Button from "../../../components/common/Button/Button";
import {
  employerApi,
  type EmployerPublicDto,
} from "../../../api/employerApi/employerApi";
import { vacancyApi } from "../../../api/vacancyApi/vacancyApi";
import type {
  VacancyCandidateListItem,
  VacancyCandidateListResponse,
} from "../../../api/vacancyApi/vacancyTypes";

function pickLogoLetter(name: string) {
  const n = (name ?? "").trim();
  return n ? n[0].toUpperCase() : "C";
}

function formatSalary(from: number | null, to: number | null) {
  const fmt = (v: number) => new Intl.NumberFormat("ru-RU").format(v);
  if (from !== null && from !== undefined && from > 0 && to !== null && to !== undefined && to > 0)
    return `${fmt(from)} — ${fmt(to)} ₸`;
  if (from !== null && from !== undefined && from > 0) return `от ${fmt(from)} ₸`;
  if (to !== null && to !== undefined && to > 0) return `до ${fmt(to)} ₸`;
  return "З/п не указана";
}

function formatDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("ru-RU", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

export default function CompanyViewPage() {
  const params = useParams();
  const companyId = Number(params.id);

  const [company, setCompany] = useState<EmployerPublicDto | null>(null);
  const [vacancies, setVacancies] = useState<VacancyCandidateListItem[]>([]);

  const [page, setPage] = useState(1);
  const limit = 10;
  const [total, setTotal] = useState(0);

  const [loadingCompany, setLoadingCompany] = useState(false);
  const [loadingVacancies, setLoadingVacancies] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const canLoadMore = vacancies.length < total;

  const loadCompany = async () => {
    if (!Number.isFinite(companyId) || companyId <= 0) return;

    try {
      setError(null);
      setLoadingCompany(true);
      const dto = await employerApi.getPublicById(companyId);
      setCompany(dto);
    } catch (e: any) {
      setError(e?.message ?? "Не удалось загрузить компанию");
    } finally {
      setLoadingCompany(false);
    }
  };

  const loadVacancies = async (nextPage: number, mode: "replace" | "append") => {
    if (!Number.isFinite(companyId) || companyId <= 0) return;

    try {
      setError(null);
      if (mode === "replace") setLoadingVacancies(true);
      else setLoadingMore(true);

      const res: VacancyCandidateListResponse =
        await vacancyApi.getAllPublicByEmployerId(companyId, {
          page: nextPage,
          limit,
        });

      setTotal(res.pagination.total);
      setPage(res.pagination.page);

      setVacancies((prev) =>
        mode === "replace" ? res.items : [...prev, ...res.items],
      );
    } catch (e: any) {
      setError(e?.message ?? "Не удалось загрузить вакансии компании");
    } finally {
      setLoadingVacancies(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    loadCompany();
    loadVacancies(1, "replace");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyId]);

  const title = useMemo(() => {
    if (loadingCompany && !company) return "Загружаем компанию…";
    if (company) return company.name;
    return "Компания";
  }, [loadingCompany, company]);

  const verified = (company?.vacanciesCount ?? 0) > 0;
  const typeName = company?.type?.name ?? "Компания";

  return (
    <main className={styles.container}>
      <div className={styles.topNavigation}>
        <Link to="/companies" className={styles.backBtn}>
          <span>←</span> Назад к списку
        </Link>
      </div>

      <article className={styles.companyProfile}>
        <div className={styles.profileHeader}>
          <div className={styles.profileLogo}>
            {pickLogoLetter(company?.name ?? "")}
          </div>

          <div className={styles.profileTitleBlock}>
            <h1 className={styles.h1}>
              {title}{" "}
              {verified && (
                <span className={styles.verifiedBadge} title="Есть активные вакансии">
                  ✓
                </span>
              )}
            </h1>

            <div className={styles.profileMeta}>
              <span className={styles.metaTag}>💼 {typeName}</span>
              <span className={styles.metaTag}>
                📍 {company?.cityName ?? "Город не указан"}
              </span>
              <span className={styles.metaTag}>
                👥{" "}
                {company?.employeesCount
                  ? `${company.employeesCount}+ сотрудников`
                  : "Размер не указан"}
              </span>
            </div>
          </div>
        </div>

        <div className={styles.profileAbout}>
          <h3>О компании</h3>

          {loadingCompany && !company ? (
            <p className={styles.muted}>Загрузка…</p>
          ) : (
            <p>
              {company?.bio?.trim()
                ? company.bio
                : company?.shortBio?.trim()
                  ? company.shortBio
                  : "Описание компании пока не заполнено."}
            </p>
          )}
        </div>
      </article>

      <section className={styles.vacanciesList}>
        <div className={styles.sectionTitle}>
          <span>Открытые вакансии</span>
          <span className={styles.vacanciesBadge}>
            {loadingVacancies && vacancies.length === 0
              ? "Загружаем…"
              : `${total} активные`}
          </span>
        </div>

        {error && <div className={styles.errorBox}>{error}</div>}

        {loadingVacancies && vacancies.length === 0 ? (
          <div className={styles.skeletonList}>
            <div className={styles.skeletonCard} />
            <div className={styles.skeletonCard} />
            <div className={styles.skeletonCard} />
          </div>
        ) : vacancies.length === 0 ? (
          <div className={styles.emptyBox}>
            У этой компании пока нет активных вакансий.
          </div>
        ) : (
          vacancies.map((v) => (
            <article key={v.id} className={styles.jobCard}>
              <div className={styles.jobHeader}>
                <div>
                  <Link to={`/vacancies/${v.id}`} className={styles.jobTitle}>
                    {v.title}
                  </Link>

                  <div className={styles.jobMeta}>
                    <span>📍 {v.cityName ?? "Город не указан"}</span>
                    <span>🕒 {formatDate(v.createdAt)}</span>
                  </div>
                </div>

                <div className={styles.jobSalary}>
                  {formatSalary(v.salaryFrom, v.salaryTo)}
                </div>
              </div>

              <div className={styles.jobFooter}>
                <div className={styles.tags}>
                  {(v.skills ?? []).slice(0, 6).map((s) => (
                    <span key={s.id} className={styles.tag}>
                      {s.name}
                    </span>
                  ))}
                </div>

                <Link to={`/vacancies/${v.id}`} className={styles.btnApply}>
                  Подробнее
                </Link>
              </div>
            </article>
          ))
        )}

        <div className={styles.loadMoreContainer}>
          <Button
            loading={loadingMore}
            onClick={() => {
              if (!canLoadMore || loadingMore || loadingVacancies) return;
              loadVacancies(page + 1, "append");
            }}
            disabled={!canLoadMore || loadingMore || loadingVacancies}
          >
            {canLoadMore
              ? `Показать еще ${Math.min(limit, total - vacancies.length)} вакансий ↓`
              : "Больше вакансий нет"}
          </Button>
        </div>
      </section>
    </main>
  );
}