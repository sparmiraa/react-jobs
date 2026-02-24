import styles from "./InputField.module.scss";
import React from "react";

type Props = {
  label?: string;
  error?: string;
  headerRight?: React.ReactNode;
} & React.InputHTMLAttributes<HTMLInputElement>;

export default function InputField({label, error, headerRight, ...props}: Props) {
  return (
    <div className={styles.inputGroup}>
      {(label || headerRight) && (
        <div className={styles.inputHeader}>
          {label && <label>{label}</label>}
          {headerRight}
        </div>
      )}

      <input {...props} />

      {error && <div className={styles.error}>{error}</div>}
    </div>
  );
}
