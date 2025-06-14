"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Toast from "@/components/Toast";

interface RegisterFormInputs {
  email: string;
  password: string;
  confirmPassword: string;
}

interface ToastState {
  show: boolean;
  message: string;
  type: "success" | "error" | "info";
}

export default function RegisterPage() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterFormInputs>();
  const router = useRouter();
  const [toast, setToast] = useState<ToastState>({ show: false, message: "", type: "info" });

  const onSubmit = async (data: RegisterFormInputs) => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || "Kayıt işlemi başarısız");
      }

      Cookies.set("token", result.token, { expires: 1 });
      router.push("/dashboard");
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Kayıt işlemi başarısız", "error");
    }
  };

  const showToast = (message: string, type: "success" | "error" | "info") => {
    setToast({ show: true, message, type });
  };

  const hideToast = () => {
    setToast({ ...toast, show: false });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">Yönetici Kaydı</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">E-posta</label>
            <input
              type="email"
              {...register("email", {
                required: "E-posta gerekli",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Geçerli bir e-posta adresi giriniz",
                },
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Şifre</label>
            <input
              type="password"
              {...register("password", {
                required: "Şifre gerekli",
                minLength: {
                  value: 6,
                  message: "Şifre en az 6 karakter olmalı",
                },
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Şifre Tekrar</label>
            <input
              type="password"
              {...register("confirmPassword", {
                required: "Şifre tekrarı gerekli",
                validate: (value) =>
                  value === watch("password") || "Şifreler eşleşmiyor",
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Kayıt Ol
          </button>

          <p className="text-center text-sm text-gray-600">
            Zaten hesabınız var mı?{" "}
            <a href="/login" className="text-blue-600 hover:text-blue-800">
              Giriş Yap
            </a>
          </p>
        </div>
      </form>

      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
        />
      )}
    </div>
  );
} 