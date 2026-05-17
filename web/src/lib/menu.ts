export type MenuItem = {
  id: number | string;
  name: string;
  category: string;
  price?: number;
  description?: string;
  options?: {
    name: string;
    price: number;
  }[];
  tags?: string[];
};

export const menuCategories = [
  "Bánh Mì",
  "Soups/Wontons/Noodles",
  "Add-ons & Extras",
  "Milk Tea",
  "Specialty Drinks",
  "Fruit Teas",
  "Fruit Smoothies",
  "Hot Specialty Teas",
] as const;

export const menuItems: MenuItem[] = [
  // BÁNH MÌ
  { id: 1, name: "House Special", category: "Bánh Mì", price: 10.5, tags: ["Contains pâté"] },
  { id: 2, name: "Pork Meatball", category: "Bánh Mì", price: 9.75, tags: ["Contains tomato"] },
  { id: 3, name: "Pork & Kimchi", category: "Bánh Mì", price: 11.25 },
  { id: 4, name: "Pork Roll", category: "Bánh Mì", price: 9.75, tags: ["Contains pâté"] },
  { id: 5, name: "BBQ Pork", category: "Bánh Mì", price: 9.75 },
  { id: 6, name: "Grilled Chicken", category: "Bánh Mì", price: 9.75 },
  { id: 7, name: "Grilled Beef", category: "Bánh Mì", price: 10.5 },
  { id: 8, name: "Grilled Pork", category: "Bánh Mì", price: 9.75 },
  { id: 9, name: "Vegetarian", category: "Bánh Mì", price: 9.75 },
  { id: 10, name: "Egg", category: "Bánh Mì", price: 9.75 },
  { id: 11, name: "Pork Sausage", category: "Bánh Mì", price: 9.75 },

  // SOUPS / WONTONS / NOODLES
  {
    id: 12,
    name: "Wonton Egg Noodle Soup",
    category: "Soups/Wontons/Noodles",
    description: "Egg noodles, wontons, bok choy, and BBQ pork (Char Siu) in a rich, savory broth. Garnished with green onions, white and black pepper.",
    options: [
      { name: "Pork Wontons", price: 18.5 },
      { name: "Vegetarian Wontons", price: 19.5 },
    ],
  },
  {
    id: 13,
    name: "Wonton Soup",
    category: "Soups/Wontons/Noodles",
    options: [
      { name: "Pork Wontons", price: 12.5 },
      { name: "Vegetarian Wontons", price: 13.5 },
    ],
  },
  {
    id: 14,
    name: "Chili Oil Wontons",
    category: "Soups/Wontons/Noodles",
    description: "Savory wontons drizzled in chili oil sauce, garnished with green onions and sesame seeds.",
    options: [
      { name: "Pork Wontons", price: 12.5 },
      { name: "Vegetarian Wontons", price: 13.5 },
    ],
  },
  {
    id: 15,
    name: "Sweet & Tangy Wontons",
    category: "Soups/Wontons/Noodles",
    description: "Savory wontons paired with a sweet and tangy sauce, garnished with fried onion, sesame seeds, and cilantro.",
    options: [
      { name: "Pork Wontons", price: 12.5 },
      { name: "Vegetarian Wontons", price: 13.5 },
    ],
  },
  {
    id: 16,
    name: "Sweet Chili Ray Wontons",
    category: "Soups/Wontons/Noodles",
    description: "Savory wontons drizzled with sweet and tangy sauce and chili oil, topped with fried onion, bean sprouts, sesame seeds, and Thai basil.",
    options: [
      { name: "Pork Wontons", price: 13.5 },
      { name: "Vegetarian Wontons", price: 14.5 },
    ],
  },
  {
    id: 17,
    name: "Stir-fry Noodles",
    category: "Soups/Wontons/Noodles",
    description: "Egg noodles or udon noodles stir-fried in chili oil with onions, cabbage, and celery. Topped with green onions, sesame seeds, crispy fried onions, and cilantro. Served with broth on the side.",
    options: [
      { name: "Pork", price: 18.5 },
      { name: "Beef", price: 18.5 },
      { name: "Chicken", price: 18.5 },
      { name: "Tofu", price: 18.5 },
    ],
  },
  { id: 18, name: "Organic Chicken Pho", category: "Soups/Wontons/Noodles", price: 18.95 },
  {
    id: 19,
    name: "Khao Soi Rice Noodle Soup",
    category: "Soups/Wontons/Noodles",
    price: 18.95,
    description: "A Lao style soup served with wide rice noodles, minced pork, soy bean sauce, and pork meatballs in a savory broth. Served with bean sprouts, cabbage, cilantro, lime, and roasted chili pepper on the side.",
    tags: ["Contains tomato"],
  },
  {
    id: 20,
    name: "Thai Curry Chicken w/ Bread",
    category: "Soups/Wontons/Noodles",
    options: [
      { name: "Chicken", price: 14.5 },
      { name: "Tofu", price: 14.95 },
    ],
  },
  { id: 21, name: "Meatball Soup w/ Bread", category: "Soups/Wontons/Noodles", price: 14.5, tags: ["Contains tomato"] },
  { id: 22, name: "Egg Drop Soup", category: "Soups/Wontons/Noodles", price: 8.5 },

  // ADD-ONS & EXTRAS
  { id: "extra-meat", name: "Extra Meat", category: "Add-ons & Extras", price: 2 },
  { id: "scrambled-egg", name: "Scrambled Egg", category: "Add-ons & Extras", price: 1.75 },
  { id: "chili-oil", name: "Chili Oil", category: "Add-ons & Extras", price: 0.5 },
  { id: "kimchi", name: "Kimchi", category: "Add-ons & Extras", price: 1.5 },
  { id: "apple-kimchi", name: "Apple Kimchi", category: "Add-ons & Extras", price: 2 },
  { id: "extra-veggies", name: "Extra Veggies", category: "Add-ons & Extras", price: 0.75 },
  { id: "pate", name: "Pâté", category: "Add-ons & Extras", price: 1 },
  { id: "avocado", name: "Avocado", category: "Add-ons & Extras", price: 1.5 },

  // MILK TEA
  { id: "milk-tea", name: "Milk Tea", category: "Milk Tea", price: 6.5 },
  { id: "blended", name: "Blended", category: "Milk Tea", price: 7 },

  // SPECIALTY DRINKS
  { id: "matcha-milk-tea", name: "Matcha Milk Tea", category: "Specialty Drinks", price: 7 },
  { id: "thai-iced-tea", name: "Thai Iced Tea", category: "Specialty Drinks", price: 6.5 },
  { id: "thai-green-tea", name: "Thai Green Tea", category: "Specialty Drinks", price: 7.25 },
  { id: "tiger-milk-tea", name: "Tiger Milk Tea w/ Boba", category: "Specialty Drinks", price: 7.5 },
  { id: "okinawa-sea-salt-crema", name: "Okinawa w/ Sea Salt Crema", category: "Specialty Drinks", price: 7.25, tags: ["Contains dairy"] },
  { id: "viet-iced-coffee-crema", name: "Vietnamese Iced Coffee w/ Crema", category: "Specialty Drinks", price: 7.5, tags: ["Contains dairy"] },
  {
    id: "viet-iced-coffee",
    name: "Vietnamese Iced Coffee",
    category: "Specialty Drinks",
    options: [
      { name: "Small", price: 6.5 },
      { name: "Large", price: 7.25 },
    ],
    tags: ["Contains dairy"],
  },

  // FRUIT TEAS
  { id: "strawberry-sakura-fruit-tea", name: "Strawberry Sakura Fruit Tea", category: "Fruit Teas", price: 7 },
  { id: "cherry-blossom-fruit-tea", name: "Cherry Blossom Fruit Tea", category: "Fruit Teas", price: 7 },
  { id: "passion-fruit-tea", name: "Passion Fruit Tea", category: "Fruit Teas", price: 7 },
  { id: "guava-fruit-tea", name: "Guava Fruit Tea", category: "Fruit Teas", price: 7 },
  { id: "strawberry-fruit-tea", name: "Strawberry Fruit Tea", category: "Fruit Teas", price: 7 },
  { id: "mango-fruit-tea", name: "Mango Fruit Tea", category: "Fruit Teas", price: 7 },
  { id: "peach-fruit-tea", name: "Peach Fruit Tea", category: "Fruit Teas", price: 7 },
  { id: "pomegranate-fruit-tea", name: "Pomegranate Fruit Tea", category: "Fruit Teas", price: 7 },
  { id: "dragon-fruit-tea", name: "Dragon Fruit Tea", category: "Fruit Teas", price: 7 },
  { id: "winter-melon-fruit-tea", name: "Winter Melon Fruit Tea", category: "Fruit Teas", price: 7 },

  // FRUIT SMOOTHIES
  { id: "mango-smoothie", name: "Mango", category: "Fruit Smoothies", price: 7 },
  { id: "strawberry-smoothie", name: "Strawberry", category: "Fruit Smoothies", price: 7 },
  { id: "peach-smoothie", name: "Peach", category: "Fruit Smoothies", price: 7 },
  { id: "avocado-smoothie", name: "Avocado", category: "Fruit Smoothies", price: 7.5 },

  // HOT SPECIALTY TEAS
  {
    id: "roasted-rice-green-tea",
    name: "Roasted Rice Green Tea",
    category: "Hot Specialty Teas",
    price: 3.75,
    description: "Green tea leaves and toasted brown rice. Warm, nutty aroma with a slightly sweet finish.",
  },
  {
    id: "oolong-tea",
    name: "Oolong Tea",
    category: "Hot Specialty Teas",
    price: 3.75,
    description: "A balance between black tea and green tea. Smooth, floral, and toasty.",
  },
  {
    id: "jasmine-green-tea",
    name: "Jasmine Green Tea",
    category: "Hot Specialty Teas",
    price: 3.75,
    description: "Fragrant green tea leaves with jasmine blossoms. Offers a soft floral aroma.",
  },
  {
    id: "sakura-green-tea",
    name: "Sakura Green Tea",
    category: "Hot Specialty Teas",
    price: 3.75,
    description: "A blend of green tea leaves and cherry blossom petals, offering a subtle sweet floral aroma.",
  },
  {
    id: "chocolate-orange-tea",
    name: "Chocolate Orange Tea",
    category: "Hot Specialty Teas",
    price: 3.75,
    description: "Black tea infused with cocoa and citrus peel. Notes of orange zest.",
  },
  {
    id: "gingerbread-tea",
    name: "Gingerbread Tea",
    category: "Hot Specialty Teas",
    price: 3.75,
    description: "A warm blend of black tea, ginger, and spices.",
    tags: ["Caffeine free"],
  },
  {
    id: "rose-all-day-tea",
    name: "Rosé All Day Tea",
    category: "Hot Specialty Teas",
    price: 3.75,
    description: "A bright floral tea blend with hints of apple, hibiscus, elderberries, blueberries, red and black currants, and blue mallow flower.",
    tags: ["Caffeine free"],
  },
  {
    id: "white-chocolate-chai",
    name: "White Chocolate Chai",
    category: "Hot Specialty Teas",
    price: 3.75,
    description: "Spiced chai combined with smooth white chocolate, notes of vanilla and warm spices.",
  },
];

export const menu = menuItems;
