import { NextResponse } from "next/server";
import { clientPromise } from "@/lib/mongodb";
import { Receipt } from "@/types/receipt";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    const receipts = await db.collection("receipts").find({}).sort({ createdAt: -1 }).toArray();
    return NextResponse.json(receipts);
  } catch (error) {
    console.error("Error fetching receipts:", error);
    return NextResponse.json(
      { error: "Fişler alınırken bir hata oluştu" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const client = await clientPromise;
    const db = client.db();

    const receipt: Receipt = {
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("receipts").insertOne(receipt);
    return NextResponse.json({ ...receipt, _id: result.insertedId });
  } catch (error) {
    console.error("Error creating receipt:", error);
    return NextResponse.json(
      { error: "Fiş oluşturulurken bir hata oluştu" },
      { status: 500 }
    );
  }
} 