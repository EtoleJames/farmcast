interface ErrorMessageProps {
  message: string;
}

export default function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "12px",
        padding: "14px 18px",
        borderRadius: "14px",
        border: "1px solid rgba(220,38,38,0.2)",
        backgroundColor: "rgba(220,38,38,0.06)",
        marginTop: "16px",
        maxWidth: "640px",
      }}
    >
      <span style={{ fontSize: "16px", marginTop: "1px", flexShrink: 0 }}>⚠️</span>
      <div>
        <p style={{ fontWeight: 600, fontSize: "14px", color: "#dc2626", marginBottom: "2px" }}>
          Could not load forecast
        </p>
        <p style={{ fontSize: "13px", color: "#dc2626", opacity: 0.75 }}>{message}</p>
      </div>
    </div>
  );
}
