// WeatherCard renders one day of forecast data.
// Clicking the card opens the HourlyChartModal for that day.

"use client";

import { useState } from "react";
import type { DailyWeather, HourlyDataPoint } from "@/types";
import HourlyChartModal from "./HourlyChartModal";

interface WeatherCardProps {
  day: DailyWeather;
  isToday: boolean;
  hourlyData: HourlyDataPoint[];
  locationName: string;
}

function getWeatherEmoji(code: number): string {
  if (code === 0 || code === 1) return "☀️";
  if (code === 2) return "⛅";
  if (code === 3) return "☁️";
  if (code >= 45 && code <= 48) return "🌫️";
  if (code >= 51 && code <= 67) return "🌧️";
  if (code >= 71 && code <= 77) return "❄️";
  if (code >= 80 && code <= 82) return "🌦️";
  if (code >= 95) return "⛈️";
  return "🌡️";
}

function formatDate(dateString: string, isToday: boolean): string {
  if (isToday) return "Today";
  const date = new Date(dateString + "T00:00:00");
  return date.toLocaleDateString("en-KE", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export default function WeatherCard({
  day,
  isToday,
  hourlyData,
  locationName,
}: WeatherCardProps) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div
        onClick={() => setShowModal(true)}
        role="button"
        tabIndex={0}
        aria-label={`View hourly forecast for ${formatDate(day.date, isToday)}`}
        onKeyDown={(e) => { if (e.key === "Enter") setShowModal(true); }}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "10px",
          padding: "16px 12px",
          borderRadius: "16px",
          border: isToday ? "none" : "1px solid var(--border)",
          backgroundColor: isToday ? "var(--today-bg)" : "var(--bg-card)",
          color: isToday ? "var(--today-text)" : "var(--text-primary)",
          transform: isToday ? "scale(1.04)" : "scale(1)",
          boxShadow: isToday ? "0 8px 24px rgba(0,0,0,0.15)" : "none",
          cursor: "pointer",
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
          userSelect: "none",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = isToday ? "scale(1.07)" : "scale(1.03)";
          e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.15)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = isToday ? "scale(1.04)" : "scale(1)";
          e.currentTarget.style.boxShadow = isToday ? "0 8px 24px rgba(0,0,0,0.15)" : "none";
        }}
      >
        <p
          style={{
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: isToday ? "var(--today-muted)" : "var(--text-muted)",
          }}
        >
          {formatDate(day.date, isToday)}
        </p>

        <span style={{ fontSize: "36px", lineHeight: 1 }}>
          {getWeatherEmoji(day.weatherCode)}
        </span>

        <p
          style={{
            fontSize: "11px",
            textAlign: "center",
            lineHeight: 1.4,
            color: isToday ? "var(--today-muted)" : "var(--text-secondary)",
          }}
        >
          {day.description}
        </p>

        <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
          <span style={{ fontSize: "20px", fontWeight: 700 }}>{day.maxTemp}°</span>
          <span
            style={{
              fontSize: "14px",
              color: isToday ? "var(--today-muted)" : "var(--text-muted)",
            }}
          >
            {day.minTemp}°
          </span>
        </div>

        <div
          style={{
            width: "100%",
            paddingTop: "10px",
            borderTop: `1px solid ${isToday ? "rgba(255,255,255,0.12)" : "var(--border)"}`,
            display: "flex",
            flexDirection: "column",
            gap: "6px",
          }}
        >
          {[
            { label: "Rain", value: `${day.precipitation} mm` },
            { label: "Wind", value: `${day.windSpeed} km/h` },
          ].map(({ label, value }) => (
            <div
              key={label}
              style={{ display: "flex", justifyContent: "space-between", fontSize: "11px" }}
            >
              <span
                style={{
                  color: isToday ? "var(--today-muted)" : "var(--text-muted)",
                }}
              >
                {label}
              </span>
              <span style={{ fontWeight: 600 }}>{value}</span>
            </div>
          ))}
        </div>

        {/* Tap hint at the bottom of the card */}
        <p
          style={{
            fontSize: "10px",
            color: isToday ? "var(--today-muted)" : "var(--text-muted)",
            marginTop: "2px",
          }}
        >
          Tap for hourly ↗
        </p>
      </div>

      {/* Modal renders outside the card flow via this conditional */}
      {showModal && (
        <HourlyChartModal
          date={day.date}
          locationName={locationName}
          hourlyData={hourlyData}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
