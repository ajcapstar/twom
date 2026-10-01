"use client";

import React, { useState } from "react";
import styles from "./SearchBar.module.css";

const SearchBar: React.FC = () => {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      // TODO: wire up search
      console.log("Search:", query);
    }
  };

  return (
    <section className={styles.section} aria-label="Search">
      <form
        className={`${styles.form} ${focused ? styles.focused : ""}`}
        onSubmit={handleSubmit}
        role="search"
      >
        <span className={styles.icon} aria-hidden="true">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </span>
        <input
          id="site-search"
          type="search"
          className={styles.input}
          placeholder="Search pieces, collections…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          aria-label="Search products"
          autoComplete="off"
        />
        {query && (
          <button
            type="button"
            className={styles.clear}
            onClick={() => setQuery("")}
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </form>
    </section>
  );
};

export default SearchBar;
