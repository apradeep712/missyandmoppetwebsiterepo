import React from 'react';
import Link from 'next/link';

interface PolicyPageProps {
  title: string;
  lastUpdated: string;
  /** When true, hides the "starting template" review notice (e.g. for Contact/FAQ). */
  hideTemplateNotice?: boolean;
  children: React.ReactNode;
}

/**
 * Shared wrapper for informational / legal pages so they all share one
 * consistent, on-brand layout. Pass drafted content as children.
 */
export default function PolicyPage({
  title,
  lastUpdated,
  hideTemplateNotice = false,
  children,
}: PolicyPageProps) {
  return (
    <main className="min-h-screen bg-[#fdf7f2] text-[#4b3b33]">
      <div className="mx-auto max-w-3xl px-6 py-20 sm:py-28">
        {/* Breadcrumb / back */}
        <Link
          href="/"
          className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#b8927c] transition-colors hover:text-[#4b3b33]"
        >
          ← Back to home
        </Link>

        <header className="mt-6 mb-10 border-b border-[#ead8cd] pb-8">
          <h1 className="font-serif text-3xl font-bold tracking-tight sm:text-4xl">
            {title}
          </h1>
          <p className="mt-3 text-[11px] uppercase tracking-[0.2em] text-[#a07d68]">
            Last updated: {lastUpdated}
          </p>
        </header>

        {!hideTemplateNotice && (
          <div className="mb-10 rounded-2xl border border-[#ead8cd] bg-white/60 p-5 text-xs leading-relaxed text-[#7c675b]">
            <strong className="font-bold text-[#4b3b33]">Note:</strong> This is a
            starting template. Items shown in{' '}
            <span className="rounded bg-[#fdf7f2] px-1 font-mono text-[#a07d68]">
              [BRACKETS]
            </span>{' '}
            must be completed with your business details, and the wording should be
            reviewed by a qualified professional before you rely on it.
          </div>
        )}

        <div className="policy-prose space-y-6 text-sm leading-relaxed text-[#5c4a40]">
          {children}
        </div>
      </div>
    </main>
  );
}
