import React from 'react';

/** Section heading used inside policy pages. */
export function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-serif text-xl font-bold text-[#4b3b33] pt-4">
      {children}
    </h2>
  );
}

/** Paragraph. */
export function P({ children }: { children: React.ReactNode }) {
  return <p className="text-sm leading-relaxed text-[#5c4a40]">{children}</p>;
}

/** Bulleted list. */
export function UL({ children }: { children: React.ReactNode }) {
  return (
    <ul className="list-disc space-y-2 pl-6 text-sm leading-relaxed text-[#5c4a40] marker:text-[#b8927c]">
      {children}
    </ul>
  );
}

/** A placeholder token the owner must fill in. */
export function PH({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded bg-[#f3e7dd] px-1 font-mono text-[13px] text-[#a07d68]">
      [{children}]
    </span>
  );
}
