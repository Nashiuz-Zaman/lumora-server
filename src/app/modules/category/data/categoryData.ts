export const topCategories = [
  {
    title: "Fashion & Accessories",
    slug: "fashion-accessories",
    categoryImages: [
      "https://res.cloudinary.com/diwzuhlc3/image/upload/v1757080347/lumora/top-categories/fashion-1_1_xtzuvw.webp",
      "https://res.cloudinary.com/diwzuhlc3/image/upload/v1757080273/lumora/top-categories/fashion-2_sciglm.webp",
      "https://res.cloudinary.com/diwzuhlc3/image/upload/v1757080282/lumora/top-categories/fashion-3_xesu1a.webp",
      "https://res.cloudinary.com/diwzuhlc3/image/upload/v1757080277/lumora/top-categories/fashion-4_lsuksm.webp",
    ],
  },
  {
    title: "Gaming & Entertainment",
    slug: "gaming-entertainment",
    categoryImages: [
      "https://res.cloudinary.com/diwzuhlc3/image/upload/v1757080480/lumora/top-categories/entertainment-1_ogxlmo.webp",
    ],
  },
  {
    title: "Mobile Phones & Electronics",
    slug: "mobile-phones-electronics",
    categoryImages: [
      "https://res.cloudinary.com/diwzuhlc3/image/upload/v1757091587/lumora/top-categories/mobile-1_1_ynn7zr.webp",
    ],
  },
  {
    title: "Food & Snacks",
    slug: "food-snacks",
    categoryImages: [
      "https://res.cloudinary.com/diwzuhlc3/image/upload/v1757080550/lumora/top-categories/food-1_dxurgc.webp",
      "https://res.cloudinary.com/diwzuhlc3/image/upload/v1757080552/lumora/top-categories/food-2_n8xqpb.webp",
      "https://res.cloudinary.com/diwzuhlc3/image/upload/v1757080554/lumora/top-categories/food-3_lpkzoo.webp",
      "https://res.cloudinary.com/diwzuhlc3/image/upload/v1757080548/lumora/top-categories/food-4_nifdn9.webp",
    ],
  },
  {
    title: "Kitchen Essentials",
    slug: "kitchen-essentials",
    categoryImages: [
      "https://res.cloudinary.com/diwzuhlc3/image/upload/v1757080778/lumora/top-categories/kitchen-1_1_ta3vaw.webp",
      "https://res.cloudinary.com/diwzuhlc3/image/upload/v1757080775/lumora/top-categories/kitchen-2_ga1pht.webp",
      "https://res.cloudinary.com/diwzuhlc3/image/upload/v1757080782/lumora/top-categories/kitchen-3_cwuizw.webp",
      "https://res.cloudinary.com/diwzuhlc3/image/upload/v1757080780/lumora/top-categories/kitchen-4_kj3ugn.webp",
    ],
  },
  {
    title: "Home Appliances & Essentials",
    slug: "home-appliances-essentials",
    categoryImages: [
      "https://res.cloudinary.com/diwzuhlc3/image/upload/v1757080886/lumora/top-categories/home-1_qclzjx.webp",
    ],
  },
  {
    title: "Health & Wellness",
    slug: "health-wellness",
    categoryImages: [
      "https://res.cloudinary.com/diwzuhlc3/image/upload/v1757082267/lumora/top-categories/health-1_2_hmfjbq.webp",
      "https://res.cloudinary.com/diwzuhlc3/image/upload/v1757081415/lumora/top-categories/health-2_1_b8egro.webp",
      "https://res.cloudinary.com/diwzuhlc3/image/upload/v1757081799/lumora/top-categories/health-3_1_k1av2n.webp",
    ],
  },
  {
    title: "Outdoors",
    slug: "outdoors",
    categoryImages: [
      "https://res.cloudinary.com/diwzuhlc3/image/upload/v1757260940/lumora/top-categories/outdoor-1_amgxnj.webp",
      "https://res.cloudinary.com/diwzuhlc3/image/upload/v1757260940/lumora/top-categories/outdoor-2_vpamfz.webp",
      "https://res.cloudinary.com/diwzuhlc3/image/upload/v1757260939/lumora/top-categories/outdoor-3_h5ta1h.webp",
    ],
  },
];

