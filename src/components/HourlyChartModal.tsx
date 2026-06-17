// HourlyChartModal shows an hourly weather breakdown for a selected day.
// It receives the day's label and its array of hourly data points,
// then renders three Recharts charts — temperature, precipitation, wind.

"use client";

import { useEffect } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { HourlyDataPoint } from "@/types";

interface HourlyChartModalProps {
  date: string;
  locationName: string;
  hourlyData: HourlyDataPoint[];
  onClose: () => void;
}

// We only show every 3rd hour on the x-axis to avoid crowding
function tickFormatter(time: string): string {
  const hour = parseInt(time.split(":")[0], 10);
  return hour % 3 === 0 ? time : "";
}

function formatDateLabel(dateString: string): string {
  const date = new Date(dateString + "T00:00:00");
  return date.toLocaleDateString("en-KE", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

export default function HourlyChartModal({
  date,
  locationName,
  hourlyData,
  onClose,
}: HourlyChartModalProps) {
  // Close on Escape key
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  // Prevent body scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    // Backdrop — clicking outside the card closes the modal
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.6)",
        backdropFilter: "blur(4px)",
        zIndex: 200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      {/* Modal card — stop click propagation so clicking inside doesn't close */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: "var(--bg-card)",
          borderRadius: "24px",
          border: "1px solid var(--border)",
          width: "100%",
          maxWidth: "860px",
          maxHeight: "90vh",
          overflowY: "auto",
          padding: "32px",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            marginBottom: "28px",
          }}
        >
          <div>
            <p
              style={{
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--text-muted)",
                marginBottom: "4px",
              }}
            >
              Hourly Breakdown · {locationName}
            </p>
            <h2
              style={{
                fontSize: "22px",
                fontWeight: 700,
                color: "var(--text-primary)",
              }}
            >
              {formatDateLabel(date)}
            </h2>
          </div>

          <button
            onClick={onClose}
            aria-label="Close modal"
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              border: "1px solid var(--border)",
              backgroundColor: "var(--bg-input)",
              color: "var(--text-secondary)",
              fontSize: "18px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            ✕
          </button>
        </div>

        {/* Charts */}
        <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>

          {/* Temperature */}
          <ChartSection title="🌡️ Temperature" unit="°C">
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={hourlyData}>
                <defs>
                  <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4caf72" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#4caf72" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis
                  dataKey="time"
                  tickFormatter={tickFormatter}
                  tick={{ fontSize: 11, fill: "var(--text-muted)" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "var(--text-muted)" }}
                  axisLine={false}
                  tickLine={false}
                  unit="°"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--bg-card)",
                    border: "1px solid var(--border)",
                    borderRadius: "10px",
                    fontSize: "13px",
                    color: "var(--text-primary)",
                  }}
                  formatter={(value) => {
                    if (value === undefined || value === null) return ["—", "Temperature"];
                    return [`${Number(value)}°C`, "Temperature"];
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="temperature"
                  stroke="#4caf72"
                  strokeWidth={2.5}
                  fill="url(#tempGradient)"
                  dot={false}
                  activeDot={{ r: 5, fill: "#4caf72" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartSection>

          {/* Precipitation */}
          <ChartSection title="🌧️ Precipitation" unit="mm">
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis
                  dataKey="time"
                  tickFormatter={tickFormatter}
                  tick={{ fontSize: 11, fill: "var(--text-muted)" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "var(--text-muted)" }}
                  axisLine={false}
                  tickLine={false}
                  unit="mm"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--bg-card)",
                    border: "1px solid var(--border)",
                    borderRadius: "10px",
                    fontSize: "13px",
                    color: "var(--text-primary)",
                  }}
                  formatter={(value) => {
                    if (value === undefined || value === null) return ["—", "Precipitation"];
                    return [`${Number(value)} mm`, "Precipitation"];
                  }}
                />
                <Bar
                  dataKey="precipitation"
                  fill="#60a5fa"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={16}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartSection>

          {/* Wind Speed */}
          <ChartSection title="💨 Wind Speed" unit="km/h">
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis
                  dataKey="time"
                  tickFormatter={tickFormatter}
                  tick={{ fontSize: 11, fill: "var(--text-muted)" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "var(--text-muted)" }}
                  axisLine={false}
                  tickLine={false}
                  unit=" km/h"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--bg-card)",
                    border: "1px solid var(--border)",
                    borderRadius: "10px",
                    fontSize: "13px",
                    color: "var(--text-primary)",
                  }}
                  formatter={(value) => {
                    if (value === undefined || value === null) return ["—", "Wind Speed"];
                    return [`${Number(value)} km/h`, "Wind Speed"];
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="windSpeed"
                  stroke="#f59e0b"
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 5, fill: "#f59e0b" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartSection>

        </div>

        {/* Footer hint */}
        <p
          style={{
            textAlign: "center",
            fontSize: "12px",
            color: "var(--text-muted)",
            marginTop: "28px",
          }}
        >
          Click outside or press Esc to close
        </p>
      </div>
    </div>
  );
}

// ─── Sub-component ────────────────────────────────────────────────────────────

function ChartSection({
  title,
  unit,
  children,
}: {
  title: string;
  unit: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "12px",
        }}
      >
        <p
          style={{
            fontSize: "14px",
            fontWeight: 600,
            color: "var(--text-primary)",
          }}
        >
          {title}
        </p>
        <span
          style={{
            fontSize: "11px",
            color: "var(--text-muted)",
            backgroundColor: "var(--bg-chip)",
            padding: "2px 8px",
            borderRadius: "999px",
          }}
        >
          {unit}
        </span>
      </div>
      {children}
    </div>
  );
}
