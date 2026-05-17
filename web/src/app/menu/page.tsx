"use client";

import { menuCategories, menuItems, type MenuItem } from "@/lib/menu";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

const logoMenuLinks = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/order", label: "Order" },
  { href: "/about", label: "About" },
  { href: "/about#contact", label: "Contact" },
  { href: "/#rewards", label: "Rewards" },
];

export type CartItem = {
  cartId: string;
  itemId: MenuItem["id"];
  name: string;
  price: number;
  optionName?: string;
};

function getDefaultPrice(item: MenuItem) {
  return item.price ?? item.options?.[0]?.price ?? 0;
}

function getPriceLabel(item: MenuItem) {
  if (typeof item.price === "number") {
    return `$${item.price.toFixed(2)}`;
  }

  if (item.options?.length) {
    return item.options
      .map((option) => `${option.name}: $${option.price.toFixed(2)}`)
      .join(" / ");
  }

  return "Price unavailable";
}

function createCartItem(item: MenuItem): CartItem {
  const defaultOption = item.options?.[0];

  return {
    cartId: `${item.id}-${defaultOption?.name ?? "default"}-${Date.now()}-${Math.random()}`,
    itemId: item.id,
    name: item.name,
    price: item.price ?? defaultOption?.price ?? 0,
    optionName: defaultOption?.name,
  };
}

export default function MenuPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const router = useRouter();
  const [logoMenuOpen, setLogoMenuOpen] = useState(false);

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  const groupedCartItems = useMemo(() => {
    return cart.reduce(
      (acc, item) => {
        const groupKey = `${item.itemId}-${item.optionName ?? "default"}`;
        const existingItem = acc.find((cartItem) => cartItem.groupKey === groupKey);

        if (existingItem) {
          existingItem.quantity += 1;
          existingItem.cartIds.push(item.cartId);
        } else {
          acc.push({ ...item, groupKey, quantity: 1, cartIds: [item.cartId] });
        }

        return acc;
      },
      [] as Array<CartItem & { groupKey: string; quantity: number; cartIds: string[] }>
    );
  }, [cart]);

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
       <div className="sticky top-20 z-40 mx-auto mb-4 max-w-5xl rounded-lg border border-orange-200 bg-orange-50 p-4 text-sm shadow-md">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="font-bold text-orange-700">Current Order</h2>
            <div className="flex items-center gap-3">
              <span className="font-semibold text-orange-700">
                {cart.length} item{cart.length === 1 ? "" : "s"}
              </span>

              {cart.length > 0 && (
                <button
                  onClick={() => setCart([])}
                  className="rounded bg-gray-800 px-2 py-1 text-xs font-semibold text-white hover:bg-black"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          <div className="mx-auto max-w-5xl">
            {cart.length === 0 ? (
              <p className="text-gray-600">No items added yet.</p>
            ) : (
              <>
                <ul className="space-y-1">
                  {groupedCartItems.map((item) => (
                    <li key={item.groupKey} className="flex items-center justify-between text-gray-800">
                      <span>
                        {item.name}
                        {item.optionName ? ` (${item.optionName})` : ""} x{item.quantity}
                      </span>

                      <div className="flex items-center gap-2">
                        <span>${(item.price * item.quantity).toFixed(2)}</span>

                        <button
                          onClick={() => {
                            const cartIdToRemove = item.cartIds[0];
                            setCart(cart.filter((cartItem) => cartItem.cartId !== cartIdToRemove));
                          }}
                          className="rounded bg-red-500 px-2 py-1 text-xs font-semibold text-white hover:bg-red-600"
                        >
                          Remove
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="mt-3 flex justify-between border-t border-orange-200 pt-2 font-bold text-orange-700">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <button
                  disabled={cart.length === 0}
                  onClick={() => {
                    localStorage.setItem("cart", JSON.stringify(cart));
                    router.push("/order");
                  }}
                  className="mt-4 w-full rounded bg-orange-500 px-4 py-2 font-bold text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-gray-300"
                >
                  Checkout
                </button>
              </>
            )}
          </div>
        </div>

        <div className="mx-auto max-w-5xl">
          {menuCategories.map((category) => (
            <section key={category} className="mb-8 last:mb-0">
              <div className="mb-3 flex items-center gap-3">
                <h2 className="whitespace-nowrap text-2xl font-extrabold text-orange-500">
                  {category}
                </h2>
                <div className="h-0.5 flex-1 bg-gray-900" />
              </div>

              <div className="grid grid-cols-1 gap-x-8 gap-y-3 text-sm sm:text-base md:grid-cols-2">
                {menuItems
                  .filter((item) => item.category === category)
                  .map((item) => (
                    <div key={item.id} className="rounded-md p-2 transition hover:bg-gray-50">
                      <div className="flex items-center gap-2">
                        <span className="font-bold">
                          {typeof item.id === "number" ? `#${item.id} ` : ""}{item.name}
                        </span>

                        <span className="flex-1 border-b border-dotted border-gray-500" />

                        <span className="text-right text-sm font-semibold text-green-700">
                          {getPriceLabel(item)}
                        </span>
                      </div>

                      {item.description && (
                        <p className="mt-1 text-sm leading-relaxed text-gray-600">
                          {item.description}
                        </p>
                      )}

                      {item.tags && item.tags.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {item.tags.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full bg-orange-100 px-2 py-1 text-xs font-semibold text-orange-700"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      <button
                        onClick={() => setCart([...cart, createCartItem(item)])}
                        disabled={getDefaultPrice(item) === 0}
                        className="mt-2 rounded bg-orange-500 px-2 py-1 text-xs font-semibold text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-gray-300"
                      >
                        Add
                      </button>
                    </div>
                  ))}
              </div>
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}
