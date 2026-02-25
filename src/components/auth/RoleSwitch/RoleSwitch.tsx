import React from 'react';
import styles from "./RoleSwith.module.scss";
import {Link} from "react-router-dom";
import {AuthFormModeType} from "../types";
import {page} from "../../../constants/page";

type RoleSwitch = {
  mode: AuthFormModeType;
}

export default function RoleSwitch({mode}: RoleSwitch) {
  return (
    <div className={styles.roleSwitch}>
      {
        mode === "login" && (
          <>
            Впервые на JobSpace?
            <div className={styles.registerLinks}>
              <Link to={page.candidateRegistration}>Я ищу работу</Link>
              <Link to={page.employerRegistration}>Я ищу сотрудников</Link>
            </div>
          </>
        )}
      {
        mode === "employer" && (
          <>
            Вы ищете работу?
            <div className={styles.registerLinks}>
              <Link to={page.candidateRegistration}>Зарегистрироваться как
                кандидат</Link>
            </div>
          </>
        )
      }
      {
        mode === "candidate" && (
          <>
            Вы ищете сотрудников?
            <div className={styles.registerLinks}>
              <Link to={page.employerRegistration}>Зарегистрировать
                компанию</Link>
            </div>
          </>
        )
      }
    </div>
  );
};
