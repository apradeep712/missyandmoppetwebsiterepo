'use client';

import { useEffect, useMemo, useState } from 'react';
import AddToCartButton from '@/app/components/AddToCartButton';
import BuyNowButton from '@/app/components/BuyNowButton';
import {
  ageMonthsFromLegacyBuckets,
  formatAgeFromMonths,
  groupAgesForUI,
  normalizeAgeMonths,
} from '@/lib/ageSizing';

type ProductForActions = {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
  price_cents: number;
  currency: string;
  age_months: number[] | null;
  age_buckets: string[] | null;
};

function formatPrice(price_cents: number, currency: string) {
  const amount = price_cents / 100;
  return currency === 'INR'
    ? `₹${amount.toLocaleString('en-IN')}`
    : `${amount.toFixed(2)} ${currency}`;
}

function buildWhatsAppUrl(params: {
  productName: string;
  price: string;
  slug: string;
  selectedAgeMonths: number | null;
}) {
  const phoneNumber = '919148884999';

  const sizeText =
    params.selectedAgeMonths !== null
      ? formatAgeFromMonths(params.selectedAgeMonths)
      : 'Not selected';

  const productUrl =
    typeof window !== 'undefined'
      ? `https://missyandmoppet.com/product/${params.slug}`
      : `/product/${params.slug}`;

  const message = [
    `Hi, I'm interested in this product from your  collection ✨`,
    ``,
    `Product: ${params.productName}`,
    `Price: ${params.price}`,
    `Size/Age: ${sizeText}`,
    `Link: ${productUrl}`,
    ``,
    `Can you share more details?`,
  ].join('\n');

  return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
}

export default function ProductActionsClient({
  product,
}: {
  product: ProductForActions;
}) {
  const [open, setOpen] = useState(false);
  const [selectedAgeMonths, setSelectedAgeMonths] = useState<number | null>(
    null
  );

  const sizes = useMemo(() => {
    const fromNew = normalizeAgeMonths(product.age_months ?? []);
    if (fromNew.length > 0) return fromNew;
    return ageMonthsFromLegacyBuckets(product.age_buckets);
  }, [product.age_months, product.age_buckets]);

  useEffect(() => {
    if (sizes.length === 1) {
      setSelectedAgeMonths(sizes[0]);
    } else if (sizes.length === 0) {
      setSelectedAgeMonths(null);
    }
  }, [sizes]);

  const { baby, toddler, kid } = useMemo(() => groupAgesForUI(sizes), [sizes]);

  const requiresSizeSelection = sizes.length > 1;
  const canProceed = !requiresSizeSelection || selectedAgeMonths !== null;

  const selectedSizeLabel =
    selectedAgeMonths !== null ? formatAgeFromMonths(selectedAgeMonths) : null;

  function handleWhatsAppClick() {
    if (!canProceed) {
      setOpen(true);
      return;
    }

    const url = buildWhatsAppUrl({
      productName: product.name,
      price: formatPrice(product.price_cents, product.currency),
      slug: product.slug,
      selectedAgeMonths,
    });

    window.open(url, '_blank', 'noopener,noreferrer');
  }

  return (
    <div className="space-y-5">
      {requiresSizeSelection && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-[#7c675b]">Select size</p>

          <button
            type="button"
            onClick={() => setOpen(true)}
            className="w-full rounded-2xl border border-[#ead8cd] bg-white px-4 py-3 text-left text-sm shadow-[0_10px_26px_rgba(148,116,96,0.12)] transition hover:bg-[#fff7f1]"
          >
            {selectedSizeLabel ? (
              <span className="font-medium text-[#4b3b33]">
                {selectedSizeLabel}
              </span>
            ) : (
              <span className="text-[#7c675b]">Choose age</span>
            )}
          </button>

          {!selectedSizeLabel && (
            <p className="text-[11px] text-[#a07d68]">
              Please select a size before adding or buying.
            </p>
          )}
        </div>
      )}

      {open && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          />

          <div className="absolute left-1/2 top-1/2 w-[min(760px,92vw)] -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-[#ead8cd] bg-[#fdf7f2] p-5 shadow-[0_30px_90px_rgba(0,0,0,0.35)]">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-[#4b3b33]">
                Choose age
              </h3>

              <button
                type="button"
                className="rounded-xl border border-[#ead8cd] bg-white px-3 py-1.5 text-xs"
                onClick={() => setOpen(false)}
              >
                Close
              </button>
            </div>

            <div className="mt-4 space-y-5">
              <AgeGroupBlock
                title="Baby"
                subtitle="0–11 months"
                values={baby}
                selected={selectedAgeMonths}
                onSelect={(m) => {
                  setSelectedAgeMonths(m);
                  setOpen(false);
                }}
              />

              <AgeGroupBlock
                title="Toddler"
                subtitle="12 months – 3 years"
                values={toddler}
                selected={selectedAgeMonths}
                onSelect={(m) => {
                  setSelectedAgeMonths(m);
                  setOpen(false);
                }}
              />

              <AgeGroupBlock
                title="Kid"
                subtitle="4+ years"
                values={kid}
                selected={selectedAgeMonths}
                onSelect={(m) => {
                  setSelectedAgeMonths(m);
                  setOpen(false);
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* MAIN CTA */}
      <button
        type="button"
        onClick={handleWhatsAppClick}
        className="flex w-full items-center justify-center rounded-full bg-[#25D366] px-6 py-4 text-sm font-bold uppercase tracking-[0.18em] text-white shadow-[0_18px_40px_rgba(37,211,102,0.28)] transition hover:-translate-y-0.5 hover:bg-[#1ebe5d]"
      >
        {canProceed ? 'Buy on WhatsApp' : 'Select Size to Buy on WhatsApp'}
      </button>

      {/* SECONDARY CTAs */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <AddToCartButton
          disabled={!canProceed}
          product={{
            id: product.id,
            name: product.name,
            slug: product.slug,
            image_url: product.image_url,
            price_cents: product.price_cents,
            currency: product.currency,
            age_months: sizes,
            selected_age_months: selectedAgeMonths,
          }}
        />

        <BuyNowButton
          product={{
            id: product.id,
            slug: product.slug,
            age_months: product.age_months,
            selected_age_months: selectedAgeMonths,
          }}
        />
      </div>
    </div>
  );
}

function AgeGroupBlock(props: {
  title: string;
  subtitle: string;
  values: number[];
  selected: number | null;
  onSelect: (m: number) => void;
}) {
  if (!props.values.length) return null;

  return (
    <div>
      <div className="flex items-baseline justify-between">
        <p className="text-xs font-semibold text-[#4b3b33]">{props.title}</p>
        <p className="text-[11px] text-[#7c675b]">{props.subtitle}</p>
      </div>

      <div className="mt-2 flex flex-wrap gap-2">
        {props.values.map((m) => {
          const active = props.selected === m;

          return (
            <button
              key={m}
              type="button"
              onClick={() => props.onSelect(m)}
              className={[
                'rounded-full border px-3 py-1.5 text-xs transition',
                active
                  ? 'border-[#4b3b33] bg-[#4b3b33] text-white'
                  : 'border-[#ead8cd] bg-white text-[#4b3b33] hover:bg-[#fff7f1]',
              ].join(' ')}
            >
              {formatAgeFromMonths(m)}
            </button>
          );
        })}
      </div>
    </div>
  );
}