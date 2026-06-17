// AI advisory client — uses Groq's Llama model to generate farm advice.
// Groq is free, requires no credit card, and is OpenAI-API-compatible.
// We call it from the Next.js API route so the key stays server-side only.

import type { DailyWeather, FarmAdvisory, Location } from "@/types";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "llama-3.3-70b-versatile";

// ─── Prompt Builder ───────────────────────────────────────────────────────────

function buildPrompt(location: Location, forecast: DailyWeather[]): string {
  const forecastSummary = forecast
    .map(
      (day) =>
        `- ${day.date}: ${day.description}, High ${day.maxTemp}°C / Low ${day.minTemp}°C, Rain ${day.precipitation}mm, Wind ${day.windSpeed}km/h`
    )
    .join("\n");

  return `You are an agricultural advisor for Kenyan farmers. Based on the 7-day weather forecast below, provide practical farm advisory advice. Be specific to the weather data — do not give generic tips.

Location: ${location.name}, ${location.country}
Coordinates: ${location.latitude.toFixed(2)}°N, ${location.longitude.toFixed(2)}°E

7-Day Forecast:
${forecastSummary}

Respond ONLY with a valid JSON object in exactly this shape — no markdown, no explanation, no backticks:
{
  "summary": "2-3 sentence overview of the week's weather and what it means for farming",
  "plantingAdvice": "Specific advice on whether to plant this week and what crops suit this forecast",
  "irrigationAdvice": "Specific advice on irrigation needs based on rainfall and temperature",
  "riskWarnings": ["warning 1", "warning 2"],
  "bestDaysToFarm": ["YYYY-MM-DD", "YYYY-MM-DD"]
}

Keep each field concise and actionable. bestDaysToFarm should list the 2-3 best days from the forecast for outdoor farm work based on weather conditions.`;
}

// ─── Main Export ──────────────────────────────────────────────────────────────

export async function generateFarmAdvisory(
  location: Location,
  forecast: DailyWeather[]
): Promise<FarmAdvisory> {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    throw new Error("GROQ_API_KEY is not set in environment variables.");
  }

  const response = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // Groq uses Bearer token auth — same pattern as OpenAI
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages: [
        {
          role: "system",
          content:
            "You are an expert agricultural advisor for Kenyan farmers. You always respond with valid JSON only — no markdown, no prose, no backticks.",
        },
        {
          role: "user",
          content: buildPrompt(location, forecast),
        },
      ],
      temperature: 0.4,
      max_tokens: 600,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      error?.error?.message ??
        `Groq API request failed with status ${response.status}`
    );
  }

  const data = await response.json();

  // Groq uses the same response shape as OpenAI
  const rawText: string = data?.choices?.[0]?.message?.content ?? "";

  if (!rawText) {
    throw new Error("Groq returned an empty response.");
  }

  // Strip any accidental markdown fences before parsing
  const cleaned = rawText
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  try {
    return JSON.parse(cleaned) as FarmAdvisory;
  } catch {
    throw new Error("Groq response could not be parsed as JSON.");
  }
}
