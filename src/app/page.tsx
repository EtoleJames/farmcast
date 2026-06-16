"use client";

import { useState } from "react";
import type { WeatherForecast } from "@/types";
import { getWeatherForecast } from "@/lib/weather";
import SearchBar from "@/components/SearchBar";
import WeatherPanel from "@/components/WeatherPanel";
import ErrorMessage from "@/components/ErrorMessage";

export default function Home() {
  const [forecast, setForecast] = useState<WeatherForecast | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSearch(query: string) {
    // Reset previous results before each new search
    setIsLoading(true);
    setError(null);
    setForecast(null);

    try {
      const data = await getWeatherForecast(query);
      setForecast(data);
    } catch (err) {
      // Show the error message from the weather service,
      // or fall back to a generic message if it's unexpected
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-green-50">
      {/* Header */}
      <header className="bg-white border-b border-green-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-5">
          <h1 className="text-2xl font-bold text-green-800 mb-1">
            🌱 FarmCast
          </h1>
          <p className="text-sm text-gray-500">
            Farm intelligence dashboard — weather forecasts and AI advisories
          </p>
        </div>
      </header>

      {/* Search */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <SearchBar onSearch={handleSearch} isLoading={isLoading} />

        {error && <ErrorMessage message={error} />}

        {/* Loading skeleton */}
        {isLoading && (
          <div className="mt-10 text-center text-green-700 font-medium animate-pulse">
            Fetching forecast for your location...
          </div>
        )}

        {/* Results */}
        {forecast && !isLoading && (
          <div className="mt-10">
            <WeatherPanel forecast={forecast} />
          </div>
        )}

        {/* Empty state — shown before any search */}
        {!forecast && !isLoading && !error && (
          <div className="mt-16 text-center text-gray-400">
            <p className="text-5xl mb-4">🌦️</p>
            <p className="text-lg font-medium">Search a location to get started</p>
            <p className="text-sm mt-1">
              Try <span className="text-green-600 font-medium">Bomet, Kenya</span> or{" "}
              <span className="text-green-600 font-medium">Nairobi</span>
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
