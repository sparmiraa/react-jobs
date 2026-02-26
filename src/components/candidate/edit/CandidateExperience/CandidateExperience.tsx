import React, {useState} from "react";
import {useForm} from "react-hook-form";
import {
  CandidateExperienceResponse,
  UpdateCandidateExperience,
} from "../../../../api/candidateApi/candidateTypes";
import {candidateApi} from "../../../../api/candidateApi/candidateApi";
import styles from "../../../../pages/candidate/CandidateEditPage/CandidateProfilePage.module.scss";
import {formatPeriod, fromDateInputValue, toDateInputValue} from "../../../../utils/dateFormater";

type CandidateExperienceProps = {
  experiences: CandidateExperienceResponse[];
  setExperiences: React.Dispatch<React.SetStateAction<CandidateExperienceResponse[]>>;
};

const EMPTY_FORM: UpdateCandidateExperience = {
  companyName: "",
  title: "",
  bio: "",
  startFrom: "",
  endTo: "",
};

export default function CandidateExperience(
  {experiences, setExperiences}: CandidateExperienceProps) {
  const [editingId, setEditingId] = useState<number | "new" | null>(null);
  const isEditing = editingId !== null;

  const {
    register,
    handleSubmit,
    reset,
    formState: {isDirty, isSubmitting},
  } = useForm<UpdateCandidateExperience>({
    defaultValues: EMPTY_FORM,
  });

  const startCreate = () => {
    setEditingId("new");
    reset({
      ...EMPTY_FORM,
      startFrom: new Date().toISOString().slice(0, 10),
      endTo: "",
    });
  };

  const startEdit = (exp: CandidateExperienceResponse) => {
    setEditingId(exp.id);
    reset({
      companyName: exp.companyName ?? "",
      title: exp.title ?? "",
      bio: exp.bio ?? "",
      startFrom: toDateInputValue(exp.startFrom),
      endTo: toDateInputValue(exp.endTo),
    });
  };

  const cancel = () => {
    setEditingId(null);
    reset(EMPTY_FORM);
  };

  const onSubmit = async (values: UpdateCandidateExperience) => {
    if (!values.companyName.trim() || !values.title.trim() || !values.startFrom) return;

    const payload = {
      companyName: values.companyName.trim(),
      title: values.title.trim(),
      bio: values.bio?.trim() ?? "",
      startFrom: fromDateInputValue(values.startFrom)!,
      endTo: values.endTo === null ? null : fromDateInputValue(values.endTo),
    };

    if (editingId === "new") {
      const created = await candidateApi.createCandidateExperience(payload);
      setExperiences((prev) => [created, ...prev]);
      cancel();
      return;
    }

    const updated = await candidateApi.updateCandidateExperience(
      Number(editingId),
      payload,
    );

    setExperiences((prev) =>
      prev.map((e) => (e.id === updated.id ? updated : e)),
    );
    cancel();
  };

  const remove = async (id: number) => {
    await candidateApi.deleteCandidateExperience(id);
    setExperiences((prev) => prev.filter((e) => e.id !== id));
    if (editingId === id) cancel();
  };

  const renderForm = (submitLabel: string) => (
    <form className={styles.experienceEdit} onSubmit={handleSubmit(onSubmit)}>
      <div className={styles.experienceFormGrid}>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Компания</label>
          <input
            className={styles.formControl}
            type="text"
            placeholder='Например, "Google"'
            {...register("companyName", {required: true})}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Должность</label>
          <input
            className={styles.formControl}
            type="text"
            placeholder="Например, Software Engineer"
            {...register("title", {required: true})}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Дата начала</label>
          <input
            className={styles.formControl}
            type="date"
            {...register("startFrom", {required: true})}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Дата окончания</label>
          <input
            className={styles.formControl}
            type="date"
            {...register("endTo")}
          />
          <div className={styles.muted} style={{marginTop: 6}}>
            Оставь пустым, если работаешь сейчас
          </div>
        </div>

        <div className={`${styles.formGroup} ${styles.fullWidth}`}>
          <label className={styles.formLabel}>Описание</label>
          <textarea
            className={styles.formControl}
            placeholder="Коротко: что делал, достижения, стек..."
            {...register("bio")}
          />
        </div>
      </div>

      <div className={styles.actionsRow}>
        <button
          type="button"
          className={styles.btnSecondary}
          onClick={cancel}
          disabled={isSubmitting}
        >
          Отмена
        </button>
        <button
          type="submit"
          className={styles.btnPrimary}
          disabled={!isDirty || isSubmitting}
        >
          {isSubmitting ? "Сохранение..." : submitLabel}
        </button>
      </div>
    </form>
  );

  return (
    <section id="experience" className={styles.profileSection}>
      <div className={styles.sectionHeader}>
        <div className={styles.sectionHeaderRow}>
          <div>
            <h2>Опыт работы</h2>
            <p>Добавляй отдельные места работы, чтобы их было удобно редактировать.</p>
          </div>

        </div>
      </div>

      <div className={styles.experienceList}>
        {experiences.length === 0 && (
          <div className={styles.emptyState}>
            Пока нет опыта работы. Нажми “Добавить опыт”.
          </div>
        )}

        {experiences.map((exp) => {
          const opened = editingId === exp.id;

          return (
            <div key={exp.id} className={styles.experienceCard}>
              <div className={styles.experienceTop}>
                <div className={styles.experienceTitleBlock}>
                  <div className={styles.experienceTitle}>
                    {exp.companyName || "Без компании"} · {exp.title || "Без должности"}
                  </div>
                  <div className={styles.experienceMeta}>
                    {formatPeriod(exp.startFrom, exp.endTo)}
                  </div>
                </div>

                <div style={{display: "flex", gap: 8}}>
                  <button
                    type="button"
                    className={styles.editBtn}
                    onClick={() => startEdit(exp)}
                    disabled={isEditing && !opened}
                  >
                    Редактировать
                  </button>

                  <button
                    type="button"
                    className={styles.btnDanger}
                    onClick={() => remove(exp.id)}
                    disabled={isSubmitting}
                    title="Удалить"
                  >
                    Удалить
                  </button>
                </div>
              </div>

              {!opened ? (
                <div className={styles.experienceBody}>
                  <div className={styles.experienceBio}>
                    {exp.bio?.trim() ? exp.bio : (
                      <span className={styles.muted}>Описание не заполнено</span>
                    )}
                  </div>
                </div>
              ) : (
                renderForm("Сохранить")
              )}
            </div>
          );
        })}

        {editingId === "new" && (
          <div className={styles.experienceCard}>
            <div className={styles.experienceTop}>
              <div className={styles.experienceTitleBlock}>
                <div className={styles.experienceTitle}>Новый опыт</div>
                <div className={styles.experienceMeta}>Заполни поля и сохрани</div>
              </div>

              <button type="button" className={styles.editBtn} onClick={cancel}>
                Закрыть
              </button>
            </div>

            {renderForm("Создать")}
          </div>
        )}

        {editingId === null && (
          <div className={styles.actionsRow} style={{marginTop: 16}}>
            <button
              type="button"
              className={styles.btnPrimary}
              onClick={startCreate}
              disabled={isEditing}
            >
              + Добавить опыт
            </button>
          </div>
        )}
      </div>
    </section>
  );
}