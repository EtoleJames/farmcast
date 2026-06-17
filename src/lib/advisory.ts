// advisory.ts is the client-side function that fetches the farm advisory.
// It calls our own Next.js API route (/api/advisory), which in turn
// calls Groq on the server. This keeps the Groq API key server-side only.

import type { DailyWeather, FarmAdvisory, Location } from "@/types";

export async function fetchFarmAdvisory(
  location: Location,
  forecast: DailyWeather[]
): Promise<FarmAdvisory> {
  const response = await fetch("/api/advisory", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ location, forecast }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error?.error ?? "Failed to fetch farm advisory.");
  }

  return response.json();
}
