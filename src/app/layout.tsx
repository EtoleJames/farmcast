import type { Metadata, Viewport } from "next";
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

// ─── SEO Metadata ─────────────────────────────────────────────────────────────
// Next.js reads this object and injects the correct <meta> tags server-side.
// This means search engines and link-preview crawlers see full metadata
// without needing to execute JavaScript.

export const metadata: Metadata = {
  metadataBase: new URL("https://farmcast.vercel.app"),

  title: {
    default: "FarmCast — Farm Intelligence Dashboard",
    // %s will be replaced by page-level titles on sub-pages
    template: "%s | FarmCast",
  },

  description:
    "Get 7-day weather forecasts and AI-powered farm advisories for any location in Kenya. Know when to plant, irrigate, and harvest.",

  keywords: [
    "Kenya weather",
    "farm advisory",
    "agricultural forecast",
    "Kenyan farmers",
    "weather forecast Kenya",
    "AI farming",
    "Open-Meteo",
    "FarmCast",
  ],

  authors: [
    {
      name: "James Etole",
      url: "https://www.linkedin.com/in/james-etole-6a7115145/",
    },
  ],

  creator: "James Etole",

  // ── Open Graph ──────────────────────────────────────────────────────────────
  // Controls the preview card when the link is shared on LinkedIn,
  // WhatsApp, Twitter, Slack, etc.

  openGraph: {
    type: "website",
    locale: "en_KE",
    url: "https://farmcast.vercel.app",
    siteName: "FarmCast",
    title: "FarmCast — Farm Intelligence Dashboard",
    description:
      "7-day weather forecasts and AI-powered farm advisories for Kenyan farmers. Know when to plant, irrigate, and harvest.",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "FarmCast — Farm Intelligence Dashboard",
      },
    ],
  },

  // ── Twitter / X ─────────────────────────────────────────────────────────────
  twitter: {
    card: "summary_large_image",
    title: "FarmCast — Farm Intelligence Dashboard",
    description:
      "7-day weather forecasts and AI-powered farm advisories for Kenyan farmers.",
    images: ["/og-image.svg"],
  },

  // ── PWA / Icons ─────────────────────────────────────────────────────────────
  manifest: "/manifest.json",

  icons: {
    icon: "/icon.svg",
    apple: "/icon-192.svg",
  },

  // ── Robots ──────────────────────────────────────────────────────────────────
  // Tell search engines to index and follow links
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

// ── Viewport / Theme Color ───────────────────────────────────────────────────
// theme-color sets the browser chrome color on mobile — matches our dark green
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#1a3c2a" },
    { media: "(prefers-color-scheme: dark)", color: "#0b1410" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/*
          Runs before first paint — reads saved theme from localStorage
          and applies .dark to <html> immediately.
          Must stay in <head> so there is zero flash of wrong theme.
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
      <body
        suppressHydrationWarning
        className={`${inter.variable} ${fraunces.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
