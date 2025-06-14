export default function PrintLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body className="bg-white">
        <main>{children}</main>
      </body>
    </html>
  );
} 