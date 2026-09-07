import type { ReactNode } from "react";

import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";

interface AuthFieldProps extends React.ComponentProps<"input"> {
  name: string;
  label: string;
  error?: string;
  action?: ReactNode;
}

export function AuthField({
  name,
  label,
  error,
  action,
  ...props
}: AuthFieldProps) {
  return (
    <div className="mb-3.5">
      <div className="mb-2 flex items-center justify-between gap-2.5">
        <Label htmlFor={name}>{label}</Label>
        {action}
      </div>
      <Input id={name} name={name} aria-invalid={Boolean(error)} {...props} />
      {error && (
        <p
          role="alert"
          className="mt-1.5 text-xs font-semibold text-destructive"
        >
          {error}
        </p>
      )}
    </div>
  );
}
