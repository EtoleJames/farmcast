// WeatherCard renders one day of forecast data.
// Keeping this as its own component means WeatherPanel
// stays clean and this card can be tested or restyled independently.

import type { DailyWeather } from "@/types";

interface WeatherCardProps {
  day: DailyWeather;
  isToday: boolean;
}

// Maps WMO weather codes to simple emojis so users get
// a visual cue at a glance without needing to read the description.
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

export default function WeatherCard({ day, isToday }: WeatherCardProps) {
  return (
    <div
      className={`
        flex flex-col items-center gap-2 p-4 rounded-2xl border
        ${
          isToday
            ? "bg-green-700 text-white border-green-600 shadow-lg scale-105"
            : "bg-white text-gray-700 border-green-100 hover:shadow-md"
        }
        transition-all duration-200
      `}
    >
      <p className={`text-sm font-semibold ${isToday ? "text-green-100" : "text-gray-500"}`}>
        {formatDate(day.date, isToday)}
      </p>

      <span className="text-3xl">{getWeatherEmoji(day.weatherCode)}</span>

      <p className={`text-xs text-center ${isToday ? "text-green-100" : "text-gray-400"}`}>
        {day.description}
      </p>

      <div className="flex gap-2 text-sm font-bold">
        <span>{day.maxTemp}°</span>
        <span className={isToday ? "text-green-200" : "text-gray-400"}>
          {day.minTemp}°
        </span>
      </div>

      <div className={`text-xs space-y-0.5 text-center ${isToday ? "text-green-100" : "text-gray-400"}`}>
        <p>🌧 {day.precipitation} mm</p>
        <p>💨 {day.windSpeed} km/h</p>
      </div>
    </div>
  );
}
