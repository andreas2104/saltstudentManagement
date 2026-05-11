"use client";

import { useEffect, useState } from "react";
import { HiCheck, HiXMark } from "react-icons/hi2";

type ToastType = "success" | "error";

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

let toastId = 0;
const listeners: ((toasts: Toast[]) => void)[] = [];
let toasts: Toast[] = [];

const notify = (toasts: Toast[]) => {
  for (const listener of listeners) {
    listener(toasts);
  }
};

export function toast(message: string, type: ToastType = "success") {
  const id = ++toastId;
  toasts = [...toasts, { id, message, type }];
  notify(toasts);

  setTimeout(() => {
    toasts = toasts.filter((t) => t.id !== id);
    notify(toasts);
  }, 4000);
}

export function ToastContainer() {
  const [currentToasts, setCurrentToasts] = useState<Toast[]>([]);

  useEffect(() => {
    listeners.push(setCurrentToasts);
    return () => {
      const index = listeners.indexOf(setCurrentToasts);
      if (index > -1) listeners.splice(index, 1);
    };
  }, []);

  if (currentToasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {currentToasts.map((t) => (
        <div
          key={t.id}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg text-white min-w-[280px] animate-slide-in ${
            t.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {t.type === "success" ? (
            <HiCheck className="text-xl flex-shrink-0" />
          ) : (
            <HiXMark className="text-xl flex-shrink-0" />
          )}
          <span className="text-sm font-medium">{t.message}</span>
        </div>
      ))}
    </div>
  );
}
