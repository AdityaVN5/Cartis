import { Product } from "../types";

export const SAMPLE_PRODUCTS: Product[] = [
  {
    id: "prod-1",
    sku: "1-WHITE",
    name: "Coats and Blazers #1",
    category: "Feminine",
    price: 177.42,
    originalPrice: 210.00,
    rating: 4.6,
    reviewCount: 51,
    description: "Sports Velvet Sports With Buttons",
    materials: "Technical Nylon, Organic Cotton & Merino Wool blend",
    image: "https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=1000&auto=format&fit=crop",
    galleryImages: [
      "https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=1000&auto=format&fit=crop"
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "White", hex: "#ffffff" }
    ],
    inStock: true,
    stockQty: 10,
    aiDemandMatchScore: 91,
    tag: "Trending"
  },
  {
    id: "prod-2",
    sku: "2-GREEN",
    name: "Sweaters and Knitwear #2",
    category: "Feminine",
    price: 116.34,
    rating: 4.7,
    reviewCount: 52,
    description: "Luxurious Pink Denim With Buttons",
    materials: "Technical Nylon, Organic Cotton & Merino Wool blend",
    image: "https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=1000&auto=format&fit=crop",
    galleryImages: [
      "https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=1000&auto=format&fit=crop"
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Pink", hex: "#ec4899" }
    ],
    inStock: true,
    stockQty: 9,
    aiDemandMatchScore: 92,
    tag: "New"
  },
  {
    id: "prod-3",
    sku: "3-RED",
    name: "Dresses and Jumpsuits #3",
    category: "Feminine",
    price: 86.36,
    rating: 4.8,
    reviewCount: 53,
    description: "Black Tricot Printed Tricot",
    materials: "Technical Nylon, Organic Cotton & Merino Wool blend",
    image: "https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=1000&auto=format&fit=crop",
    galleryImages: [
      "https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=1000&auto=format&fit=crop"
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Black", hex: "#111111" }
    ],
    inStock: true,
    stockQty: 122,
    aiDemandMatchScore: 93,
    tag: "Bestseller"
  },
  {
    id: "prod-12",
    sku: "12-GREEN",
    name: "Coats and Blazers #12",
    category: "Masculine",
    price: 98.81,
    rating: 4.7,
    reviewCount: 62,
    description: "Boho Yellow Lace With Hood",
    materials: "Technical Nylon, Organic Cotton & Merino Wool blend",
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1000&auto=format&fit=crop",
    galleryImages: [
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1000&auto=format&fit=crop"
    ],
    sizes: ["M", "L", "XL", "XXL"],
    colors: [
      { name: "Yellow", hex: "#eab308" }
    ],
    inStock: true,
    stockQty: 21,
    aiDemandMatchScore: 92,
    tag: "Bestseller"
  },
  {
    id: "prod-13",
    sku: "13-BLUE",
    name: "Sweaters and Sweatshirts #13",
    category: "Masculine",
    price: 58.88,
    rating: 4.8,
    reviewCount: 63,
    description: "Casual Red Tricot With Zipper",
    materials: "Technical Nylon, Organic Cotton & Merino Wool blend",
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1000&auto=format&fit=crop",
    galleryImages: [
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1000&auto=format&fit=crop"
    ],
    sizes: ["M", "L", "XL", "XXL"],
    colors: [
      { name: "Red", hex: "#b91c1c" }
    ],
    inStock: true,
    stockQty: 37,
    aiDemandMatchScore: 93,
    tag: "Trending"
  },
  {
    id: "prod-14",
    sku: "14-PINK",
    name: "T-shirts and Polos #14",
    category: "Masculine",
    price: 49.66,
    rating: 4.9,
    reviewCount: 64,
    description: "Boho Jacquard Branco Com Glitter",
    materials: "Technical Nylon, Organic Cotton & Merino Wool blend",
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1000&auto=format&fit=crop",
    galleryImages: [
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1000&auto=format&fit=crop"
    ],
    sizes: ["M", "L", "XL", "XXL"],
    colors: [
      { name: "Grey", hex: "#6b7280" }
    ],
    inStock: true,
    stockQty: 54,
    aiDemandMatchScore: 94,
    tag: "New"
  },
  {
    id: "prod-21",
    sku: "21",
    name: "Baby (0-12 months) #21",
    category: "Children",
    price: 38.51,
    rating: 4.6,
    reviewCount: 71,
    description: "Turquoise Casual With Glitter",
    materials: "Technical Nylon, Organic Cotton & Merino Wool blend",
    image: "https://images.unsplash.com/photo-1519457431-44ccd64a579b?q=80&w=1000&auto=format&fit=crop",
    galleryImages: [
      "https://images.unsplash.com/photo-1519457431-44ccd64a579b?q=80&w=1000&auto=format&fit=crop"
    ],
    sizes: ["P", "M", "G"],
    colors: [
      { name: "Turquoise", hex: "#0d9488" }
    ],
    inStock: true,
    stockQty: 33,
    aiDemandMatchScore: 91,
    tag: "Bestseller"
  },
  {
    id: "prod-22",
    sku: "22-GREY",
    name: "Girl and Boy #22",
    category: "Children",
    price: 69.68,
    rating: 4.7,
    reviewCount: 72,
    description: "Boho Jacquard Rosa Com Franjas",
    materials: "Technical Nylon, Organic Cotton & Merino Wool blend",
    image: "https://images.unsplash.com/photo-1519457431-44ccd64a579b?q=80&w=1000&auto=format&fit=crop",
    galleryImages: [
      "https://images.unsplash.com/photo-1519457431-44ccd64a579b?q=80&w=1000&auto=format&fit=crop"
    ],
    sizes: ["P", "M", "G", "GG"],
    colors: [
      { name: "Grey", hex: "#6b7280" }
    ],
    inStock: true,
    stockQty: 50,
    aiDemandMatchScore: 92,
    tag: "Trending"
  }
];
