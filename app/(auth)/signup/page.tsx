"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import type React from "react";
import { useState, useTransition } from "react";
import Button from "@/app/components/ui/Button";
import Input from "@/app/components/ui/Input";

interface ValidationErrors {
  name?: string[];
  lastname?: string[];
  email?: string[];
  contact?: string[];
  password?: string[];
  confirmPassword?: string[];
}

interface ApiError {
  message: string;
  errors?: ValidationErrors;
}

const signupUser = async (data: {
  name: string;
  lastname: string;
  email: string;
  contact: string;
  password: string;
  confirmPassword: string;
}) => {
  const response = await fetch(`/api/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw errorData;
  }
  return response.json();
};

export default function Signup() {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [formData, setFormData] = useState({
    name: "",
    lastname: "",
    email: "",
    contact: "",
    password: "",
    confirmPassword: "",
  });

  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {},
  );
  const [globalError, setGlobalError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (validationErrors[name as keyof ValidationErrors]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
    if (globalError) {
      setGlobalError("");
    }
  };

  const mutation = useMutation({
    mutationFn: signupUser,
    onSuccess: () => {
      setValidationErrors({});
      setGlobalError("");
      startTransition(() => {
        router.push("/login");
      });
    },
    onError: (error: ApiError) => {
      setValidationErrors({});
      setGlobalError("");
      if (error.errors) {
        setValidationErrors(error.errors);
      } else if (error.message) {
        setGlobalError(error.message);
      } else {
        setGlobalError("An unknown error occurred");
      }
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setValidationErrors({});
    setGlobalError("");
    mutation.mutate(formData);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-950 p-4">
      <div className="w-full max-w-md bg-neutral-900 shadow-2xl rounded-3xl p-8 border border-neutral-800">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">
            Create Account
          </h1>
          <p className="text-neutral-400 text-sm">
            Join us and start managing your events seamlessly.
          </p>
        </div>

        {globalError && (
          <div className="mb-4 px-4 py-3 bg-red-950/30 border border-red-900 rounded-2xl">
            <p className="text-sm text-red-400">{globalError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <Input
              id="name"
              name="name"
              type="text"
              label="First Name"
              placeholder="John"
              value={formData.name}
              onChange={handleChange}
              error={validationErrors.name?.[0]}
              className="bg-neutral-800 border-neutral-700 text-white placeholder-neutral-500 focus:ring-white"
              labelClassName="text-neutral-300"
            />

            <Input
              id="lastname"
              name="lastname"
              type="text"
              label="Last Name"
              placeholder="Doe"
              value={formData.lastname}
              onChange={handleChange}
              error={validationErrors.lastname?.[0]}
              className="bg-neutral-800 border-neutral-700 text-white placeholder-neutral-500 focus:ring-white"
              labelClassName="text-neutral-300"
            />

            <Input
              id="email"
              name="email"
              type="email"
              label="Email Address"
              placeholder="name@example.com"
              value={formData.email}
              onChange={handleChange}
              error={validationErrors.email?.[0]}
              className="bg-neutral-800 border-neutral-700 text-white placeholder-neutral-500 focus:ring-white"
              labelClassName="text-neutral-300"
            />

            <Input
              id="contact"
              name="contact"
              type="text"
              label="Contact Number"
              placeholder="+1234567890"
              value={formData.contact}
              onChange={handleChange}
              error={validationErrors.contact?.[0]}
              className="bg-neutral-800 border-neutral-700 text-white placeholder-neutral-500 focus:ring-white"
              labelClassName="text-neutral-300"
            />

            <Input
              id="password"
              name="password"
              type="password"
              label="Password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              error={validationErrors.password?.[0]}
              className="bg-neutral-800 border-neutral-700 text-white placeholder-neutral-500 focus:ring-white"
              labelClassName="text-neutral-300"
            />

            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              label="Confirm Password"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={validationErrors.confirmPassword?.[0]}
              className="bg-neutral-800 border-neutral-700 text-white placeholder-neutral-500 focus:ring-white"
              labelClassName="text-neutral-300"
            />
          </div>

          <Button
            type="submit"
            isLoading={mutation.isPending}
            className="w-full font-bold py-4 rounded-2xl active:scale-[0.98] transition-all duration-200 shadow-lg"
          >
            {mutation.isPending ? "Creating account..." : "Sign Up"}
          </Button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-neutral-400 text-sm">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-white font-semibold hover:underline"
            >
              Log in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
