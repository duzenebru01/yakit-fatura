import { clientPromise } from "./mongodb";
import { ObjectId } from "mongodb";

export interface Receipt {
  _id?: ObjectId;
  licensePlate: string;
  date: string;
  time: string;
  liter: number;
  unitPrice: number;
  totalPrice: number;
  vat: number;
  paymentType: string;
  createdByUserId: ObjectId;
  zNo: string;
}

export async function createReceipt(receipt: Receipt): Promise<void> {
  const client = await clientPromise;
  const db = client.db();
  await db.collection<Receipt>("receipts").insertOne(receipt);
}

export async function getReceipts(): Promise<Receipt[]> {
  const client = await clientPromise;
  const db = client.db();
  return db.collection<Receipt>("receipts").find().toArray();
} 