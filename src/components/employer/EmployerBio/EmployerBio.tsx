import { UpdateEmployerBio } from "../../../api/employerApi/employerTypes";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { employerApi } from "../../../api/employerApi/employerApi";
import styles from "../../../pages/candidate/CandidateEditPage/CandidateProfilePage.module.scss";

type Props = {
  employerBio: UpdateEmployerBio;
  setEmployerBio: (v: UpdateEmployerBio) => void;
};

export default function EmployerBio({ employerBio, setEmployerBio }: Props) {
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isDirty, isSubmitting },
  } = useForm<UpdateEmployerBio>();
  useEffect(() => {
    reset(employerBio);
  }, [employerBio]);

  const onSubmit = async (values: UpdateEmployerBio) => {
    console.log(values);
    await employerApi.updateEmployerBio(values);

    setEmployerBio(values);
    setIsEditing(false);
  };

  const cancel = () => {
    reset(employerBio);
    setIsEditing(false);
  };

  return (
    <section id="about" className={styles.profileSection}>
      <div className={styles.sectionHeader}>
        <h2>Информация о компании</h2>
        <p>Расскажите кандидатам о вашей миссии</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={`${styles.formGroup} ${styles.fullWidth}`}>
          <label className={styles.formLabel}>Количество работников</label>
          <input
            type={"number"}
            className={styles.formControl}
            disabled={!isEditing}
            placeholder="Например: 50"
            {...register("employeesCount", {
              setValueAs: (v) => (v === "" || v === null ? null : Number(v)),
            })}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Короткое описание</label>
          <textarea
            placeholder="Небольшое описание о компании, до 120 символов"
            className={styles.formControl}
            disabled={!isEditing}
            {...register("shortBio")}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Подробное описание</label>
          <textarea
            placeholder="Подробное описание компании, до 1000 символов"
            className={styles.formControl}
            disabled={!isEditing}
            {...register("bio")}
          />
        </div>

        <div className={styles.actionsRow}>
          {!isEditing ? (
            <button
              type="button"
              className={styles.btnPrimary}
              onClick={() => setIsEditing(true)}
            >
              Редактировать
            </button>
          ) : (
            <>
              <button
                type="button"
                className={styles.btnSecondary}
                onClick={cancel}
              >
                Отмена
              </button>

              <button
                type="submit"
                className={styles.btnPrimary}
                disabled={!isDirty || isSubmitting}
              >
                Сохранить
              </button>
            </>
          )}
        </div>
      </form>
    </section>
  );
}
