import React, {useEffect, useState} from 'react';
import {UpdateCandidateBio} from "../../../../api/candidateApi/candidateTypes";
import {mainApi} from "../../../../api/mainApi/mainApi";
import {candidateApi} from "../../../../api/candidateApi/candidateApi";
import {useForm} from "react-hook-form";
import styles from "../../../../pages/candidate/CandidateEditPage/CandidateProfilePage.module.scss";

type CandidateBioProps = {
  candidateBio: UpdateCandidateBio,
  setCandidateBio: React.Dispatch<React.SetStateAction<UpdateCandidateBio>>
}

export default function CandidateBio({candidateBio, setCandidateBio}: CandidateBioProps) {

  const [skills, setSkills] = useState<Skill[]>([]);
  const [isBioEditing, setIsBioEditing] = useState(false);

  useEffect(() => {
    const fetchMain = async () => {
      const skillsResponseDto = await mainApi.getSkills();
      setSkills(skillsResponseDto);
    }
    fetchMain();
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: {isDirty, isSubmitting},
  } = useForm<UpdateCandidateBio>();
  useEffect(() => {
    reset(candidateBio)
  }, [candidateBio]);

  const selectedSkills = watch("skillsId") ?? [];
  const toggleSkill = (skillId: number, checked: boolean) => {
    const next = checked
      ? Array.from(new Set([...(selectedSkills ?? []), skillId]))
      : (selectedSkills ?? []).filter((id) => id !== skillId);

    setValue("skillsId", next, {shouldDirty: true});
  };

  const onSubmitBio = async (values: UpdateCandidateBio) => {
    const payload: UpdateCandidateBio = {
      bio: values.bio,
      salaryFrom: Number(values.salaryFrom),
      salaryTo: Number(values.salaryTo),
      skillsId: values.skillsId ?? [],
    };

    await candidateApi.updateCandidateBio(payload);
    setCandidateBio({
      bio: payload.bio,
      salaryFrom: payload.salaryFrom,
      salaryTo: payload.salaryTo,
      skillsId: payload.skillsId,
    });
    setIsBioEditing(false);
  };

  const cancelBioEdit = () => {
    if (!candidateBio) return;
    reset(candidateBio);
    setIsBioEditing(false);
  };

  return (
    <section id="bio" className={styles.profileSection}>
      <div className={styles.sectionHeader}>
        <h2>Профессиональный профиль</h2>
        <p>Опишите свой опыт простыми словами.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmitBio)}>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Зарплатные ожидания (₽)</label>
          <div className={styles.salaryRow}>
            <input
              className={styles.formControl}
              type="number"
              placeholder="От"
              disabled={!isBioEditing}
              {...register("salaryFrom", {
                setValueAs: (v) => (v === "" ? "" : Number(v)),
              })}
            />
            <input
              className={styles.formControl}
              type="number"
              placeholder="До"
              disabled={!isBioEditing}
              {...register("salaryTo", {
                setValueAs: (v) => (v === "" ? "" : Number(v)),
              })}
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Ключевые навыки</label>

          <div className={styles.skillsList}>
            {skills.map((s) => {
              const checked = selectedSkills.includes(s.id);

              return (
                <label
                  key={s.id}
                  className={`${styles.skillPill} ${
                    checked ? styles.skillPillActive : ""
                  } ${!isBioEditing ? styles.skillPillDisabled : ""}`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    disabled={!isBioEditing}
                    onChange={(e) => toggleSkill(s.id, e.target.checked)}
                  />
                  <span>{s.name}</span>
                </label>
              );
            })}
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Коротко о себе</label>
          <textarea
            className={styles.formControl}
            placeholder="Напишите пару абзацев о себе..."
            disabled={!isBioEditing}
            {...register("bio")}
          />
        </div>

        <div className={styles.actionsRow}>
          {!isBioEditing ? (
            <button
              type="button"
              className={styles.btnPrimary}
              onClick={() => setIsBioEditing(true)}
            >
              Редактировать
            </button>
          ) : (
            <>
              <button
                type="button"
                className={styles.btnSecondary}
                onClick={cancelBioEdit}
                disabled={isSubmitting}
              >
                Отмена
              </button>

              <button
                type="submit"
                className={styles.btnPrimary}
                disabled={!isDirty || isSubmitting}
              >
                {isSubmitting ? "Сохранение..." : "Сохранить"}
              </button>
            </>
          )}
        </div>
      </form>
    </section>
  );
}

