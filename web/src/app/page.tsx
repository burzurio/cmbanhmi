"use client";
import { useState } from "react";

export default function cmBanhMiLanding() {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* NAVBAR */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-gray-200/60 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <a href="#home" className="flex items-center gap-2">
            {/* Replace with your logo image later */}
            <div className="h-8 w-8 rounded-full bg-red-600" />
            <span className="text-xl font-semibold tracking-tight">CM Banh Mi</span>
          </a>

          <nav className="hidden items-center gap-8 md:flex">
            <a href="#menu" className="text-sm font-medium hover:text-red-600">Menu</a>
            <a href="#featured" className="text-sm font-medium hover:text-red-600">Featured</a>
            <a href="#story" className="text-sm font-medium hover:text-red-600">Our Story</a>
            <a href="#locations" className="text-sm font-medium hover:text-red-600">Locations</a>
            <a href="#rewards" className="text-sm font-medium hover:text-red-600">Rewards</a>
          </nav>

          <div className="hidden md:block">
            <a href="#locations" className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700">Find a Store</a>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setOpen((v) => !v)}
            className="inline-flex items-center justify-center rounded-md p-2 md:hidden"
            aria-label="Toggle Menu"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu panel */}
        {open && (
          <div className="border-t border-gray-200 bg-white md:hidden">
            <nav className="space-y-1 px-4 py-3">
              {[
                { href: "#menu", label: "Menu" },
                { href: "#featured", label: "Featured" },
                { href: "#story", label: "Our Story" },
                { href: "#locations", label: "Locations" },
                { href: "#rewards", label: "Rewards" },
              ].map((link) => (
                <a key={link.href} href={link.href} onClick={() => setOpen(false)} className="block rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-50">
                  {link.label}
                </a>
              ))}
              <a href="#locations" onClick={() => setOpen(false)} className="mt-2 block rounded-full bg-red-600 px-4 py-2 text-center text-sm font-semibold text-white">Find a Store</a>
            </nav>
          </div>
        )}
      </header>

      {/* HERO */}
      <section id="home" className="relative isolate flex min-h-[88vh] items-center overflow-hidden pt-20">
        {/* Replace this gradient with a hero image later: */}
        {/* Example (later): <div className="absolute inset-0 bg-cover bg-center" style={{backgroundImage: 'url(/images/hero.jpg)'}} /> */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-900/60 to-transparent opacity-80" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(239,68,68,0.25),transparent_40%),radial-gradient(circle_at_80%_30%,rgba(239,68,68,0.15),transparent_30%)]" />

        {/* Placeholder media block */}
        <div className="absolute inset-0 -z-10 flex items-center justify-center">
          <div className="h-[70%] w-[90%] rounded-3xl border border-dashed border-white/30 bg-white/5" />
        </div>

        <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Freshly Shaken, Boldly Brewed
          </h1>
          <p className="max-w-2xl text-base text-white/80 sm:text-lg">
            A sleek, image-ready layout inspired by Sharetea. Swap in product photos and store visuals later.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a href="#menu" className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm transition hover:shadow">
              Explore Menu
            </a>
            <a href="#locations" className="rounded-full border border-white/70 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/10">
              Find a Store
            </a>
          </div>
        </div>
      </section>

      {/* RIBBON / ANNOUNCEMENT */}
      <section className="border-y border-gray-200 bg-gray-50">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 text-sm sm:px-6 lg:px-8">
          <p className="font-medium">Limited-time flavors dropping soon.</p>
          <a href="#menu" className="inline-flex items-center gap-2 rounded-full bg-gray-900 px-3 py-1.5 text-white">
            Preview Menu <span aria-hidden>→</span>
          </a>
        </div>
      </section>

      {/* FEATURED (carousel-style strip without JS) */}
      <section id="featured" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="text-2xl font-bold">Featured Drinks</h2>
          <a href="#menu" className="text-sm font-semibold text-red-600 hover:text-red-700">View all</a>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <article key={i} className="group overflow-hidden rounded-2xl border border-gray-200">
              {/* Replace this block with an <img> later */}
              <div className="aspect-[4/5] w-full bg-gray-100">
                <div className="flex h-full items-center justify-center text-xs text-gray-500">
                  Image placeholder {i + 1}
                </div>
              </div>
              <div className="p-3">
                <h3 className="text-sm font-semibold">Drink Name</h3>
                <p className="text-xs text-gray-500">Signature series</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* MENU PREVIEW GRID */}
      <section id="menu" className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-2xl font-bold">Menu Highlights</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {["Milk Tea", "Fruit Tea", "Toppings"].map((cat) => (
              <div key={cat} className="rounded-2xl border border-gray-200 p-6">
                <div className="mb-4 aspect-[16/9] w-full overflow-hidden rounded-xl bg-gray-100">
                  <div className="flex h-full items-center justify-center text-xs text-gray-500">Category image</div>
                </div>
                <h3 className="text-lg font-semibold">{cat}</h3>
                <ul className="mt-3 space-y-1 text-sm text-gray-600">
                  <li>Item one</li>
                  <li>Item two</li>
                  <li>Item three</li>
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STORY / BRAND */}
      <section id="story" className="bg-gray-50">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <h2 className="text-2xl font-bold">Brewed with care since 20XX</h2>
            <p className="mt-4 text-gray-600">
              I may use this section to tell origin story, sourcing, or quality promise. Keeping it short with visual-forward as the images will do most of the talking later.
            </p>
            <div className="mt-6 flex gap-3">
              <a href="#rewards" className="rounded-full bg-red-600 px-5 py-2.5 text-sm font-semibold text-white">Join Rewards</a>
              <a href="#locations" className="rounded-full border border-gray-300 px-5 py-2.5 text-sm font-semibold">Find a Store</a>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="aspect-[3/4] rounded-2xl bg-gray-200" />
            <div className="aspect-[3/4] translate-y-6 rounded-2xl bg-gray-200" />
          </div>
        </div>
      </section>

      {/* REWARDS / APP BANNER */}
      <section id="rewards" className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-red-600 to-red-500" />
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-8 px-4 py-16 text-white sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <h2 className="text-2xl font-bold">Rewards & App</h2>
            <p className="mt-3 max-w-xl text-white/90">
              Tease your points program and mobile app. Add your App Store and Google Play badges later.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="#" className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-gray-900">Download iOS</a>
              <a href="#" className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-gray-900">Download Android</a>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="aspect-[9/16] rounded-xl bg-white/10" />
            <div className="aspect-[9/16] translate-y-6 rounded-xl bg-white/10" />
          </div>
        </div>
      </section>

      {/* LOCATIONS / STORE LOCATOR CTA */}
      <section id="locations" className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
            <div className="order-2 lg:order-1">
              <h2 className="text-2xl font-bold">Find a Store Near You</h2>
              <p className="mt-3 text-gray-600">Integrate a map or store list later. For now this is a clean CTA section.</p>
              <form className="mt-6 flex max-w-md gap-2">
                <input type="text" placeholder="Enter city or ZIP" className="w-full rounded-xl border border-gray-300 px-4 py-2 outline-none ring-red-600 focus:ring" />
                <button type="button" className="rounded-xl bg-gray-900 px-4 py-2 text-white">Search</button>
              </form>
            </div>
            <div className="order-1 lg:order-2">
              <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl bg-gray-100">
                <div className="flex h-full items-center justify-center text-xs text-gray-500">Map / store image placeholder</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SOCIAL STRIP */}
      <section className="bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold">Follow Us</h2>
            <a href="#" className="text-sm font-semibold text-red-600">@cmbanhmi</a>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-square rounded-xl bg-gray-200" />
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-gray-200 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-12 sm:px-6 md:grid-cols-4 lg:px-8">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <div className="h-7 w-7 rounded-full bg-red-600" />
              <span className="text-lg font-semibold">CM Banh Mi</span>
            </div>
            <p className="text-sm text-gray-600">Refreshing moments, any time.</p>
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
              <li><a href="#story" className="hover:text-gray-900">Our Story</a></li>
              <li><a href="#locations" className="hover:text-gray-900">Locations</a></li>
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
        <div className="border-t border-gray-200 py-6 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} CM Banh Mi. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

