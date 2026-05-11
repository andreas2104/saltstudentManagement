"use client";

import { useMutation } from "@tanstack/react-query";
import type React from "react";
import { useState } from "react";
import Button from "@/app/components/ui/Button";
import Input from "@/app/components/ui/Input";

interface ValidationErrors {
  email?: string[];
  password?: string[];
}

interface ApiError {
  message: string;
  errors?: ValidationErrors;
}

const loginUser = async (data: { email: string; password: string }) => {
  const response = await fetch(`/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw errorData;
  }
  return response.json();
};

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
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
    mutationFn: loginUser,
    onSuccess: (data) => {
      console.log("Login success! Data:", data);
      setValidationErrors({});
      setGlobalError("");

      const searchParams = new URLSearchParams(window.location.search);
      const redirectPath = searchParams.get("redirect") || "/dashboard";

      window.location.href = redirectPath;
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
  console.log("user succes,", mutation);
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
            Welcome Back
          </h1>
          <p className="text-neutral-400 text-sm">
            Enter your credentials to access your account.
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
          </div>

          <Button
            type="submit"
            isLoading={mutation.isPending}
            className="w-full font-bold py-4 rounded-2xl active:scale-[0.98] transition-all duration-200 shadow-lg"
          >
            {mutation.isPending ? "Logging in..." : "Log In"}
          </Button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-neutral-400 text-sm">
            Don&apos;t have an account?{" "}
            <a
              href="/signup"
              className="text-white font-semibold hover:underline"
            >
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