export const subCategoriesMap: Record<
  string,
  { title: string; slug: string }[]
> = {
  "Fashion & Accessories": [
    { title: "Men's Clothing", slug: "mens-clothing" },
    { title: "Women's Clothing", slug: "womens-clothing" },
    { title: "Shoes", slug: "shoes" },
    { title: "Bags & Wallets", slug: "bags-wallets" },
    { title: "Watches", slug: "watches" },
    { title: "Jewelry", slug: "jewelry" },
    { title: "Sunglasses", slug: "sunglasses" },
  ],
  "Gaming & Entertainment": [
    { title: "Gaming Consoles", slug: "gaming-consoles" },
    { title: "PC Gaming", slug: "pc-gaming" },
    { title: "Gaming Laptops", slug: "gaming-laptops" },
    { title: "VR Headsets", slug: "vr-headsets" },
    { title: "Board Games", slug: "board-games" },
    { title: "Card Games", slug: "card-games" },
    {
      title: "Action Figures & Collectibles",
      slug: "action-figures-collectibles",
    },
    { title: "Gaming Accessories", slug: "gaming-accessories" },
  ],
  "Mobile Phones & Electronics": [
    { title: "Smartphones", slug: "smartphones" },
    { title: "Mobile Accessories", slug: "mobile-accessories" },
    { title: "Consumer Electronics", slug: "consumer-electronics" },
  ],
  "Food & Snacks": [
    { title: "Chocolates & Candy", slug: "chocolates-candy" },
    { title: "Beverages", slug: "beverages" },
    { title: "Chips & Snacks", slug: "chips-snacks" },
    { title: "Organic Food", slug: "organic-food" },
    { title: "Nuts & Dry Fruits", slug: "nuts-dry-fruits" },
    { title: "Instant Meals", slug: "instant-meals" },
    { title: "Sauces & Condiments", slug: "sauces-condiments" },
  ],
  "Kitchen Essentials": [
    { title: "Cookware", slug: "cookware" },
    { title: "Cutlery & Knives", slug: "cutlery-knives" },
    { title: "Small Appliances", slug: "small-appliances" },
    { title: "Storage & Organization", slug: "storage-organization" },
    { title: "Blenders & Mixers", slug: "blenders-mixers" },
    { title: "Microwave Ovens", slug: "microwave-ovens" },
    { title: "Coffee & Tea Accessories", slug: "coffee-tea-accessories" },
    { title: "Dinnerware & Utensils", slug: "dinnerware-utensils" },
  ],
  "Home Appliances & Essentials": [
    { title: "Refrigerators", slug: "refrigerators" },
    { title: "Washing Machines", slug: "washing-machines" },
    { title: "Vacuum Cleaners", slug: "vacuum-cleaners" },
    { title: "Fans & Heaters", slug: "fans-heaters" },
    { title: "Air Conditioners", slug: "air-conditioners" },
    { title: "Water Purifiers", slug: "water-purifiers" },
    { title: "Doorbells & Security", slug: "doorbells-security" },
    { title: "Lighting & Lamps", slug: "lighting-lamps" },
  ],
  "Health & Wellness": [
    { title: "Vitamins & Supplements", slug: "vitamins-supplements" },
    { title: "Personal Care", slug: "personal-care" },
    { title: "Fitness Equipment", slug: "fitness-equipment" },
    { title: "Medical Devices", slug: "medical-devices" },
    { title: "Skincare & Beauty", slug: "skincare-beauty" },
    { title: "Hair Care", slug: "hair-care" },
    { title: "Oral Care", slug: "oral-care" },
    { title: "Health Monitors", slug: "health-monitors" },
  ],
  Outdoors: [
    { title: "Camping & Hiking", slug: "camping-hiking" },
    { title: "Backpacks & Outdoor Bags", slug: "backpacks-outdoor-bags" },
    { title: "Climbing & Mountaineering", slug: "climbing-mountaineering" },
    { title: "Cycling & Accessories", slug: "cycling-accessories" },
    { title: "Water Sports & Kayaking", slug: "water-sports-kayaking" },
  ],
};
