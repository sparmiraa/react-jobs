import {Outlet} from "react-router-dom";
import Footer from "../../components/common/Footer/Footer";
import Header from "../../components/common/Header/Header";
import styles from "./MainLayout.module.scss"
import { useAppSelector } from "../../redux/store";

export default function MainLayout() {
  const user = useAppSelector((s) => s.auth.user);
  return (
    <div className={styles.wrapper}>
      <Header user={user} />

      <div className={styles.content}>
        <Outlet/>
      </div>

      <Footer/>
    </div>
  );
}
