'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useSound } from '@/context/SoundContext';
import { useTheme } from '@/context/ThemeContext';
import { CurrencyCode } from '@/types/product';
import { BRAND_CONFIG } from '@/config/brand';
import { ShoppingBag, Search, Menu, X, ChevronDown, Sun, Moon } from 'lucide-react';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { cartCount, openCart, openSearch, currency, setCurrency } = useCart();
  const { playClick } = useSound();
  const { theme, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCurrencyDropdownOpen, setIsCurrencyDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const currencies: CurrencyCode[] = ['GHS', 'USD', 'GBP', 'EUR'];

  const navLinks = [
    { label: 'SHOP', href: '/shop' },
    { label: 'LOOKBOOK', href: '/lookbook' },
    { label: 'ABOUT', href: '/about' },
    { label: 'SUPPORT', href: '/support' },
  ];

  const logoSrc = theme === 'light' ? BRAND_CONFIG.logoBlack : BRAND_CONFIG.logoWhite;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/90 dark:bg-[#08080a]/90 backdrop-blur-xl border-b border-black/5 dark:border-white/5 py-3 shadow-md dark:shadow-2xl'
            : 'bg-gradient-to-b from-white/90 via-white/50 to-transparent dark:from-black/80 dark:via-black/40 dark:to-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Left: Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={playClick}
                className={`text-xs font-mono tracking-widest uppercase transition-colors relative py-1 ${
                  pathname === link.href
                    ? 'text-black dark:text-white font-bold'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white'
                }`}
              >
                {link.label}
                {pathname === link.href && (
                  <span className="absolute bottom-0 left-0 right-0 h-px bg-black dark:bg-white" />
                )}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Center: Brand Identity Logo */}
          <Link
            href="/"
            onClick={playClick}
            className="flex items-center gap-3 group tracking-tighter"
          >
            <div className="relative w-7 h-9 sm:w-8 sm:h-10 shrink-0">
              <Image
                src={logoSrc}
                alt={BRAND_CONFIG.name}
                fill
                className="object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-[0_0_12px_rgba(255,255,255,0.2)] dark:drop-shadow-[0_0_12px_rgba(255,255,255,0.2)]"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-black tracking-[0.25em] text-black dark:text-white uppercase font-display leading-none whitespace-nowrap">
                {BRAND_CONFIG.name}
              </span>
              <span className="text-[9px] font-mono tracking-[0.2em] text-zinc-500 dark:text-zinc-400 uppercase mt-0.5 hidden sm:block">
                {BRAND_CONFIG.subTitle}
              </span>
            </div>
          </Link>

          {/* Right: Actions */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Theme Toggle Button (Light / Dark) */}
            <button
              onClick={() => {
                playClick();
                toggleTheme();
              }}
              className="p-2 text-zinc-500 hover:text-black dark:text-zinc-400 dark:hover:text-white transition-colors"
              aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-zinc-400 hover:text-white transition-colors" />
              ) : (
                <Moon className="w-4 h-4 text-zinc-600 hover:text-black transition-colors" />
              )}
            </button>

            {/* Search Trigger */}
            <button
              onClick={() => {
                playClick();
                openSearch();
              }}
              className="p-2 text-zinc-500 hover:text-black dark:text-zinc-400 dark:hover:text-white transition-colors"
              title="Search Catalog (Cmd+K)"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Currency Selector */}
            <div className="relative">
              <button
                onClick={() => setIsCurrencyDropdownOpen(!isCurrencyDropdownOpen)}
                className="flex items-center gap-1 px-2 py-1 text-xs font-sans font-medium tracking-wider uppercase text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors"
              >
                <span>{currency}</span>
                <ChevronDown className="w-3 h-3 text-zinc-500" />
              </button>

              {isCurrencyDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsCurrencyDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-28 bg-white dark:bg-[#0c0d12] border border-black/10 dark:border-white/10 rounded-lg shadow-2xl py-1 z-20 font-sans text-xs">
                    {currencies.map((c) => (
                      <button
                        key={c}
                        onClick={() => {
                          setCurrency(c);
                          setIsCurrencyDropdownOpen(false);
                          playClick();
                        }}
                        className={`w-full px-3 py-1.5 text-left transition-colors flex items-center justify-between ${
                          currency === c
                            ? 'bg-black/5 dark:bg-white/10 text-black dark:text-white font-semibold'
                            : 'text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
                        }`}
                      >
                        <span>{c}</span>
                        {c === 'GHS' && <span className="text-[10px] text-zinc-500 font-bold">GH₵</span>}
                        {c === 'USD' && <span className="text-[10px] text-zinc-500">$</span>}
                        {c === 'GBP' && <span className="text-[10px] text-zinc-500">£</span>}
                        {c === 'EUR' && <span className="text-[10px] text-zinc-500">€</span>}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Shopping Bag Button */}
            <button
              onClick={() => {
                playClick();
                openCart();
              }}
              className="relative p-2 text-zinc-700 dark:text-zinc-200 hover:text-black dark:hover:text-white transition-colors flex items-center"
              aria-label="Open Shopping Bag"
            >
              <ShoppingBag className="w-5 h-5 stroke-[1.6]" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-black text-white dark:bg-white dark:text-black font-sans font-bold text-[9px] flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Slide-Out Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-30 md:hidden bg-white/98 dark:bg-black/95 backdrop-blur-2xl pt-24 px-6 flex flex-col justify-between pb-12 animate-in slide-in-from-top duration-300">
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-6 border-b border-black/10 dark:border-white/10">
              <div className="flex items-center gap-3">
                <div className="relative w-9 h-11">
                  <Image
                    src={logoSrc}
                    alt={BRAND_CONFIG.name}
                    fill
                    className="object-contain"
                  />
                </div>
                <div>
                  <p className="text-xl font-black tracking-widest text-black dark:text-white">{BRAND_CONFIG.name}</p>
                  <p className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400">{BRAND_CONFIG.subTitle}</p>
                </div>
              </div>

              {/* Mobile Theme Toggle Button */}
              <button
                onClick={() => {
                  playClick();
                  toggleTheme();
                }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/5 dark:bg-white/10 text-xs font-mono text-zinc-700 dark:text-zinc-200"
              >
                {theme === 'dark' ? (
                  <>
                    <Sun className="w-4 h-4 text-amber-300" />
                    <span>LIGHT</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-4 h-4 text-zinc-800" />
                    <span>DARK</span>
                  </>
                )}
              </button>
            </div>

            <nav className="space-y-6">
              <span className="text-[11px] font-mono tracking-widest text-zinc-500 uppercase">
                NAVIGATION
              </span>
              {navLinks.map((link) => (
                <div key={link.label}>
                  <Link
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block text-2xl font-bold uppercase tracking-wider ${
                      pathname === link.href ? 'text-black dark:text-white underline underline-offset-8' : 'text-zinc-600 dark:text-zinc-400'
                    }`}
                  >
                    {link.label}
                  </Link>
                </div>
              ))}
            </nav>
          </div>

          <div className="space-y-4 pt-8 border-t border-black/10 dark:border-white/10 font-mono text-xs">
            <div className="flex items-center justify-between text-zinc-600 dark:text-zinc-400">
              <span>SELECT CURRENCY</span>
              <div className="flex items-center gap-2">
                {currencies.map((c) => (
                  <button
                    key={c}
                    onClick={() => setCurrency(c)}
                    className={`px-2 py-1 rounded ${
                      currency === c ? 'bg-black text-white dark:bg-white dark:text-black font-bold' : 'text-zinc-500'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 text-zinc-500 text-[11px]">
              <p>{BRAND_CONFIG.name} • {BRAND_CONFIG.subTitle}</p>
              <p>{BRAND_CONFIG.flagshipAddress}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
