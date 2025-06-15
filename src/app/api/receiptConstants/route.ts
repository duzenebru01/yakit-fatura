import { NextResponse } from "next/server";
import { clientPromise } from "@/lib/mongodb";
import { ReceiptConstants } from "@/types/receiptConstants";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    const constants = await db.collection("receiptConstants").findOne({});
    
    if (!constants) {
      // Eğer sabitler yoksa varsayılan değerleri döndür
      return NextResponse.json({
        companyName: "",
        address: "",
        phone: "",
        taxNumber: "",
        tradeRegistryNumber: "",
        mersisNumber: "",
        footerText: "",
      });
    }

    return NextResponse.json(constants);
  } catch (error) {
    console.error("Sabitler alınırken hata oluştu:", error);
    return NextResponse.json(
      { error: "Sabitler alınırken bir hata oluştu" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const constants: ReceiptConstants = await request.json();
    const client = await clientPromise;
    const db = client.db();

    // Mevcut sabitleri kontrol et
    const existingConstants = await db.collection("receiptConstants").findOne({});

    if (existingConstants) {
      // Mevcut sabitleri güncelle
      await db.collection("receiptConstants").updateOne(
        { _id: existingConstants._id },
        { $set: { 
          companyName: constants.companyName,
          address: constants.address,
          phone: constants.phone,
          taxNumber: constants.taxNumber,
          tradeRegistryNumber: constants.tradeRegistryNumber,
          mersisNumber: constants.mersisNumber,
          footerText: constants.footerText
        }}
      );
    } else {
      // Yeni sabitler oluştur
      await db.collection("receiptConstants").insertOne(constants);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Sabitler güncellenirken hata oluştu:", error);
    return NextResponse.json(
      { error: "Sabitler güncellenirken bir hata oluştu" },
      { status: 500 }
    );
  }
} 