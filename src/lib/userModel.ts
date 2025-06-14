import clientPromise from "./mongodb";
import { ObjectId } from "mongodb";

export interface User {
  _id?: ObjectId;
  email: string;
  passwordHash: string;
  role: string;
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const client = await clientPromise;
  const db = client.db();
  return db.collection<User>("users").findOne({ email });
}

export async function createUser(user: User): Promise<void> {
  const client = await clientPromise;
  const db = client.db();
  await db.collection<User>("users").insertOne(user);
} 