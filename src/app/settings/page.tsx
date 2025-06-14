"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ReceiptConstants } from "@/types/receiptConstants";

const defaultConstants: ReceiptConstants = {
  companyName: "",
  address: "",
  phone: "",
  taxNumber: "",
  tradeRegistryNumber: "",
  mersisNumber: "",
  footerText: "",
};

export default function SettingsPage() {
  const router = useRouter();
  const [constants, setConstants] = useState<ReceiptConstants>(defaultConstants);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchConstants = async () => {
      try {
        const res = await fetch("/api/receiptConstants");
        const data = await res.json();
        setConstants(data);
      } catch (error) {
        console.error("Sabitler yüklenirken hata oluştu:", error);
      }
    };
    fetchConstants();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/receiptConstants", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(constants),
      });

      if (!res.ok) {
        throw new Error("Ayarlar kaydedilemedi");
      }

      router.push("/dashboard");
    } catch (error) {
      console.error("Ayarlar kaydedilirken hata oluştu:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Fiş Sabitleri</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Firma Adı
                  </label>
                  <input
                    type="text"
                    value={constants.companyName}
                    onChange={(e) =>
                      setConstants({ ...constants, companyName: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Adres
                  </label>
                  <input
                    type="text"
                    value={constants.address}
                    onChange={(e) =>
                      setConstants({ ...constants, address: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Telefon
                  </label>
                  <input
                    type="text"
                    value={constants.phone}
                    onChange={(e) =>
                      setConstants({ ...constants, phone: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Vergi Numarası
                  </label>
                  <input
                    type="text"
                    value={constants.taxNumber}
                    onChange={(e) =>
                      setConstants({ ...constants, taxNumber: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Ticaret Sicil Numarası
                  </label>
                  <input
                    type="text"
                    value={constants.tradeRegistryNumber}
                    onChange={(e) =>
                      setConstants({ ...constants, tradeRegistryNumber: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    MERSİS Numarası
                  </label>
                  <input
                    type="text"
                    value={constants.mersisNumber}
                    onChange={(e) =>
                      setConstants({ ...constants, mersisNumber: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Alt Bilgi Metni
                  </label>
                  <input
                    type="text"
                    value={constants.footerText}
                    onChange={(e) =>
                      setConstants({ ...constants, footerText: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex justify-center py-2 px-8 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {isLoading ? "Kaydediliyor..." : "Kaydet"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 