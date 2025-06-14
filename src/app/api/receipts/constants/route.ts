import { NextResponse } from "next/server";

export async function GET() {
  const constants = {
    fuelTypes: ["Benzin", "Dizel", "LPG"],
    paymentTypes: ["Nakit", "Kredi Kartı"],
  };

  return NextResponse.json(constants);
} 