import "./globals.css";

export const metadata = {
  title: "Stock Price Analysis - Test",
  description: "Stock Price Analysis",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
