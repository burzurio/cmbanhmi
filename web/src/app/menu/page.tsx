"use client";

import { menuCategories, menuItems, type MenuItem } from "@/lib/menu";
import SiteHeader from "@/components/SiteHeader";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export type CartItem = {
  cartId: string;
  itemId: MenuItem["id"];
  name: string;
  price: number;
  quantity?: number;
  optionName?: string;
  removedIngredients?: string[];
  selectedAddOns?: SelectedAddOn[];
  flavor?: string;
  selectedToppings?: SelectedTopping[];
};

type AddOnPlacement = "On sandwich" | "On the side";

type SelectedAddOn = {
  name: string;
  price: number;
  placement?: AddOnPlacement;
};

type NoodleType = "Udon noodle" | "Egg noodle";

type SelectedTopping = {
  name: string;
  price: number;
};

const defaultBanhMiIngredients = [
  "Carrots",
  "Meat",
  "Cucumber",
  "Jalapeños",
  "Cilantro",
];

const sandwichAddOns = [
  { name: "Extra Meat", price: 2.0 },
  { name: "Scrambled Egg", price: 1.75 },
  { name: "Chili Oil", price: 0.5 },
  { name: "Kimchi", price: 1.5 },
  { name: "Apple Kimchi", price: 2.0 },
  { name: "Extra Veggies", price: 0.75 },
  { name: "Pâté", price: 1.0 },
  { name: "Avocado", price: 1.5 },
];

const addOnsWithPlacement = ["Chili Oil", "Kimchi", "Apple Kimchi"];
const addOnPlacementOptions: AddOnPlacement[] = ["On sandwich", "On the side"];
const defaultAddOnPlacement: AddOnPlacement = "On sandwich";
const noodleTypes: NoodleType[] = ["Udon noodle", "Egg noodle"];
const optionCustomizationItemIds = [12, 13, 14, 15, 16, 17, 20];

const drinkToppings = [
  { name: "Boba", price: 0.75 },
  { name: "Crystal Boba", price: 0.75 },
  { name: "Lychee Jelly", price: 0.75 },
  { name: "Rainbow Jelly", price: 0.75 },
  { name: "Coconut Jelly", price: 0.75 },
  { name: "Green Apple Jelly", price: 0.75 },
  { name: "Lychee Popping Boba", price: 0.75 },
  { name: "Mango Popping Boba", price: 0.75 },
  { name: "Strawberry Popping Boba", price: 0.75 },
  { name: "Brown Sugar Boba", price: 1 },
  { name: "Sea Salt Crema", price: 1 },
  { name: "Red Bean", price: 1 },
  { name: "Strawberry Purée", price: 1 },
];

function getDefaultIngredientsForItem(item: MenuItem) {
  if (item.id === 1 || item.id === 4) {
    return [...defaultBanhMiIngredients, "Pâté"];
  }

  if (item.id === 3) {
    return [...defaultBanhMiIngredients, "Kimchi"];
  }

  return defaultBanhMiIngredients;
}

function getItemOptions(item: MenuItem) {
  return item.options ?? [];
}

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

