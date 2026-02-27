import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import styles from "./VacancyUpsertPage.module.scss";

import InputField from "../../../components/common/InputField/InputField";
import SkillPill from "../../../components/common/SkillPill/SkillPill";

import { vacancyApi } from "../../../api/vacancyApi/vacancyApi";
import type { VacancyUpsertDto } from "../../../api/vacancyApi/vacancyTypes";
import { mainApi } from "../../../api/mainApi/mainApi";
import type { City, Skill } from "../../../api/mainApi/mainTypes";

type Props = {
  mode: "create" | "edit";
};

type FormValues = {
  title: string;
  cityId: number | null;
  salaryFrom: number | null;
  salaryTo: number | null;
  requiredText: string;
  plusText: string;
  responsibilities: string;
  assumptions: string;
  skillIds: number[];
  isActive: boolean;
};

function asNullableNumber(v: unknown): number | null {
  const n = Number(v);
  if (!Number.isFinite(n) || n === 0) return null;
  return n;
}

export default function VacancyUpsertPage({ mode }: Props) {
  const nav = useNavigate();
  const { id } = useParams();
  const vacancyId = mode === "edit" ? Number(id) : null;

  const [cities, setCities] = useState<City[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(false);

  const {
    register,
    setValue,
    watch,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
    reset,
  } = useForm<FormValues>({
    defaultValues: {
      title: "",
      cityId: null,
      salaryFrom: null,
      salaryTo: null,
      requiredText: "",
      plusText: "",
      responsibilities: "",
      assumptions: "",
      skillIds: [],
      isActive: false,
    },
  });

  const selectedSkillIds = watch("skillIds");
  const isActive = watch("isActive");

  useEffect(() => {
    (async () => {
      const [citiesRes, skillsRes] = await Promise.all([
        mainApi.getCities(),
        mainApi.getSkills(),
      ]);
      setCities(citiesRes);
      setSkills(skillsRes);
    })();
  }, []);

  useEffect(() => {
    if (mode !== "edit" || !vacancyId) return;

    (async () => {
      setLoading(true);
      try {
        const v = await vacancyApi.getByIdForEdit(vacancyId);

        reset({
          title: v.title ?? "",
          cityId: v.city_id ?? null,
          salaryFrom: v.salary_from ?? null,
          salaryTo: v.salary_to ?? null,
          requiredText: v.required_text ?? "",
          plusText: v.plus_text ?? "",
          responsibilities: v.responsibilities ?? "",
          assumptions: v.assumptions ?? "",
          skillIds: v.skills ?? [],
          isActive: Boolean(v.is_active),
        });
      } finally {
        setLoading(false);
      }
    })();
  }, [mode, vacancyId, reset]);

  const pageTitle = useMemo(
    () => (mode === "edit" ? "Редактирование вакансии" : "Создание вакансии"),
    [mode]
  );

  function toggleSkill(skillId: number, checked: boolean) {
    const current = new Set(selectedSkillIds ?? []);
    if (checked) current.add(skillId);
    else current.delete(skillId);
    setValue("skillIds", Array.from(current), { shouldDirty: true });
  }

  async function onSubmit(values: FormValues) {
    const dto: VacancyUpsertDto = {
      title: values.title.trim(),
      cityId: values.cityId ?? null,
      salaryFrom: values.salaryFrom ?? null,
      salaryTo: values.salaryTo ?? null,
      requiredText: values.requiredText?.trim() || null,
      plusText: values.plusText?.trim() || null,
      responsibilities: values.responsibilities?.trim() || null,
      assumptions: values.assumptions?.trim() || null,
      skillIds: values.skillIds ?? [],
    };

    if (mode === "create") {
      await vacancyApi.create(dto);
      nav("/employer/vacancies");
      return;
    }

    if (!vacancyId) return;

    await vacancyApi.update(vacancyId, dto);
    await vacancyApi.changeStatus(vacancyId, Boolean(values.isActive));
    nav("/employer/vacancies");
  }

  return (
    <main className={styles.container}>
      <div className={styles.topNavigation}>
        <Link to="/employer/vacancies" className={styles.backBtn}>
          <span>←</span> Назад к списку вакансий
        </Link>
      </div>

      <h1 className={styles.pageTitle}>{pageTitle}</h1>

      {loading && <div className={styles.loading}>Загрузка...</div>}

      <form onSubmit={handleSubmit(onSubmit)}>
        <section className={styles.formSection}>
          <div className={styles.sectionHeader}>
            <h2>Основная информация</h2>
          </div>

          <div className={styles.formGrid}>
            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <InputField
                label="Заголовок вакансии"
                placeholder="Например: Senior Backend Engineer"
                {...register("title", { required: "Укажите заголовок" })}
                error={errors.title?.message}
                needMargin={false}
              />
            </div>

            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label className={styles.formLabel}>Уровень дохода</label>
              <div className={styles.salaryInputs}>
                <input
                  className={styles.formControl}
                  type="number"
                  placeholder="От"
                  {...register("salaryFrom", { setValueAs: asNullableNumber })}
                />
                <span>—</span>
                <input
                  className={styles.formControl}
                  type="number"
                  placeholder="До"
                  {...register("salaryTo", { setValueAs: asNullableNumber })}
                />
              </div>
            </div>

            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label className={styles.formLabel}>Город</label>
              <select
                className={styles.formControl}
                {...register("cityId", {
                  setValueAs: (v) => (v ? Number(v) : null),
                })}
              >
                <option value="">Не выбран</option>
                {cities.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        <section className={styles.formSection}>
          <div className={styles.sectionHeader}>
            <h2>Требования к кандидату</h2>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              Ключевые навыки (для фильтров)
            </label>
            <span className={styles.formHint}>
              Отметь навыки, которые важны для вакансии.
            </span>

            <div className={styles.skillsGrid}>
              {skills.map((s) => {
                const checked = (selectedSkillIds ?? []).includes(s.id);
                return (
                  <SkillPill
                    key={s.id}
                    name={s.name}
                    checked={checked}
                    onChange={(val) => toggleSkill(s.id, val)}
                  />
                );
              })}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              Необходимые навыки и опыт
            </label>
            <textarea
              className={styles.formControl}
              placeholder="Что обязательно..."
              {...register("requiredText")}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Будет плюсом</label>
            <textarea
              className={styles.formControl}
              placeholder="Что желательно..."
              {...register("plusText")}
            />
          </div>
        </section>

        <section className={styles.formSection}>
          <div className={styles.sectionHeader}>
            <h2>Задачи и Условия</h2>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Обязанности</label>
            <textarea
              className={styles.formControl}
              placeholder="Перечислите задачи..."
              {...register("responsibilities")}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Условия</label>
            <textarea
              className={styles.formControl}
              placeholder="График, бонусы..."
              {...register("assumptions")}
            />
          </div>
        </section>

        {mode === "edit" && (
          <section className={styles.formSection}>
            <div className={styles.sectionHeader}>
              <h2>Настройки публикации</h2>
            </div>

            <div className={styles.settingsRow}>
              <div className={styles.settingsInfo}>
                <h4>Вакансия активна</h4>
                <p>
                  Кандидаты видят вакансию в поиске и могут откликаться. Если
                  выключить — вакансия уйдет в архив.
                </p>
              </div>

              <label className={styles.toggleSwitch}>
                <input type="checkbox" {...register("isActive")} />
                <span className={styles.slider} />
              </label>
            </div>
          </section>
        )}

        <div className={styles.saveBar}>
          <div className={styles.saveBarContent}>
            <div className={styles.saveStatus}>
              {isSubmitting
                ? "Сохраняю..."
                : isDirty
                ? "Есть несохраненные изменения"
                : mode === "edit"
                ? isActive
                  ? "Активна"
                  : "В архиве"
                : "Черновик"}
            </div>

            <button
              className={styles.btnSave}
              type="submit"
              disabled={isSubmitting}
            >
              {mode === "edit" ? "Опубликовать изменения" : "Создать вакансию"}
            </button>
          </div>
        </div>
      </form>
    </main>
  );
}
