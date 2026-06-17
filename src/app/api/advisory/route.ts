// This API route sits between the browser and Groq.
// The browser POSTs weather data here, and this route calls Groq
// using the server-side API key. The key is never sent to the browser.

import { NextRequest, NextResponse } from "next/server";
import { generateFarmAdvisory } from "@/lib/groq";
import type { DailyWeather, Location } from "@/types";

interface AdvisoryRequestBody {
  location: Location;
  forecast: DailyWeather[];
}

export async function POST(request: NextRequest) {
  let body: AdvisoryRequestBody;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body — expected JSON." },
      { status: 400 }
    );
  }

  const { location, forecast } = body;

  if (!location || !forecast || forecast.length === 0) {
    return NextResponse.json(
      { error: "Request must include location and forecast data." },
      { status: 400 }
    );
  }

  try {
    const advisory = await generateFarmAdvisory(location, forecast);
    return NextResponse.json(advisory);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to generate advisory.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
