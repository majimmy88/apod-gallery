"use client";


import { ApodEntry } from "@/lib/apod";
import ApodCard from "@/components/ApodCard";
import { useVisited } from "@/hooks/useVisited";

interface ApodGridProps {
  entries: ApodEntry[];
}

export default function ApodGrid({ entries }: ApodGridProps) {
  const { visitedSet } = useVisited();

  if (entries.length === 0) {
    return (
      <p className="py-16 text-center text-gray-500 dark:text-gray-400">
        No images found for this date range.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {entries.map((entry) => (
        <ApodCard
          key={entry.date}
          entry={entry}
          // visitedSet is empty on SSR (avoids hydration mismatch); populated after mount
          visited={visitedSet.has(entry.date)}
        />
      ))}
    </div>
  );
}
