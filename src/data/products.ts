import { Product } from "../types";

export const SAMPLE_PRODUCTS: Product[] = [
  {
    id: "prod-1",
    sku: "SKU-9904",
    name: "Cartis Modular Trench Parka",
    category: "Outerwear",
    price: 480,
    originalPrice: 550,
    rating: 4.9,
    reviewCount: 128,
    description: "Weatherproof 3-layer bonded technical membrane engineered for extreme urban climates. Features magnetic dynamic closure and integrated temperature-regulating mesh inner lining.",
    materials: "100% Recycled Technical Nylon, Gore-Tex Pro Membrane",
    image: "https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=1000&auto=format&fit=crop",
    galleryImages: [
      "https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1000&auto=format&fit=crop",
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: [
      { name: "Onyx Black", hex: "#111111" },
      { name: "Concrete Grey", hex: "#777777" },
      { name: "Chalk White", hex: "#EAEAEA" }
    ],
    inStock: true,
    stockQty: 42,
    aiDemandMatchScore: 99,
    predictedRestockDays: 0,
    tag: "Trending / AI Pick"
  },
  {
    id: "prod-2",
    sku: "SKU-8821",
    name: "NPU Cyber Runner Sneaker",
    category: "Footwear",
    price: 290,
    rating: 4.8,
    reviewCount: 94,
    description: "Sculpted ergonomic midsole with carbon fiber shank insert for continuous kinetic energy return. Ultra-breathable knit mesh upper with quick-tension speed lacing.",
    materials: "Engineered Flyknit, Carbon Shank, Vibram rubber outsole",
    image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=1000&auto=format&fit=crop",
    galleryImages: [
      "https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=1000&auto=format&fit=crop",
    ],
    sizes: ["US 8", "US 9", "US 10", "US 11", "US 12"],
    colors: [
      { name: "Stealth Grey", hex: "#2B2B2B" },
      { name: "Pure White", hex: "#F5F5F5" }
    ],
    inStock: true,
    stockQty: 18,
    aiDemandMatchScore: 97,
    predictedRestockDays: 2,
    tag: "High Demand"
  },
  {
    id: "prod-3",
    sku: "SKU-7740",
    name: "Archival Wool Structure Overshirt",
    category: "Tailored Essentials",
    price: 340,
    rating: 4.9,
    reviewCount: 62,
    description: "Tailored heavy-gauge virgin wool structure blazer with hidden zip pockets and clean notched lapel. Blends high-fashion architectural silhouette with everyday durability.",
    materials: "85% Merino Wool, 15% Cashmere Blend",
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1000&auto=format&fit=crop",
    galleryImages: [
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=1000&auto=format&fit=crop"
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Charcoal", hex: "#1F1F1F" },
      { name: "Midnight Navy", hex: "#0E1A2B" }
    ],
    inStock: true,
    stockQty: 29,
    aiDemandMatchScore: 95,
    tag: "Bestseller"
  },
  {
    id: "prod-4",
    sku: "SKU-6612",
    name: "Tactical Matte Aluminum Carrier Backpack",
    category: "Tech Accessories",
    price: 260,
    originalPrice: 310,
    rating: 4.7,
    reviewCount: 110,
    description: "Anodized aluminum buckle system, padded 16-inch laptop vault with shock-absorbing corners, waterproof zippers, and ergonomic load-balancing harness.",
    materials: "1680D Ballistic Cordura, Aircraft Grade Aluminum Clamps",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1000&auto=format&fit=crop",
    galleryImages: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?q=80&w=1000&auto=format&fit=crop"
    ],
    sizes: ["22 Liters", "30 Liters"],
    colors: [
      { name: "Matte Black", hex: "#000000" },
      { name: "Titanium Silver", hex: "#A8A8A8" }
    ],
    inStock: true,
    stockQty: 15,
    aiDemandMatchScore: 94,
    tag: "Essential"
  },
  {
    id: "prod-5",
    sku: "SKU-5531",
    name: "Minimalist Heavyweight Heavy-Cotton Hoodie",
    category: "Tailored Essentials",
    price: 190,
    rating: 4.9,
    reviewCount: 204,
    description: "500 GSM custom milled organic cotton fleece with boxy architectural drop-shoulder cut, double-layered hood, and zero drawstrings for clean aesthetic lines.",
    materials: "100% Organic Heavyweight French Terry Cotton",
    image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=1000&auto=format&fit=crop",
    galleryImages: [
      "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?q=80&w=1000&auto=format&fit=crop"
    ],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Ink Black", hex: "#121212" },
      { name: "Bone White", hex: "#F3F1ED" },
      { name: "Slate Grey", hex: "#5C6068" }
    ],
    inStock: true,
    stockQty: 60,
    aiDemandMatchScore: 98,
    tag: "Wardrobe Core"
  },
  {
    id: "prod-6",
    sku: "SKU-4419",
    name: "Cartis Ceramic Tech Sunglasses",
    category: "Tech Accessories",
    price: 220,
    rating: 4.6,
    reviewCount: 45,
    description: "Precision-milled ceramic frame with polarized Zeiss anti-reflective lenses providing 100% UV400 shield and zero-glare clarity.",
    materials: "Bio-based Acetate, Zirconia Ceramic Temples, Polarized Lenses",
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=1000&auto=format&fit=crop",
    galleryImages: [
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=1000&auto=format&fit=crop"
    ],
    sizes: ["One Size"],
    colors: [
      { name: "Obsidian", hex: "#0A0A0A" },
      { name: "Translucent Smoke", hex: "#3A3A3A" }
    ],
    inStock: true,
    stockQty: 8,
    aiDemandMatchScore: 91,
    predictedRestockDays: 1,
    tag: "Low Stock"
  },
  {
    id: "prod-7",
    sku: "SKU-3308",
    name: "Cartis Hydro-Shield Rain Shell",
    category: "Outerwear",
    price: 390,
    originalPrice: 420,
    rating: 4.8,
    reviewCount: 88,
    description: "Ultra-lightweight packable storm coat engineered with heat-sealed seams and articulated storm hood for complete downpour defense.",
    materials: "Ripstop Dyneema Composite Fabric",
    image: "https://images.unsplash.com/photo-1516257984-b1b4d707412e?q=80&w=1000&auto=format&fit=crop",
    galleryImages: [
      "https://images.unsplash.com/photo-1516257984-b1b4d707412e?q=80&w=1000&auto=format&fit=crop"
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Storm Black", hex: "#141414" },
      { name: "Fog Grey", hex: "#9E9E9E" }
    ],
    inStock: true,
    stockQty: 22,
    aiDemandMatchScore: 96,
    tag: "Storm Prepared"
  },
  {
    id: "prod-8",
    sku: "SKU-2290",
    name: "Cartis High-Derby Leather Boot",
    category: "Footwear",
    price: 360,
    rating: 4.9,
    reviewCount: 71,
    description: "Italian full-grain calfskin leather boots with lugged Goodyear welt construction for weather resistance and timeless modern elegance.",
    materials: "Full-Grain Italian Leather, Commando Rubber Sole",
    image: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?q=80&w=1000&auto=format&fit=crop",
    galleryImages: [
      "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?q=80&w=1000&auto=format&fit=crop"
    ],
    sizes: ["US 8", "US 9", "US 10", "US 11", "US 12"],
    colors: [
      { name: "Deep Black", hex: "#0D0D0D" },
      { name: "Espresso Brown", hex: "#2E1B11" }
    ],
    inStock: true,
    stockQty: 12,
    aiDemandMatchScore: 98,
    tag: "Crafted Edition"
  }
];
