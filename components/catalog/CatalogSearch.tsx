"use client";

import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";

interface CatalogSearchProps {
  onSearch: (query: string) => void;
}

export default function CatalogSearch({ onSearch }: CatalogSearchProps) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, onSearch]);

  return (
    <div className="relative">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-600" />
      <input
        type="text"
        placeholder="Search categories, subtopics, concepts..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full bg-[#0F0F0F] border border-neutral-900 focus:border-neutral-700 outline-none pl-11 pr-10 py-3 text-white text-sm placeholder:text-neutral-600 transition-colors"
      />
      {query && (
        <button
          onClick={() => setQuery("")}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-600 hover:text-white transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
