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

function hasPlacementOption(addOnName: string) {
  return addOnsWithPlacement.includes(addOnName);
}

function formatSelectedAddOns(addOns: SelectedAddOn[]) {
  return addOns
    .map((addOn) => (addOn.placement ? `${addOn.name} (${addOn.placement})` : addOn.name))
    .join(", ");
}

function formatPricedItems(items: Array<{ name: string }>) {
  return items.map((item) => item.name).join(", ");
}

export default function MenuPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const router = useRouter();
  const [logoMenuOpen, setLogoMenuOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [includedIngredients, setIncludedIngredients] = useState(defaultBanhMiIngredients);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [addOnPlacements, setAddOnPlacements] = useState<Record<string, AddOnPlacement>>({});
  const [selectedOptionName, setSelectedOptionName] = useState("");
  const [selectedNoodleType, setSelectedNoodleType] = useState<NoodleType>(noodleTypes[0]);
  const [selectedToppings, setSelectedToppings] = useState<string[]>([]);

  const total = cart.reduce((sum, item) => sum + item.price, 0);
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

  const groupedCartItems = useMemo(() => {
    return cart.reduce(
      (acc, item) => {
        const groupKey = getCustomizationKey(item);
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

  function openBanhMiModal(item: MenuItem) {
    setSelectedItem(item);
    setIncludedIngredients(getDefaultIngredientsForItem(item));
    setSelectedAddOns([]);
    setAddOnPlacements({});
    setSelectedOptionName("");
    setSelectedNoodleType(noodleTypes[0]);
    setSelectedToppings([]);
  }

  function openOptionCustomizationModal(item: MenuItem) {
    setSelectedItem(item);
    setIncludedIngredients(defaultBanhMiIngredients);
    setSelectedAddOns([]);
    setAddOnPlacements({});
    setSelectedOptionName(getItemOptions(item)[0]?.name ?? "");
    setSelectedNoodleType(noodleTypes[0]);
    setSelectedToppings([]);
  }

  function openDrinkCustomizationModal(item: MenuItem) {
    setSelectedItem(item);
    setIncludedIngredients(defaultBanhMiIngredients);
    setSelectedAddOns([]);
    setAddOnPlacements({});
    setSelectedOptionName("");
    setSelectedNoodleType(noodleTypes[0]);
    setSelectedToppings([]);
  }

  function closeBanhMiModal() {
    setSelectedItem(null);
    setIncludedIngredients(defaultBanhMiIngredients);
    setSelectedAddOns([]);
    setAddOnPlacements({});
    setSelectedOptionName("");
    setSelectedNoodleType(noodleTypes[0]);
    setSelectedToppings([]);
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
        ...createCartItem(selectedItem),
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
    closeBanhMiModal();
  }

  function addDrinkCustomizedItemToCart() {
    if (!selectedItem || !selectedDrinkOption) {
      return;
    }

    setCart((currentCart) => [
      ...currentCart,
      {
        ...createCartItem(selectedItem),
        name: `${selectedItem.name} ${selectedDrinkOption.name}`,
        price: selectedItemTotal,
        optionName: undefined,
        flavor: selectedItem.name,
        selectedToppings: drinkToppings
          .filter((topping) => selectedToppings.includes(topping.name))
          .map((topping) => ({ name: topping.name, price: topping.price })),
      },
    ]);
    closeBanhMiModal();
  }

  function addOptionCustomizedItemToCart() {
    if (!selectedItem || !selectedOption) {
      return;
    }

    setCart((currentCart) => [
      ...currentCart,
      {
        ...createCartItem(selectedItem),
        price: selectedOption.price,
        optionName: isStirFryNoodlesItem(selectedItem)
          ? `${selectedOption.name} / ${selectedNoodleType}`
          : selectedOption.name,
      },
    ]);
    closeBanhMiModal();
  }

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
                        {item.name} x{item.quantity}
                        {item.optionName && (
                          <span className="block text-xs text-gray-600">
                            {item.optionName}
                          </span>
                        )}
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

                          setCart((currentCart) => [...currentCart, createCartItem(item)]);
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
              ) : (
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
              )}
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
                      : addOptionCustomizedItemToCart
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
