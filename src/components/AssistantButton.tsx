"use client";

import { useAssistant } from "./Assistant";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & { type_?: string; purpose?: string };

/** A button that opens the AI assistant, optionally pre-filled with a property type or purpose. */
export function AssistantButton({ type_, purpose, children, ...rest }: Props) {
  const { open } = useAssistant();
  return (
    <button type="button" {...rest} onClick={() => open({ type: type_, purpose })}>
      {children}
    </button>
  );
}
