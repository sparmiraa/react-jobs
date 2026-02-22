import styles from "./InfoCard.module.scss";

type InfoCardProps = {
  title: string;
  content: string;
};

export default function InfoCard({ title, content }: InfoCardProps) {
  return (
    <div className={styles.infoCard}>
      <h2>{title}</h2>
      <p>{content}</p>
    </div>
  );
}
