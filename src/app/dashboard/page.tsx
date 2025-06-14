"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { Receipt } from "@/lib/receiptModel";
import { useRouter } from "next/navigation";
import { ReceiptConstants } from "@/models/receipt";
import Toast from "@/components/Toast";

interface ReceiptFormInputs {
  licensePlate: string;
  date: string;
  time: string;
  fuelType: string;
  amount: number;
  price: number;
  total: number;
}

interface ToastState {
  show: boolean;
  message: string;
  type: "success" | "error" | "info";
}

export default function DashboardPage() {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<ReceiptFormInputs>({
    defaultValues: {
      licensePlate: "",
      date: "",
      time: "",
      fuelType: "",
      amount: 0,
      price: 0,
      total: 0,
    },
    mode: "onChange",
  });
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [constants, setConstants] = useState<ReceiptConstants | null>(null);
  const [toast, setToast] = useState<ToastState>({ show: false, message: "", type: "info" });
  const [isLoading, setIsLoading] = useState({
    receipts: false,
    constants: false,
    fuelPrice: false,
    submit: false,
  });
  const router = useRouter();

  const fetchReceipts = useCallback(async () => {
    setIsLoading(prev => ({ ...prev, receipts: true }));
    try {
      const res = await fetch("/api/receipts");
      if (!res.ok) throw new Error("Fişler yüklenirken bir hata oluştu");
      const data = await res.json();
      setReceipts(data);
    } catch {
      showToast("Fişler yüklenirken bir hata oluştu", "error");
    } finally {
      setIsLoading(prev => ({ ...prev, receipts: false }));
    }
  }, []);

  const fetchConstants = useCallback(async () => {
    setIsLoading(prev => ({ ...prev, constants: true }));
    try {
      const res = await fetch("/api/receipts/constants");
      if (!res.ok) throw new Error("Sabitler yüklenirken bir hata oluştu");
      const data = await res.json();
      setConstants(data);
    } catch {
      showToast("Sabitler yüklenirken bir hata oluştu", "error");
    } finally {
      setIsLoading(prev => ({ ...prev, constants: false }));
    }
  }, []);

  useEffect(() => {
    fetchReceipts();
    fetchConstants();
  }, [fetchReceipts, fetchConstants]);

  const fetchFuelPrice = async () => {
    setIsLoading(prev => ({ ...prev, fuelPrice: true }));
    try {
      const date = watch("date");
      if (!date) {
        showToast("Lütfen önce tarih seçin", "error");
        return;
      }

      const res = await fetch(`/api/fuelPrice?date=${date}`);
      if (!res.ok) throw new Error("Yakıt fiyatı alınamadı");
      const data = await res.json();
      setValue("price", data.price);
      calculateTotal(data.price, watch("amount"));
    } catch {
      showToast("Yakıt fiyatı alınırken bir hata oluştu", "error");
    } finally {
      setIsLoading(prev => ({ ...prev, fuelPrice: false }));
    }
  };

  const calculateTotal = (price: number, amount: number) => {
    const total = price * amount;
    setValue("total", total);
  };

  const onSubmit = async (data: ReceiptFormInputs) => {
    setIsLoading(prev => ({ ...prev, submit: true }));
    try {
      const res = await fetch("/api/receipts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Fiş kaydedilemedi");

      showToast("Fiş başarıyla kaydedildi", "success");
      fetchReceipts();
    } catch {
      showToast("Fiş kaydedilirken bir hata oluştu", "error");
    } finally {
      setIsLoading(prev => ({ ...prev, submit: false }));
    }
  };

  const handlePrint = (id: string) => {
    router.push(`/print/${id}`);
  };

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (!res.ok) throw new Error("Çıkış yapılamadı");
      router.push("/login");
    } catch {
      showToast("Çıkış yapılırken bir hata oluştu", "error");
    }
  };

  const showToast = (message: string, type: "success" | "error" | "info") => {
    setToast({ show: true, message, type });
  };

  const hideToast = () => {
    setToast({ ...toast, show: false });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold">Yakıt Fatura Paneli</h1>
              </div>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleLogout}
                className="ml-4 px-4 py-2 text-sm text-red-600 hover:text-red-800"
              >
                Çıkış Yap
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4">Yakıt Fişleri Dashboard</h1>

        <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-8">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">Yeni Fiş Oluştur</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Plaka</label>
                <input
                  type="text"
                  {...register("licensePlate", { required: "Plaka gerekli" })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                {errors.licensePlate && (
                  <p className="mt-1 text-sm text-red-600">{errors.licensePlate.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Tarih</label>
                <input
                  type="date"
                  {...register("date", { required: "Tarih gerekli" })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                {errors.date && (
                  <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Saat</label>
                <input
                  type="time"
                  {...register("time", { required: "Saat gerekli" })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                {errors.time && (
                  <p className="mt-1 text-sm text-red-600">{errors.time.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Yakıt Türü</label>
                <select
                  {...register("fuelType", { required: "Yakıt türü gerekli" })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Seçiniz</option>
                  {constants?.fuelTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                {errors.fuelType && (
                  <p className="mt-1 text-sm text-red-600">{errors.fuelType.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Miktar (Lt)</label>
                <input
                  type="number"
                  step="0.01"
                  {...register("amount", {
                    required: "Miktar gerekli",
                    min: { value: 0.01, message: "Miktar 0'dan büyük olmalı" },
                  })}
                  onChange={(e) => {
                    const amount = parseFloat(e.target.value);
                    calculateTotal(watch("price"), amount);
                  }}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                {errors.amount && (
                  <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Birim Fiyat (TL)</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    step="0.01"
                    {...register("price", {
                      required: "Birim fiyat gerekli",
                      min: { value: 0.01, message: "Birim fiyat 0'dan büyük olmalı" },
                    })}
                    onChange={(e) => {
                      const price = parseFloat(e.target.value);
                      calculateTotal(price, watch("amount"));
                    }}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={fetchFuelPrice}
                    disabled={isLoading.fuelPrice}
                    className="mt-1 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Fiyat Al
                  </button>
                </div>
                {errors.price && (
                  <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Toplam Tutar (TL)</label>
                <input
                  type="number"
                  step="0.01"
                  {...register("total", { required: "Toplam tutar gerekli" })}
                  readOnly
                  className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isLoading.submit}
                className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading.submit ? "Kaydediliyor..." : "Fiş Oluştur"}
              </button>
            </div>
          </form>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <h2 className="text-lg sm:text-xl font-semibold p-4 sm:p-6 border-b">Son Fişler</h2>
          {isLoading.receipts ? (
            <div className="flex justify-center items-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Plaka
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tarih
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Saat
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Yakıt Türü
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Miktar
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Birim Fiyat
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Toplam
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      İşlemler
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {receipts.map((receipt) => (
                    <tr key={receipt._id?.toString()}>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {receipt.licensePlate}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {receipt.date}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {receipt.time}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {receipt.fuelType}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {Number(receipt.amount).toFixed(2)} Lt
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {Number(receipt.price).toFixed(2)} TL
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {Number(receipt.total).toFixed(2)} TL
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <button
                          onClick={() => handlePrint(receipt._id?.toString() || "")}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Yazdır
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

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