import { Outlet } from "react-router-dom";
import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import styles from "./MainLayout.module.scss"

export default function MainLayout() {
  return (
    <div className={styles.wrapper}>
      <Header />

      <div className={styles.content}>
        <Outlet />
      </div>

      <Footer />
    </div>
  );
}
