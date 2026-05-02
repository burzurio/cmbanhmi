"use client";

import { menu } from "@/lib/menu";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const categories = ["Banh Mi", "Soups / Wontons / Noodles"];

const logoMenuLinks = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/order", label: "Order" },
  { href: "/about", label: "About" },
  { href: "/about#contact", label: "Contact" },
  { href: "/#rewards", label: "Rewards" },
];

export default function MenuPage() {
  const [logoMenuOpen, setLogoMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <header className="fixed inset-x-0 top-0 z-50 w-screen border-b border-gray-200 bg-white">
        <div className="flex w-full items-center justify-between px-4 py-2 sm:px-6 lg:px-8">
          <div className="relative shrink-0">
            <button
              type="button"
              onClick={() => setLogoMenuOpen((value) => !value)}
              className="flex h-11 w-24 items-center justify-start rounded-md focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2"
              aria-expanded={logoMenuOpen}
              aria-haspopup="menu"
              aria-label="Open site menu"
            >
              <Image
                src="/images/logo.png"
                alt="CM Banh Mi"
                width={96}
                height={44}
                priority
                className="h-11 w-24 object-contain"
              />
            </button>

            {logoMenuOpen && (
              <div className="absolute left-0 top-full mt-2 w-44 rounded-lg border border-gray-200 bg-white py-2 shadow-lg">
                <nav aria-label="Logo menu">
                  {logoMenuLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setLogoMenuOpen(false)}
                      className="block px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50 hover:text-red-600"
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </div>
            )}
          </div>

          <nav className="hidden flex-1 items-center justify-center gap-6 md:flex">
            <Link href="/" className="text-sm font-medium hover:text-red-600">Home</Link>
            <Link href="/menu" className="text-sm font-medium hover:text-red-600">Menu</Link>
            <Link href="/about" className="text-sm font-medium hover:text-red-600">About</Link>
            <Link href="/about#contact" className="text-sm font-medium hover:text-red-600">Contact</Link>
            <Link href="/#rewards" className="text-sm font-medium hover:text-red-600">Rewards</Link>
          </nav>

          <div className="ml-auto flex shrink-0 items-center justify-end gap-2">
            <a
              href="https://www.instagram.com/cmbanhmi/"
              target="_blank"
              rel="noopener noreferrer"
              className="relative z-10 inline-flex h-9 w-9 flex-none items-center justify-center overflow-hidden rounded-full border border-pink-700 bg-pink-600 text-white shadow-sm transition hover:bg-pink-700"
              aria-label="CM Banh Mi on Instagram"
            >
              <svg className="block h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="2" />
                <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
                <circle cx="17.5" cy="6.5" r="1.25" fill="currentColor" />
              </svg>
            </a>
          </div>
        </div>
      </header>

      <main className="px-4 pb-5 pt-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="mb-7 text-center">
            <h1 className="text-3xl font-extrabold tracking-tight text-orange-500 sm:text-4xl">
              CM Banh Mi Menu
            </h1>
            <p className="mt-1 text-sm text-gray-600 sm:text-base">
              Fresh sandwiches, soups, noodles, drinks, and add-ons.
            </p>
          </div>

          {categories.map((category) => (
            <section key={category} className="mb-6 last:mb-0">
              <div className="mb-3 flex items-center gap-3">
                <h2 className="whitespace-nowrap text-2xl font-extrabold text-orange-500">
                  {category}
                </h2>
                <div className="h-0.5 flex-1 bg-gray-900" />
              </div>

              <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_11rem] lg:items-start">
                <div className="grid grid-cols-1 gap-x-8 gap-y-2 text-sm sm:text-base md:grid-cols-2">
                  {menu
                    .filter((item) => item.category === category)
                    .map((item) => (
                      <div key={item.id} className="flex items-baseline gap-2">
                        <span className="font-bold">
                          #{item.id} {item.name}
                        </span>

                        <span className="flex-1 border-b border-dotted border-gray-500" />

                        <span className="font-semibold text-green-700">
                          ${item.price.toFixed(2)}
                        </span>
                      </div>
                    ))}
                </div>

                <div className="hidden grid-cols-2 gap-2 lg:grid">
                  <div className="aspect-square rounded bg-gray-100" />
                  <div className="aspect-square rounded bg-gray-100" />
                </div>
              </div>
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}
