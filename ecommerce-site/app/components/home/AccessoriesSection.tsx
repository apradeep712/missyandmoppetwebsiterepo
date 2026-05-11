import Image from 'next/image';
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

      <div className="overflow-hidden rounded-[28px] bg-[#f6e4d8] p-3">
        <div className="relative min-h-[260px] overflow-hidden rounded-[24px] md:min-h-[340px]">
          <Image
            src="/sub/subsa.png"
            alt="Handcrafted baby accessories"
            fill
            sizes="(max-width: 768px) 100vw, 40vw"
            className="object-cover"
          />
        </div>
      </div>
    </div>
  );
}