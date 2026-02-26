import styles from "./CandidateProfilePage.module.scss";
import {useEffect, useState} from "react";
import {candidateApi} from "../../../api/candidateApi/candidateApi";
import {
  CandidateExperienceResponse,
  UpdateCandidateBio,
  UpdateCandidateInfo
} from "../../../api/candidateApi/candidateTypes";
import CandidateInfo from "../../../components/candidate/edit/CandidateInfo/CandidateInfo";
import CandidateBio from "../../../components/candidate/edit/CandidateBio/CandidateBio";
import CandidateExperience from "../../../components/candidate/edit/CandidateExperience/CandidateExperience";
import {toDateInputValue} from "../../../utils/dateFormater";


export default function CandidateProfilePage() {

  const [candidateInfo, setCandidateInfo] = useState<UpdateCandidateInfo>({} as UpdateCandidateInfo);
  const [candidateBio, setCandidateBio] = useState<UpdateCandidateBio>({} as UpdateCandidateBio);
  const [experiences, setExperiences] = useState<CandidateExperienceResponse[]>([] as CandidateExperienceResponse[]);
  const [isActive, setIsActive] = useState<boolean>();

  useEffect(() => {
    const fetchCandidate = async () => {
      const responseDto = await candidateApi.getCurrentCandidateProfile();
      const candidateInfoPart = {
        name: responseDto.name ?? "",
        phoneNumber: responseDto.phoneNumber ?? "",
        birthday: toDateInputValue(responseDto.birthday) ?? "",
        cityId: responseDto.city_id ?? 0,
      };
      setCandidateInfo(candidateInfoPart);

      const candidateBioPart = {
        bio: responseDto.bio ?? "",
        salaryFrom: responseDto.salary_from ?? "",
        salaryTo: responseDto.salary_to ?? "",
        skillsId: responseDto.skillsId ?? [],
      };
      setCandidateBio(candidateBioPart);
      setExperiences(responseDto.experience);
      setIsActive(responseDto.is_active)
    };
    fetchCandidate();
  }, []);

  const handleToggleActive = async (checked: boolean) => {
    setIsActive(checked);
    await candidateApi.changeActiveStatus(checked);
  };

  return (
    <div className={styles.container}>
      <aside className={styles.pageNav}>
        <ul className={styles.pageNavList}>
          <li>
            <a href="#info" className={`${styles.pageNavLink} ${styles.active}`}>
              Личные данные
            </a>
          </li>
          <li>
            <a href="#bio" className={styles.pageNavLink}>
              Резюме и Навыки
            </a>
          </li>
          <li>
            <a href="#settings" className={styles.pageNavLink}>
              Настройки аккаунта
            </a>
          </li>
        </ul>
      </aside>

      <main className={styles.main}>
        <div className={styles.form}>
          <CandidateInfo candidateInfo={candidateInfo} setCandidateInfo={setCandidateInfo}/>
          <CandidateBio candidateBio={candidateBio} setCandidateBio={setCandidateBio}/>
          <CandidateExperience experiences={experiences} setExperiences={setExperiences}/>
          <section id="settings" className={styles.profileSection}>
            <div className={styles.sectionHeader}>
              <h2>Настройки аккаунта</h2>
              <p>Управление видимостью вашего профиля.</p>
            </div>

            <div className={styles.settingsRow}>
              <div className={styles.settingsInfo}>
                <h4>Активен в поиске работы</h4>
                <p>Ваше резюме будет видно работодателям. Если выключить, вы скроете профиль.</p>
              </div>

              <label className={styles.toggleSwitch}>
                <input
                  type="checkbox"
                  checked={!!isActive}
                  onChange={(e) => handleToggleActive(e.target.checked)}
                />
                <span className={styles.slider}/>
              </label>
            </div>
          </section>

          <section className={`${styles.profileSection} ${styles.dangerZone}`}>
            <div className={styles.settingsRow}>
              <div className={styles.settingsInfo}>
                <h4 className={styles.dangerTitle}>Удалить аккаунт</h4>
                <p>Все ваши данные и отклики будут навсегда удалены.</p>
              </div>

              <button type="button" className={styles.btnDanger}>
                Удалить профиль
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}