"use client";

import { useEffect } from "react";
import { useVisited } from "@/hooks/useVisited";

export default function MarkVisited({ date }: { date: string }) {
  const { markVisited } = useVisited();
  useEffect(() => {
    markVisited(date);
  }, [date, markVisited]);
  return null;
}
