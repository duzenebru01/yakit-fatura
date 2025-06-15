export default function Print58Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <head>
        <style>{`
          @media print {
            html, body {
              width: 58mm;
              height: auto;
              margin: 0;
              padding: 0;
              background: white;
            }
            @page {
              size: 58mm auto;
              margin: 0;
              padding: 0;
            }
          }
        `}</style>
      </head>
      <body className="bg-white">
        <main>{children}</main>
      </body>
    </html>
  );
} 