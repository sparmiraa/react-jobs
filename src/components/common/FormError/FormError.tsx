import styles from "./FormError.module.scss"

type Props = {
  message?: string;
};

export default function FormError({ message }: Props) {
  if (!message) return null;

  return <div className={styles.error}> ⚠ {message}</div>;
}
