import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Product, CartItem, FilterState } from "../types";
import { SAMPLE_PRODUCTS } from "../data/products";

interface CustomerShopViewProps {
  cart: CartItem[];
  addToCart: (product: Product, size?: string, color?: string, qty?: number) => void;
  openCart: () => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
}

export default function CustomerShopView({
  cart,
  addToCart,
  openCart,
  selectedCategory,
  setSelectedCategory,
}: CustomerShopViewProps) {
  // Local state for product detail modal
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modalSize, setModalSize] = useState<string>("");
  const [modalColor, setModalColor] = useState<string>("");
  const [modalQty, setModalQty] = useState<number>(1);
  const [addedToast, setAddedToast] = useState<string | null>(null);

  // Filters
  const [filters, setFilters] = useState<FilterState>({
    category: selectedCategory || "All",
    searchQuery: "",
    sortBy: "featured",
    maxPrice: 600,
    inStockOnly: false,
  });

  // AI Personal Stylist state
  const [aiQuery, setAiQuery] = useState("");
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);

  // AI Fit Predictor State
  const [fitHeight, setFitHeight] = useState("178");
  const [fitWeight, setFitWeight] = useState("72");
  const [fitPref, setFitPref] = useState<"slim" | "regular" | "oversized">("regular");
  const [fitRecommendation, setFitRecommendation] = useState<string | null>(null);

  // Update filter category when prop changes
  const activeCategory = selectedCategory || filters.category;

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setFilters((prev) => ({ ...prev, category: cat }));
  };

  // Filtered and Sorted products
  const filteredProducts = useMemo(() => {
    return SAMPLE_PRODUCTS.filter((prod) => {
      // Category filter
      if (activeCategory !== "All" && prod.category !== activeCategory) {
        return false;
      }
      // Search filter
      if (filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase();
        const matchName = prod.name.toLowerCase().includes(query);
        const matchSku = prod.sku.toLowerCase().includes(query);
        const matchCategory = prod.category.toLowerCase().includes(query);
        const matchDesc = prod.description.toLowerCase().includes(query);
        const matchMaterial = prod.materials.toLowerCase().includes(query);
        if (!matchName && !matchSku && !matchCategory && !matchDesc && !matchMaterial) {
          return false;
        }
      }
      // Price filter
      if (prod.price > filters.maxPrice) return false;
      // In stock filter
      if (filters.inStockOnly && !prod.inStock) return false;

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === "price-asc") return a.price - b.price;
      if (filters.sortBy === "price-desc") return b.price - a.price;
      if (filters.sortBy === "rating") return b.rating - a.rating;
      if (filters.sortBy === "ai-match") return b.aiDemandMatchScore - a.aiDemandMatchScore;
      return b.aiDemandMatchScore - a.aiDemandMatchScore; // default featured
    });
  }, [activeCategory, filters]);

  // Similar products recommendation logic
  const similarProducts = useMemo(() => {
    if (!selectedProduct) return [];
    return SAMPLE_PRODUCTS.filter((p) => p.id !== selectedProduct.id)
      .sort((a, b) => {
        const aCatMatch = a.category === selectedProduct.category ? 1 : 0;
        const bCatMatch = b.category === selectedProduct.category ? 1 : 0;
        if (aCatMatch !== bCatMatch) return bCatMatch - aCatMatch;
        return b.aiDemandMatchScore - a.aiDemandMatchScore;
      })
      .slice(0, 3);
  }, [selectedProduct]);

  // Open product detail modal
  const handleProductClick = (prod: Product) => {
    setSelectedProduct(prod);
    setModalSize(prod.sizes[0] || "");
    setModalColor(prod.colors[0]?.name || "");
    setModalQty(1);
    setFitRecommendation(null);
  };

  // Quick Add handler
  const handleQuickAdd = (e: React.MouseEvent, prod: Product) => {
    e.stopPropagation();
    addToCart(prod, prod.sizes[0] || "M", prod.colors[0]?.name || "Default", 1);
    triggerToast(`Added "${prod.name}" to cart`);
  };

  const triggerToast = (msg: string) => {
    setAddedToast(msg);
    setTimeout(() => {
      setAddedToast(null);
    }, 2800);
  };

  // Calculate AI Fit Recommendation
  const calculateFit = () => {
    const h = parseInt(fitHeight) || 175;
    const w = parseInt(fitWeight) || 70;
    let size = "M";
    if (w < 60 || h < 165) size = "S";
    else if (w > 85 || h > 185) size = "XL";
    else if (w > 75 || h > 180) size = "L";

    if (fitPref === "oversized" && size !== "XL") {
      if (size === "S") size = "M";
      else if (size === "M") size = "L";
      else if (size === "L") size = "XL";
    }

    setFitRecommendation(`Based on your profile (${h}cm, ${w}kg, ${fitPref} fit), our Neural Size Engine recommends Size ${size} with 98.6% fit confidence.`);
  };

  // AI Personal Stylist simulation / API
  const handleAiStylistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiQuery.trim()) return;
    setIsAiLoading(true);
    setAiResponse(null);

    // Simulate AI network delay of 1 second for hyper-realistic feel
    setTimeout(() => {
      const query = aiQuery.toLowerCase();
      let responseText = "";

      if (query.includes("coat") || query.includes("trench") || query.includes("parka") || query.includes("outerwear") || query.includes("jacket") || query.includes("cold") || query.includes("rain") || query.includes("winter")) {
        responseText = `For your interest in technical outerwear, I recommend pairing the **Modular Trench Parka** (SKU-9904) with our **Structured Wool Overshirt** (SKU-9912). This combination ensures high weather-resistance and a bold architectural silhouette.`;
      } else if (query.includes("shoe") || query.includes("sneaker") || query.includes("footwear") || query.includes("run") || query.includes("walk") || query.includes("sport")) {
        responseText = `To elevate your footwear collection, consider the **NPU Cyber Runner Sneakers** (SKU-8821) in Dark Matter. They pair perfectly with the **Tapered Technical Cargos** (SKU-9908) to anchor your look with functional design.`;
      } else if (query.includes("shirt") || query.includes("pants") || query.includes("cargo") || query.includes("trouser") || query.includes("apparel") || query.includes("clothes")) {
        responseText = `For a clean minimalist uniform, I suggest the **Structured Wool Overshirt** (SKU-9912) worn open over a base layer, combined with the **Tapered Technical Cargos** (SKU-9908) for premium comfort and structural styling.`;
      } else if (query.includes("glass") || query.includes("sunglass") || query.includes("accessory") || query.includes("shades")) {
        responseText = `To complement your outfit, our **Ceramic Tech Sunglasses** (SKU-8840) are the perfect finish. Their architectural frames provide architectural symmetry and structural balance to any technical outfit.`;
      } else {
        responseText = `Based on your request "${aiQuery}", I highly recommend pairing the **Modular Trench Parka** (SKU-9904) with the **Structured Wool Overshirt** (SKU-9912) and **Ceramic Tech Sunglasses** (SKU-8840) for a modern, functional, and weather-proof minimalist look.`;
      }

      setAiResponse(responseText);
      setIsAiLoading(false);
    }, 1000);
  };

  return (
    <div className="w-full bg-background text-on-background pb-24" id="customer-shop-root">
      {/* Toast Notification */}
      <AnimatePresence>
        {addedToast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 right-6 z-50 bg-primary text-on-primary px-6 py-3 shadow-xl font-body-md text-sm border border-neutral-700 flex items-center gap-3"
            id="cart-toast"
          >
            <span className="material-symbols-outlined text-green-400">check_circle</span>
            <span>{addedToast}</span>
            <button
              onClick={openCart}
              className="ml-3 underline font-medium text-xs hover:text-neutral-300 cursor-pointer"
            >
              View Cart
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero E-Commerce Banner with moving mountain gradient */}
      <section
        className="relative w-full border-b border-border-subtle px-margin-mobile md:px-margin-desktop py-14 md:py-24 max-w-container-max mx-auto overflow-hidden animate-moving-gradient"
        style={{
          background: "linear-gradient(135deg, #ffffff 0%, #fffbf5 30%, #ffedd5 60%, #fff7ed 85%, #ffffff 100%)",
        }}
      >
        {/* Soft Ambient Warm Flares */}
        <div className="absolute top-0 right-0 w-[550px] h-[550px] bg-gradient-to-bl from-orange-200/20 via-amber-100/15 to-transparent pointer-events-none blur-3xl" />
        <div className="absolute -bottom-10 left-1/4 w-80 h-80 bg-gradient-to-tr from-orange-100/20 via-amber-50/15 to-transparent pointer-events-none blur-2xl" />

        {/* Moving Mountain Silhouette Contour Layer (Extreme Left to Extreme Right Full Width) with Gaussian Blur */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden pointer-events-none leading-none z-0">
          <svg
            className="relative block w-[200%] h-24 md:h-36 text-amber-300/40 animate-mountain-move blur-lg"
            viewBox="0 0 2400 120"
            preserveAspectRatio="none"
          >
            <path
              d="M0,80 C200,20 400,100 600,30 C800,90 1000,10 1200,75 C1400,25 1600,105 1800,40 C2000,95 2200,15 2400,70 L2400,120 L0,120 Z"
              fill="currentColor"
            />
          </svg>
        </div>

        <div className="relative z-10 flex flex-col justify-between items-start gap-8 max-w-3xl">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/80 backdrop-blur-sm border border-amber-200/80 font-label-sm text-xs text-amber-900 mb-4 uppercase tracking-widest shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
              A/W 2026 Collection • Neural Stock Sync
            </div>
            <h1 className="font-headline-lg text-4xl md:text-6xl tracking-tighter text-primary font-bold mb-4">
              MONOLITH STORE
            </h1>
            <p className="font-body-md text-neutral-800 font-medium text-base md:text-lg leading-relaxed mb-8 max-w-2xl">
              Minimalist architectural garments and technical artifacts. Every garment is inventory-backed in real-time by the Monolith Retail Intelligence Engine.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => {
                  const el = document.getElementById("catalog-grid");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className="bg-primary text-on-primary font-body-md text-xs px-4 py-2 border border-primary hover:bg-neutral-800 transition-colors cursor-pointer shadow-2xs font-semibold"
              >
                Shop Catalog ({filteredProducts.length} Items)
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main E-Commerce Catalog Section */}
      <section className="px-margin-mobile md:px-margin-desktop py-10 max-w-container-max mx-auto" id="catalog-grid">
        {/* Category Tabs & Filter Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-border-subtle mb-8">
          {/* Categories */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {["All", "Outerwear", "Footwear", "Tailored Essentials", "Tech Accessories"].map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`px-4 py-2 font-body-md text-xs whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? "bg-primary text-on-primary font-medium"
                      : "bg-surface text-text-muted hover:text-primary border border-border-subtle"
                  }`}
                  id={`cat-btn-${cat.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Search & Sort Controls */}
          <div className="flex flex-wrap items-center gap-4">
            {/* Search */}
            <div className="relative flex-1 md:w-64">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-text-muted text-sm">
                search
              </span>
              <input
                type="text"
                placeholder="Search SKU, item, material..."
                value={filters.searchQuery}
                onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
                className="w-full bg-surface border border-border-subtle pl-9 pr-3 py-2 text-xs font-body-md text-primary focus:outline-none focus:border-primary"
                id="product-search-input"
              />
              {filters.searchQuery && (
                <button
                  onClick={() => setFilters({ ...filters, searchQuery: "" })}
                  className="absolute right-3 top-2.5 text-text-muted hover:text-primary text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as any })}
              className="bg-surface border border-border-subtle px-3 py-2 text-xs font-body-md text-primary focus:outline-none focus:border-primary cursor-pointer"
              id="sort-select"
            >
              <option value="featured">Featured / AI Match</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="ai-match">Highest Demand Score</option>
            </select>

            {/* In Stock Only Checkbox */}
            <label className="flex items-center gap-2 cursor-pointer font-body-md text-xs text-text-muted select-none">
              <input
                type="checkbox"
                checked={filters.inStockOnly}
                onChange={(e) => setFilters({ ...filters, inStockOnly: e.target.checked })}
                className="accent-primary"
              />
              In Stock Only
            </label>
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-border-subtle bg-surface">
            <span className="material-symbols-outlined text-4xl text-text-muted mb-3">search_off</span>
            <h3 className="font-headline-lg text-lg text-primary mb-2">No products match your criteria</h3>
            <p className="font-body-md text-xs text-text-muted mb-4">
              Try adjusting your category, price range, or search keyword.
            </p>
            <button
              onClick={() => {
                setSelectedCategory("All");
                setFilters({
                  category: "All",
                  searchQuery: "",
                  sortBy: "featured",
                  maxPrice: 600,
                  inStockOnly: false,
                });
              }}
              className="bg-primary text-on-primary px-4 py-2 text-xs font-body-md cursor-pointer hover:bg-neutral-800"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((prod) => (
              <motion.div
                key={prod.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => handleProductClick(prod)}
                className="group bg-surface border border-border-subtle flex flex-col justify-between hover:border-primary transition-all cursor-pointer overflow-hidden relative"
                id={`product-card-${prod.id}`}
              >
                <div>
                  {/* Image Container */}
                  <div className="relative aspect-[3/4] bg-surface-container-low overflow-hidden">
                    <img
                      src={prod.image}
                      alt={prod.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Tag Badge */}
                    {prod.tag && (
                      <span className="absolute top-3 left-3 bg-black text-white text-[10px] font-label-sm uppercase px-2 py-0.5 tracking-wider font-semibold border border-neutral-700">
                        {prod.tag}
                      </span>
                    )}

                    {/* AI Match Score Badge */}
                    <span className="absolute top-3 right-3 bg-white text-black text-[10px] font-mono px-2 py-0.5 border border-black font-semibold shadow-sm">
                      {prod.aiDemandMatchScore}% AI MATCH
                    </span>

                    {/* Quick Add Button Overlay */}
                    <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                      <button
                        onClick={(e) => handleQuickAdd(e, prod)}
                        className="w-full bg-white text-black font-body-md text-xs py-2 font-semibold hover:bg-neutral-200 transition-colors cursor-pointer flex items-center justify-center gap-1"
                      >
                        <span className="material-symbols-outlined text-sm">shopping_bag</span>
                        Quick Add
                      </button>
                    </div>
                  </div>

                  {/* Info Container */}
                  <div className="p-4 flex flex-col gap-2">
                    <div className="flex items-center justify-between text-[11px] font-label-sm text-text-muted">
                      <span>{prod.sku}</span>
                      <span>{prod.category}</span>
                    </div>

                    <h3 className="font-body-md text-sm text-primary font-bold line-clamp-1 group-hover:underline">
                      {prod.name}
                    </h3>

                    <p className="font-body-md text-xs text-text-muted line-clamp-2 leading-relaxed">
                      {prod.description}
                    </p>
                  </div>
                </div>

                <div className="p-4 pt-0 border-t border-border-subtle/50 mt-2 flex items-center justify-between">
                  <div className="flex items-baseline gap-2">
                    <span className="font-headline-lg text-base text-primary font-bold">${prod.price}</span>
                    {prod.originalPrice && (
                      <span className="font-body-md text-xs text-text-muted line-through">
                        ${prod.originalPrice}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1 text-xs text-text-muted">
                    <span className="text-amber-400 font-bold">★</span>
                    <span className="font-mono text-primary">{prod.rating}</span>
                    <span>({prod.reviewCount})</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* AI Fit & Style Recommendation Modal */}
      <AnimatePresence>
        {showAiModal && (
          <div
            onClick={() => setShowAiModal(false)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 cursor-pointer"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-surface border border-border-subtle w-full max-w-lg p-6 shadow-2xl relative cursor-default"
            >
              <button
                onClick={() => setShowAiModal(false)}
                className="absolute top-4 right-4 text-text-muted hover:text-primary p-1 cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>

              <div className="flex items-center gap-2 text-primary font-label-sm text-xs uppercase tracking-widest mb-2 font-bold">
                CARTIS Neural Stylist
              </div>
              <h2 className="font-headline-lg text-xl text-primary font-bold mb-4">
                Personalized Outfit & Size Recommendation
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block font-body-md text-xs text-text-muted mb-1">
                    Describe your styling need or occasion:
                  </label>
                  <textarea
                    rows={3}
                    value={aiQuery}
                    onChange={(e) => setAiQuery(e.target.value)}
                    placeholder="e.g., Looking for a minimalist outfit for a chilly evening in Tokyo..."
                    className="w-full bg-background border border-border-subtle p-3 text-xs font-body-md text-primary focus:outline-none focus:border-primary"
                  />
                </div>

                <button
                  onClick={handleAiStylistSubmit}
                  disabled={isAiLoading || !aiQuery.trim()}
                  className="w-full bg-primary text-on-primary py-2.5 text-xs font-body-md hover:bg-neutral-800 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {isAiLoading ? "Consulting AI Stylist..." : "Generate Recommendation"}
                </button>

                {aiResponse && (
                  <div className="p-4 bg-surface-paper border border-border-subtle font-body-md text-xs text-primary leading-relaxed">
                    <p className="font-bold mb-1">Stylist Insight:</p>
                    {aiResponse}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Product Detail Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <div
            onClick={() => setSelectedProduct(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto cursor-pointer"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-surface border border-border-subtle w-full max-w-3xl my-8 p-6 md:p-8 shadow-2xl relative cursor-default"
              id="product-modal-content"
            >
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 text-text-muted hover:text-primary p-2 cursor-pointer z-10"
              >
                <span className="material-symbols-outlined text-2xl">close</span>
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Image Gallery */}
                <div className="flex flex-col gap-3">
                  <div className="aspect-[3/4] bg-surface-container-low border border-border-subtle overflow-hidden">
                    <img
                      src={selectedProduct.image}
                      alt={selectedProduct.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    {selectedProduct.galleryImages?.map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        alt="thumbnail"
                        referrerPolicy="no-referrer"
                        className="w-16 h-20 object-cover border border-border-subtle cursor-pointer hover:opacity-80"
                      />
                    ))}
                  </div>
                </div>

                {/* Details */}
                <div className="flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs font-label-sm text-text-muted">
                      <span>{selectedProduct.sku}</span>
                      <span className="text-emerald-400 font-mono">
                        {selectedProduct.stockQty} Units In Stock
                      </span>
                    </div>

                    <h2 className="font-headline-lg text-2xl text-primary font-bold">
                      {selectedProduct.name}
                    </h2>

                    <div className="flex items-baseline gap-3">
                      <span className="font-headline-lg text-xl text-primary font-bold">
                        ${selectedProduct.price}
                      </span>
                      {selectedProduct.originalPrice && (
                        <span className="font-body-md text-sm text-text-muted line-through">
                          ${selectedProduct.originalPrice}
                        </span>
                      )}
                    </div>

                    <p className="font-body-md text-xs text-text-muted leading-relaxed">
                      {selectedProduct.description}
                    </p>

                    <div className="p-3 bg-surface-paper border border-border-subtle text-xs">
                      <span className="font-bold text-primary block mb-1">Materials & Specs:</span>
                      <span className="text-text-muted">{selectedProduct.materials}</span>
                    </div>

                    {/* Color Options */}
                    <div>
                      <span className="block font-body-md text-xs text-primary font-bold mb-2">
                        Color: {modalColor}
                      </span>
                      <div className="flex items-center gap-3">
                        {selectedProduct.colors.map((c) => (
                          <button
                            key={c.name}
                            onClick={() => setModalColor(c.name)}
                            style={{ backgroundColor: c.hex }}
                            className={`w-7 h-7 rounded-full border-2 transition-transform cursor-pointer ${
                              modalColor === c.name ? "border-primary scale-110" : "border-transparent"
                            }`}
                            title={c.name}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Size Options */}
                    <div>
                      <span className="block font-body-md text-xs text-primary font-bold mb-2">
                        Select Size:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {selectedProduct.sizes.map((sz) => (
                          <button
                            key={sz}
                            onClick={() => setModalSize(sz)}
                            className={`px-3 py-1.5 text-xs font-body-md border transition-all cursor-pointer ${
                              modalSize === sz
                                ? "bg-primary text-on-primary border-primary font-bold"
                                : "bg-surface text-text-muted border-border-subtle hover:text-primary"
                            }`}
                          >
                            {sz}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* AI Fit Predictor Tool */}
                    <div className="p-3 bg-surface border border-border-subtle space-y-2">
                      <div className="flex items-center justify-between text-xs font-label-sm text-primary">
                        <span className="flex items-center gap-1 font-bold">
                          <span className="material-symbols-outlined text-xs">straighten</span>
                          Neural Size Predictor
                        </span>
                        <button
                          onClick={calculateFit}
                          className="text-[10px] underline hover:text-text-muted cursor-pointer"
                        >
                          Calculate Size
                        </button>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div>
                          <span className="text-[10px] text-text-muted">Height (cm)</span>
                          <input
                            type="number"
                            value={fitHeight}
                            onChange={(e) => setFitHeight(e.target.value)}
                            className="w-full bg-background border border-border-subtle px-2 py-1 text-xs"
                          />
                        </div>
                        <div>
                          <span className="text-[10px] text-text-muted">Weight (kg)</span>
                          <input
                            type="number"
                            value={fitWeight}
                            onChange={(e) => setFitWeight(e.target.value)}
                            className="w-full bg-background border border-border-subtle px-2 py-1 text-xs"
                          />
                        </div>
                        <div>
                          <span className="text-[10px] text-text-muted">Fit Style</span>
                          <select
                            value={fitPref}
                            onChange={(e) => setFitPref(e.target.value as any)}
                            className="w-full bg-background border border-border-subtle px-1 py-1 text-xs"
                          >
                            <option value="slim">Slim</option>
                            <option value="regular">Regular</option>
                            <option value="oversized">Oversized</option>
                          </select>
                        </div>
                      </div>
                      {fitRecommendation && (
                        <p className="text-[11px] text-emerald-400 font-mono mt-1">
                          {fitRecommendation}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Modal Action Footer */}
                  <div className="mt-6 pt-4 border-t border-border-subtle flex items-center gap-4">
                    <div className="flex items-center border border-border-subtle">
                      <button
                        onClick={() => setModalQty(Math.max(1, modalQty - 1))}
                        className="px-3 py-2 text-xs font-body-md hover:bg-surface-container-low cursor-pointer"
                      >
                        -
                      </button>
                      <span className="px-4 py-2 text-xs font-mono">{modalQty}</span>
                      <button
                        onClick={() => setModalQty(modalQty + 1)}
                        className="px-3 py-2 text-xs font-body-md hover:bg-surface-container-low cursor-pointer"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => {
                        addToCart(selectedProduct, modalSize, modalColor, modalQty);
                        setSelectedProduct(null);
                        triggerToast(`Added ${modalQty}x "${selectedProduct.name}" (${modalSize})`);
                      }}
                      className="flex-1 bg-primary text-on-primary py-3 text-xs font-body-md font-bold hover:bg-neutral-800 transition-colors cursor-pointer flex items-center justify-center gap-2"
                      id="modal-add-to-cart-btn"
                    >
                      <span className="material-symbols-outlined text-base">shopping_bag</span>
                      Add to Cart • ${(selectedProduct.price * modalQty).toFixed(2)}
                    </button>
                  </div>
                </div>
              </div>

              {/* Recommended Similar Products Section */}
              {similarProducts.length > 0 && (
                <div className="mt-8 pt-6 border-t border-border-subtle">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-headline-lg text-sm text-primary font-bold uppercase tracking-wider flex items-center gap-2">
                      Similar Products & AI Recommendations
                    </h3>
                    <span className="text-[10px] font-mono text-text-muted">CARTIS Neural Recommendation Match</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {similarProducts.map((simProd) => (
                      <div
                        key={simProd.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleProductClick(simProd);
                        }}
                        className="group bg-surface-paper border border-border-subtle p-3 flex flex-col justify-between hover:border-primary transition-all cursor-pointer relative"
                        id={`recommended-product-${simProd.id}`}
                      >
                        <div>
                          <div className="relative aspect-[3/4] bg-surface-container-low overflow-hidden mb-2">
                            <img
                              src={simProd.image}
                              alt={simProd.name}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <span className="absolute top-1.5 right-1.5 bg-black text-white text-[9px] font-mono px-1.5 py-0.5 font-semibold">
                              {simProd.aiDemandMatchScore}% MATCH
                            </span>
                          </div>
                          <span className="text-[10px] font-mono text-text-muted uppercase block">{simProd.category}</span>
                          <h4 className="font-body-md text-xs font-bold text-primary group-hover:underline line-clamp-1">
                            {simProd.name}
                          </h4>
                        </div>
                        <div className="mt-2 flex items-center justify-between text-xs pt-2 border-t border-border-subtle/50">
                          <span className="font-bold text-primary">${simProd.price}</span>
                          <span className="text-[10px] font-mono text-emerald-400 font-semibold flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                            View Product →
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
