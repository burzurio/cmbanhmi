"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const images = [
  "/images/hero/Beef-Banh.jpg",
  "/images/hero/Lemon-Grass-Chicken.jpg",
  "/images/hero/Chili-Oil-Wonton.jpg",
  "/images/hero/Tiger-Boba.jpg",
  "/images/hero/Thai-Tea.jpg",
  "/images/hero/Strawberry-Matcha.jpg",
];

const logoMenuLinks = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/order", label: "Order" },
  { href: "/about", label: "About" },
  { href: "/about#contact", label: "Contact" },
  { href: "/#rewards", label: "Rewards" },
];

export default function CMBanhMiLanding() {
  const [logoMenuOpen, setLogoMenuOpen] = useState(false);
  const [featuredIndex, setFeaturedIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setFeaturedIndex((index) => (index + 1) % images.length);
    }, 3500);

    return () => window.clearInterval(timer);
  }, []);

  const previousFeatured = () => {
    setFeaturedIndex((index) => (index - 1 + images.length) % images.length);
  };

  const nextFeatured = () => {
    setFeaturedIndex((index) => (index + 1) % images.length);
  };

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
            <Link href="/menu" className="text-sm font-medium hover:text-red-600">Menu</Link>
            <Link href="/#featured" className="text-sm font-medium hover:text-red-600">Featured</Link>
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

      <section id="home" className="relative flex min-h-[68vh] items-center justify-center overflow-hidden pt-16">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/hero/hero.jpg')" }}
        />
        <div className="absolute inset-0 bg-black/60" />

        <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Vietnamese Sandwiches, Made Fresh
          </h1>
          <p className="max-w-xl text-base text-white/85">
            Fresh ingredients. Bold flavors. Made daily.
          </p>
          <div className="flex gap-3">
            <a href="/menu" className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-gray-900">
              Explore Menu
            </a>
            <a
              href="#locations"
              className="rounded-full border border-white/70 px-5 py-2 text-sm font-semibold text-white hover:bg-white/10"
            >
              Find a Store
            </a>
          </div>
        </div>
      </section>

      
      <section className="border-y border-gray-200 bg-gray-50">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-2.5 text-sm sm:px-6 lg:px-8">
          <p className="font-medium">Limited-time flavors dropping soon.</p>
          <a href="#menu" className="inline-flex items-center gap-2 rounded-full bg-gray-900 px-3 py-1.5 text-white">
            Preview Menu <span aria-hidden>-&gt;</span>
          </a>
        </div>
      </section>

      <section id="featured" className="mx-auto max-w-md px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto mb-3 flex max-w-[350px] items-center justify-between">
          <h2 className="text-xl font-bold sm:text-2xl">Featured Sandwiches</h2>
          <Link href="/menu" className="text-sm font-semibold text-red-600 hover:text-red-700">View menu</Link>
        </div>

        <div className="mx-auto flex max-w-[430px] items-center justify-center gap-3">
          <button
            type="button"
            onClick={previousFeatured}
            className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gray-300 text-lg font-semibold hover:bg-gray-50 sm:flex"
            aria-label="Previous featured item"
          >
            &lt;
          </button>

          <Link
            href="/menu"
            className="group block"
          >
            <div className="relative h-[320px] w-[230px] overflow-hidden rounded-lg border border-gray-200 bg-gray-100 sm:h-[350px] sm:w-[250px]">
              <Image
                src={images[featuredIndex]}
                alt={`Featured food ${featuredIndex + 1}`}
                fill
                sizes="(min-width: 640px) 250px, 230px"
                className="object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-4 pb-3 pt-10">
                <span className="text-sm font-semibold text-white">Explore the full menu</span>
              </div>
            </div>
          </Link>

          <button
            type="button"
            onClick={nextFeatured}
            className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gray-300 text-lg font-semibold hover:bg-gray-50 sm:flex"
            aria-label="Next featured item"
          >
            &gt;
          </button>
        </div>

        <div className="mt-3 flex items-center justify-center gap-2 sm:hidden">
          <button
            type="button"
            onClick={previousFeatured}
            className="h-8 w-8 rounded-full border border-gray-300 text-base font-semibold"
            aria-label="Previous featured item"
          >
            &lt;
          </button>
          <button
            type="button"
            onClick={nextFeatured}
            className="h-8 w-8 rounded-full border border-gray-300 text-base font-semibold"
            aria-label="Next featured item"
          >
            &gt;
          </button>
        </div>
      </section>

      <section id="menu" className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-10 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold">Explore Our Menu</h2>
          <p className="mx-auto mt-2 max-w-xl text-gray-600">
            Browse banh mi, soups, noodles, drinks, and more.
          </p>
          <a
            href="/menu"
            className="mt-4 inline-block rounded-full bg-red-600 px-5 py-2 text-sm font-semibold text-white hover:bg-red-700"
          >
            View Full Menu
          </a>
        </div>
      </section>

      <section id="story" className="bg-gray-50">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-6 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:px-8">
          <div>
            <h2 className="text-2xl font-bold">Our Story</h2>
            <p className="mt-2 text-gray-600">
              I may use this section to tell origin story, sourcing, or quality promise. Keeping it short with visual-forward as the images will do most of the talking later.
            </p>
            <div className="mt-4 flex gap-3">
              <a href="#rewards" className="rounded-full bg-red-600 px-5 py-2 text-sm font-semibold text-white">Join Rewards</a>
              <a href="#locations" className="rounded-full border border-gray-300 px-5 py-2 text-sm font-semibold">Find a Store</a>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="aspect-[4/5] rounded-lg bg-gray-200" />
            <div className="aspect-[4/5] rounded-lg bg-gray-200" />
          </div>
        </div>
      </section>

      <section id="rewards" className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-red-600 to-red-500" />
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-6 px-4 py-10 text-white sm:px-6 lg:grid-cols-[minmax(0,1fr)_18rem] lg:px-8">
          <div>
            <h2 className="text-2xl font-bold">Earn Points Each Time You Order!</h2>
            <p className="mt-2 max-w-xl text-white/90">
              Tease your points program and mobile app. Add your App Store and Google Play badges later.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <a href="#" className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-gray-900">Join Rewards</a>
              <a href="#" className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-gray-900">View Order History</a>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="aspect-[3/4] rounded-lg bg-white/10" />
            <div className="aspect-[3/4] rounded-lg bg-white/10" />
          </div>
        </div>
      </section>


      <footer className="border-t border-gray-200 bg-white">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 py-8 sm:px-6 md:grid-cols-4 lg:px-8">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <div className="h-7 w-7 rounded-full bg-red-600" />
              <span className="text-lg font-semibold">CM Banh Mi</span>
            </div>
            <p className="text-sm text-gray-600">Fresh Vietnamese sandwiches, From Our Family to Yours!</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold">Explore</h3>
            <ul className="mt-3 space-y-2 text-sm text-gray-600">
              <li><a href="#menu" className="hover:text-gray-900">Menu</a></li>
              <li><a href="#featured" className="hover:text-gray-900">Featured</a></li>
              <li><a href="#rewards" className="hover:text-gray-900">Rewards</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold">Company</h3>
            <ul className="mt-3 space-y-2 text-sm text-gray-600">
              <li><a href="#story" className="hover:text-gray-900">About</a></li>
              <li><a href="#locations" className="hover:text-gray-900">Contact</a></li>
              <li><a href="#" className="hover:text-gray-900">Careers</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold">Get the App</h3>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <div className="h-10 rounded-md bg-gray-200" />
              <div className="h-10 rounded-md bg-gray-200" />
            </div>
          </div>
        </div>
        <div className="border-t border-gray-200 py-4 text-center text-xs text-gray-500">
          &copy; {new Date().getFullYear()} CM Banh Mi. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
