// WeatherPanel receives a complete WeatherForecast and renders
// the location header and the 7-day grid of WeatherCards.

import type { WeatherForecast } from "@/types";
import WeatherCard from "./WeatherCard";

interface WeatherPanelProps {
  forecast: WeatherForecast;
}

export default function WeatherPanel({ forecast }: WeatherPanelProps) {
  const { location, daily, hourlyByDate } = forecast;

  return (
    <section>
      <div style={{ marginBottom: "24px" }}>
        <p
          style={{
            fontSize: "12px",
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "var(--text-muted)",
            marginBottom: "4px",
          }}
        >
          7-Day Forecast · Tap a card for hourly detail
        </p>
        <h2
          style={{ fontSize: "22px", fontWeight: 700, color: "var(--text-primary)" }}
        >
          {location.name},{" "}
          <span style={{ color: "var(--accent-green)", fontWeight: 400 }}>
            {location.country}
          </span>
        </h2>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: "10px",
        }}
      >
        {daily.map((day, index) => (
          <WeatherCard
            key={day.date}
            day={day}
            isToday={index === 0}
            hourlyData={hourlyByDate[day.date] ?? []}
            locationName={location.name}
          />
        ))}
      </div>
    </section>
  );
}
