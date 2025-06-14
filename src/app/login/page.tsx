"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { Toast } from "@/components/Toast";

interface LoginFormInputs {
  email: string;
  password: string;
}

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>();
  const router = useRouter();
  const [error, setError] = useState("");
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  const onSubmit = async (data: LoginFormInputs) => {
    setError("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (res.ok) {
      Cookies.set("token", result.token, { expires: 1 });
      router.push("/dashboard");
    } else {
      setError(result.error || "Giriş başarısız");
    }
  };

  const hideToast = () => {
    setToast({ show: false, message: "", type: "" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">Yönetici Girişi</h2>
        {error && <div className="mb-4 text-red-600 text-center">{error}</div>}
        <div className="mb-4">
          <label className="block mb-1 font-medium">E-posta</label>
          <input type="email" {...register("email", { required: true })} className="w-full px-3 py-2 border rounded" />
          {errors.email && <span className="text-red-500 text-sm">E-posta gerekli</span>}
        </div>
        <div className="mb-6">
          <label className="block mb-1 font-medium">Şifre</label>
          <input type="password" {...register("password", { required: true })} className="w-full px-3 py-2 border rounded" />
          {errors.password && <span className="text-red-500 text-sm">Şifre gerekli</span>}
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">Giriş Yap</button>

        <p className="text-center text-sm text-gray-600 mt-4">
          Hesabınız yok mu?{" "}
          <a href="/register" className="text-blue-600 hover:text-blue-800">
            Kayıt Ol
          </a>
        </p>
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