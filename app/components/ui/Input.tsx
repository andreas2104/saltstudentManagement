"use client";

import { forwardRef, type InputHTMLAttributes } from "react";

type InputSize = "sm" | "md" | "lg";

interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  error?: string;
  labelClassName?: string;
  size?: InputSize;
}

const sizeStyles: Record<InputSize, string> = {
  sm: "px-3 py-2 text-xs font-bold rounded-xl",
  md: "px-4 py-3 text-sm font-bold rounded-xl",
  lg: "px-5 py-4 text-sm font-bold rounded-2xl",
};

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      className = "",
      labelClassName = "",
      id,
      size = "lg",
      ...props
    },
    ref,
  ) => {
    const baseInputStyles =
      "w-full border text-black transition-all duration-200 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-700 focus:border-transparent disabled:bg-neutral-900 disabled:text-neutral-600 disabled:cursor-not-allowed";
    const statusStyles = error
      ? "border-red-500 focus:ring-red-500"
      : "border-neutral-800";
    const defaultBg = className.includes("bg-") ? "" : "bg-white";

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label
            htmlFor={id}
            className={[
              "block text-sm font-medium text-black mb-1 ml-1",
              labelClassName,
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {label}
          </label>
        )}
        <input
          id={id}
          ref={ref}
          className={[
            baseInputStyles,
            sizeStyles[size],
            statusStyles,
            defaultBg,
            className,
          ]
            .filter(Boolean)
            .join(" ")}
          {...props}
        />
        {error && (
          <p className="text-xs text-red-600 font-medium ml-1">{error}</p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
export default Input;
