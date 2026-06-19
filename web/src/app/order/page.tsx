"use client";

import { menuItems, type MenuItem } from "@/lib/menu";
import SiteHeader from "@/components/SiteHeader";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type CartItem = {
  cartId: string;
  itemId: MenuItem["id"];
  name: string;
  price: number;
  quantity?: number;
  optionName?: string;
  removedIngredients?: string[];
  selectedAddOns?: SelectedAddOn[];
  flavor?: string;
  selectedToppings?: SelectedPricedItem[];
};

type SelectedAddOn = {
  name: string;
  price: number;
  placement?: string;
};

type SelectedPricedItem = {
  name: string;
  price: number;
};

function createCartItem(item: MenuItem, optionName?: string, quantity = 1): CartItem {
  const option = item.options?.find((itemOption) => itemOption.name === optionName) ?? item.options?.[0];

  return {
    cartId: `${item.id}-${option?.name ?? "default"}-${Date.now()}-${Math.random()}`,
    itemId: item.id,
    name: item.name,
    price: item.price ?? option?.price ?? 0,
    quantity,
    optionName: option?.name,
  };
}

function isCartItem(item: unknown): item is CartItem {
  return (
    typeof item === "object" &&
    item !== null &&
    "cartId" in item &&
    "itemId" in item &&
    "name" in item &&
    "price" in item &&
    typeof item.price === "number"
  );
}

function normalizeCart(savedCart: string): CartItem[] {
  const parsed = JSON.parse(savedCart) as unknown;

  if (!Array.isArray(parsed)) {
    return [];
  }

  return parsed.flatMap((cartEntry) => {
    if (isCartItem(cartEntry)) {
      return [cartEntry];
    }

    const item = menuItems.find((menuItem) => menuItem.id === cartEntry);
    return item ? [createCartItem(item)] : [];
  });
}

function getCustomizationKey(item: CartItem) {
  return [
    item.itemId,
    item.optionName ?? "default",
    item.removedIngredients?.join(",") ?? "no-removals",
    item.selectedAddOns
      ?.map((addOn) => `${addOn.name}:${addOn.price}:${addOn.placement ?? "no-placement"}`)
      .join(",") ?? "no-add-ons",
    item.flavor ?? "no-flavor",
    item.selectedToppings
      ?.map((topping) => `${topping.name}:${topping.price}`)
      .join(",") ?? "no-toppings",
  ].join("-");
}

function formatSelectedAddOns(addOns: SelectedAddOn[]) {
  return addOns
    .map((addOn) => (addOn.placement ? `${addOn.name} (${addOn.placement})` : addOn.name))
    .join(", ");
}

function formatPricedItems(items: SelectedPricedItem[]) {
  return items.map((item) => item.name).join(", ");
}

