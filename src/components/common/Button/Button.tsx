import styles from "./Button.module.scss"
import React from "react";

type Props = {
  loading?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({ loading, children, ...props }: Props) {
  return (
    <button className={styles.btnSubmit} {...props} disabled={loading || props.disabled}>
      {loading ? "Загрузка..." : children}
    </button>
  );
}
