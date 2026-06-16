// Weather service — all Open-Meteo API calls live here.
// The rest of the app never talks to Open-Meteo directly;
// it goes through these functions. This makes it easy to
// swap the weather provider later without touching the UI.

import type {
  DailyWeather,
  GeocodingResult,
  Location,
  OpenMeteoResponse,
  WeatherForecast,
} from "@/types";

const GEO_BASE_URL = "https://geocoding-api.open-meteo.com/v1";
const FORECAST_BASE_URL = "https://api.open-meteo.com/v1";

// ─── WMO Weather Code Descriptions ───────────────────────────────────────────
// Open-Meteo returns numeric WMO codes. We translate them to
// plain English so the UI and Gemini both get readable descriptions.

const WMO_DESCRIPTIONS: Record<number, string> = {
  0: "Clear Sky",
  1: "Mainly Clear",
  2: "Partly Cloudy",
  3: "Overcast",
  45: "Foggy",
  48: "Icy Fog",
  51: "Light Drizzle",
  53: "Moderate Drizzle",
  55: "Heavy Drizzle",
  61: "Light Rain",
  63: "Moderate Rain",
  65: "Heavy Rain",
  71: "Light Snow",
  73: "Moderate Snow",
  75: "Heavy Snow",
  80: "Light Showers",
  81: "Moderate Showers",
  82: "Heavy Showers",
  95: "Thunderstorm",
  96: "Thunderstorm with Hail",
  99: "Thunderstorm with Heavy Hail",
};

function getWeatherDescription(code: number): string {
  return WMO_DESCRIPTIONS[code] ?? "Unknown";
}

// ─── Geocoding ────────────────────────────────────────────────────────────────
// Converts a place name like "Bomet, Kenya" into lat/lng coordinates.

export async function geocodeLocation(query: string): Promise<Location> {
  const url = `${GEO_BASE_URL}/search?name=${encodeURIComponent(query)}&count=1&language=en&format=json`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Geocoding request failed with status ${response.status}`);
  }

  const data = await response.json();

  if (!data.results || data.results.length === 0) {
    throw new Error(
      `No location found for "${query}". Try a more specific name.`
    );
  }

  const result: GeocodingResult = data.results[0];

  return {
    name: result.name,
    country: result.country,
    latitude: result.latitude,
    longitude: result.longitude,
  };
}

// ─── Forecast ─────────────────────────────────────────────────────────────────
// Fetches a 7-day daily forecast for given coordinates.

async function fetchForecast(
  latitude: number,
  longitude: number
): Promise<DailyWeather[]> {
  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    daily:
      "temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max,weather_code",
    timezone: "auto",
    forecast_days: "7",
  });

  const url = `${FORECAST_BASE_URL}/forecast?${params}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Forecast request failed with status ${response.status}`);
  }

  const data: OpenMeteoResponse = await response.json();

  // Zip the parallel arrays from Open-Meteo into an array of objects.
  // Open-Meteo returns { time: [...], temperature_2m_max: [...] } etc.
  // We want [{ date, maxTemp, ... }, ...] — much easier to work with in the UI.
  return data.daily.time.map((date, index) => ({
    date,
    maxTemp: Math.round(data.daily.temperature_2m_max[index]),
    minTemp: Math.round(data.daily.temperature_2m_min[index]),
    precipitation: data.daily.precipitation_sum[index],
    windSpeed: Math.round(data.daily.wind_speed_10m_max[index]),
    weatherCode: data.daily.weather_code[index],
    description: getWeatherDescription(data.daily.weather_code[index]),
  }));
}

// ─── Main Export ──────────────────────────────────────────────────────────────
// This is the single function the UI calls. It geocodes the location
// then fetches the forecast and returns everything together.

export async function getWeatherForecast(
  query: string
): Promise<WeatherForecast> {
  const location = await geocodeLocation(query);
  const daily = await fetchForecast(location.latitude, location.longitude);

  return { location, daily };
}
