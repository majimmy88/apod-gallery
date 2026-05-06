"use client";

import { useCallback, useEffect, useState } from "react";

const KEY = "apod-theme";

export function useDarkMode() {
  const [isDark, setIsDark] = useState(false);

  // Sync with whatever the inline <script> already applied
  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggle = useCallback(() => {
    setIsDark((prev) => {
      const next = !prev;
      document.documentElement.classList.toggle("dark", next);
      try {
        localStorage.setItem(KEY, next ? "dark" : "light");
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  return { isDark, toggle };
}
