"use client";

import { useAssistant } from "@/components/Assistant";

/** Opens the assistant in sale mode ("Vinde și tu"). */
export function SellButton({ className, children }: { className?: string; children: React.ReactNode }) {
  const { open } = useAssistant();
  return (
    <button type="button" className={className} onClick={() => open({ sale: true })}>
      {children}
    </button>
  );
}
