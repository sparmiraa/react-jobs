import styles from "./InputField.module.scss";
import React from "react";

type Props = {
    needMargin?: boolean;
    label?: string;
    error?: string;
    headerRight?: React.ReactNode;
} & React.InputHTMLAttributes<HTMLInputElement>;

export default function InputField({label, error, headerRight, needMargin = true, ...props}: Props) {
    return (
        <div className={needMargin ? styles.inputGroup : ""}>
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
