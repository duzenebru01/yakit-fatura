import { NextRequest, NextResponse } from "next/server";
import { clientPromise } from "@/lib/mongodb";
import { generateToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    const client = await clientPromise;
    const db = client.db();

    // E-posta kontrolü
    const existingUser = await db.collection("users").findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "Bu e-posta adresi zaten kullanımda" }, { status: 400 });
    }

    // Yeni kullanıcı oluştur
    const user = {
      email,
      password, // Gerçek uygulamada şifre hash'lenmeli
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("users").insertOne(user);
    const token = generateToken({
      userId: result.insertedId.toString(),
      email: user.email,
      role: user.role,
    });

    return NextResponse.json({ token });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Kayıt işlemi başarısız" }, { status: 500 });
  }
} 