import {Outlet} from "react-router-dom";
import Footer from "../../components/common/Footer/Footer";
import Header from "../../components/common/Header/Header";
import styles from "./MainLayout.module.scss"

export default function MainLayout() {
  return (
    <div className={styles.wrapper}>
      <Header/>

      <div className={styles.content}>
        <Outlet/>
      </div>

      <Footer/>
    </div>
  );
}
