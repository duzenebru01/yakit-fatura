"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Receipt } from "@/types/receipt";
import { ReceiptConstants } from "@/types/receiptConstants";

export default function Print58Page() {
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

  // Yardımcı fonksiyonlar
  const kdvOrani = 0.20;
  const kdvTutari = receipt.total * kdvOrani;
  const toplamTutar = receipt.total;
  const yakitAraToplam = receipt.amount * receipt.price;
  const formattedDate = receipt.date;
  const formattedTime = receipt.time;

  return (
    <div className="print58-content">
      {/* 1. sıra: Firma adı */}
      <div className="row center bold bigger">{constants.companyName}</div>
      {/* 2-3. sıra: Firma adresi */}
      <div className="row center">{constants.address}</div>
      <div className="row center">{constants.phone}</div>
      {/* 4. sıra: Vergi dairesi */}
      <div className="row center">{constants.taxNumber}</div>
      {/* 5. sıra: Tic. sicil no */}
      <div className="row center">TİC. SİC. NO: {constants.tradeRegistryNumber}</div>
      {/* 6. sıra: Mersis */}
      <div className="row center">MERSİS: {constants.mersisNumber}</div>
      {/* 7. sıra: boşluk */}
      <div className="row">&nbsp;</div>
      {/* 8. sıra: sağda tarih, solda saat */}
      <div className="row between">
        <span>{formattedTime}</span>
        <span>{formattedDate}</span>
      </div>
      {/* 9. sıra: solda fiş no alanı */}
      <div className="row left">Fiş No: {receipt._id?.toString().slice(-6) || "-"}</div>
      {/* 10. sıra: boşluk */}
      <div className="row">&nbsp;</div>
      {/* 11. sıra: ortada plaka, bold ve büyük */}
      <div className="row center bold plate">{receipt.licensePlate}</div>
      {/* 12. sıra: boşluk */}
      <div className="row">&nbsp;</div>
      {/* 13. sıra: solda alınan yakıt miktarı X birim fiyatı */}
      <div className="row left">{receipt.amount} Lt x {receipt.price.toFixed(2)} TL</div>
      {/* 14. sıra: solda yakıt türü, yanında %20 vergi, sağda toplam */}
      <div className="row between">
        <span>{receipt.fuelType} (%20 KDV)</span>
        <span>{receipt.total.toFixed(2)} TL</span>
      </div>
      {/* 15. sıra: çizgi */}
      <div className="row center">------------------------------</div>
      {/* 16. sıra: solda KDV (plaka ile aynı boyutta), sağda kdv tutarı */}
      <div className="row between plate bold">
        <span>KDV</span>
        <span>{kdvTutari.toFixed(2)} TL</span>
      </div>
      {/* 17. sıra: solda TOPLAM (plaka ile aynı boyutta), sağda toplam tutar */}
      <div className="row between plate bold">
        <span>TOPLAM</span>
        <span>{toplamTutar.toFixed(2)} TL</span>
      </div>
      {/* 18. sıra: çizgi */}
      <div className="row center">------------------------------</div>
      {/* 19. sıra: ödeme yöntemi solda, sağda toplam */}
      <div className="row between">
        <span>Ödeme: Nakit</span>
        <span>{toplamTutar.toFixed(2)} TL</span>
      </div>
      {/* 20. sıra: boşluk */}
      <div className="row">&nbsp;</div>
      {/* 21. sıra: Pompa No */}
      <div className="row left">Pompa No: 1</div>
      {/* 22. sıra: İstasyon */}
      <div className="row left">İstasyon: {constants.companyName}</div>
      {/* 23. sıra: boşluk */}
      <div className="row">&nbsp;</div>
      {/* 24. sıra: EKU NO ve Z No */}
      <div className="row between">
        <span>EKU NO: 0003</span>
        <span>Z No: 0738</span>
      </div>
      <style jsx>{`
        .print58-content {
          width: 58mm;
          margin: 0 auto;
          background: white;
          padding-left: 1.5mm;
          padding-right: 1.5mm;
          font-family: monospace, Arial, sans-serif;
          font-size: 10.5pt;
        }
        .row {
          width: 100%;
          display: flex;
          flex-direction: row;
          align-items: center;
          min-height: 1em;
        }
        .center { justify-content: center; text-align: center; }
        .left { justify-content: flex-start; text-align: left; }
        .right { justify-content: flex-end; text-align: right; }
        .between { justify-content: space-between; }
        .bold { font-weight: bold; }
        .bigger { font-size: 12pt; }
        .plate { font-size: 13pt; }
        @media print {
          .print58-content {
            width: 58mm !important;
            padding-left: 1.5mm !important;
            padding-right: 1.5mm !important;
            margin: 0 !important;
            background: white !important;
          }
          body {
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
          }
          @page {
            size: 58mm auto !important;
            margin: 0 !important;
            padding: 0 !important;
          }
        }
      `}</style>
    </div>
  );
} 