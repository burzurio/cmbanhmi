import { menu } from "@/lib/menu";

const categories = ["Banh Mi", "Soups / Wontons / Noodles"];

export default function MenuPage() {
  return (
    <main className="min-h-screen bg-white px-4 py-24 text-gray-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-orange-500">
            CM Banh Mi Menu
          </h1>
          <p className="mt-3 text-gray-600">
            Fresh sandwiches, soups, noodles, drinks, and add-ons.
          </p>
        </div>

        {categories.map((category) => (
          <section key={category} className="mb-14">
            <div className="mb-6 flex items-center gap-4">
              <h2 className="whitespace-nowrap text-3xl font-extrabold text-orange-500">
                {category}
              </h2>
              <div className="h-0.5 flex-1 bg-gray-900" />
            </div>

            <div className="grid grid-cols-1 gap-x-12 gap-y-4 md:grid-cols-2">
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
          </section>
        ))}
      </div>
    </main>
  );
}
