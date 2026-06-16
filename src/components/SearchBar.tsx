"use client";

import { useState, type SyntheticEvent } from "react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

export default function SearchBar({ onSearch, isLoading }: SearchBarProps) {
  const [query, setQuery] = useState("");

  function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmed = query.trim();
    if (!trimmed) return;

    onSearch(trimmed);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex gap-2 w-full max-w-xl mx-auto"
    >
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search a location e.g. Bomet, Kenya"
        disabled={isLoading}
        className="
          flex-1 px-4 py-3 rounded-xl border border-green-200
          bg-white text-gray-800 placeholder-gray-400
          focus:outline-none focus:ring-2 focus:ring-green-400
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-all duration-200
        "
      />
      <button
        type="submit"
        disabled={isLoading || !query.trim()}
        className="
          px-6 py-3 rounded-xl bg-green-700 text-white font-semibold
          hover:bg-green-800 active:scale-95
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-all duration-200
        "
      >
        {isLoading ? "Searching..." : "Search"}
      </button>
    </form>
  );
}
