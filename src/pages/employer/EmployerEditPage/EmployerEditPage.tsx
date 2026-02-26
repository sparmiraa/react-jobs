import React, {useEffect, useState} from 'react';
import {employerApi} from "../../../api/employerApi/employerApi";
import {UpdateEmployerBio, UpdateEmployerInfo} from "../../../api/employerApi/employerTypes";
import styles from "../../candidate/CandidateEditPage/CandidateProfilePage.module.scss";
import EmployerInfo from "../../../components/employer/EmployerInfo/EmployerInfo";
import EmployerBio from "../../../components/employer/EmployerBio/EmployerBio";

export default function EmployerEditPage() {

  const [employerInfo, setEmployerInfo] = useState<UpdateEmployerInfo>({} as UpdateEmployerInfo);

  const [employerBio, setEmployerBio] = useState<UpdateEmployerBio>({} as UpdateEmployerBio);

  useEffect(() => {
    const fetchEmployer = async () => {
      const responseDto = await employerApi.getCurrentEmployerProfile();

      setEmployerInfo({
        name: responseDto.name ?? "",
        phoneNumber: responseDto.phoneNumber ?? "",
        cityId: responseDto.city_id ?? 0,
        typeId: responseDto.type_id ?? 0,
      });

      setEmployerBio({
        employeesCount: responseDto.employeesCount ?? "",
        shortBio: responseDto.shortBio ?? "",
        bio: responseDto.bio ?? "",
      });
    };

    fetchEmployer();
  }, []);

  return (
    <div className={styles.container}>
      <aside className={styles.pageNav}>
        <ul className={styles.pageNavList}>
          <li><a href="#info" className={`${styles.pageNavLink} ${styles.active}`}>Основная информация</a></li>
          <li><a href="#about" className={styles.pageNavLink}>О компании</a></li>
        </ul>
      </aside>

      <main className={styles.main}>
        <div className={styles.form}>
          <EmployerInfo
            employerInfo={employerInfo}
            setEmployerInfo={setEmployerInfo}
          />

          <EmployerBio
            employerBio={employerBio}
            setEmployerBio={setEmployerBio}
          />
        </div>
      </main>
    </div>
  );
}