export default function OrderPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [pickupNotes, setPickupNotes] = useState("");
  const [pickupTime, setPickupTime] = useState("");

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");

    if (savedCart) {
      setCart(normalizeCart(savedCart));
    }
  }, []);

  const groupedCartItems = cart.reduce((acc, item) => {
    const groupKey = getCustomizationKey(item);
    const existingItem = acc.find((cartItem) => cartItem.groupKey === groupKey);

    if (existingItem) {
      existingItem.quantity += item.quantity ?? 1;
    } else {
      acc.push({ ...item, groupKey, quantity: item.quantity ?? 1 });
    }

    return acc;
  }, [] as Array<CartItem & { groupKey: string; quantity: number }>);

  const total = cart.reduce((sum, item) => sum + item.price * (item.quantity ?? 1), 0);
  
  function formatPickupTime(time: string) {
  if (!time) return "";

  const [hours, minutes] = time.split(":");
  const hour = Number(hours);

  const suffix = hour >= 12 ? "PM" : "AM";
  const formattedHour = hour % 12 || 12;

  return `${formattedHour}:${minutes} ${suffix}`;
  }

  function handleAddItems() {
    localStorage.setItem("cart", JSON.stringify(cart));
    router.push("/menu");
  }
  
      async function handlePlaceOrder() {
      if (!customerName || !pickupTime || groupedCartItems.length === 0) {
        alert("Please enter your name, pickup time, and at least one item.");
        return;
      }

      const order = {
        customerName,
        pickupTime,
        pickupNotes,
        items: groupedCartItems,
        total,
        createdAt: new Date().toISOString(),
      };

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(order),
      });

      const data = await response.json();

      if (!data.success) {
        alert("Something went wrong placing your order.");
        return;
      }

      setOrderPlaced(true);
      localStorage.removeItem("cart");
      setCart([]);
    }
  if (orderPlaced) {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <SiteHeader />
      <main className="flex min-h-screen items-center justify-center px-4 pb-12 pt-24">
        <div className="max-w-md rounded-lg border border-green-200 bg-green-50 p-6 text-center">
          <h1 className="text-3xl font-extrabold text-green-700">
            Order Placed!
          </h1>
          <p className="mt-3 text-gray-700">
            Thank you, {customerName}. Your order has been received.
          </p>
          <p className="mt-2 text-gray-600">
            Pickup time: {formatPickupTime(pickupTime)}
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => router.push("/menu")}
              className="flex-1 rounded bg-green-700 px-4 py-3 font-bold text-white hover:bg-green-800"
            >
              Order Another Meal
            </button>
            <button
              type="button"
              onClick={() => router.push("/")}
              className="flex-1 rounded border border-green-300 bg-white px-4 py-3 font-bold text-green-700 hover:bg-green-100"
            >
              Return Home
            </button>
          </div>
        </div>
      </main>
    </div>
  );
  }
  return (
    <main className="min-h-screen bg-white px-4 py-8 text-gray-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-orange-500">Checkout</h1>
            <p className="mt-2 text-gray-600">
              Review your order and enter pickup details.
            </p>
          </div>

          <button
            type="button"
            onClick={handleAddItems}
            className="rounded border border-orange-300 px-4 py-2 text-sm font-bold text-orange-700 hover:bg-orange-50"
          >
            Add Items
          </button>
        </div>

        <section className="mt-6 rounded-lg border border-orange-200 bg-orange-50 p-4">
          <h2 className="text-lg font-bold text-orange-700">Order Summary</h2>

          {groupedCartItems.length === 0 ? (
            <p className="mt-3 text-gray-600">Your cart is empty.</p>
          ) : (
            <>
              <ul className="mt-3 space-y-2">
                {groupedCartItems.map((item) => (
                  <li
                    key={item.groupKey}
                    className="flex items-center justify-between text-gray-800"
                  >
                    <span>
                      {item.name}
                      {item.optionName ? ` (${item.optionName})` : ""} x{item.quantity}
                      {item.removedIngredients && item.removedIngredients.length > 0 && (
                        <span className="block text-xs text-gray-600">
                          No {item.removedIngredients.join(", ")}
                        </span>
                      )}
                      {item.selectedAddOns && item.selectedAddOns.length > 0 && (
                        <span className="block text-xs text-gray-600">
                          Add {formatSelectedAddOns(item.selectedAddOns)}
                        </span>
                      )}
                      {item.selectedToppings && item.selectedToppings.length > 0 && (
                        <span className="block text-xs text-gray-600">
                          Toppings: {formatPricedItems(item.selectedToppings)}
                        </span>
                      )}
                    </span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-4 flex justify-between border-t border-orange-200 pt-3 font-bold text-orange-700">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </>
          )}
        </section>

        <section className="mt-6 rounded-lg border border-gray-200 p-4">
          <h2 className="text-lg font-bold">Pickup Details</h2>

          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-semibold">
                Customer Name
              </label>
              <input
                value={customerName}
                onChange={(event) => setCustomerName(event.target.value)}
                className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold">
                Pickup Time
              </label>
              <input
                type="time"
                value={pickupTime}
                onChange={(event) => setPickupTime(event.target.value)}
                className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold">
                Pickup Notes
              </label>
              <textarea
                value={pickupNotes}
                onChange={(event) => setPickupNotes(event.target.value)}
                className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
                placeholder="Any special instructions?"
                rows={3}
              />
            </div>
          </div>
        </section>

        <button
          disabled={groupedCartItems.length === 0}
          onClick={handlePlaceOrder}
          className="mt-6 w-full rounded bg-orange-500 px-4 py-3 font-bold text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          Place Order
        </button>
      </div>
    </main>
  );
}
