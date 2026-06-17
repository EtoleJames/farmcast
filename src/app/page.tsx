import type { Metadata } from "next";
import ThemeToggle from "@/components/ThemeToggle";
import DashboardClient from "@/components/DashboardClient";
import LinkedInButton from "@/components/LinkedInButton";

export const metadata: Metadata = {
  title: "FarmCast — Farm Intelligence Dashboard",
  description:
    "Get 7-day weather forecasts and AI-powered farm advisories for any location in Kenya. Built for Kenyan farmers.",
  keywords: [
    "weather",
    "Kenya",
    "farming",
    "agriculture",
    "forecast",
    "AI advisory",
  ],
  authors: [{ name: "James Etole" }],
  openGraph: {
    title: "FarmCast — Farm Intelligence Dashboard",
    description:
      "7-day weather forecasts and AI-powered farm advisories for Kenyan farmers.",
    type: "website",
  },
};

export default function Home() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--bg)" }}>

      {/* ── Nav — rendered on the server ───────────────────────────── */}
      <nav
        style={{
          borderBottom: "1px solid var(--border)",
          backgroundColor: "var(--bg-card)",
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
            padding: "0 24px",
            height: "64px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "24px" }}>🌱</span>
            <span
              style={{
                fontSize: "20px",
                fontWeight: 700,
                fontFamily: "var(--font-fraunces), serif",
                color: "var(--text-primary)",
              }}
            >
              FarmCast
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
            <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>
              Open-Meteo · Groq AI
            </span>
            {/* ThemeToggle is a Client Component — isolated for the toggle logic */}
            <ThemeToggle />
          </div>
        </div>
      </nav>

      {/* ── All interactive content lives in DashboardClient ────────── */}
      <DashboardClient />

      {/* ── Footer — rendered on the server ────────────────────────── */}
      <footer
        style={{
          borderTop: "1px solid var(--border)",
          backgroundColor: "var(--bg-card)",
        }}
      >
        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
            padding: "24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          {/* Left — project identity */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "18px" }}>🌱</span>
            <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>
              FarmCast — Weather by Open-Meteo · AI by Groq
            </span>
          </div>

          {/* Right — personal identity */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <span
              style={{
                fontSize: "13px",
                color: "var(--text-secondary)",
                fontWeight: 500,
              }}
            >
              Built by James Etole
            </span>

            {/* LinkedInButton is a Client Component because it has hover handlers */}
            <LinkedInButton />
          </div>
        </div>
      </footer>
    </div>
  );
}
