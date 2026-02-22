import { Link } from "react-router-dom";
import StatCard from "../../components/StatCard/StatCard";
import InfoCard from "../../components/InfoCard/InfoCard";
import styles from "./Home.module.scss";

export default function Home() {
  return (
    <>
      <section className={styles.hero}>
        <div className="container">
          <h1>
            Найди работу или сотрудника <span>без лишней воды</span>
          </h1>
          <p>
            Простые текстовые резюме, прозрачные требования и быстрый коннект
            между компаниями и талантами. Никаких сложных файлов, только то, что
            важно.
          </p>
          <div className={styles.heroButtons}>
            <Link to="/" className="btnLarge btnPrimary">
              Найти работу
            </Link>
            <Link to="/" className="btnLarge btnOutline">
              Разместить вакансию
            </Link>
          </div>
        </div>
      </section>

      <section className={styles.statsSection}>
        <div className={`container ${styles.stats}`}>
          <StatCard number={"150+"} label={"Компаний доверяют нам"} />
          <StatCard number={"430"} label={"Активных вакансий"} />
          <StatCard number={"1,200+"} label={"Специалистов нашли работу"} />
        </div>
      </section>

      <section className={styles.HIWSection}>
        <div className={`container ${styles.howItWorks}`}>
          <InfoCard
            title={"Для кандидатов"}
            content={
              "Забудьте о сложных многостраничных PDF-файлах. Заполните короткий профиль, укажите ваш опыт, желаемую зарплату и выделите свои ключевые навыки тегами. Всё остальное мы берем на себя."
            }
          />

          <InfoCard
            title={"Для работодателей"}
            content={
              "Никакого спама и нерелевантных откликов. Публикуйте вакансии списком четких требований. Удобные фильтры помогут найти тех, кто идеально впишется в вашу команду."
            }
          />
        </div>
      </section>
    </>
  );
}
