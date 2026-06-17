// page.tsx owns all state and coordinates the two data fetches.
// Weather loads first, then the advisory is requested automatically.
// Components only receive props — none fetch data themselves.

"use client";

import { useState } from "react";
import type { FarmAdvisory, WeatherForecast } from "@/types";
import { getWeatherForecast } from "@/lib/weather";
import { fetchFarmAdvisory } from "@/lib/advisory";
import SearchBar from "@/components/SearchBar";
import WeatherPanel from "@/components/WeatherPanel";
import AdvisoryPanel from "@/components/AdvisoryPanel";
import ErrorMessage from "@/components/ErrorMessage";
import ThemeToggle from "@/components/ThemeToggle";

const QUICK_SEARCHES = ["Bomet", "Nairobi", "Nakuru", "Kisumu", "Meru", "Eldoret"];

export default function Home() {
  const [forecast, setForecast] = useState<WeatherForecast | null>(null);
  const [advisory, setAdvisory] = useState<FarmAdvisory | null>(null);
  const [isLoadingWeather, setIsLoadingWeather] = useState(false);
  const [isLoadingAdvisory, setIsLoadingAdvisory] = useState(false);
  const [weatherError, setWeatherError] = useState<string | null>(null);
  const [advisoryError, setAdvisoryError] = useState<string | null>(null);

  async function handleSearch(query: string) {
    // Reset everything on each new search
    setIsLoadingWeather(true);
    setWeatherError(null);
    setAdvisoryError(null);
    setForecast(null);
    setAdvisory(null);

    try {
      // Step 1 — fetch weather first
      const weatherData = await getWeatherForecast(query);
      setForecast(weatherData);
      setIsLoadingWeather(false);

      // Step 2 — use the weather data to fetch the AI advisory
      setIsLoadingAdvisory(true);
      const advisoryData = await fetchFarmAdvisory(
        weatherData.location,
        weatherData.daily
      );
      setAdvisory(advisoryData);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong.";

      // Determine which stage failed based on what we have loaded so far
      if (!forecast) {
        setWeatherError(message);
        setIsLoadingWeather(false);
      } else {
        setAdvisoryError(message);
      }
    } finally {
      setIsLoadingWeather(false);
      setIsLoadingAdvisory(false);
    }
  }

  const hasResults = forecast && !isLoadingWeather;
  const showEmptyState = !forecast && !isLoadingWeather && !weatherError;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--bg)" }}>

      {/* ── Nav ──────────────────────────────────────────────────────── */}
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
            <ThemeToggle />
          </div>
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section style={{ backgroundColor: "var(--accent)", padding: "72px 24px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
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

          <h1
            style={{
              fontSize: "clamp(34px, 5vw, 58px)",
              fontWeight: 700,
              fontFamily: "var(--font-fraunces), serif",
              color: "#ffffff",
              lineHeight: 1.1,
              maxWidth: "680px",
              marginBottom: "20px",
            }}
          >
            Know your weather.{" "}
            <span style={{ color: "var(--accent-green)" }}>
              Grow with confidence.
            </span>
          </h1>

          <p
            style={{
              fontSize: "16px",
              color: "rgba(255,255,255,0.6)",
              maxWidth: "500px",
              lineHeight: 1.7,
              marginBottom: "36px",
            }}
          >
            7-day forecasts for any Kenyan location — paired with an AI advisory
            on when to plant, irrigate, and harvest.
          </p>

          <SearchBar onSearch={handleSearch} isLoading={isLoadingWeather} />

          {weatherError && (
            <div style={{ marginTop: "16px" }}>
              <ErrorMessage message={weatherError} />
            </div>
          )}

          {/* Quick search chips */}
          <div
            style={{
              display: "flex",
              gap: "8px",
              marginTop: "20px",
              flexWrap: "wrap",
            }}
          >
            <span
              style={{
                fontSize: "13px",
                color: "rgba(255,255,255,0.35)",
                paddingTop: "6px",
              }}
            >
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

        {/* Weather loading spinner */}
        {isLoadingWeather && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "16px",
              padding: "80px 0",
            }}
          >
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
            <p style={{ fontSize: "15px", color: "var(--text-muted)" }}>
              Fetching forecast...
            </p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {/* Results — weather and advisory stacked */}
        {hasResults && (
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

            {/* Weather panel */}
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

            {/* Advisory loading */}
            {isLoadingAdvisory && (
              <div
                style={{
                  backgroundColor: "var(--bg-card)",
                  borderRadius: "20px",
                  border: "1px solid var(--border)",
                  padding: "32px",
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                }}
              >
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    border: "3px solid var(--border-input)",
                    borderTopColor: "var(--accent-green)",
                    animation: "spin 0.7s linear infinite",
                    flexShrink: 0,
                  }}
                />
                <div>
                  <p
                    style={{
                      fontSize: "15px",
                      fontWeight: 600,
                      color: "var(--text-primary)",
                    }}
                  >
                    Generating farm advisory...
                  </p>
                  <p
                    style={{
                      fontSize: "13px",
                      color: "var(--text-muted)",
                      marginTop: "2px",
                    }}
                  >
                    Groq AI is analysing your forecast
                  </p>
                </div>
              </div>
            )}

            {/* Advisory error */}
            {advisoryError && !isLoadingAdvisory && (
              <ErrorMessage message={advisoryError} />
            )}

            {/* Advisory panel */}
            {advisory && !isLoadingAdvisory && (
              <div
                style={{
                  backgroundColor: "var(--bg-card)",
                  borderRadius: "20px",
                  border: "1px solid var(--border)",
                  padding: "32px",
                }}
              >
                <AdvisoryPanel advisory={advisory} />
              </div>
            )}
          </div>
        )}

        {/* Empty state — before first search */}
        {showEmptyState && (
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
            <h3
              style={{
                fontSize: "20px",
                fontWeight: 700,
                color: "var(--text-primary)",
              }}
            >
              Search a location to begin
            </h3>
            <p
              style={{
                fontSize: "15px",
                color: "var(--text-secondary)",
                maxWidth: "380px",
                lineHeight: 1.6,
              }}
            >
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

          {/* Right — your personal identity */}
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

            <a
              href="https://www.linkedin.com/in/james-etole-6a7115145/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 14px",
                borderRadius: "999px",
                border: "1px solid var(--border-input)",
                backgroundColor: "var(--bg-input)",
                color: "var(--text-secondary)",
                fontSize: "13px",
                fontWeight: 500,
                textDecoration: "none",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "var(--accent-green-bg)";
                e.currentTarget.style.borderColor = "var(--accent-green)";
                e.currentTarget.style.color = "var(--accent)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "var(--bg-input)";
                e.currentTarget.style.borderColor = "var(--border-input)";
                e.currentTarget.style.color = "var(--text-secondary)";
              }}
            >
              {/* LinkedIn SVG icon — inline so no external image needed */}
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              LinkedIn
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
