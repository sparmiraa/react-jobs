import React, {useEffect, useState} from 'react';
import styles from "../../../../pages/candidate/CandidateEditPage/CandidateProfilePage.module.scss";
import {useAppDispatch} from "../../../../redux/store";
import {UpdateCandidateInfo} from "../../../../api/candidateApi/candidateTypes";
import {candidateApi} from "../../../../api/candidateApi/candidateApi";
import {changeName} from "../../../../redux/user/userSlice";
import {useForm} from "react-hook-form";
import {mainApi} from "../../../../api/mainApi/mainApi";
import {toDateInputValue} from "../../../../utils/dateFormater";

type CandidateInfoProps = {
  candidateInfo: UpdateCandidateInfo,
  setCandidateInfo: React.Dispatch<React.SetStateAction<UpdateCandidateInfo>>
}

export default function CandidateInfo({candidateInfo, setCandidateInfo}: CandidateInfoProps) {
  const dispatch = useAppDispatch();

  const [isInfoEditing, setIsInfoEditing] = useState(false);
  const [cities, setCities] = useState<City[]>([]);

  useEffect(() => {
    const fetchMain = async () => {
      const citiesResponseDto = await mainApi.getCities();
      setCities(citiesResponseDto);
    }
    fetchMain();
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: {isDirty, isSubmitting},
  } = useForm<UpdateCandidateInfo>();
  useEffect(() => {
    reset(candidateInfo)
  }, [candidateInfo]);

  const onSubmitCandidateInfo = async (values: UpdateCandidateInfo) => {
    const payload: UpdateCandidateInfo = {
      name: values.name,
      phoneNumber: values.phoneNumber,
      cityId: Number(values.cityId),
      birthday: toDateInputValue(values.birthday),
    };

    await candidateApi.updateCandidateInfo(payload);
    setCandidateInfo({
      name: payload.name,
      phoneNumber: payload.phoneNumber,
      cityId: payload.cityId,
      birthday: payload.birthday,
    });
    setIsInfoEditing(false);
    dispatch(changeName(payload.name));
  };

  const cancelInfoEdit = () => {
    if (!candidateInfo) return;
    reset(candidateInfo);
    setIsInfoEditing(false);
  };

  return (
    <section id="info" className={styles.profileSection}>
      <div className={styles.sectionHeader}>
        <h2>Личные данные</h2>
        <p>Основная информация, которую увидят работодатели.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmitCandidateInfo)}>
        <div className={styles.formGrid}>
          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label className={styles.formLabel}>Имя и Фамилия</label>
            <input
              className={styles.formControl}
              type="text"
              placeholder={"Введите имя"}
              disabled={!isInfoEditing}
              {...register("name")}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Телефон</label>
            <input
              className={styles.formControl}
              type="tel"
              placeholder="+7 (999) 000-00-00"
              disabled={!isInfoEditing}
              {...register("phoneNumber")}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Дата рождения</label>
            <input
              className={styles.formControl}
              type="date"
              disabled={!isInfoEditing}
              {...register("birthday")}
            />
          </div>

          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label className={styles.formLabel}>Город</label>
            <select
              className={styles.formControl}
              disabled={!isInfoEditing}
              {...register("cityId")}
            >
              <option value={"0"} disabled>
                Выбрать город
              </option>
              {cities.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.actionsRow}>
          {!isInfoEditing ? (
            <button
              type="button"
              className={styles.btnPrimary}
              onClick={() => setIsInfoEditing(true)}
            >
              Редактировать
            </button>
          ) : (
            <>
              <button
                type="button"
                className={styles.btnSecondary}
                onClick={cancelInfoEdit}
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
};