function createCartItem(item: MenuItem, quantity = 1): CartItem {
  const defaultOption = item.options?.[0];

  return {
    cartId: `${item.id}-${defaultOption?.name ?? "default"}-${Date.now()}-${Math.random()}`,
    itemId: item.id,
    name: item.name,
    price: item.price ?? defaultOption?.price ?? 0,
    quantity,
    optionName: defaultOption?.name,
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

function isBanhMiItem(item: MenuItem) {
  return item.category === menuCategories[0];
}

function isOptionCustomizationItem(item: MenuItem) {
  return optionCustomizationItemIds.includes(Number(item.id)) && getItemOptions(item).length > 0;
}

function isStirFryNoodlesItem(item: MenuItem) {
  return item.id === 17;
}

function isMilkTeaFlavorItem(item: MenuItem) {
  return ( 
    (item.category === "Milk Tea" || item.category === "Specialty Drinks") &&
     getItemOptions(item).length > 0
  );
}

function hasPlacementOption(addOnName: string) {
  return addOnsWithPlacement.includes(addOnName);
}

function formatSelectedAddOns(addOns: SelectedAddOn[]) {
  return addOns
    .map((addOn) => (addOn.placement ? `${addOn.name} (${addOn.placement})` : addOn.name))
    .join(", ");
}

function formatPricedItems(items: SelectedTopping[]) {
  return items.map((item) => item.name).join(", ");
}

function getBaseItemName(item: CartItem) {
  return menuItems.find((menuItem) => menuItem.id === item.itemId)?.name ?? item.name;
}

function getCartItemDetails(item: CartItem) {
  const baseName = getBaseItemName(item);
  const details: string[] = [];

  if (item.name !== baseName && item.name.startsWith(baseName)) {
    const optionText = item.name.slice(baseName.length).trim();

    if (optionText) {
      details.push(`Option: ${optionText}`);
    }
  }

  if (item.optionName) {
    details.push(`Option: ${item.optionName}`);
  }

  if (item.removedIngredients?.length) {
    details.push(`No ${item.removedIngredients.join(", ")}`);
  }

  if (item.selectedAddOns?.length) {
    details.push(`Add ${formatSelectedAddOns(item.selectedAddOns)}`);
  }

  if (item.selectedToppings?.length) {
    details.push(`Toppings: ${formatPricedItems(item.selectedToppings)}`);
  }

  return details;
}

export default function MenuPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const router = useRouter();
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [includedIngredients, setIncludedIngredients] = useState(defaultBanhMiIngredients);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [addOnPlacements, setAddOnPlacements] = useState<Record<string, AddOnPlacement>>({});
  const [selectedOptionName, setSelectedOptionName] = useState("");
  const [selectedNoodleType, setSelectedNoodleType] = useState<NoodleType>(noodleTypes[0]);
  const [selectedToppings, setSelectedToppings] = useState<string[]>([]);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [toast, setToast] = useState<{ message: string; id: number } | null>(null);

  const cartItemCount = cart.reduce((sum, item) => sum + (item.quantity ?? 1), 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.price * (item.quantity ?? 1), 0);
  const defaultIngredientsForSelectedItem = selectedItem
    ? getDefaultIngredientsForItem(selectedItem)
    : defaultBanhMiIngredients;
  const optionsForSelectedItem = selectedItem ? getItemOptions(selectedItem) : [];
  const selectedOption =
    optionsForSelectedItem.find((option) => option.name === selectedOptionName) ??
    optionsForSelectedItem[0];
  const selectedAddOnsTotal = sandwichAddOns
    .filter((addOn) => selectedAddOns.includes(addOn.name))
    .reduce((sum, addOn) => sum + addOn.price, 0);
  const selectedDrinkOption = selectedItem && isMilkTeaFlavorItem(selectedItem)
    ? optionsForSelectedItem.find((option) => option.name === selectedOptionName)
    : undefined;
  const selectedToppingsTotal = drinkToppings
    .filter((topping) => selectedToppings.includes(topping.name))
    .reduce((sum, topping) => sum + topping.price, 0);
  const selectedItemTotal = selectedItem
    ? (isOptionCustomizationItem(selectedItem)
        ? selectedOption?.price ?? getDefaultPrice(selectedItem)
        : isMilkTeaFlavorItem(selectedItem)
          ? (selectedDrinkOption?.price ?? 0) + selectedToppingsTotal
          : getDefaultPrice(selectedItem) + selectedAddOnsTotal)
    : 0;

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");

    if (savedCart) {
      setCart(normalizeCart(savedCart));
    }
  }, []);

  useEffect(() => {
    if (!toast) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setToast(null);
    }, 1800);

    return () => window.clearTimeout(timeoutId);
  }, [toast]);

  function showAddedToast(itemName: string) {
    setToast({
      message: `${itemName} added`,
      id: Date.now(),
    });
  }

  function goToOrder() {
    localStorage.setItem("cart", JSON.stringify(cart));
    router.push("/order");
  }

  function openBanhMiModal(item: MenuItem) {
    setSelectedItem(item);
    setIncludedIngredients(getDefaultIngredientsForItem(item));
    setSelectedAddOns([]);
    setAddOnPlacements({});
    setSelectedOptionName("");
    setSelectedNoodleType(noodleTypes[0]);
    setSelectedToppings([]);
    setSelectedQuantity(1);
  }

  function openOptionCustomizationModal(item: MenuItem) {
    setSelectedItem(item);
    setIncludedIngredients(defaultBanhMiIngredients);
    setSelectedAddOns([]);
    setAddOnPlacements({});
    setSelectedOptionName(getItemOptions(item)[0]?.name ?? "");
    setSelectedNoodleType(noodleTypes[0]);
    setSelectedToppings([]);
    setSelectedQuantity(1);
  }

  function openDrinkCustomizationModal(item: MenuItem) {
    setSelectedItem(item);
    setIncludedIngredients(defaultBanhMiIngredients);
    setSelectedAddOns([]);
    setAddOnPlacements({});
    setSelectedOptionName("");
    setSelectedNoodleType(noodleTypes[0]);
    setSelectedToppings([]);
    setSelectedQuantity(1);
  }

  function openBasicItemModal(item: MenuItem) {
    setSelectedItem(item);
    setIncludedIngredients(defaultBanhMiIngredients);
    setSelectedAddOns([]);
    setAddOnPlacements({});
    setSelectedOptionName("");
    setSelectedNoodleType(noodleTypes[0]);
    setSelectedToppings([]);
    setSelectedQuantity(1);
  }

  function closeBanhMiModal() {
    setSelectedItem(null);
    setIncludedIngredients(defaultBanhMiIngredients);
    setSelectedAddOns([]);
    setAddOnPlacements({});
    setSelectedOptionName("");
    setSelectedNoodleType(noodleTypes[0]);
    setSelectedToppings([]);
    setSelectedQuantity(1);
  }

  function toggleIngredient(ingredient: string) {
    setIncludedIngredients((currentIngredients) =>
      currentIngredients.includes(ingredient)
        ? currentIngredients.filter((currentIngredient) => currentIngredient !== ingredient)
        : [...currentIngredients, ingredient]
    );
  }

  function toggleAddOn(addOnName: string) {
    setSelectedAddOns((currentAddOns) => {
      if (currentAddOns.includes(addOnName)) {
        setAddOnPlacements((currentPlacements) => {
          const nextPlacements = { ...currentPlacements };
          delete nextPlacements[addOnName];
          return nextPlacements;
        });
        return currentAddOns.filter((currentAddOn) => currentAddOn !== addOnName);
      }

      if (hasPlacementOption(addOnName)) {
        setAddOnPlacements((currentPlacements) => ({
          ...currentPlacements,
          [addOnName]: currentPlacements[addOnName] ?? defaultAddOnPlacement,
        }));
      }

      return [...currentAddOns, addOnName];
    });
  }

  function updateAddOnPlacement(addOnName: string, placement: AddOnPlacement) {
    setAddOnPlacements((currentPlacements) => ({
      ...currentPlacements,
      [addOnName]: placement,
    }));
  }

  function toggleTopping(toppingName: string) {
    setSelectedToppings((currentToppings) =>
      currentToppings.includes(toppingName)
        ? currentToppings.filter((currentTopping) => currentTopping !== toppingName)
        : [...currentToppings, toppingName]
    );
  }

  function decrementQuantity() {
    setSelectedQuantity((currentQuantity) => Math.max(1, currentQuantity - 1));
  }

  function incrementQuantity() {
    setSelectedQuantity((currentQuantity) => currentQuantity + 1);
  }

  function addBasicItemToCart() {
    if (!selectedItem) {
      return;
    }

    setCart((currentCart) => [...currentCart, createCartItem(selectedItem, selectedQuantity)]);
    showAddedToast(selectedItem.name);
    closeBanhMiModal();
  }

  function addCustomizedItemToCart() {
    if (!selectedItem) {
      return;
    }

    const removedIngredients = defaultIngredientsForSelectedItem.filter(
      (ingredient) => !includedIngredients.includes(ingredient)
    );

    setCart((currentCart) => [
      ...currentCart,
      {
        ...createCartItem(selectedItem, selectedQuantity),
        price: selectedItemTotal,
        removedIngredients,
        selectedAddOns: sandwichAddOns
          .filter((addOn) => selectedAddOns.includes(addOn.name))
          .map((addOn) => ({
            name: addOn.name,
            price: addOn.price,
            placement: hasPlacementOption(addOn.name)
              ? addOnPlacements[addOn.name] ?? defaultAddOnPlacement
              : undefined,
          })),
      },
    ]);
    showAddedToast(selectedItem.name);
    closeBanhMiModal();
  }

  function addDrinkCustomizedItemToCart() {
    if (!selectedItem || !selectedDrinkOption) {
      return;
    }

    setCart((currentCart) => [
      ...currentCart,
      {
        ...createCartItem(selectedItem, selectedQuantity),
        name: `${selectedItem.name} ${selectedDrinkOption.name}`,
        price: selectedItemTotal,
        optionName: undefined,
        flavor: selectedItem.name,
        selectedToppings: drinkToppings
          .filter((topping) => selectedToppings.includes(topping.name))
          .map((topping) => ({ name: topping.name, price: topping.price })),
      },
    ]);
    showAddedToast(selectedItem.name);
    closeBanhMiModal();
  }

  function addOptionCustomizedItemToCart() {
    if (!selectedItem || !selectedOption) {
      return;
    }

    setCart((currentCart) => [
      ...currentCart,
      {
        ...createCartItem(selectedItem, selectedQuantity),
        price: selectedOption.price,
        optionName: isStirFryNoodlesItem(selectedItem)
          ? `${selectedOption.name} / ${selectedNoodleType}`
          : selectedOption.name,
      },
    ]);
    showAddedToast(selectedItem.name);
    closeBanhMiModal();
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <SiteHeader />

      <main className="px-4 pb-24 pt-20 sm:px-6 lg:px-8">
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
                        onClick={() => {
                          if (isBanhMiItem(item)) {
                            openBanhMiModal(item);
                            return;
                          }

                          if (isOptionCustomizationItem(item)) {
                            openOptionCustomizationModal(item);
                            return;
                          }

                          if (isMilkTeaFlavorItem(item)) {
                            openDrinkCustomizationModal(item);
                            return;
                          }

                          openBasicItemModal(item);
                        }}
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

      {toast && (
        <div className="fixed bottom-24 right-4 z-50 rounded-md bg-gray-950 px-4 py-3 text-sm font-bold text-white shadow-lg sm:right-6">
          {toast.message}
        </div>
      )}

      <button
        type="button"
        onClick={() => setCartOpen(true)}
        className="fixed bottom-5 right-4 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-orange-500 text-white shadow-lg transition hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 sm:right-6"
        aria-label={`View order with ${cartItemCount} item${cartItemCount === 1 ? "" : "s"}`}
      >
        <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M7 8V7a5 5 0 0 1 10 0v1"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M5 8h14l-1 12H6L5 8Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </svg>
        {cartItemCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-6 min-w-6 items-center justify-center rounded-full bg-gray-950 px-1.5 text-xs font-extrabold text-white">
            {cartItemCount}
          </span>
        )}
      </button>

      {cartOpen && (
        <div
          className="fixed inset-0 z-50 flex justify-end bg-black/40"
          onClick={() => setCartOpen(false)}
        >
          <aside
            className="flex h-full w-full max-w-md flex-col bg-white shadow-xl"
            aria-label="Current order"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-200 p-4">
              <div>
                <p className="text-sm font-bold uppercase text-orange-600">Current order</p>
                <h2 className="text-2xl font-extrabold text-gray-950">
                  {cartItemCount} item{cartItemCount === 1 ? "" : "s"}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setCartOpen(false)}
                className="rounded-md px-3 py-2 text-sm font-bold text-gray-700 hover:bg-gray-100"
              >
                Close
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {cart.length === 0 ? (
                <p className="rounded-md border border-gray-200 bg-gray-50 p-4 text-gray-600">
                  Your order is empty.
                </p>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {cart.map((item) => {
                    const quantity = item.quantity ?? 1;
                    const details = getCartItemDetails(item);

                    return (
                      <li key={item.cartId} className="py-4 first:pt-0 last:pb-0">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="font-extrabold text-gray-950">
                              {quantity}x {getBaseItemName(item)}
                            </p>
                            {details.length > 0 && (
                              <ul className="mt-1 space-y-0.5 text-sm font-medium text-gray-600">
                                {details.map((detail) => (
                                  <li key={detail}>{detail}</li>
                                ))}
                              </ul>
                            )}
                          </div>
                          <p className="shrink-0 font-bold text-gray-800">
                            ${(item.price * quantity).toFixed(2)}
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            <div className="border-t border-gray-200 p-4">
              <div className="flex items-center justify-between text-lg font-extrabold text-gray-950">
                <span>Total</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <button
                type="button"
                onClick={goToOrder}
                disabled={cart.length === 0}
                className="mt-4 w-full rounded bg-orange-500 px-4 py-3 font-bold text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-gray-300"
              >
                Checkout
              </button>
            </div>
          </aside>
        </div>
      )}

      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6">
          <div
            className="max-h-full w-full max-w-lg overflow-y-auto rounded-lg bg-white shadow-xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="banh-mi-customization-title"
          >
            <div className="border-b border-orange-100 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2
                    id="banh-mi-customization-title"
                    className="text-2xl font-extrabold text-orange-500"
                  >
                    Customize {selectedItem.name}
                  </h2>
                  <p className="mt-1 text-sm font-semibold text-green-700">
                    ${selectedItemTotal.toFixed(2)}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={closeBanhMiModal}
                  className="rounded-md px-2 py-1 text-2xl leading-none text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                  aria-label="Close customization modal"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
            </div>

            <div className="space-y-6 p-5">
              {isBanhMiItem(selectedItem) ? (
                <>
                  <section>
                    <h3 className="text-sm font-bold uppercase tracking-wide text-gray-700">
                      Ingredients
                    </h3>
                    <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {defaultIngredientsForSelectedItem.map((ingredient) => (
                        <label
                          key={ingredient}
                          className="flex cursor-pointer items-center justify-between rounded-md border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-800 hover:border-orange-300 hover:bg-orange-50"
                        >
                          <span>{ingredient}</span>
                          <input
                            type="checkbox"
                            checked={includedIngredients.includes(ingredient)}
                            onChange={() => toggleIngredient(ingredient)}
                            className="h-4 w-4 accent-orange-500"
                          />
                        </label>
                      ))}
                    </div>
                  </section>

                  <section>
                    <h3 className="text-sm font-bold uppercase tracking-wide text-gray-700">
                      Add-ons
                    </h3>
                    <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {sandwichAddOns.map((addOn) => (
                        <div
                          key={addOn.name}
                          className="rounded-md border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-800 hover:border-orange-300 hover:bg-orange-50"
                        >
                          <label className="flex cursor-pointer items-center justify-between">
                            <span>
                              {addOn.name}
                              <span className="ml-1 text-xs font-bold text-green-700">
                                +${addOn.price.toFixed(2)}
                              </span>
                            </span>
                            <input
                              type="checkbox"
                              checked={selectedAddOns.includes(addOn.name)}
                              onChange={() => toggleAddOn(addOn.name)}
                              className="h-4 w-4 accent-orange-500"
                            />
                          </label>

                          {selectedAddOns.includes(addOn.name) && hasPlacementOption(addOn.name) && (
                            <select
                              value={addOnPlacements[addOn.name] ?? defaultAddOnPlacement}
                              onChange={(event) =>
                                updateAddOnPlacement(addOn.name, event.target.value as AddOnPlacement)
                              }
                              className="mt-2 w-full rounded border border-orange-200 bg-white px-2 py-1 text-xs font-semibold text-gray-800 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100"
                              aria-label={`${addOn.name} placement`}
                            >
                              {addOnPlacementOptions.map((placement) => (
                                <option key={placement} value={placement}>
                                  {placement}
                                </option>
                              ))}
                            </select>
                          )}
                        </div>
                      ))}
                    </div>
                  </section>
                </>
              ) : isMilkTeaFlavorItem(selectedItem) ? (
                <>
                  <section>
                    <h3 className="text-sm font-bold uppercase tracking-wide text-gray-700">
                      Drink Type
                    </h3>
                    <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {optionsForSelectedItem.map((option) => (
                        <label
                          key={option.name}
                          className="flex cursor-pointer items-center justify-between rounded-md border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-800 hover:border-orange-300 hover:bg-orange-50"
                        >
                          <span>
                            {option.name}
                            <span className="ml-1 text-xs font-bold text-green-700">
                              ${option.price.toFixed(2)}
                            </span>
                          </span>
                          <input
                            type="radio"
                            name="drink-type"
                            checked={selectedOptionName === option.name}
                            onChange={() => setSelectedOptionName(option.name)}
                            className="h-4 w-4 accent-orange-500"
                          />
                        </label>
                      ))}
                    </div>
                  </section>

                  {selectedDrinkOption && (
                    <section>
                      <h3 className="text-sm font-bold uppercase tracking-wide text-gray-700">
                        Toppings
                      </h3>
                      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                        {drinkToppings.map((topping) => (
                          <label
                            key={topping.name}
                            className="flex cursor-pointer items-center justify-between rounded-md border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-800 hover:border-orange-300 hover:bg-orange-50"
                          >
                            <span>
                              {topping.name}
                              <span className="ml-1 text-xs font-bold text-green-700">
                                +${topping.price.toFixed(2)}
                              </span>
                            </span>
                            <input
                              type="checkbox"
                              checked={selectedToppings.includes(topping.name)}
                              onChange={() => toggleTopping(topping.name)}
                              className="h-4 w-4 accent-orange-500"
                            />
                          </label>
                        ))}
                      </div>
                    </section>
                  )}
                </>
              ) : isOptionCustomizationItem(selectedItem) ? (
                <section>
                  <h3 className="text-sm font-bold uppercase tracking-wide text-gray-700">
                    {isStirFryNoodlesItem(selectedItem) ? "Protein" : "Wonton Option"}
                  </h3>
                  <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {optionsForSelectedItem.map((option) => (
                      <label
                        key={option.name}
                        className="flex cursor-pointer items-center justify-between rounded-md border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-800 hover:border-orange-300 hover:bg-orange-50"
                      >
                        <span>
                          {option.name}
                          <span className="ml-1 text-xs font-bold text-green-700">
                            ${option.price.toFixed(2)}
                          </span>
                        </span>
                        <input
                          type="radio"
                          name="item-option"
                          checked={selectedOptionName === option.name}
                          onChange={() => setSelectedOptionName(option.name)}
                          className="h-4 w-4 accent-orange-500"
                        />
                      </label>
                    ))}
                  </div>

                  {isStirFryNoodlesItem(selectedItem) && (
                    <div className="mt-5">
                      <h3 className="text-sm font-bold uppercase tracking-wide text-gray-700">
                        Noodle Type
                      </h3>
                      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                        {noodleTypes.map((noodleType) => (
                          <label
                            key={noodleType}
                            className="flex cursor-pointer items-center justify-between rounded-md border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-800 hover:border-orange-300 hover:bg-orange-50"
                          >
                            <span>{noodleType}</span>
                            <input
                              type="radio"
                              name="noodle-type"
                              checked={selectedNoodleType === noodleType}
                              onChange={() => setSelectedNoodleType(noodleType)}
                              className="h-4 w-4 accent-orange-500"
                            />
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </section>
              ) : null}

              <section>
                <h3 className="text-sm font-bold uppercase tracking-wide text-gray-700">
                  Quantity
                </h3>
                <div className="mt-3 inline-flex items-center rounded-md border border-gray-200">
                  <button
                    type="button"
                    onClick={decrementQuantity}
                    disabled={selectedQuantity === 1}
                    className="h-10 w-10 text-xl font-bold text-gray-800 hover:bg-gray-50 disabled:cursor-not-allowed disabled:text-gray-300"
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span className="flex h-10 min-w-12 items-center justify-center border-x border-gray-200 px-4 text-lg font-extrabold">
                    {selectedQuantity}
                  </span>
                  <button
                    type="button"
                    onClick={incrementQuantity}
                    className="h-10 w-10 text-xl font-bold text-gray-800 hover:bg-gray-50"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </section>
            </div>

            <div className="flex gap-3 border-t border-orange-100 p-5">
              <button
                type="button"
                onClick={closeBanhMiModal}
                className="flex-1 rounded border border-gray-300 px-4 py-2 font-bold text-gray-800 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={
                  isBanhMiItem(selectedItem)
                    ? addCustomizedItemToCart
                    : isMilkTeaFlavorItem(selectedItem)
                      ? addDrinkCustomizedItemToCart
                      : isOptionCustomizationItem(selectedItem)
                        ? addOptionCustomizedItemToCart
                        : addBasicItemToCart
                }
                disabled={isMilkTeaFlavorItem(selectedItem) && !selectedDrinkOption}
                className="flex-1 rounded bg-orange-500 px-4 py-2 font-bold text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-gray-300"
              >
                Add to Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
