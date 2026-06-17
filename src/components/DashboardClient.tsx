"use client";

import { useState } from "react";
import type { FarmAdvisory, WeatherForecast } from "@/types";
import { getWeatherForecast } from "@/lib/weather";
import { fetchFarmAdvisory } from "@/lib/advisory";
import SearchBar from "@/components/SearchBar";
import WeatherPanel from "@/components/WeatherPanel";
import AdvisoryPanel from "@/components/AdvisoryPanel";
import ErrorMessage from "@/components/ErrorMessage";

const QUICK_SEARCHES = ["Bomet", "Nairobi", "Nakuru", "Kisumu", "Meru", "Eldoret"];

export default function DashboardClient() {
  const [forecast, setForecast] = useState<WeatherForecast | null>(null);
  const [advisory, setAdvisory] = useState<FarmAdvisory | null>(null);
  const [isLoadingWeather, setIsLoadingWeather] = useState(false);
  const [isLoadingAdvisory, setIsLoadingAdvisory] = useState(false);
  const [weatherError, setWeatherError] = useState<string | null>(null);
  const [advisoryError, setAdvisoryError] = useState<string | null>(null);

  async function handleSearch(query: string) {
    setIsLoadingWeather(true);
    setWeatherError(null);
    setAdvisoryError(null);
    setForecast(null);
    setAdvisory(null);

    try {
      // Step 1 — fetch weather
      const weatherData = await getWeatherForecast(query);
      setForecast(weatherData);
      setIsLoadingWeather(false);

      // Step 2 — use the weather data to generate the AI advisory
      setIsLoadingAdvisory(true);
      const advisoryData = await fetchFarmAdvisory(
        weatherData.location,
        weatherData.daily
      );
      setAdvisory(advisoryData);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong.";

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
    <>
      {/* ── Hero ───────────────────────────────────────────────────── */}
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
                  e.currentTarget.style.backgroundColor =
                    "rgba(255,255,255,0.15)";
                  e.currentTarget.style.color = "#fff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor =
                    "rgba(255,255,255,0.07)";
                  e.currentTarget.style.color = "rgba(255,255,255,0.75)";
                }}
              >
                {city}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Results ────────────────────────────────────────────────── */}
      <main style={{ maxWidth: "1100px", margin: "0 auto", padding: "48px 24px" }}>

        {/* Weather loading */}
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

        {/* Results — weather and advisory */}
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

        {/* Empty state */}
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
    </>
  );
}
