"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // After mount, read the actual DOM state set by the inline <head> script
    setIsDark(document.documentElement.classList.contains("dark"));
    setMounted(true);
  }, []);

  function toggle() {
    const html = document.documentElement;
    const nextDark = !isDark;

    if (nextDark) {
      html.classList.add("dark");
      localStorage.setItem("farmcast-theme", "dark");
    } else {
      html.classList.remove("dark");
      localStorage.setItem("farmcast-theme", "light");
    }

    setIsDark(nextDark);
  }

  // Render a placeholder the same size as the button until we know the theme.
  // This prevents a layout shift when the button label changes after mount.
  if (!mounted) {
    return (
      <div
        style={{
          width: "90px",
          height: "36px",
          borderRadius: "999px",
          backgroundColor: "var(--border-input)",
          opacity: 0.4,
        }}
      />
    );
  }

  return (
    <button
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "8px 16px",
        borderRadius: "999px",
        border: "1px solid var(--border-input)",
        backgroundColor: "var(--bg-card)",
        color: "var(--text-secondary)",
        fontSize: "14px",
        fontWeight: 500,
        cursor: "pointer",
        transition: "all 0.2s ease",
        minWidth: "90px",
      }}
    >
      <span style={{ fontSize: "16px" }}>{isDark ? "☀️" : "🌙"}</span>
      <span>{isDark ? "Light" : "Dark"}</span>
    </button>
  );
}
