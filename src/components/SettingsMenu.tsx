"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useVisited } from "@/hooks/useVisited";
import { useDarkMode } from "@/hooks/useDarkMode";

export default function SettingsMenu() {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const desktopMenuRef = useRef<HTMLDivElement>(null);
  const { clearAll } = useVisited();
  const { isDark, toggle: toggleDark } = useDarkMode();

  // Focus first item when menu opens (preventScroll avoids mobile viewport jump)
  useEffect(() => {
    if (!open) return;
    const isDesktop = window.matchMedia("(min-width: 640px)").matches;
    const menu = isDesktop ? desktopMenuRef.current : mobileMenuRef.current;
    const firstItem = menu?.querySelector<HTMLButtonElement>(
      "button:not(:disabled)"
    );
    firstItem?.focus({ preventScroll: true });
  }, [open]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function handle(e: MouseEvent) {
      const target = e.target as Node;
      if (
        !mobileMenuRef.current?.contains(target) &&
        !desktopMenuRef.current?.contains(target) &&
        !buttonRef.current?.contains(target)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [open]);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      setOpen(false);
      buttonRef.current?.focus();
    }
  }

  function handleClearHistory() {
    clearAll();
    setOpen(false);
    buttonRef.current?.focus();
  }

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen((v) => !v);
          }
        }}
        aria-label="Settings"
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex h-11 w-11 items-center justify-center rounded-full text-gray-700 transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:text-white dark:hover:bg-white/10 dark:focus-visible:ring-white"
      >
        <GearIcon />
      </button>

      {/* Desktop menu */}
      {open && (
        <div
          ref={desktopMenuRef}
          role="menu"
          onKeyDown={handleKeyDown}
          className="absolute right-0 top-full z-50 mt-2 hidden w-56 flex-col overflow-visible rounded-xl border border-gray-200 bg-white p-2 shadow-2xl dark:border-white/10 dark:bg-gray-900 sm:flex"
        >
          <MenuItems
            handleClearHistory={handleClearHistory}
            isDark={isDark}
            toggleDark={toggleDark}
          />
        </div>
      )}

      {open &&
        typeof document !== "undefined" &&
        createPortal(
          <>
            <div
              className="fixed inset-0 z-40 bg-black/60 sm:hidden"
              onClick={() => setOpen(false)}
            />
            <div
              ref={mobileMenuRef}
              role="menu"
              onKeyDown={handleKeyDown}
              className="fixed left-3 right-3 top-[4.75rem] z-50 flex max-h-[calc(100dvh_-_5.5rem)] flex-col overflow-y-auto rounded-xl border border-gray-200 bg-white p-2 shadow-2xl dark:border-white/10 dark:bg-gray-900 sm:hidden"
            >
              <MenuItems
                handleClearHistory={handleClearHistory}
                isDark={isDark}
                toggleDark={toggleDark}
              />
            </div>
          </>,
          document.body
        )}
    </div>
  );
}

interface MenuItemsProps {
  handleClearHistory: () => void;
  isDark: boolean;
  toggleDark: () => void;
}

function MenuItems({
  handleClearHistory,
  isDark,
  toggleDark,
}: MenuItemsProps) {
  return (
    <>
      {/* Dark mode toggle */}
      <button
        role="menuitemcheckbox"
        aria-checked={isDark}
        onClick={toggleDark}
        className="flex min-h-[44px] w-full items-center justify-between gap-2 rounded-lg px-4 py-3 text-left text-sm text-gray-900 transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:text-white dark:hover:bg-white/10 dark:focus-visible:ring-blue-400"
      >
        <span className="flex items-center gap-2">
          {isDark ? <MoonIcon /> : <SunIcon />}
          Dark mode
        </span>
        <span
          aria-hidden="true"
          className={[
            "relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors",
            isDark ? "bg-blue-600" : "bg-gray-300",
          ].join(" ")}
        >
          <span
            className={[
              "pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform",
              isDark ? "translate-x-5" : "translate-x-0",
            ].join(" ")}
          />
        </span>
      </button>

      <div className="my-1 border-t border-gray-100 dark:border-white/10" />

      {/* Clear history */}
      <button
        role="menuitem"
        onClick={handleClearHistory}
        className="flex min-h-[44px] w-full items-center gap-2 rounded-lg px-4 py-3 text-left text-sm text-gray-900 transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:text-white dark:hover:bg-white/10 dark:focus-visible:ring-blue-400"
      >
        <TrashIcon />
        Clear History
      </button>
    </>
  );
}

function GearIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  );
}
