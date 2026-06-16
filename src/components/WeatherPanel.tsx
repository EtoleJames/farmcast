// WeatherPanel receives a full WeatherForecast and renders
// the location header and the 7-day grid of WeatherCards.
// It has no data-fetching logic — that lives in page.tsx.

import type { WeatherForecast } from "@/types";
import WeatherCard from "./WeatherCard";

interface WeatherPanelProps {
  forecast: WeatherForecast;
}

export default function WeatherPanel({ forecast }: WeatherPanelProps) {
  const { location, daily } = forecast;

  return (
    <section className="w-full">
      {/* Location header */}
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-green-800">
          {location.name}
          <span className="text-green-500 font-normal text-lg ml-2">
            {location.country}
          </span>
        </h2>
        <p className="text-sm text-gray-400 mt-0.5">7-day weather forecast</p>
      </div>

      {/* Forecast grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {daily.map((day, index) => (
          <WeatherCard
            key={day.date}
            day={day}
            isToday={index === 0}
          />
        ))}
      </div>
    </section>
  );
}
