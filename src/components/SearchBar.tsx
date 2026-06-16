// SearchBar shows location suggestions as the user types.
// Selecting a suggestion immediately triggers the weather search.
// The user can also finish typing and the debounce will fire naturally.

"use client";

import { useState, useEffect, useRef } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { getLocationSuggestions } from "@/lib/weather";
import type { GeocodingResult } from "@/types";

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

export default function SearchBar({ onSearch, isLoading }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<GeocodingResult[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isFetchingSuggestions, setIsFetchingSuggestions] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);

  const lastSearchedQuery = useRef<string>("");
  const containerRef = useRef<HTMLDivElement>(null);

  const debouncedQuery = useDebounce(query, 350);

  // Fetch suggestions whenever the debounced query changes
  useEffect(() => {
    const trimmed = debouncedQuery.trim();

    if (trimmed.length < 2) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    // Don't re-fetch suggestions for something we already searched
    if (trimmed === lastSearchedQuery.current) return;

    setIsFetchingSuggestions(true);

    getLocationSuggestions(trimmed)
      .then((results) => {
        setSuggestions(results);
        setShowDropdown(results.length > 0);
        setActiveSuggestion(-1);
      })
      .finally(() => setIsFetchingSuggestions(false));
  }, [debouncedQuery]);

  // Close dropdown when clicking outside the component
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // When a suggestion is picked — fill the input, fire search, close dropdown
  function handleSelectSuggestion(result: GeocodingResult) {
    const label = `${result.name}, ${result.country}`;
    setQuery(label);
    setSuggestions([]);
    setShowDropdown(false);
    lastSearchedQuery.current = label;
    onSearch(label);
  }

  // Keyboard navigation — arrow keys move through suggestions, Enter selects
  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!showDropdown) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveSuggestion((prev) => Math.min(prev + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveSuggestion((prev) => Math.max(prev - 1, -1));
    } else if (e.key === "Enter" && activeSuggestion >= 0) {
      e.preventDefault();
      handleSelectSuggestion(suggestions[activeSuggestion]);
    } else if (e.key === "Escape") {
      setShowDropdown(false);
    }
  }

  return (
    <div
      ref={containerRef}
      style={{ position: "relative", width: "100%", maxWidth: "640px" }}
    >
      {/* ── Input ── */}
      <div style={{ position: "relative" }}>
        <span
          style={{
            position: "absolute",
            left: "16px",
            top: "50%",
            transform: "translateY(-50%)",
            pointerEvents: "none",
            display: "flex",
            alignItems: "center",
          }}
        >
          {isLoading || isFetchingSuggestions ? (
            <span
              style={{
                display: "inline-block",
                width: "18px",
                height: "18px",
                border: "2px solid var(--border-input)",
                borderTopColor: "var(--accent-green)",
                borderRadius: "50%",
                animation: "spin 0.7s linear infinite",
              }}
            />
          ) : (
            <span style={{ fontSize: "18px" }}>🔍</span>
          )}
        </span>

        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActiveSuggestion(-1);
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (suggestions.length > 0) setShowDropdown(true);
          }}
          placeholder="Type a location — Bomet, Nakuru, Kisumu..."
          disabled={isLoading}
          autoComplete="off"
          style={{
            width: "100%",
            paddingLeft: "48px",
            paddingRight: query.length > 0 ? "40px" : "16px",
            paddingTop: "14px",
            paddingBottom: "14px",
            borderRadius: showDropdown ? "14px 14px 0 0" : "14px",
            border: "1.5px solid var(--border-input)",
            borderBottom: showDropdown ? "1.5px solid var(--border)" : "1.5px solid var(--border-input)",
            backgroundColor: "var(--bg-input)",
            color: "var(--text-primary)",
            fontSize: "15px",
            outline: "none",
            transition: "border-color 0.2s ease, box-shadow 0.2s ease",
          }}
          onFocusCapture={(e) => {
            e.target.style.borderColor = "var(--accent-green)";
            e.target.style.boxShadow = "0 0 0 3px rgba(76,175,114,0.15)";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "var(--border-input)";
            e.target.style.boxShadow = "none";
          }}
        />

        {/* Clear button — only shown when there is text */}
        {query.length > 0 && (
          <button
            onClick={() => {
              setQuery("");
              setSuggestions([]);
              setShowDropdown(false);
              lastSearchedQuery.current = "";
            }}
            style={{
              position: "absolute",
              right: "14px",
              top: "50%",
              transform: "translateY(-50%)",
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "16px",
              color: "var(--text-muted)",
              padding: "4px",
              display: "flex",
              alignItems: "center",
            }}
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      {/* ── Suggestions Dropdown ── */}
      {showDropdown && suggestions.length > 0 && (
        <ul
          role="listbox"
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            backgroundColor: "var(--bg-card)",
            border: "1.5px solid var(--accent-green)",
            borderTop: "none",
            borderRadius: "0 0 14px 14px",
            overflow: "hidden",
            zIndex: 100,
            listStyle: "none",
            padding: 0,
            margin: 0,
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
          }}
        >
          {suggestions.map((result, index) => {
            const isActive = index === activeSuggestion;
            const adminLabel = [result.admin1, result.country]
              .filter(Boolean)
              .join(", ");

            return (
              <li
                key={result.id}
                role="option"
                aria-selected={isActive}
                onMouseDown={() => handleSelectSuggestion(result)}
                onMouseEnter={() => setActiveSuggestion(index)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "12px 16px",
                  cursor: "pointer",
                  backgroundColor: isActive ? "var(--accent-green-bg)" : "transparent",
                  borderBottom:
                    index < suggestions.length - 1
                      ? "1px solid var(--border)"
                      : "none",
                  transition: "background-color 0.1s ease",
                }}
              >
                {/* Pin icon */}
                <span style={{ fontSize: "16px", flexShrink: 0 }}>📍</span>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "var(--text-primary)",
                      margin: 0,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {result.name}
                  </p>
                  {adminLabel && (
                    <p
                      style={{
                        fontSize: "12px",
                        color: "var(--text-muted)",
                        margin: 0,
                        marginTop: "1px",
                      }}
                    >
                      {adminLabel}
                    </p>
                  )}
                </div>

                {/* Subtle enter hint on active item */}
                {isActive && (
                  <span style={{ fontSize: "11px", color: "var(--text-muted)", flexShrink: 0 }}>
                    ↵ select
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
