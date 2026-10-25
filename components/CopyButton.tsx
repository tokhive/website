"use client";

import { useEffect, useState } from "react";

export function CopyButton({ text, className = "", label = "Copy" }: { text: string; className?: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1500);
    return () => clearTimeout(t);
  }, [copied]);

  return (
    <button
      type="button"
      className={`cursor-pointer hover:opacity-80 ${className}`}
      onClick={async (e) => {
        e.stopPropagation();
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
        } catch {
          // Clipboard can be unavailable (insecure context); leave the label unchanged.
        }
      }}
    >
      {copied ? "Copied ✓" : label}
    </button>
  );
}
