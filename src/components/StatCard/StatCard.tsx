import styles from "./StatCard.module.scss";

type StatCardProps = {
  number: string;
  label: string;
};

export default function StatCard({ number, label }: StatCardProps) {
  return (
    <div className={styles.statCard}>
      <div className={styles.statNumber}>{number}</div>
      <div className={styles.statLabel}>{label}</div>
    </div>
  );
}
