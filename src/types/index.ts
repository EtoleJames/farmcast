// These are the shared TypeScript types for the entire FarmCast app.
// Keeping them in one place means if the API shape changes,
// we only update it here and TypeScript will catch every broken reference.

// ─── Location ────────────────────────────────────────────────────────────────

export interface Location {
  name: string;
  country: string;
  latitude: number;
  longitude: number;
}

// ─── Weather ─────────────────────────────────────────────────────────────────

export interface DailyWeather {
  date: string;
  maxTemp: number;
  minTemp: number;
  precipitation: number;
  windSpeed: number;
  weatherCode: number;
  description: string;
}

export interface WeatherForecast {
  location: Location;
  daily: DailyWeather[];
  // Hourly data is stored here keyed by date string e.g. "2024-03-15"
  // so each WeatherCard can look up its own day's hourly data on click
  hourlyByDate: Record<string, HourlyDataPoint[]>;
}

// A single hour's weather data — used to power the chart modal
export interface HourlyDataPoint {
  // Display time e.g. "14:00" — shown on the chart x-axis
  time: string;
  temperature: number;
  precipitation: number;
  windSpeed: number;
}

// ─── Advisory ────────────────────────────────────────────────────────────────

export interface FarmAdvisory {
  summary: string;
  plantingAdvice: string;
  irrigationAdvice: string;
  riskWarnings: string[];
  bestDaysToFarm: string[];
}

// ─── API Response shapes ──────────────────────────────────────────────────────

export interface GeocodingResult {
  id: number;
  name: string;
  country: string;
  admin1?: string;
  latitude: number;
  longitude: number;
}

export interface OpenMeteoResponse {
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_sum: number[];
    wind_speed_10m_max: number[];
    weather_code: number[];
  };
  // Hourly arrays — same length, one entry per hour across all 7 days
  hourly: {
    time: string[];
    temperature_2m: number[];
    precipitation: number[];
    wind_speed_10m: number[];
  };
}
