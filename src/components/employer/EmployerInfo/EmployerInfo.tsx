import {useEffect, useState} from "react";
import {mainApi} from "../../../api/mainApi/mainApi";
import {UpdateEmployerInfo} from "../../../api/employerApi/employerTypes";
import {useForm} from "react-hook-form";
import {employerApi} from "../../../api/employerApi/employerApi";
import styles from "../../../pages/candidate/CandidateEditPage/CandidateProfilePage.module.scss";
import {changeName} from "../../../redux/user/userSlice";
import {useAppDispatch} from "../../../redux/store";

type Props = {
  employerInfo: UpdateEmployerInfo;
  setEmployerInfo: (v: UpdateEmployerInfo) => void;
};

export default function EmployerInfo({ employerInfo, setEmployerInfo }: Props) {
  const dispatch = useAppDispatch();

  const [isEditing, setIsEditing] = useState(false);
  const [cities, setCities] = useState<City[]>([]);
  const [types, setTypes] = useState<EmployerType[]>([]);

  useEffect(() => {
    mainApi.getCities().then(setCities);
    mainApi.getEmployerTypes().then(setTypes);
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isDirty, isSubmitting }
  } = useForm<UpdateEmployerInfo>();

  useEffect(() => {
    reset(employerInfo);
  }, [employerInfo]);

  const onSubmit = async (values: UpdateEmployerInfo) => {

    const payload = {
      name: values.name,
      phoneNumber: values.phoneNumber,
      cityId: Number(values.cityId),
      typeId: Number(values.typeId),
    };

    await employerApi.updateEmployerInfo(payload);
    setEmployerInfo(payload);
    setIsEditing(false);
    dispatch(changeName(payload.name));
  };

  const cancel = () => {
    reset(employerInfo);
    setIsEditing(false);
  };

  return (
    <section id="info" className={styles.profileSection}>
      <div className={styles.sectionHeader}>
        <h2>Профиль компании</h2>
        <p>Эти данные будут отображаться в ваших вакансиях</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>

        <div className={styles.formGrid}>

          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label className={styles.formLabel}>Название компании</label>
            <input
              className={styles.formControl}
              disabled={!isEditing}
              {...register("name")}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Город</label>
            <select
              className={styles.formControl}
              disabled={!isEditing}
              {...register("cityId")}
            >
              <option value={0}>Выбрать город</option>
              {cities.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Индустрия</label>
            <select
              className={styles.formControl}
              disabled={!isEditing}
              {...register("typeId")}
            >
              <option value={0}>Выбрать сферу</option>
              {types.map(t => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>

        </div>

        <div className={styles.actionsRow}>
          {!isEditing ? (
            <button type="button" className={styles.btnPrimary}
                    onClick={() => setIsEditing(true)}
            >
              Редактировать
            </button>
          ) : (
            <>
              <button type="button"
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