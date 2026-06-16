import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "FarmCast — Farm Intelligence Dashboard",
  description: "Weather forecasts and AI-powered farm advisories for Kenyan farmers",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/*
          Runs before first paint — reads saved theme from localStorage
          and applies .dark to <html> immediately so there is no flash.
          Must be in <head>, not <body>, for this to work correctly.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('farmcast-theme');
                  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (saved === 'dark' || (!saved && prefersDark)) {
                    document.documentElement.classList.add('dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body suppressHydrationWarning className={`${inter.variable} ${fraunces.variable}`}>
        {children}
      </body>
    </html>
  );
}
