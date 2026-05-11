"use client";

import type { FormHTMLAttributes, ReactNode } from "react";

interface FormProps extends FormHTMLAttributes<HTMLFormElement> {
  children: ReactNode;
  onSubmit: (e?: React.BaseSyntheticEvent) => void | Promise<void>;
  title?: string;
  description?: string;
}

export default function Form({
  children,
  onSubmit,
  title,
  description,
  className = "",
  ...props
}: FormProps) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(e);
      }}
      className={[
        "space-y-4 w-full p-6 bg-neutral-900 text-neutral-200 rounded-lg shadow-sm border border-neutral-800",
        className,
      ].join(" ")}
      {...props}
    >
      {(title || description) && (
        <div className="mb-4">
          {title && (
            <h2 className="text-lg font-bold text-gray-900">{title}</h2>
          )}
          {description && (
            <p className="text-sm text-gray-500">{description}</p>
          )}
        </div>
      )}

      <div className="space-y-4">{children}</div>
    </form>
  );
}
