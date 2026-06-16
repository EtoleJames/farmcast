import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FarmCast — Farm Intelligence Dashboard",
  description:
    "Weather forecasts and AI-powered farm advisories for Kenyan farmers",
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
