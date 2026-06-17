// Gemini client — all communication with the Gemini API lives here.
// The rest of the app calls generateFarmAdvisory and never touches
// the Gemini API directly. This keeps the AI logic in one place.

import type { DailyWeather, FarmAdvisory, Location } from "@/types";

const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

// ─── Prompt Builder ───────────────────────────────────────────────────────────
// We build a structured prompt that gives Gemini all the weather context
// it needs to generate advice that is specific to this location and forecast,
// not generic farming tips it could have made up without the data.

function buildPrompt(location: Location, forecast: DailyWeather[]): string {
  const forecastSummary = forecast
    .map((day) =>
      `- ${day.date}: ${day.description}, High ${day.maxTemp}°C / Low ${day.minTemp}°C, Rain ${day.precipitation}mm, Wind ${day.windSpeed}km/h`
    )
    .join("\n");

  return `
You are an agricultural advisor for Kenyan farmers. Based on the 7-day weather forecast below,
provide practical farm advisory advice. Be specific to the weather data — do not give generic tips.

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

Keep each field concise and actionable. bestDaysToFarm should list the 2-3 best days from the forecast
for outdoor farm work based on weather conditions.
  `.trim();
}

// ─── Main Export ──────────────────────────────────────────────────────────────

export async function generateFarmAdvisory(
  location: Location,
  forecast: DailyWeather[]
): Promise<FarmAdvisory> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set in environment variables.");
  }

  const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: buildPrompt(location, forecast) }],
        },
      ],
      generationConfig: {
        temperature: 0.4,   // Low temperature = factual, consistent responses
        maxOutputTokens: 600,
      },
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      error?.error?.message ?? `Gemini API request failed with status ${response.status}`
    );
  }

  const data = await response.json();

  // Extract the text content from Gemini's response structure
  const rawText: string =
    data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

  if (!rawText) {
    throw new Error("Gemini returned an empty response.");
  }

  // Strip any accidental markdown fences before parsing
  const cleaned = rawText
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  try {
    const parsed = JSON.parse(cleaned) as FarmAdvisory;
    return parsed;
  } catch {
    throw new Error("Gemini response could not be parsed as JSON.");
  }
}
