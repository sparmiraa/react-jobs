import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import styles from "./CandidateCompaniesPage.module.scss";

import InputField from "../../../components/common/InputField/InputField";
import Button from "../../../components/common/Button/Button";

import { employerApi } from "../../../api/employerApi/employerApi";
import { Link } from "react-router-dom";

type EmployerType = { id: number; name: string } | null;

type EmployerItem = {
  id: number;
  name: string;
  shortBio: string | null;
  type: EmployerType;
  vacanciesCount: number;
};

type SearchResponse = {
  total: number;
  page: number;
  limit: number;
  data: EmployerItem[];
};

type FormValues = {
  name: string;
};

function pickLogoStyle(index: number) {
  const variants = [
    styles.bgBlue,
    styles.bgPurple,
    styles.bgGreen,
    styles.bgOrange,
    styles.bgDark,
  ];
  return variants[index % variants.length];
}

function pickLogoLetter(name?: string) {
  if (!name || name.trim().length === 0) return "?";
  return name.trim()[0].toUpperCase();
}

export default function CompaniesPage() {
  const { register, handleSubmit, getValues, setValue } = useForm<FormValues>({
    mode: "onSubmit",
    defaultValues: { name: "" },
  });

  const [items, setItems] = useState<EmployerItem[]>([]);
  const [total, setTotal] = useState(0);

  const [page, setPage] = useState(1);
  const limit = 12;

  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canLoadMore = items.length < total;

  const fetchPage = async (nextPage: number, mode: "replace" | "append") => {
    const name = (getValues("name") ?? "").trim();

    try {
      setError(null);

      if (mode === "replace") setLoading(true);
      else setLoadingMore(true);

      const res: SearchResponse = await employerApi.search({
        name,
        page: nextPage,
        limit,
        sort: "name",
        order: "ASC",
      });

      setTotal(res.total);
      setPage(res.page);

      setItems((prev) =>
        mode === "replace" ? res.data : [...prev, ...res.data],
      );
    } catch (e: any) {
      setError(e?.message ?? "Ошибка загрузки компаний");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchPage(1, "replace");
  }, []);

  const onSubmit = async (data: FormValues) => {
    await fetchPage(1, "replace");
  };

  const onLoadMore = async () => {
    if (!canLoadMore || loadingMore || loading) return;
    await fetchPage(page + 1, "append");
  };

  const subtitle = useMemo(() => {
    if (loading) return "Загружаем компании…";
    if (error) return error;
    return "Найдите компанию своей мечты. Ищите по названию, отрасли или технологиям.";
  }, [loading, error]);

  return (
    <main className={styles.container}>
      <section className={styles.searchSection}>
        <h1>Каталог компаний</h1>
        <p className={styles.subtitle}>{subtitle}</p>

        <form className={styles.searchBar} onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.searchInputWrap}>
            <InputField
              placeholder="Например: Яндекс, FinTech или E-commerce..."
              {...register("name")}
            />
          </div>

          <div className={styles.searchBtnWrap}>
            <Button loading={loading}>Найти компанию</Button>
          </div>
        </form>
      </section>

      <div className={styles.companiesGrid}>
        {items.map((c, idx) => {
          const typeName = c.type?.name ?? "Компания";
          const verified = c.vacanciesCount > 0;

          return (
            <article key={c.id} className={styles.companyCard}>
              <div className={styles.companyHeader}>
                <div className={`${styles.companyLogo} ${pickLogoStyle(idx)}`}>
                  {pickLogoLetter(c.name)}
                </div>

                <div className={styles.companyInfo}>
                  <h3 className={styles.companyTitle}>
                    {c.name}{" "}
                    {verified && (
                      <span className={styles.verifiedBadge}>✓</span>
                    )}
                  </h3>

                  <span className={styles.companyIndustry}>{typeName}</span>
                </div>
              </div>

              <div className={styles.companyDesc}>
                {c.shortBio?.trim()
                  ? c.shortBio
                  : "Краткое описание компании пока не заполнено."}
              </div>

              <div className={styles.companyFooter}>
                {c.vacanciesCount > 0 ? (
                  <span className={styles.vacanciesCount}>
                    {c.vacanciesCount}{" "}
                    {c.vacanciesCount === 1
                      ? "вакансия"
                      : c.vacanciesCount >= 2 && c.vacanciesCount <= 4
                        ? "вакансии"
                        : "вакансий"}
                  </span>
                ) : (
                  <span className={`${styles.vacanciesCount} ${styles.empty}`}>
                    Нет открытых вакансий
                  </span>
                )}

                <Link to={`/companies/${c.id}`} className={styles.btnView}>
                  {c.vacanciesCount > 0 ? "Подробнее" : "О компании"}
                </Link>
              </div>
            </article>
          );
        })}
      </div>

      <div className={styles.loadMoreContainer}>
        <button
          type="button"
          className={styles.btnLoadMore}
          onClick={onLoadMore}
          disabled={!canLoadMore || loadingMore || loading}
        >
          {loadingMore
            ? "Загружаем…"
            : canLoadMore
              ? `Показать еще ${Math.min(limit, total - items.length)} компаний ↓`
              : "Больше компаний нет"}
        </button>
      </div>
    </main>
  );
}
