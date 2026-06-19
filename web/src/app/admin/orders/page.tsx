"use client";

import { useCallback, useEffect, useState } from "react";

type PricedCustomization = {
  name: string;
  price?: number;
  placement?: string;
};

type OrderItemCustomizations = {
  optionName?: string | null;
  selectedAddOns?: PricedCustomization[];
  selectedToppings?: PricedCustomization[];
  removedIngredients?: string[];
  flavor?: string | null;
};

type OrderItem = {
  id: number;
  order_id: number;
  item_name: string;
  quantity: number;
  price: string | number;
  customizations: OrderItemCustomizations | null;
};

type Order = {
  id: number;
  customer_name: string;
  pickup_time: string;
  pickup_notes: string | null;
  total: string | number;
  created_at: string;
  items: OrderItem[];
};

type OrdersResponse = {
  success: boolean;
  orders?: Order[];
  error?: string;
};

function formatCurrency(value: string | number) {
  return `$${Number(value).toFixed(2)}`;
}

function formatPickupTime(time: string) {
  if (!time) {
    return "";
  }

  const [hours, minutes] = time.split(":");
  const hour = Number(hours);

  if (Number.isNaN(hour) || !minutes) {
    return time;
  }

  const suffix = hour >= 12 ? "PM" : "AM";
  const formattedHour = hour % 12 || 12;

  return `${formattedHour}:${minutes} ${suffix}`;
}

function formatPricedItems(items: PricedCustomization[]) {
  return items
    .map((item) => (item.placement ? `${item.name} (${item.placement})` : item.name))
    .join(", ");
}

function getCustomizationLines(customizations: OrderItemCustomizations | null) {
  if (!customizations) {
    return [];
  }

  const lines: string[] = [];

  if (customizations.optionName) {
    lines.push(`Protein: ${customizations.optionName}`);
  }

  if (customizations.selectedAddOns?.length) {
    lines.push(`Add: ${formatPricedItems(customizations.selectedAddOns)}`);
  }

  if (customizations.selectedToppings?.length) {
    lines.push(formatPricedItems(customizations.selectedToppings));
  }

  if (customizations.removedIngredients?.length) {
    lines.push(`No ${customizations.removedIngredients.join(", ")}`);
  }

  return lines;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const fetchOrders = useCallback(async (showRefreshing = false) => {
    if (showRefreshing) {
      setRefreshing(true);
    }

    try {
      const response = await fetch("/api/orders", { cache: "no-store" });
      const data = (await response.json()) as OrdersResponse;

      if (!response.ok || !data.success || !data.orders) {
        throw new Error(data.error ?? "Failed to fetch orders");
      }

      setOrders(data.orders);
      setError("");
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : "Failed to fetch orders");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void fetchOrders();

    const intervalId = window.setInterval(() => {
      void fetchOrders();
    }, 5000);

    return () => window.clearInterval(intervalId);
  }, [fetchOrders]);

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-6 text-gray-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col gap-3 border-b border-gray-300 pb-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase text-orange-600">Admin</p>
            <h1 className="text-3xl font-extrabold text-gray-950">Incoming Orders</h1>
          </div>

          <button
            type="button"
            onClick={() => void fetchOrders(true)}
            disabled={refreshing}
            className="rounded bg-orange-500 px-4 py-2 text-sm font-bold text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {error && (
          <div className="mt-4 rounded border border-red-200 bg-red-50 px-4 py-3 font-semibold text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <p className="mt-8 text-lg font-semibold text-gray-700">Loading orders...</p>
        ) : orders.length === 0 ? (
          <div className="mt-8 rounded-lg border border-gray-200 bg-white p-6 text-center shadow-sm">
            <h2 className="text-xl font-bold text-gray-900">No orders yet</h2>
            <p className="mt-2 text-gray-600">New orders will appear here automatically.</p>
          </div>
        ) : (
          <div className="mt-6 grid gap-4">
            {orders.map((order) => (
              <article
                key={order.id}
                className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h2 className="text-2xl font-extrabold text-gray-950">Order #{order.id}</h2>
                    <p className="mt-1 text-xl font-bold text-gray-800">{order.customer_name}</p>
                    <p className="mt-2 text-base font-semibold text-orange-700">
                      Pickup: {formatPickupTime(order.pickup_time)}
                    </p>
                  </div>

                  <div className="rounded-md bg-green-50 px-3 py-2 text-right">
                    <p className="text-xs font-bold uppercase text-green-700">Total</p>
                    <p className="text-2xl font-extrabold text-green-800">
                      {formatCurrency(order.total)}
                    </p>
                  </div>
                </div>

                {order.pickup_notes && (
                  <section className="mt-5 rounded-md border border-yellow-200 bg-yellow-50 p-3">
                    <h3 className="text-sm font-bold uppercase text-yellow-800">Notes</h3>
                    <p className="mt-1 whitespace-pre-wrap text-gray-900">{order.pickup_notes}</p>
                  </section>
                )}

                <section className="mt-5">
                  <h3 className="text-sm font-bold uppercase text-gray-600">Items</h3>

                  <ul className="mt-3 divide-y divide-gray-200">
                    {order.items.map((item) => {
                      const customizationLines = getCustomizationLines(item.customizations);

                      return (
                        <li key={item.id} className="py-3 first:pt-0 last:pb-0">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className="text-lg font-bold text-gray-950">
                                {item.quantity}x {item.item_name}
                              </p>

                              {customizationLines.length > 0 && (
                                <ul className="mt-2 space-y-1 text-sm font-semibold text-gray-700">
                                  {customizationLines.map((line) => (
                                    <li key={line}>&bull; {line}</li>
                                  ))}
                                </ul>
                              )}
                            </div>

                            <p className="shrink-0 font-bold text-gray-800">
                              {formatCurrency(Number(item.price) * item.quantity)}
                            </p>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </section>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
