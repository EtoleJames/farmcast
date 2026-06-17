// AdvisoryPanel displays the AI-generated farm advisory.
// It receives a FarmAdvisory object and renders each field
// in a structured, scannable layout a farmer can act on quickly.

import type { FarmAdvisory } from "@/types";

interface AdvisoryPanelProps {
  advisory: FarmAdvisory;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString + "T00:00:00");
  return date.toLocaleDateString("en-KE", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
}

export default function AdvisoryPanel({ advisory }: AdvisoryPanelProps) {
  return (
    <section>
      {/* Section label */}
      <div style={{ marginBottom: "24px" }}>
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
          AI Farm Advisory
        </p>
        <h2
          style={{
            fontSize: "22px",
            fontWeight: 700,
            color: "var(--text-primary)",
          }}
        >
          This Week on Your Farm
        </h2>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

        {/* Summary card */}
        <div
          style={{
            padding: "20px",
            borderRadius: "16px",
            backgroundColor: "var(--accent-green-bg)",
            border: "1px solid var(--border)",
          }}
        >
          <p
            style={{
              fontSize: "13px",
              fontWeight: 700,
              color: "var(--accent-green)",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              marginBottom: "8px",
            }}
          >
            🌿 Weekly Overview
          </p>
          <p
            style={{
              fontSize: "15px",
              lineHeight: 1.7,
              color: "var(--text-primary)",
            }}
          >
            {advisory.summary}
          </p>
        </div>

        {/* Planting + Irrigation — stack on mobile, side by side on desktop */}
        <style>{`
          .advisory-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 16px;
          }
          @media (min-width: 640px) {
            .advisory-grid {
              grid-template-columns: 1fr 1fr;
            }
          }
        `}</style>

        <div className="advisory-grid">
          <AdvisoryCard
            emoji="🌱"
            label="Planting"
            content={advisory.plantingAdvice}
          />
          <AdvisoryCard
            emoji="💧"
            label="Irrigation"
            content={advisory.irrigationAdvice}
          />
        </div>

        {/* Risk warnings */}
        {advisory.riskWarnings.length > 0 && (
          <div
            style={{
              padding: "20px",
              borderRadius: "16px",
              backgroundColor: "rgba(239,68,68,0.06)",
              border: "1px solid rgba(239,68,68,0.15)",
            }}
          >
            <p
              style={{
                fontSize: "13px",
                fontWeight: 700,
                color: "#dc2626",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                marginBottom: "12px",
              }}
            >
              ⚠️ Risk Warnings
            </p>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              {advisory.riskWarnings.map((warning, index) => (
                <li
                  key={index}
                  style={{
                    display: "flex",
                    gap: "10px",
                    fontSize: "14px",
                    lineHeight: 1.6,
                    color: "var(--text-primary)",
                  }}
                >
                  <span
                    style={{
                      color: "#dc2626",
                      flexShrink: 0,
                      marginTop: "2px",
                    }}
                  >
                    •
                  </span>
                  {warning}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Best days to farm */}
        {advisory.bestDaysToFarm.length > 0 && (
          <div
            style={{
              padding: "20px",
              borderRadius: "16px",
              backgroundColor: "var(--bg-card)",
              border: "1px solid var(--border)",
            }}
          >
            <p
              style={{
                fontSize: "13px",
                fontWeight: 700,
                color: "var(--accent-green)",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                marginBottom: "12px",
              }}
            >
              ✅ Best Days to Farm This Week
            </p>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              {advisory.bestDaysToFarm.map((date) => (
                <span
                  key={date}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "999px",
                    backgroundColor: "var(--accent-green-bg)",
                    border: "1px solid var(--border)",
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "var(--accent)",
                  }}
                >
                  {formatDate(date)}
                </span>
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}

// ─── Sub-component ────────────────────────────────────────────────────────────
// Small reusable card used for Planting and Irrigation sections.
// Kept in this file because it is only ever used by AdvisoryPanel.

function AdvisoryCard({
  emoji,
  label,
  content,
}: {
  emoji: string;
  label: string;
  content: string;
}) {
  return (
    <div
      style={{
        padding: "20px",
        borderRadius: "16px",
        backgroundColor: "var(--bg-card)",
        border: "1px solid var(--border)",
      }}
    >
      <p
        style={{
          fontSize: "13px",
          fontWeight: 700,
          color: "var(--text-muted)",
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          marginBottom: "10px",
        }}
      >
        {emoji} {label}
      </p>
      <p
        style={{
          fontSize: "14px",
          lineHeight: 1.7,
          color: "var(--text-primary)",
        }}
      >
        {content}
      </p>
    </div>
  );
}
