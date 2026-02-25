import {Outlet, Link, useLocation, Navigate} from "react-router-dom";
import styles from "./AuthLayout.module.scss";
import RoleSwitch from "../../components/auth/RoleSwitch/RoleSwitch";
import SideImage from "../../components/auth/SideImage/SideImage";
import {page} from "../../constants/page";
import {AuthFormModeType} from "../../components/auth/types";
import {accessTokenService} from "../../services/localStorage/accessTokenService";

export default function AuthLayout() {
  if (accessTokenService.isExists()) {
    return <Navigate to={page.home}/>
  }

  const location = useLocation();

  const extractFormModeFromPath = (): AuthFormModeType => {
    if (location.pathname.includes("candidate")) return "candidate";
    if (location.pathname.includes("employer")) return "employer";
    return "login";
  }

  const mode = extractFormModeFromPath();

  return (
    <div className={styles.authLayout}>
      <div className={styles.formSide}>
        <div className={styles.formHeader}>
          <Link to={page.home} className={styles.logo}>
            JobSpace
          </Link>
        </div>
        <div className={styles.formWrapper}>
          <Outlet/>
        </div>
        <RoleSwitch mode={mode}/>
      </div>
      <SideImage mode={mode}/>
    </div>
  );
}
