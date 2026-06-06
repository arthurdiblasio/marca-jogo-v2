import { ReactNode } from "react";
import { Label } from "./label";


interface FormFieldProps {
  label: string;
  htmlFor: string;

  error?: string;

  description?: string;

  children: ReactNode;
}

export function FormField({
  label,
  htmlFor,
  error,
  description,
  children,
}: FormFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={htmlFor}>
        {label}
      </Label>

      {children}

      {description && !error && (
        <p className="text-xs text-slate-500">
          {description}
        </p>
      )}

      {error && (
        <p className="text-xs font-medium text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}