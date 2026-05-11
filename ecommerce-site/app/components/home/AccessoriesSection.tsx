import Link from 'next/link';

export default function AccessoriesSection() {
  return (
    <div className="grid gap-6 md:grid-cols-[1.1fr_0.9fr] md:items-center">
      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-[#b8896f]">
          Accessories
        </p>

        <h2 className="text-3xl font-semibold tracking-tight text-[#4b3b33] md:text-4xl">
          Complete the look with handcrafted accessories
        </h2>

        <p className="mt-4 max-w-xl text-sm leading-7 text-[#7a665c] md:text-base">
          Discover soft, thoughtful finishing pieces made to pair beautifully with
          your little one&apos;s outfits.
        </p>

        <div className="mt-6">
          <Link
            href="/shop?collection=accessories"
            className="inline-flex rounded-full bg-[#4b3b33] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#6a5045]"
          >
            Shop Accessories
          </Link>
        </div>
      </div>

      <div className="rounded-[28px] bg-[#f6e4d8] p-6 text-center">
        <div className="flex min-h-[180px] items-center justify-center rounded-[24px] border border-white/60 bg-white/50 px-6">
          <p className="text-lg font-medium text-[#6a5045]">
            Tiny details, beautifully made.
          </p>
        </div>
      </div>
    </div>
  );
}