import { useForm, FieldValues } from "react-hook-form";
import InputField from "../../common/InputField/InputField";
import Button from "../../common/Button/Button";
import FormError from "../../common/FormError/FormError";
import { applyServerErrors } from "../../../utils/applyServerErrors";
import { Props } from "./AuthFormTypes";

export default function AuthForm<T extends FieldValues>({
  fields,
  submitText,
  onSubmit,
}: Props<T>) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting, touchedFields },
  } = useForm<T>({
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const submitHandler = async (data: T) => {
    try {
      await onSubmit(data);
    } catch (e) {
      applyServerErrors(e, setError);
    }
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)}>
      <FormError message={errors.root?.message as string} />

      <div style={{ marginBottom: "30px" }}>
        {fields.map((field) => (
          <InputField
            key={field.name}
            type={field.type || "text"}
            label={field.label}
            headerRight={field.headerRight}
            placeholder={field.placeholder}
            {...register(field.name as any, field.validation)}
            error={
              touchedFields[field.name as keyof typeof touchedFields]
                ? (errors as any)[field.name]?.message
                : undefined
            }
          />
        ))}
      </div>
      <Button loading={isSubmitting}>{submitText}</Button>
    </form>
  );
}
