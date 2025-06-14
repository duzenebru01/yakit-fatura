import { NextResponse } from "next/server";
import { clientPromise } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const receipt = await db.collection("receipts").findOne({ _id: new ObjectId(context.params.id) });

    if (!receipt) {
      return NextResponse.json({ error: "Fiş bulunamadı" }, { status: 404 });
    }

    return NextResponse.json(receipt);
  } catch (error) {
    console.error("Error fetching receipt:", error);
    return NextResponse.json(
      { error: "Fiş alınırken bir hata oluştu" },
      { status: 500 }
    );
  }
} 