"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Receipt } from "@/types/receipt";
import { ReceiptConstants } from "@/types/receiptConstants";

export default function PrintPage() {
  const params = useParams();
  const id = params?.id as string;
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [constants, setConstants] = useState<ReceiptConstants | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [receiptRes, constantsRes] = await Promise.all([
          fetch(`/api/receipts/${id}`),
          fetch("/api/receiptConstants"),
        ]);

        if (!receiptRes.ok || !constantsRes.ok) {
          throw new Error("Veri alınamadı");
        }

        const [receiptData, constantsData] = await Promise.all([
          receiptRes.json(),
          constantsRes.json(),
        ]);

        setReceipt(receiptData);
        setConstants(constantsData);

        // Veriler yüklendiğinde yazdırma diyaloğunu aç
        if (receiptData && constantsData) {
          setTimeout(() => {
            window.print();
          }, 500);
        }
      } catch (error) {
        console.error("Veri alınırken hata oluştu:", error);
      }
    };

    fetchData();
  }, [id]);

  if (!receipt || !constants) {
    return <div>Yükleniyor...</div>;
  }

  return (
    <div className="p-8 max-w-[80mm] mx-auto">
      <div className="text-center mb-4">
        <h1 className="text-xl font-bold">{constants.companyName}</h1>
        <p className="text-sm">{constants.address}</p>
        <p className="text-sm">{constants.phone}</p>
        <p className="text-sm">{constants.taxNumber}</p>
        <p className="text-sm">TİC. SİC. NO: {constants.tradeRegistryNumber}</p>
        <p className="text-sm">MERSİS: {constants.mersisNumber}</p>
      </div>

      <div className="border-t border-b border-dashed border-gray-400 py-2 my-2">
        <p className="text-center font-bold">YAKIT ALIM FİŞİ</p>
      </div>

      <div className="space-y-1 text-sm">
        <div className="flex justify-between">
          <span>Plaka:</span>
          <span>{receipt.licensePlate}</span>
        </div>
        <div className="flex justify-between">
          <span>Tarih:</span>
          <span>{receipt.date}</span>
        </div>
        <div className="flex justify-between">
          <span>Saat:</span>
          <span>{receipt.time}</span>
        </div>
        <div className="flex justify-between">
          <span>Yakıt Türü:</span>
          <span>{receipt.fuelType}</span>
        </div>
        <div className="flex justify-between">
          <span>Miktar (Lt):</span>
          <span>{Number(receipt.amount).toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Birim Fiyat (₺):</span>
          <span>{Number(receipt.price).toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-bold">
          <span>Toplam (₺):</span>
          <span>{Number(receipt.total).toFixed(2)}</span>
        </div>
      </div>

      <div className="mt-4 text-center text-sm">
        <p>{constants.footerText}</p>
      </div>

      <style jsx global>{`
        @media print {
          body {
            margin: 0;
            padding: 0;
          }
          @page {
            size: 80mm auto;
            margin: 0;
          }
        }
      `}</style>
    </div>
  );
} 