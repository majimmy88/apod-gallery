"use client";

import { VisitedContext, useVisitedState } from "@/hooks/useVisited";

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  const value = useVisitedState();
  return (
    <VisitedContext.Provider value={value}>{children}</VisitedContext.Provider>
  );
}
