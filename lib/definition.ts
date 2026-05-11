import * as Z from "zod";

export const SignupFormSchema = Z.object({
  name: Z.string()
    .min(2, { message: "Name must contain at least 2 characters." })
    .max(50, { message: "Name cannot exceed 50 characters." })
    .trim(),
  lastname: Z.string()
    .min(2, { message: "Last name must contain at least 2 characters." })
    .max(50, { message: "Last name cannot exceed 50 characters." })
    .trim(),

  email: Z.string().email({ message: "Invalid email address." }).trim(),
  contact: Z.string()
    .min(10, { message: "Contact number must be at least 10 characters." })
    .max(15, { message: "Contact number cannot exceed 15 characters." })
    .trim(),

  password: Z.string()
    .min(8, {
      message: "Password must contain at least 8 characters.",
    })
    .regex(/[a-zA-Z]/, {
      message: "Password must contain at least one letter.",
    })
    .regex(/[0-9]/, {
      message: "Password must contain at least one digit.",
    })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Password must contain at least one special character.",
    })
    .trim(),
  confirmPassword: Z.string().trim(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"],
});

export const ClientFormSchema = Z.object({
  name: Z.string()
    .min(2, { message: "Name must contain at least 2 characters." })
    .max(50, { message: "Name cannot exceed 50 characters." })
    .trim(),
  email: Z.string().email({ message: "Invalid email address." }).trim(),
  phone: Z.string()
    .min(10, { message: "Phone number must be at least 10 characters." })
    .max(15, { message: "Phone number cannot exceed 15 characters." })
    .trim(),
});

export type FormState =
  | {
      errors?: {
        name?: string[];
        lastname?: string[];
        email?: string[];
        contact?: string[];
        phone?: string[];
        password?: string[];
      };
      message?: string;
    }
  | undefined;
