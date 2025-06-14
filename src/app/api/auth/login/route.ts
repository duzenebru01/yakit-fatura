import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { generateToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    const client = await clientPromise;
    const db = client.db();

    const user = await db.collection("users").findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "Kullanıcı bulunamadı" }, { status: 404 });
    }

    // Şifre kontrolü (gerçek uygulamada hash'lenmiş şifreler kullanılmalı)
    if (user.password !== password) {
      return NextResponse.json({ error: "Geçersiz şifre" }, { status: 401 });
    }

    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    return NextResponse.json({ token });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Giriş başarısız" }, { status: 500 });
  }
} 