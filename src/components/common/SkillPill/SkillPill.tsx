import styles from "./SkillPill.module.scss";

type Props = {
  name: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (checked: boolean) => void;
};

export default function SkillPill({
  name,
  checked,
  disabled,
  onChange,
}: Props) {
  return (
    <label
      className={[
        styles.skillPill,
        checked ? styles.skillPillActive : "",
        disabled ? styles.skillPillDisabled : "",
      ].join(" ")}
    >
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span>{name}</span>
    </label>
  );
}
