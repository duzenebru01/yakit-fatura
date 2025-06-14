import { NextRequest, NextResponse } from "next/server";

const mockPrices: Record<string, number> = {
  "2023-01-01": 30.5,
  "2023-01-02": 30.7,
  "2023-01-03": 31.0,
  // Diğer tarihler için fiyatlar eklenebilir
};

export async function GET(req: NextRequest) {
  const date = req.nextUrl.searchParams.get("date");
  if (!date) {
    return NextResponse.json({ error: "Tarih gerekli" }, { status: 400 });
  }
  const price = mockPrices[date] || 30.0; // Varsayılan fiyat
  return NextResponse.json({ price });
} 