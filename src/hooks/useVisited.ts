"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

const STORAGE_KEY = "apod-visited";

function readStorage(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    return new Set(JSON.parse(raw) as string[]);
  } catch {
    return new Set();
  }
}

function writeStorage(set: Set<string>): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]));
  } catch {
    // ignore write errors
  }
}

export interface VisitedContextValue {
  visitedSet: Set<string>;
  markVisited: (date: string) => void;
  isVisited: (date: string) => boolean;
  clearAll: () => void;
}

export const VisitedContext = createContext<VisitedContextValue | null>(null);

export function useVisitedState(): VisitedContextValue {
  // Start with empty set to avoid hydration mismatch
  const [visitedSet, setVisitedSet] = useState<Set<string>>(new Set());

  // Hydrate from localStorage after mount
  useEffect(() => {
    setVisitedSet(readStorage());
  }, []);

  const markVisited = useCallback((date: string) => {
    setVisitedSet((prev) => {
      if (prev.has(date)) return prev;
      const next = new Set(prev);
      next.add(date);
      writeStorage(next);
      return next;
    });
  }, []);

  const isVisited = useCallback(
    (date: string) => visitedSet.has(date),
    [visitedSet]
  );

  const clearAll = useCallback(() => {
    setVisitedSet(new Set());
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  return { visitedSet, markVisited, isVisited, clearAll };
}

export function useVisited(): VisitedContextValue {
  const ctx = useContext(VisitedContext);
  if (!ctx) throw new Error("useVisited must be used inside VisitedProvider");
  return ctx;
}
