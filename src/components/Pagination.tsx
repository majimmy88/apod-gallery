"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { formatDateRange } from "@/lib/dates";

interface PaginationProps {
  currentPage: number;
  maxPage: number;
  startDate: string;
  endDate: string;
}

function buildPageItems(current: number, total: number): (number | "...")[] {
  if (total <= 1) return [1];
  const delta = 1;
  const left = Math.max(2, current - delta);
  const right = Math.min(total - 1, current + delta);
  const items: (number | "...")[] = [1];
  if (left > 2) items.push("...");
  for (let i = left; i <= right; i++) items.push(i);
  if (right < total - 1) items.push("...");
  items.push(total);
  return items;
}

function hrefForPage(page: number) {
  return page <= 1 ? "/" : `/page/${page}`;
}

export default function Pagination({ currentPage, maxPage, startDate, endDate }: PaginationProps) {
  const isFirst = currentPage <= 1;
  const isLast = currentPage >= maxPage;
  const rangeLabel = formatDateRange(startDate, endDate);
  const pageItems = buildPageItems(currentPage, maxPage);

  const [announcement, setAnnouncement] = useState("");
  const mounted = useRef(false);
  useEffect(() => {
    if (!mounted.current) { mounted.current = true; return; }
    setAnnouncement(`Showing ${rangeLabel}`);
  }, [rangeLabel]);

  return (
    <nav
      aria-label="Pagination"
      className="fixed bottom-0 left-0 right-0 z-20 flex flex-col items-center gap-1.5 border-t border-gray-200 bg-white/95 px-4 py-2 backdrop-blur dark:border-white/10 dark:bg-gray-950/95 md:static md:border-t-0 md:bg-transparent md:py-6 md:backdrop-blur-none dark:md:bg-transparent"
    >
      <div aria-live="polite" aria-atomic="true" className="sr-only">{announcement}</div>

      <p className="text-xs text-gray-500 dark:text-gray-400">{rangeLabel}</p>

      <div className="flex items-center gap-1">
        {/* Prev */}
        {isFirst ? (
          <span aria-disabled="true"
            className="inline-flex h-9 w-9 cursor-not-allowed items-center justify-center rounded-lg text-gray-300 select-none dark:text-gray-600">
            <ChevronLeftIcon />
          </span>
        ) : (
          <Link href={hrefForPage(currentPage - 1)} aria-label="Previous page"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-gray-700 transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:text-gray-300 dark:hover:bg-white/10 dark:focus-visible:ring-blue-400">
            <ChevronLeftIcon />
          </Link>
        )}

        {pageItems.map((item, i) =>
          item === "..." ? (
            <span key={`ellipsis-${i}`} aria-hidden="true"
              className="inline-flex h-9 w-7 items-center justify-center text-sm text-gray-400 select-none dark:text-gray-500">
              …
            </span>
          ) : item === currentPage ? (
            <span key={item} aria-current="page"
              className="inline-flex h-9 min-w-[2.25rem] items-center justify-center rounded-lg bg-blue-600 px-2 text-sm font-semibold text-white select-none">
              {item}
            </span>
          ) : (
            <Link key={item} href={hrefForPage(item)} aria-label={`Page ${item}`}
              className="inline-flex h-9 min-w-[2.25rem] items-center justify-center rounded-lg px-2 text-sm text-gray-700 transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:text-gray-300 dark:hover:bg-white/10 dark:focus-visible:ring-blue-400">
              {item}
            </Link>
          )
        )}

        {/* Next */}
        {isLast ? (
          <span aria-disabled="true"
            className="inline-flex h-9 w-9 cursor-not-allowed items-center justify-center rounded-lg text-gray-300 select-none dark:text-gray-600">
            <ChevronRightIcon />
          </span>
        ) : (
          <Link href={hrefForPage(currentPage + 1)} aria-label="Next page"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-gray-700 transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:text-gray-300 dark:hover:bg-white/10 dark:focus-visible:ring-blue-400">
            <ChevronRightIcon />
          </Link>
        )}
      </div>
    </nav>
  );
}

function ChevronLeftIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}
