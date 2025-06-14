import clientPromise from "./mongodb";

export interface ReceiptConstants {
  _id?: string;
  companyName: string;
  address: string;
  taxNumber: string;
  pumpNumber: string;
  stationName: string;
  paymentTypes: string[];
}

export async function getReceiptConstants(): Promise<ReceiptConstants | null> {
  const client = await clientPromise;
  const db = client.db();
  return db.collection<ReceiptConstants>("receiptConstants").findOne({});
}

export async function updateReceiptConstants(constants: ReceiptConstants): Promise<void> {
  const client = await clientPromise;
  const db = client.db();
  await db.collection<ReceiptConstants>("receiptConstants").updateOne({}, { $set: constants }, { upsert: true });
} 