// LinkedInButton is a Client Component purely because it needs
// onMouseEnter and onMouseLeave hover handlers.
// Keeping this isolated means the rest of the footer stays server-rendered.

"use client";

import type { MouseEvent } from "react";

export default function LinkedInButton() {
  function handleMouseEnter(e: MouseEvent<HTMLAnchorElement>) {
    e.currentTarget.style.backgroundColor = "var(--accent-green-bg)";
    e.currentTarget.style.borderColor = "var(--accent-green)";
    e.currentTarget.style.color = "var(--accent)";
  }

  function handleMouseLeave(e: MouseEvent<HTMLAnchorElement>) {
    e.currentTarget.style.backgroundColor = "var(--bg-input)";
    e.currentTarget.style.borderColor = "var(--border-input)";
    e.currentTarget.style.color = "var(--text-secondary)";
  }

  return (
    <a
      href="https://www.linkedin.com/in/james-etole-6a7115145/"
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: "flex",
        alignItems: "center",
        gap: "6px",
        padding: "6px 14px",
        borderRadius: "999px",
        border: "1px solid var(--border-input)",
        backgroundColor: "var(--bg-input)",
        color: "var(--text-secondary)",
        fontSize: "13px",
        fontWeight: 500,
        textDecoration: "none",
        transition: "all 0.2s ease",
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
      LinkedIn
    </a>
  );
}
