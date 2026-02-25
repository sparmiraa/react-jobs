import styles from "./FullScreenLoader.module.scss";

export default function FullScreenLoader() {
  return (
    <div className={styles.fullscreen}>
      <div className={styles.spinner} />
    </div>
  );
}