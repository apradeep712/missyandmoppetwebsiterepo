"use client";

import { useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useShopStore } from "../../store/use-shop-store";

import { ShoppingBag, User, Menu as MenuIcon } from "lucide-react";
import Link from "next/link";

export default function FloatingNav() {
  const { cart, trialItems, toggleCart } = useShopStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();

  // Handle Scroll states for the "Island" effect
  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  const totalItems = cart.length + trialItems.length;

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] flex justify-center p-4 sm:p-6 pointer-events-none">
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={`
          pointer-events-auto flex items-center justify-between w-full max-w-7xl px-4 py-2 sm:px-6 sm:py-3 rounded-full transition-all duration-500 border
          ${isScrolled 
            ? "bg-white/70 backdrop-blur-lg shadow-sm border-neutral-200/50 scale-[0.98]" 
            : "bg-transparent border-transparent"}
        `}
      >
        {/* LEFT: Branding (Existing Redirection) */}
        <Link href="/" className="flex flex-col group">
          <span className="text-[11px] font-bold tracking-[0.3em] uppercase text-neutral-900">
            Missy & Moppet
          </span>
          <span className="text-[9px] text-neutral-500 tracking-wider font-medium opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block">
            Soft pastels for little humans
          </span>
        </Link>

        {/* RIGHT: Actions & Old Menu Integration */}
        <div className="flex items-center gap-2 sm:gap-6">
          <div className="flex items-center gap-1 sm:gap-4 pr-2 sm:pr-4 border-r border-neutral-200">
            {/* Account */}
            <Link href="/profile" className="p-2 text-neutral-800 hover:opacity-50 transition-opacity">
              <User size={18} strokeWidth={1.5} />
            </Link>

            {/* Cart Trigger */}
            <button 
              onClick={() => toggleCart(true)}
              className="relative p-2 text-neutral-800 hover:opacity-50 transition-opacity"
            >
              <ShoppingBag size={18} strokeWidth={1.5} />
              {totalItems > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-neutral-900 text-[8px] font-bold text-white">
                  {totalItems}
                </span>
              )}
            </button>
          </div>

          {/* THE OLD MENU TRIGGER: This keeps your existing sidebar/redirections */}
          <button 
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-900 text-white hover:bg-neutral-800 transition-all"
            onClick={() => {
              // Trigger your existing menu logic here 
              // Example: window.dispatchEvent(new CustomEvent('open-menu'))
              console.log("Existing menu triggered");
            }}
          >
            <span className="text-[10px] font-bold uppercase tracking-widest pl-1 hidden sm:block">Menu</span>
            <MenuIcon size={16} />
          </button>
        </div>
      </motion.nav>
    </header>
  );
}