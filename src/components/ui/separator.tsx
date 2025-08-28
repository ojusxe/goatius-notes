"use client"

import * as React from "react"

// Simple separator placeholder - focusing on SSR
export const Separator = ({ className }: { className?: string }) => (
  <div className={`border-b border-[var(--border)] ${className || ''}`} />
);
