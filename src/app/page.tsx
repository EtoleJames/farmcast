"use client";

import { useState } from "react";
import type { WeatherForecast } from "@/types";
import { getWeatherForecast } from "@/lib/weather";
import SearchBar from "@/components/SearchBar";
import WeatherPanel from "@/components/WeatherPanel";
import ErrorMessage from "@/components/ErrorMessage";
import ThemeToggle from "@/components/ThemeToggle";

const QUICK_SEARCHES = ["Bomet", "Nairobi", "Nakuru", "Kisumu", "Meru", "Eldoret"];

export default function Home() {
  const [forecast, setForecast] = useState<WeatherForecast | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSearch(query: string) {
    setIsLoading(true);
    setError(null);
    setForecast(null);

    try {
      const data = await getWeatherForecast(query);
      setForecast(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--bg)" }}>

      {/* ── Navigation bar ───────────────────────────────────────────── */}
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
          {/* Logo */}
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

          {/* Nav links + toggle */}
          <div style={{ display: "flex", alignItems: "center", gap: "32px" }}>
            <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>
              Powered by Open-Meteo · Gemini AI
            </span>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section
        style={{
          backgroundColor: "var(--accent)",
          padding: "80px 24px",
        }}
      >
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          {/* Eyebrow */}
          <p
            style={{
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--accent-green)",
              marginBottom: "20px",
            }}
          >
            ✦ Built for Kenya · Weather Intelligence · AI Farm Advisory
          </p>

          {/* Headline */}
          <h1
            style={{
              fontSize: "clamp(36px, 5vw, 60px)",
              fontWeight: 700,
              fontFamily: "var(--font-fraunces), serif",
              color: "#ffffff",
              lineHeight: 1.1,
              maxWidth: "700px",
              marginBottom: "20px",
            }}
          >
            Know your weather.{" "}
            <span style={{ color: "var(--accent-green)" }}>Grow with confidence.</span>
          </h1>

          <p
            style={{
              fontSize: "17px",
              color: "rgba(255,255,255,0.6)",
              maxWidth: "520px",
              lineHeight: 1.7,
              marginBottom: "40px",
            }}
          >
            7-day forecasts for any location in Kenya — paired with an AI advisory
            telling you exactly when to plant, irrigate, and harvest.
          </p>

          {/* Search */}
          <SearchBar onSearch={handleSearch} isLoading={isLoading} />

          {error && <ErrorMessage message={error} />}

          {/* Quick search chips */}
          <div style={{ display: "flex", gap: "8px", marginTop: "20px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", paddingTop: "6px" }}>
              Try:
            </span>
            {QUICK_SEARCHES.map((city) => (
              <button
                key={city}
                onClick={() => handleSearch(`${city}, Kenya`)}
                style={{
                  padding: "6px 14px",
                  borderRadius: "999px",
                  border: "1px solid rgba(255,255,255,0.15)",
                  backgroundColor: "rgba(255,255,255,0.07)",
                  color: "rgba(255,255,255,0.75)",
                  fontSize: "13px",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.15)";
                  e.currentTarget.style.color = "#fff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.07)";
                  e.currentTarget.style.color = "rgba(255,255,255,0.75)";
                }}
              >
                {city}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Results ──────────────────────────────────────────────────── */}
      <main style={{ maxWidth: "1100px", margin: "0 auto", padding: "48px 24px" }}>

        {/* Loading */}
        {isLoading && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px", padding: "80px 0" }}>
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "50%",
                border: "3px solid var(--border-input)",
                borderTopColor: "var(--accent-green)",
                animation: "spin 0.7s linear infinite",
              }}
            />
            <p style={{ fontSize: "15px", color: "var(--text-muted)" }}>Fetching forecast...</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {/* Forecast results */}
        {forecast && !isLoading && (
          <div
            style={{
              backgroundColor: "var(--bg-card)",
              borderRadius: "20px",
              border: "1px solid var(--border)",
              padding: "32px",
            }}
          >
            <WeatherPanel forecast={forecast} />
          </div>
        )}

        {/* Empty state */}
        {!forecast && !isLoading && !error && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "100px 24px",
              textAlign: "center",
              gap: "16px",
            }}
          >
            <div
              style={{
                width: "72px",
                height: "72px",
                borderRadius: "50%",
                backgroundColor: "var(--accent-green-bg)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "32px",
                marginBottom: "8px",
              }}
            >
              🌦️
            </div>
            <h3 style={{ fontSize: "20px", fontWeight: 700, color: "var(--text-primary)" }}>
              Search a location to begin
            </h3>
            <p style={{ fontSize: "15px", color: "var(--text-secondary)", maxWidth: "380px", lineHeight: 1.6 }}>
              Type any Kenyan town or city above. You will get a 7-day forecast
              and an AI farm advisory in seconds.
            </p>
          </div>
        )}
      </main>

      {/* ── Footer ───────────────────────────────────────────────────── */}
      <footer
        style={{
          borderTop: "1px solid var(--border)",
          padding: "24px",
          backgroundColor: "var(--bg-card)",
        }}
      >
        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: "13px",
            color: "var(--text-muted)",
          }}
        >
          <span>🌱 FarmCast — Built for Kenyan farmers</span>
          <span>Weather by Open-Meteo · AI by Gemini</span>
        </div>
      </footer>
    </div>
  );
}
