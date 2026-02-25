import { ReactNode } from "react";
import { FieldValues } from "react-hook-form";


type FieldConfig = {
  name: string;
  label?: string;
  type?: string;
  placeholder?: string;
  headerRight?: ReactNode;
  validation?: any;
};

export type Props<T extends FieldValues> = {
  fields: FieldConfig[];
  submitText: string;
  onSubmit: (data: T) => Promise<void>;
};
