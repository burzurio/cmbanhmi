import { menu } from "@/lib/menu";

const categories = ["Banh Mi", "Soups / Wontons / Noodles"];

export default function MenuPage() {
  return (
    <main className="bg-white px-4 py-5 text-gray-900 sm:px-6 lg:px-8">
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
  );
}
