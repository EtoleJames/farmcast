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
  date: string;           // ISO date string e.g. "2024-03-15"
  maxTemp: number;        // °C
  minTemp: number;        // °C
  precipitation: number;  // mm
  windSpeed: number;      // km/h
  weatherCode: number;    // WMO weather interpretation code
  description: string;    // human-readable e.g. "Partly Cloudy"
}

export interface WeatherForecast {
  location: Location;
  daily: DailyWeather[];
}

// ─── Advisory ────────────────────────────────────────────────────────────────

export interface FarmAdvisory {
  summary: string;
  plantingAdvice: string;
  irrigationAdvice: string;
  riskWarnings: string[];
  bestDaysToFarm: string[];
}

// ─── API Response shapes ─────────────────────────────────────────────────────

// Open-Meteo geocoding response
export interface GeocodingResult {
  id: number;
  name: string;
  country: string;
  admin1?: string; 
  latitude: number;
  longitude: number;
}

// Open-Meteo forecast response (only the fields we use)
export interface OpenMeteoResponse {
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_sum: number[];
    wind_speed_10m_max: number[];
    weather_code: number[];
  };
}
