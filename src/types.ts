export type UserRole = "customer" | "retailer";

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: "Feminine" | "Masculine" | "Children" | "Outerwear" | "Footwear" | "Tailored Essentials" | "Tech Accessories" | string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  description: string;
  materials: string;
  image: string;
  galleryImages?: string[];
  sizes: string[];
  colors: { name: string; hex: string }[];
  inStock: boolean;
  stockQty: number;
  aiDemandMatchScore: number;
  predictedRestockDays?: number;
  tag?: string;
}

export interface CartItem {
  product: Product;
  selectedSize: string;
  selectedColor: string;
  quantity: number;
}

export interface FilterState {
  category: string;
  searchQuery: string;
  sortBy: "featured" | "price-asc" | "price-desc" | "rating" | "ai-match";
  maxPrice: number;
  inStockOnly: boolean;
}
