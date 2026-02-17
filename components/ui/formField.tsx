import { Input } from "./input";
import { Label } from "./label";
import { Textarea } from "./textarea";
import { useField } from "formik";
import { cn } from "@/lib/utils";

interface FormFieldProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "name"> {
  label: string;
  name: string;
  required?: boolean;
  className?: string;
  labelClassName?: string;
  inputClassName?: string;
  placeholder?: string;
  as?: "input" | "textarea";
  rows?: number;
  onBlurCapture?: () => void;
}

export const FormField = ({
  label,
  required,
  name,
  className,
  labelClassName,
  inputClassName,
  placeholder,
  as = "input",
  rows,
  onBlurCapture,
  ...rest
}: FormFieldProps) => {
  const [field, meta] = useField(name);

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={name} className={labelClassName}>
        {label} {required && " *"}
      </Label>
      {as === "textarea" ? (
        <Textarea
          id={name}
          className={inputClassName}
          value={field.value ?? ""}
          onChange={field.onChange}
          onBlur={field.onBlur}
          placeholder={placeholder}
          rows={rows}
          {...(rest as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : (
        <Input
          id={name}
          className={inputClassName}
          value={field.value ?? ""}
          onChange={field.onChange}
          onBlur={field.onBlur}
          onBlurCapture={onBlurCapture}
          placeholder={placeholder}
          {...rest}
        />
      )}
      {meta.touched && meta.error && (
        <p className="text-sm text-destructive">{meta.error}</p>
      )}
    </div>
  );
};
