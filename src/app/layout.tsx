import Link from "next/link";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <body className="bg-gray-50 min-h-screen">
        <nav className="bg-white shadow p-4 flex gap-4">
          <Link href="/login" className="hover:underline">Giriş</Link>
          <Link href="/dashboard" className="hover:underline">Dashboard</Link>
          <Link href="/settings" className="hover:underline">Ayarlar</Link>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  );
}
