import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import CopilotInterface from "./CopilotInterface";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts";
import { SAMPLE_PRODUCTS } from "../data/products";

export type CommandTab =
  | "dashboard"
  | "forecasting"
  | "inventory"
  | "recommendations"
  | "copilot"
  | "product-analytics"
  | "model-health";

interface RetailerCommandCenterProps {
  activeTab: CommandTab;
  setActiveTab: (tab: CommandTab) => void;
}

// Chart Mock Data
const DASHBOARD_REVENUE_TREND = [
  { month: "Jan", revenue: 120000, target: 110000 },
  { month: "Feb", revenue: 135000, target: 125000 },
  { month: "Mar", revenue: 148000, target: 140000 },
  { month: "Apr", revenue: 162000, target: 155000 },
  { month: "May", revenue: 190000, target: 175000 },
  { month: "Jun", revenue: 215000, target: 200000 },
  { month: "Jul", revenue: 240000, target: 220000 },
  { month: "Aug", revenue: 265000, target: 245000 },
];

const SALES_BY_CATEGORY = [
  { name: "Outerwear", value: 680000, percentage: 37, color: "#111111" },
  { name: "Footwear", value: 490000, percentage: 27, color: "#444444" },
  { name: "Tailored Essentials", value: 380000, percentage: 21, color: "#777777" },
  { name: "Tech Accessories", value: 210000, percentage: 11, color: "#999999" },
  { name: "Leather Goods", value: 82500, percentage: 4, color: "#cccccc" },
];

const TOP_PRODUCTS = [
  { name: "Cartis Trench Parka", revenue: 384000, units: 800 },
  { name: "NPU Cyber Runner", revenue: 261000, units: 900 },
  { name: "Archival Wool Blazer", revenue: 210800, units: 620 },
  { name: "Matte Aluminum Carrier", revenue: 169000, units: 650 },
  { name: "Derby Leather Boot", revenue: 145000, units: 380 },
];

const TOP_STORES = [
  { store: "Tokyo Ginza", revenue: 485000, transactions: 3820 },
  { store: "New York Soho", revenue: 420000, transactions: 3410 },
  { store: "London Mayfair", revenue: 360000, transactions: 2900 },
  { store: "Paris Le Marais", revenue: 295000, transactions: 2400 },
  { store: "Online Flagship", revenue: 282500, transactions: 2290 },
];

const REVENUE_BY_COUNTRY = [
  { country: "USA", revenue: 640000, share: "34.7%" },
  { country: "Japan", revenue: 485000, share: "26.3%" },
  { country: "Germany", revenue: 290000, share: "15.7%" },
  { country: "United Kingdom", revenue: 245000, share: "13.3%" },
  { country: "France", revenue: 182500, share: "10.0%" },
];

const FORECAST_BAND_DATA = [
  { date: "Aug 01", historicalSales: 4200, forecastDemand: 4300, upperBand: 4600, lowerBand: 4000 },
  { date: "Aug 02", historicalSales: 4400, forecastDemand: 4500, upperBand: 4850, lowerBand: 4150 },
  { date: "Aug 03", historicalSales: 4100, forecastDemand: 4700, upperBand: 5100, lowerBand: 4300 },
  { date: "Aug 04", historicalSales: 4800, forecastDemand: 5100, upperBand: 5500, lowerBand: 4700 },
  { date: "Aug 05", historicalSales: 5200, forecastDemand: 5400, upperBand: 5900, lowerBand: 4900 },
  { date: "Aug 06 (FC)", historicalSales: null, forecastDemand: 5800, upperBand: 6300, lowerBand: 5300 },
  { date: "Aug 07 (FC)", historicalSales: null, forecastDemand: 6200, upperBand: 6800, lowerBand: 5600 },
  { date: "Aug 08 (FC)", historicalSales: null, forecastDemand: 6500, upperBand: 7100, lowerBand: 5900 },
  { date: "Aug 09 (FC)", historicalSales: null, forecastDemand: 6100, upperBand: 6700, lowerBand: 5500 },
  { date: "Aug 10 (FC)", historicalSales: null, forecastDemand: 6400, upperBand: 7000, lowerBand: 5800 },
];

export interface ForecastRow {
  id: string;
  date: string;
  product: string;
  category: string;
  subcategory: string;
  store: string;
  country: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  trend: "Up" | "Down" | "Stable";
}

const FORECAST_TABLE_DATA: ForecastRow[] = [
  {
    id: "f-101",
    date: "2026-08-05",
    product: "Cartis Modular Trench Parka",
    category: "Outerwear",
    subcategory: "Parkas & Jackets",
    store: "Tokyo Ginza Flagship",
    country: "Japan",
    quantity: 140,
    unitPrice: 480,
    lineTotal: 67200,
    trend: "Up",
  },
  {
    id: "f-102",
    date: "2026-08-05",
    product: "NPU Cyber Runner Sneaker",
    category: "Footwear",
    subcategory: "Boots & Sneakers",
    store: "New York Soho",
    country: "USA",
    quantity: 210,
    unitPrice: 290,
    lineTotal: 60900,
    trend: "Up",
  },
  {
    id: "f-103",
    date: "2026-08-06",
    product: "Archival Wool Structure Overshirt",
    category: "Tailored Essentials",
    subcategory: "Shirts & Blazers",
    store: "London Mayfair",
    country: "United Kingdom",
    quantity: 95,
    unitPrice: 340,
    lineTotal: 32300,
    trend: "Stable",
  },
  {
    id: "f-104",
    date: "2026-08-06",
    product: "Tactical Matte Aluminum Backpack",
    category: "Tech Accessories",
    subcategory: "Bags & Accessories",
    store: "Paris Le Marais",
    country: "France",
    quantity: 110,
    unitPrice: 260,
    lineTotal: 28600,
    trend: "Up",
  },
  {
    id: "f-105",
    date: "2026-08-07",
    product: "High-Derby Sculpted Leather Boot",
    category: "Footwear",
    subcategory: "Boots & Sneakers",
    store: "Tokyo Ginza Flagship",
    country: "Japan",
    quantity: 85,
    unitPrice: 380,
    lineTotal: 32300,
    trend: "Down",
  },
  {
    id: "f-106",
    date: "2026-08-07",
    product: "Monolith Ceramic Tech Sunglasses",
    category: "Tech Accessories",
    subcategory: "Bags & Accessories",
    store: "New York Soho",
    country: "USA",
    quantity: 180,
    unitPrice: 210,
    lineTotal: 37800,
    trend: "Up",
  },
  {
    id: "f-107",
    date: "2026-08-08",
    product: "Architectural Trench Coat",
    category: "Outerwear",
    subcategory: "Parkas & Jackets",
    store: "Online Store",
    country: "Germany",
    quantity: 165,
    unitPrice: 520,
    lineTotal: 85800,
    trend: "Up",
  },
  {
    id: "f-108",
    date: "2026-08-08",
    product: "Minimalist Leather Travel Tote",
    category: "Leather Goods",
    subcategory: "Bags & Accessories",
    store: "Paris Le Marais",
    country: "France",
    quantity: 70,
    unitPrice: 450,
    lineTotal: 31500,
    trend: "Stable",
  },
  {
    id: "f-109",
    date: "2026-08-09",
    product: "Kinetic Thermal Insulation Vest",
    category: "Outerwear",
    subcategory: "Parkas & Jackets",
    store: "Tokyo Ginza Flagship",
    country: "Japan",
    quantity: 125,
    unitPrice: 390,
    lineTotal: 48750,
    trend: "Up",
  },
  {
    id: "f-110",
    date: "2026-08-09",
    product: "Seamless Technical Polo",
    category: "Tailored Essentials",
    subcategory: "Shirts & Blazers",
    store: "New York Soho",
    country: "USA",
    quantity: 150,
    unitPrice: 190,
    lineTotal: 28500,
    trend: "Stable",
  },
];

const RECOMMENDATION_PERFORMANCE = [
  { strategy: "Neural Stylist", ctr: 24.5, conversion: 12.8, revenue: 184000 },
  { strategy: "Size Match", ctr: 31.2, conversion: 16.4, revenue: 212000 },
  { strategy: "Collaborative", ctr: 18.9, conversion: 8.2, revenue: 110000 },
  { strategy: "Weather Dynamic", ctr: 22.1, conversion: 11.5, revenue: 145000 },
  { strategy: "Margin Priority", ctr: 15.4, conversion: 7.1, revenue: 98000 },
];

// RECOMMENDATION ANALYTICS DATA
const TOP_RECOMMENDED_PRODUCTS = [
  { rank: 1, name: "Cartis Modular Trench Parka", category: "Outerwear", impressions: 42800, clicks: 11200, ctr: "26.2%", revenue: "$184,200", conversion: "14.8%" },
  { rank: 2, name: "NPU Cyber Runner Sneaker", category: "Footwear", impressions: 38900, clicks: 9800, ctr: "25.2%", revenue: "$142,100", conversion: "13.2%" },
  { rank: 3, name: "Archival Wool Structure Overshirt", category: "Tailored Essentials", impressions: 31200, clicks: 7400, ctr: "23.7%", revenue: "$98,400", conversion: "11.9%" },
  { rank: 4, name: "Derby Sculpted Leather Boot", category: "Footwear", impressions: 27500, clicks: 6100, ctr: "22.2%", revenue: "$84,500", conversion: "10.8%" },
  { rank: 5, name: "Tactical Matte Aluminum Backpack", category: "Tech Accessories", impressions: 24100, clicks: 5200, ctr: "21.6%", revenue: "$62,800", conversion: "9.9%" },
];

const MOST_PURCHASED_TOGETHER = [
  { primary: "Cartis Trench Parka", pairedWith: "Derby Leather Boot", coPurchases: 480, bundleRevenue: "$384,000", lift: "+38%" },
  { primary: "NPU Cyber Runner", pairedWith: "Seamless Technical Polo", coPurchases: 390, bundleRevenue: "$187,200", lift: "+29%" },
  { primary: "Archival Wool Blazer", pairedWith: "Tactical Aluminum Backpack", coPurchases: 310, bundleRevenue: "$186,000", lift: "+24%" },
  { primary: "Kinetic Thermal Vest", pairedWith: "Monolith Tech Sunglasses", coPurchases: 260, bundleRevenue: "$156,000", lift: "+31%" },
];

const FREQUENTLY_BOUGHT_TOGETHER = [
  { bundleId: "B-101", title: "Urban Weatherproof Outfit", items: ["Cartis Trench Parka", "Derby Leather Boot", "Monolith Sunglasses"], frequency: "34.2%", bundlePrice: "$1,070", regularPrice: "$1,180", conversionRate: "18.4%" },
  { bundleId: "B-102", title: "Tech Commuter Pack", items: ["Tactical Aluminum Backpack", "NPU Cyber Runner", "Technical Polo"], frequency: "28.6%", bundlePrice: "$740", regularPrice: "$810", conversionRate: "16.1%" },
  { bundleId: "B-103", title: "Tailored Executive Capsule", items: ["Archival Wool Blazer", "Minimalist Leather Tote", "Sculpted Leather Belt"], frequency: "21.8%", bundlePrice: "$1,120", regularPrice: "$1,240", conversionRate: "14.5%" },
];

const RECOMMENDATION_CTR_TIMELINE = [
  { period: "Wk 1", personalStylist: 22.1, pdpCrossSell: 16.4, cartModal: 12.1, emailRetargeting: 8.5 },
  { period: "Wk 2", personalStylist: 23.5, pdpCrossSell: 17.2, cartModal: 13.0, emailRetargeting: 9.1 },
  { period: "Wk 3", personalStylist: 24.8, pdpCrossSell: 18.0, cartModal: 13.8, emailRetargeting: 9.8 },
  { period: "Wk 4", personalStylist: 26.2, pdpCrossSell: 19.1, cartModal: 14.5, emailRetargeting: 10.4 },
  { period: "Wk 5", personalStylist: 28.0, pdpCrossSell: 20.4, cartModal: 15.2, emailRetargeting: 11.2 },
];

const CATEGORY_PREFERENCES_DATA = [
  { category: "Outerwear", vipShoppers: 92, firstTimeShoppers: 65, techwearSegment: 88 },
  { category: "Footwear", vipShoppers: 84, firstTimeShoppers: 78, techwearSegment: 95 },
  { category: "Tailored Essentials", vipShoppers: 88, firstTimeShoppers: 52, techwearSegment: 62 },
  { category: "Tech Accessories", vipShoppers: 72, firstTimeShoppers: 82, techwearSegment: 91 },
  { category: "Leather Goods", vipShoppers: 79, firstTimeShoppers: 45, techwearSegment: 54 },
];

const PRODUCT_AFFINITY_NODES = [
  { id: "p1", name: "Cartis Trench Parka", category: "Outerwear", cx: 120, cy: 120, r: 28, color: "#111111" },
  { id: "p2", name: "Derby Leather Boot", category: "Footwear", cx: 320, cy: 80, r: 24, color: "#333333" },
  { id: "p3", name: "NPU Cyber Runner", category: "Footwear", cx: 280, cy: 220, r: 22, color: "#555555" },
  { id: "p4", name: "Archival Wool Blazer", category: "Tailored", cx: 100, cy: 250, r: 20, color: "#777777" },
  { id: "p5", name: "Tactical Backpack", category: "Tech Acc", cx: 440, cy: 180, r: 18, color: "#999999" },
];

const PRODUCT_AFFINITY_EDGES = [
  { source: "p1", target: "p2", strength: "88%", score: 0.88, label: "Trench + Boot" },
  { source: "p1", target: "p3", strength: "72%", score: 0.72, label: "Trench + Runner" },
  { source: "p1", target: "p4", strength: "64%", score: 0.64, label: "Trench + Blazer" },
  { source: "p3", target: "p5", strength: "78%", score: 0.78, label: "Runner + Backpack" },
  { source: "p2", target: "p5", strength: "56%", score: 0.56, label: "Boot + Backpack" },
];

// PRODUCT ANALYTICS DATA
const TOP_20_PRODUCTS = [
  { rank: 1, name: "Cartis Modular Trench Parka", sku: "SKU-OUT-001", category: "Outerwear", revenue: 384000, units: 800, margin: "68.5%", growth: "+34%" },
  { rank: 2, name: "NPU Cyber Runner Sneaker", sku: "SKU-FTW-002", category: "Footwear", revenue: 261000, units: 900, margin: "62.0%", growth: "+28%" },
  { rank: 3, name: "Archival Wool Blazer", sku: "SKU-TLR-003", category: "Tailored Essentials", revenue: 210800, units: 620, margin: "71.2%", growth: "+14%" },
  { rank: 4, name: "Tactical Aluminum Carrier", sku: "SKU-ACC-004", category: "Tech Accessories", revenue: 169000, units: 650, margin: "58.4%", growth: "+19%" },
  { rank: 5, name: "Derby Leather Boot", sku: "SKU-FTW-005", category: "Footwear", revenue: 145000, units: 380, margin: "65.0%", growth: "+22%" },
  { rank: 6, name: "Minimalist Leather Travel Tote", sku: "SKU-LTH-006", category: "Leather Goods", revenue: 128000, units: 285, margin: "74.0%", growth: "+12%" },
  { rank: 7, name: "Kinetic Thermal Vest", sku: "SKU-OUT-007", category: "Outerwear", revenue: 112500, units: 290, margin: "66.5%", growth: "+41%" },
  { rank: 8, name: "Seamless Technical Polo", sku: "SKU-TLR-008", category: "Tailored Essentials", revenue: 98000, units: 515, margin: "59.0%", growth: "+8%" },
  { rank: 9, name: "Monolith Tech Sunglasses", sku: "SKU-ACC-009", category: "Tech Accessories", revenue: 84000, units: 400, margin: "78.0%", growth: "+52%" },
  { rank: 10, name: "Waterproof Shell Jacket", sku: "SKU-OUT-010", category: "Outerwear", revenue: 76000, units: 190, margin: "67.0%", growth: "+15%" },
  { rank: 11, name: "Sculpted Leather Belt", sku: "SKU-LTH-011", category: "Leather Goods", revenue: 64000, units: 320, margin: "81.0%", growth: "+6%" },
  { rank: 12, name: "All-Terrain Cyber Boot", sku: "SKU-FTW-012", category: "Footwear", revenue: 58000, units: 145, margin: "63.5%", growth: "+18%" },
  { rank: 13, name: "Pinstripe Tailored Trousers", sku: "SKU-TLR-013", category: "Tailored Essentials", revenue: 52000, units: 210, margin: "69.0%", growth: "+9%" },
  { rank: 14, name: "Alloy Card Holder", sku: "SKU-ACC-014", category: "Tech Accessories", revenue: 44000, units: 360, margin: "84.0%", growth: "+25%" },
  { rank: 15, name: "Insulated Overshirt", sku: "SKU-OUT-015", category: "Outerwear", revenue: 39000, units: 130, margin: "61.0%", growth: "+11%" },
  { rank: 16, name: "Knit Merino Sweater", sku: "SKU-TLR-016", category: "Tailored Essentials", revenue: 35000, units: 140, margin: "64.0%", growth: "+4%" },
  { rank: 17, name: "Urban Sling Bag", sku: "SKU-ACC-017", category: "Tech Accessories", revenue: 31000, units: 155, margin: "60.0%", growth: "+16%" },
  { rank: 18, name: "Heavyweight Boxy Tee", sku: "SKU-TLR-018", category: "Tailored Essentials", revenue: 29500, units: 295, margin: "52.0%", growth: "+3%" },
  { rank: 19, name: "Minimalist Leather Card Case", sku: "SKU-LTH-019", category: "Leather Goods", revenue: 24000, units: 200, margin: "82.0%", growth: "+7%" },
  { rank: 20, name: "Ankle Mesh Runner Sock 3-Pack", sku: "SKU-FTW-020", category: "Footwear", revenue: 18500, units: 530, margin: "48.0%", growth: "+10%" },
];

const PRODUCT_REVENUE_DISTRIBUTION = [
  { tier: "Top 10%", cumulativePct: 64, directSharePct: 64 },
  { tier: "Top 20%", cumulativePct: 81, directSharePct: 17 },
  { tier: "Top 30%", cumulativePct: 89, directSharePct: 8 },
  { tier: "Top 40%", cumulativePct: 94, directSharePct: 5 },
  { tier: "Top 50%", cumulativePct: 97, directSharePct: 3 },
  { tier: "Long Tail", cumulativePct: 100, directSharePct: 3 },
];

const SIZE_ANALYSIS_DATA = [
  { size: "XS", salesUnits: 1420, stockoutRate: 8.2 },
  { size: "S", salesUnits: 3850, stockoutRate: 14.5 },
  { size: "M", salesUnits: 6200, stockoutRate: 22.4 },
  { size: "L", salesUnits: 5100, stockoutRate: 18.1 },
  { size: "XL", salesUnits: 2900, stockoutRate: 12.0 },
  { size: "XXL", salesUnits: 1100, stockoutRate: 4.5 },
];

const COLOR_ANALYSIS_DATA = [
  { color: "Obsidian Black", hex: "#111111", revenue: 780000, share: "42.3%", units: 5800 },
  { color: "Matte Slate", hex: "#475569", revenue: 410000, share: "22.2%", units: 3100 },
  { color: "Cyber Silver", hex: "#94a3b8", revenue: 290000, share: "15.7%", units: 2200 },
  { color: "Olive Drab", hex: "#4d533c", revenue: 210000, share: "11.4%", units: 1600 },
  { color: "Raw Ochre", hex: "#b45309", revenue: 95000, share: "5.2%", units: 750 },
  { color: "Pure White", hex: "#e2e8f0", revenue: 57500, share: "3.2%", units: 480 },
];

export default function RetailerCommandCenter({
  activeTab,
  setActiveTab,
}: RetailerCommandCenterProps) {
  // Demand Forecasting Filter states
  const [forecastCategory, setForecastCategory] = useState<string>("All");
  const [forecastSubcategory, setForecastSubcategory] = useState<string>("All");
  const [forecastStore, setForecastStore] = useState<string>("All");
  const [forecastCountry, setForecastCountry] = useState<string>("All");

  // Simulator states
  const [priceElasticity, setPriceElasticity] = useState<number>(0);
  const [promoBoost, setPromoBoost] = useState<number>(10);
  const [personalizationWeight, setPersonalizationWeight] = useState<number>(75);

  // Recommendation & Product Analytics States
  const [selectedAffinityNode, setSelectedAffinityNode] = useState<string>("p1");
  const [top20SortBy, setTop20SortBy] = useState<"revenue" | "units">("revenue");
  const [top20CategoryFilter, setTop20CategoryFilter] = useState<string>("All");

  // Copilot Full Screen Modal State
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);

  // Copilot State
  const [copilotMessages, setCopilotMessages] = useState<
    Array<{ sender: "user" | "copilot"; text: string; time: string; action?: string }>
  >([
    {
      sender: "copilot",
      text: "Hello Operational Commander. Monolith Retail Neural Engine is fully synchronized across 3 regional fulfillment centers. How can I assist your supply chain today?",
      time: "09:00 AM",
    },
  ]);
  const [copilotInput, setCopilotInput] = useState("");
  const [copilotLoading, setCopilotLoading] = useState(false);

  // Model Retrain Simulator
  const [isRetraining, setIsRetraining] = useState(false);
  const [retrainProgress, setRetrainProgress] = useState(0);
  const [retrainLogs, setRetrainLogs] = useState<string[]>([]);

  // Restock PO modal state
  const [poModalItem, setPoModalItem] = useState<any | null>(null);
  const [poSuccess, setPoSuccess] = useState(false);

  // Quick copilot prompt launcher
  const handleCopilotSend = (queryText?: string) => {
    const textToSend = queryText || copilotInput;
    if (!textToSend.trim()) return;

    const userMsg = {
      sender: "user" as const,
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setCopilotMessages((prev) => [...prev, userMsg]);
    if (!queryText) setCopilotInput("");
    setCopilotLoading(true);

    setTimeout(() => {
      let reply = "";
      const lower = textToSend.toLowerCase();

      if (lower.includes("stockout") || lower.includes("risk")) {
        reply =
          "⚠️ **High Stockout Risk Alert**: Monolith Ceramic Tech Sunglasses (SKU-4419) has only 8 units remaining with an estimated depleted timeline of 24 hours. Monolith High-Derby Leather Boot (SKU-2290) has 12 units remaining. I recommend issuing an immediate Purchase Order for 50 units each to Warehouse Alpha.";
      } else if (lower.includes("restock") || lower.includes("warehouse")) {
        reply =
          "📦 **Automated Restock Plan**: Generated PO #PO-9912. Reallocating 120 units of Outerwear from Warehouse Frankfurt (Beta) to Tokyo (Alpha) to cover projected A/W storm event demand.";
      } else if (lower.includes("pricing") || lower.includes("margin")) {
        reply =
          "🏷️ **Dynamic Margin Recommendation**: Increasing price on Monolith Modular Trench Parka by +$20 will improve gross margin by 4.2% while retaining 96.8% of purchase intent due to low price elasticity.";
      } else {
        reply =
          `🤖 **Copilot Insight for "${textToSend}"**: All neural prediction models are healthy (98.6% precision). Inventory turnover velocity is up 14% week-over-week across all core categories.`;
      }

      setCopilotMessages((prev) => [
        ...prev,
        {
          sender: "copilot",
          text: reply,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
      setCopilotLoading(false);
    }, 1000);
  };

  // Trigger Model Retrain
  const handleTriggerRetrain = () => {
    setIsRetraining(true);
    setRetrainProgress(0);
    setRetrainLogs(["[00:01] Initializing PyTorch Distributed DataLoader...", "[00:03] Ingesting 2.4M customer event logs..."]);

    let prog = 0;
    const interval = setInterval(() => {
      prog += 20;
      setRetrainProgress(prog);

      if (prog === 40) {
        setRetrainLogs((prev) => [...prev, "[00:05] Optimizing Demand Transformer weights (Epoch 12/20)..."]);
      } else if (prog === 80) {
        setRetrainLogs((prev) => [...prev, "[00:08] Validation Loss: 0.0142 | Drift Score updated to 0.01"]);
      } else if (prog >= 100) {
        clearInterval(interval);
        setIsRetraining(false);
        setRetrainLogs((prev) => [
          ...prev,
          "[00:10] Model successfully re-compiled & deployed to Production Edge nodes!",
        ]);
      }
    }, 600);
  };

  return (
    <div className="w-full bg-background text-on-background min-h-screen pb-24" id="retailer-command-center">
      {/* Top Operations Bar */}
      <div className="bg-black text-white px-margin-mobile md:px-margin-desktop py-4 border-b border-neutral-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <div>
            <h1 className="font-headline-lg text-sm md:text-base font-bold tracking-tight uppercase flex items-center gap-2">
              RETAIL OPERATIONS COMMAND CENTER
            </h1>
            <p className="font-mono text-[10px] text-neutral-400">
              CARTIS NEURAL ENGINE v3.4 • REAL-TIME SUPPLY CHAIN TELEMETRY
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6 text-xs font-mono">
          <div className="hidden sm:flex items-center gap-2 text-neutral-300">
            <span className="text-neutral-500">SYSTEM HEALTH:</span>
            <span className="text-emerald-400 font-bold">100% OPERATIONAL</span>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-neutral-300">
            <span className="text-neutral-500">LATENCY:</span>
            <span className="text-white">12ms</span>
          </div>
          <button
            onClick={() => setIsCopilotOpen(true)}
            className="bg-white text-black font-body-md text-xs px-3 py-1.5 font-bold hover:bg-neutral-200 cursor-pointer flex items-center gap-1.5 shadow-sm"
            id="launch-ai-copilot-btn"
          >
            <span className="material-symbols-outlined text-sm">smart_toy</span>
            Launch AI Copilot
          </button>
        </div>
      </div>

      {/* Sub-Navigation Module Tabs */}
      <div className="bg-surface border-b border-border-subtle sticky top-20 z-40 px-margin-mobile md:px-margin-desktop overflow-x-auto scrollbar-none">
        <div className="flex items-center gap-1 py-2 max-w-container-max mx-auto min-w-max">
          {[
            { id: "dashboard", label: "Dashboard", icon: "dashboard" },
            { id: "forecasting", label: "Demand Forecasting", icon: "trending_up" },
            { id: "inventory", label: "Inventory Optimization", icon: "inventory_2" },
            { id: "recommendations", label: "Recommendation Analytics", icon: "recommend" },
            { id: "product-analytics", label: "Product Analytics", icon: "analytics" },
            { id: "model-health", label: "Monitoring & Model Health", icon: "health_and_safety" },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as CommandTab)}
                className={`px-4 py-2.5 font-body-md text-xs font-medium transition-all flex items-center gap-2 cursor-pointer border ${
                  isActive
                    ? "bg-primary text-on-primary border-primary shadow-sm font-bold"
                    : "bg-surface text-text-muted hover:text-primary border-transparent hover:border-border-subtle"
                }`}
                id={`tab-${tab.id}`}
              >
                <span className="material-symbols-outlined text-sm">{tab.icon}</span>
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Command Center Container */}
      <div className="px-margin-mobile md:px-margin-desktop py-8 max-w-container-max mx-auto">
        <AnimatePresence mode="wait">
          {/* TAB 1: DASHBOARD */}
          {activeTab === "dashboard" && (
            <motion.div
              key="tab-dashboard"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              {/* Top KPI Cards (6 Required Cards) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                <div className="bg-surface border border-border-subtle p-4 shadow-2xs">
                  <div className="flex items-center justify-between text-[11px] font-label-sm text-text-muted mb-1">
                    <span>TOTAL REVENUE</span>
                    <span className="text-emerald-600 font-mono font-bold">+18.4%</span>
                  </div>
                  <div className="font-headline-lg text-xl font-bold text-primary">$1,842,500</div>
                  <p className="font-body-md text-[10px] text-text-muted mt-1.5">
                    Target: <span className="font-mono text-primary">$1,750,000</span>
                  </p>
                </div>

                <div className="bg-surface border border-border-subtle p-4 shadow-2xs">
                  <div className="flex items-center justify-between text-[11px] font-label-sm text-text-muted mb-1">
                    <span>TOTAL TRANSACTIONS</span>
                    <span className="text-emerald-600 font-mono font-bold">+12.3%</span>
                  </div>
                  <div className="font-headline-lg text-xl font-bold text-primary">14,820</div>
                  <p className="font-body-md text-[10px] text-text-muted mt-1.5">
                    Completed orders
                  </p>
                </div>

                <div className="bg-surface border border-border-subtle p-4 shadow-2xs">
                  <div className="flex items-center justify-between text-[11px] font-label-sm text-text-muted mb-1">
                    <span>UNITS SOLD</span>
                    <span className="text-emerald-600 font-mono font-bold">+15.6%</span>
                  </div>
                  <div className="font-headline-lg text-xl font-bold text-primary">28,450</div>
                  <p className="font-body-md text-[10px] text-text-muted mt-1.5">
                    Across 5 categories
                  </p>
                </div>

                <div className="bg-surface border border-border-subtle p-4 shadow-2xs">
                  <div className="flex items-center justify-between text-[11px] font-label-sm text-text-muted mb-1">
                    <span>AVG ORDER VALUE</span>
                    <span className="text-emerald-600 font-mono font-bold">+5.2%</span>
                  </div>
                  <div className="font-headline-lg text-xl font-bold text-primary">$124.32</div>
                  <p className="font-body-md text-[10px] text-text-muted mt-1.5">
                    Basket size: 1.92 units
                  </p>
                </div>

                <div className="bg-surface border border-border-subtle p-4 shadow-2xs">
                  <div className="flex items-center justify-between text-[11px] font-label-sm text-text-muted mb-1">
                    <span>TOTAL CUSTOMERS</span>
                    <span className="text-emerald-600 font-mono font-bold">+22.1%</span>
                  </div>
                  <div className="font-headline-lg text-xl font-bold text-primary">9,410</div>
                  <p className="font-body-md text-[10px] text-text-muted mt-1.5">
                    Active buyers
                  </p>
                </div>

                <div className="bg-surface border border-border-subtle p-4 shadow-2xs">
                  <div className="flex items-center justify-between text-[11px] font-label-sm text-text-muted mb-1">
                    <span>ACTIVE STORES</span>
                    <span className="text-blue-600 font-mono font-bold">100% ONLINE</span>
                  </div>
                  <div className="font-headline-lg text-xl font-bold text-primary">18 Stores</div>
                  <p className="font-body-md text-[10px] text-text-muted mt-1.5">
                    5 Flagships + 13 Hubs
                  </p>
                </div>
              </div>

              {/* Charts Grid: 5 Charts */}
              {/* Row 1: Revenue Trend & Sales by Category */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Chart 1: Revenue Trend */}
                <div className="bg-surface border border-border-subtle p-5 space-y-3 lg:col-span-2">
                  <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
                    <div>
                      <h3 className="font-headline-lg text-sm text-primary font-bold uppercase tracking-wider">
                        Revenue Trend
                      </h3>
                      <p className="font-body-md text-[11px] text-text-muted">
                        Monthly gross revenue vs projected target
                      </p>
                    </div>
                    <div className="flex items-center gap-3 text-xs font-mono">
                      <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-black inline-block"></span> Actual</span>
                      <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-neutral-400 inline-block"></span> Target</span>
                    </div>
                  </div>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={DASHBOARD_REVENUE_TREND}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#eeeeee" />
                        <XAxis dataKey="month" stroke="#666" fontSize={11} />
                        <YAxis stroke="#666" fontSize={11} tickFormatter={(v) => `$${v / 1000}k`} />
                        <Tooltip formatter={(val: number) => [`$${val.toLocaleString()}`, "Revenue"]} contentStyle={{ backgroundColor: "#000", color: "#fff", fontSize: "12px" }} />
                        <Area type="monotone" dataKey="revenue" name="Actual Revenue" stroke="#000" fill="#222" fillOpacity={0.15} strokeWidth={2} />
                        <Area type="monotone" dataKey="target" name="Target Revenue" stroke="#888" fill="#888" fillOpacity={0.05} strokeDasharray="4 4" strokeWidth={1.5} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Chart 2: Sales by Category */}
                <div className="bg-surface border border-border-subtle p-5 space-y-3 lg:col-span-1 flex flex-col justify-between">
                  <div className="pb-3 border-b border-border-subtle">
                    <h3 className="font-headline-lg text-sm text-primary font-bold uppercase tracking-wider">
                      Sales by Category
                    </h3>
                    <p className="font-body-md text-[11px] text-text-muted">
                      Distribution across major product lines
                    </p>
                  </div>
                  <div className="h-44 w-full my-auto">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={SALES_BY_CATEGORY}
                          cx="50%"
                          cy="50%"
                          innerRadius={45}
                          outerRadius={70}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {SALES_BY_CATEGORY.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(val: number) => [`$${val.toLocaleString()}`, "Sales"]} contentStyle={{ backgroundColor: "#000", color: "#fff", fontSize: "12px" }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-1.5 pt-2 border-t border-border-subtle text-xs">
                    {SALES_BY_CATEGORY.map((cat) => (
                      <div key={cat.name} className="flex items-center justify-between text-[11px]">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 inline-block" style={{ backgroundColor: cat.color }} />
                          <span className="font-medium text-primary">{cat.name}</span>
                        </div>
                        <span className="font-mono text-text-muted">${(cat.value / 1000).toFixed(0)}k ({cat.percentage}%)</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Row 2: Top Products, Top Stores, Revenue by Country */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Chart 3: Top Products */}
                <div className="bg-surface border border-border-subtle p-5 space-y-3">
                  <div className="pb-3 border-b border-border-subtle">
                    <h3 className="font-headline-lg text-sm text-primary font-bold uppercase tracking-wider">
                      Top Products
                    </h3>
                    <p className="font-body-md text-[11px] text-text-muted">
                      Highest grossing SKUs this season
                    </p>
                  </div>
                  <div className="h-56 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={TOP_PRODUCTS} layout="vertical" margin={{ left: 10, right: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis type="number" stroke="#666" fontSize={10} tickFormatter={(v) => `$${v / 1000}k`} />
                        <YAxis type="category" dataKey="name" stroke="#333" fontSize={10} width={90} />
                        <Tooltip formatter={(val: number) => [`$${val.toLocaleString()}`, "Revenue"]} contentStyle={{ backgroundColor: "#000", color: "#fff", fontSize: "12px" }} />
                        <Bar dataKey="revenue" fill="#111111" radius={[0, 2, 2, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Chart 4: Top Stores */}
                <div className="bg-surface border border-border-subtle p-5 space-y-3">
                  <div className="pb-3 border-b border-border-subtle">
                    <h3 className="font-headline-lg text-sm text-primary font-bold uppercase tracking-wider">
                      Top Stores
                    </h3>
                    <p className="font-body-md text-[11px] text-text-muted">
                      Highest performing flagship locations
                    </p>
                  </div>
                  <div className="h-56 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={TOP_STORES}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="store" stroke="#666" fontSize={10} />
                        <YAxis stroke="#666" fontSize={10} tickFormatter={(v) => `$${v / 1000}k`} />
                        <Tooltip formatter={(val: number) => [`$${val.toLocaleString()}`, "Revenue"]} contentStyle={{ backgroundColor: "#000", color: "#fff", fontSize: "12px" }} />
                        <Bar dataKey="revenue" fill="#333333" radius={[2, 2, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Chart 5: Revenue by Country */}
                <div className="bg-surface border border-border-subtle p-5 space-y-3">
                  <div className="pb-3 border-b border-border-subtle">
                    <h3 className="font-headline-lg text-sm text-primary font-bold uppercase tracking-wider">
                      Revenue by Country
                    </h3>
                    <p className="font-body-md text-[11px] text-text-muted">
                      Geographic market breakdown
                    </p>
                  </div>
                  <div className="h-56 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={REVENUE_BY_COUNTRY}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="country" stroke="#666" fontSize={10} />
                        <YAxis stroke="#666" fontSize={10} tickFormatter={(v) => `$${v / 1000}k`} />
                        <Tooltip formatter={(val: number) => [`$${val.toLocaleString()}`, "Revenue"]} contentStyle={{ backgroundColor: "#000", color: "#fff", fontSize: "12px" }} />
                        <Bar dataKey="revenue" fill="#666666" radius={[2, 2, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 2: DEMAND FORECASTING */}
          {activeTab === "forecasting" && (() => {
            // Calculate filtered data
            const filteredRows = FORECAST_TABLE_DATA.filter((row) => {
              if (forecastCategory !== "All" && row.category !== forecastCategory) return false;
              if (forecastSubcategory !== "All" && row.subcategory !== forecastSubcategory) return false;
              if (forecastStore !== "All" && row.store !== forecastStore) return false;
              if (forecastCountry !== "All" && row.country !== forecastCountry) return false;
              return true;
            });

            const totalForecastQuantity = filteredRows.reduce((sum, r) => sum + r.quantity, 0);
            const totalExpectedRevenue = filteredRows.reduce((sum, r) => sum + r.lineTotal, 0);

            return (
              <motion.div
                key="tab-forecasting"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border-subtle">
                  <div>
                    <h2 className="font-headline-lg text-xl text-primary font-bold">
                      Neural Demand Forecasting Engine
                    </h2>
                    <p className="font-body-md text-xs text-text-muted">
                      Predictive multi-variate modeling with historical baseline vs AI forecast & confidence bounds.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-text-muted font-mono">Horizon:</span>
                    <button className="bg-primary text-on-primary text-xs px-3 py-1 font-bold">7 Days</button>
                    <button className="bg-surface text-text-muted border border-border-subtle text-xs px-3 py-1 hover:text-primary cursor-pointer">30 Days</button>
                    <button className="bg-surface text-text-muted border border-border-subtle text-xs px-3 py-1 hover:text-primary cursor-pointer">90 Days</button>
                  </div>
                </div>

                {/* Filters Row: Category, Subcategory, Store, Country */}
                <div className="bg-surface border border-border-subtle p-4 space-y-3 shadow-2xs">
                  <div className="flex items-center justify-between pb-2 border-b border-border-subtle">
                    <span className="font-label-sm text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-sm">filter_alt</span>
                      Demand Forecasting Filters
                    </span>
                    {(forecastCategory !== "All" || forecastSubcategory !== "All" || forecastStore !== "All" || forecastCountry !== "All") && (
                      <button
                        onClick={() => {
                          setForecastCategory("All");
                          setForecastSubcategory("All");
                          setForecastStore("All");
                          setForecastCountry("All");
                        }}
                        className="text-[11px] font-mono text-amber-600 hover:underline cursor-pointer"
                      >
                        Reset All Filters
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-body-md">
                    {/* Category Filter */}
                    <div>
                      <label className="block text-[11px] text-text-muted font-medium mb-1">Category</label>
                      <select
                        value={forecastCategory}
                        onChange={(e) => setForecastCategory(e.target.value)}
                        className="w-full bg-surface-paper border border-border-subtle px-3 py-2 rounded-none text-xs text-primary focus:outline-none focus:border-primary cursor-pointer"
                      >
                        <option value="All">All Categories</option>
                        <option value="Outerwear">Outerwear</option>
                        <option value="Footwear">Footwear</option>
                        <option value="Tailored Essentials">Tailored Essentials</option>
                        <option value="Tech Accessories">Tech Accessories</option>
                        <option value="Leather Goods">Leather Goods</option>
                      </select>
                    </div>

                    {/* Subcategory Filter */}
                    <div>
                      <label className="block text-[11px] text-text-muted font-medium mb-1">Subcategory</label>
                      <select
                        value={forecastSubcategory}
                        onChange={(e) => setForecastSubcategory(e.target.value)}
                        className="w-full bg-surface-paper border border-border-subtle px-3 py-2 rounded-none text-xs text-primary focus:outline-none focus:border-primary cursor-pointer"
                      >
                        <option value="All">All Subcategories</option>
                        <option value="Parkas & Jackets">Parkas & Jackets</option>
                        <option value="Boots & Sneakers">Boots & Sneakers</option>
                        <option value="Shirts & Blazers">Shirts & Blazers</option>
                        <option value="Bags & Accessories">Bags & Accessories</option>
                      </select>
                    </div>

                    {/* Store Filter */}
                    <div>
                      <label className="block text-[11px] text-text-muted font-medium mb-1">Store Location</label>
                      <select
                        value={forecastStore}
                        onChange={(e) => setForecastStore(e.target.value)}
                        className="w-full bg-surface-paper border border-border-subtle px-3 py-2 rounded-none text-xs text-primary focus:outline-none focus:border-primary cursor-pointer"
                      >
                        <option value="All">All Stores</option>
                        <option value="Tokyo Ginza Flagship">Tokyo Ginza Flagship</option>
                        <option value="New York Soho">New York Soho</option>
                        <option value="London Mayfair">London Mayfair</option>
                        <option value="Paris Le Marais">Paris Le Marais</option>
                        <option value="Online Store">Online Store</option>
                      </select>
                    </div>

                    {/* Country Filter */}
                    <div>
                      <label className="block text-[11px] text-text-muted font-medium mb-1">Country</label>
                      <select
                        value={forecastCountry}
                        onChange={(e) => setForecastCountry(e.target.value)}
                        className="w-full bg-surface-paper border border-border-subtle px-3 py-2 rounded-none text-xs text-primary focus:outline-none focus:border-primary cursor-pointer"
                      >
                        <option value="All">All Countries</option>
                        <option value="USA">USA</option>
                        <option value="Japan">Japan</option>
                        <option value="Germany">Germany</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="France">France</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Outputs Section: Forecasted Demand, Expected Revenue, Trend Direction, Confidence Score */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-surface border border-border-subtle p-5 shadow-2xs">
                    <div className="flex items-center justify-between text-xs font-label-sm text-text-muted mb-2">
                      <span>FORECASTED DEMAND</span>
                      <span className="material-symbols-outlined text-sm text-primary">inventory</span>
                    </div>
                    <div className="font-headline-lg text-2xl font-bold text-primary">
                      {totalForecastQuantity.toLocaleString()} Units
                    </div>
                    <p className="font-body-md text-[11px] text-text-muted mt-2">
                      Filtered prediction volume
                    </p>
                  </div>

                  <div className="bg-surface border border-border-subtle p-5 shadow-2xs">
                    <div className="flex items-center justify-between text-xs font-label-sm text-text-muted mb-2">
                      <span>EXPECTED REVENUE</span>
                      <span className="material-symbols-outlined text-sm text-emerald-600">payments</span>
                    </div>
                    <div className="font-headline-lg text-2xl font-bold text-primary">
                      ${totalExpectedRevenue.toLocaleString()}
                    </div>
                    <p className="font-body-md text-[11px] text-text-muted mt-2">
                      Gross projected revenue
                    </p>
                  </div>

                  <div className="bg-surface border border-border-subtle p-5 shadow-2xs">
                    <div className="flex items-center justify-between text-xs font-label-sm text-text-muted mb-2">
                      <span>TREND DIRECTION</span>
                      <span className="material-symbols-outlined text-sm text-emerald-500">trending_up</span>
                    </div>
                    <div className="font-headline-lg text-2xl font-bold text-emerald-600 flex items-center gap-1">
                      ↗ +14.8% <span className="text-xs text-text-muted font-normal">(Bullish)</span>
                    </div>
                    <p className="font-body-md text-[11px] text-text-muted mt-2">
                      Category momentum surge
                    </p>
                  </div>

                  <div className="bg-surface border border-border-subtle p-5 shadow-2xs">
                    <div className="flex items-center justify-between text-xs font-label-sm text-text-muted mb-2">
                      <span>CONFIDENCE SCORE</span>
                      <span className="material-symbols-outlined text-sm text-blue-600">verified</span>
                    </div>
                    <div className="font-headline-lg text-2xl font-bold text-primary">
                      96.4%
                    </div>
                    <p className="font-body-md text-[11px] text-text-muted mt-2">
                      High Precision Neural Model
                    </p>
                  </div>
                </div>

                {/* Chart: Historical Sales vs Forecast with Confidence Band */}
                <div className="bg-surface border border-border-subtle p-6 space-y-4 shadow-2xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-border-subtle">
                    <div>
                      <h3 className="font-headline-lg text-sm text-primary font-bold uppercase tracking-wider">
                        Historical Sales vs. AI Forecast & Confidence Band
                      </h3>
                      <p className="font-body-md text-xs text-text-muted">
                        Solid line represents actual historical units; dashed line represents AI forecast with upper/lower confidence bounds.
                      </p>
                    </div>
                    <div className="flex items-center gap-4 text-xs font-mono">
                      <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-blue-600 inline-block"></span> Historical Sales</span>
                      <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-black inline-block"></span> Forecast Demand</span>
                      <span className="flex items-center gap-1.5"><span className="w-3 h-2 bg-emerald-500/30 inline-block"></span> Confidence Band</span>
                    </div>
                  </div>

                  <div className="h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={FORECAST_BAND_DATA}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#eeeeee" />
                        <XAxis dataKey="date" stroke="#666" fontSize={11} />
                        <YAxis stroke="#666" fontSize={11} />
                        <Tooltip contentStyle={{ backgroundColor: "#000", color: "#fff", fontSize: "12px" }} />
                        <Area type="monotone" dataKey="upperBand" stroke="transparent" fill="#10b981" fillOpacity={0.15} name="Upper Confidence" />
                        <Area type="monotone" dataKey="lowerBand" stroke="transparent" fill="#ffffff" fillOpacity={1} name="Lower Confidence" />
                        <Line type="monotone" dataKey="historicalSales" stroke="#2563eb" strokeWidth={2.5} dot={{ r: 4 }} name="Historical Sales" />
                        <Line type="monotone" dataKey="forecastDemand" stroke="#000000" strokeWidth={2.5} strokeDasharray="4 4" dot={{ r: 4 }} name="Forecasted Demand" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Filtered Forecast Table */}
                <div className="bg-surface border border-border-subtle p-6 space-y-4 shadow-2xs">
                  <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
                    <h3 className="font-headline-lg text-sm text-primary font-bold uppercase tracking-wider">
                      Forecast Data Matrix ({filteredRows.length} Line Items)
                    </h3>
                    <span className="text-xs font-mono text-text-muted">
                      Columns: Date, Product, Category, Quantity, Line Total
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead>
                        <tr className="border-b border-border-subtle text-text-muted font-label-sm uppercase bg-surface-paper">
                          <th className="py-3 px-3">Date</th>
                          <th className="py-3 px-3">Product</th>
                          <th className="py-3 px-3">Category</th>
                          <th className="py-3 px-3">Store / Country</th>
                          <th className="py-3 px-3 text-right">Quantity</th>
                          <th className="py-3 px-3 text-right">Line Total</th>
                          <th className="py-3 px-3 text-center">Trend</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border-subtle font-body-md">
                        {filteredRows.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="py-8 text-center text-text-muted font-mono">
                              No forecast items found for selected filter criteria.
                            </td>
                          </tr>
                        ) : (
                          filteredRows.map((row) => (
                            <tr key={row.id} className="hover:bg-neutral-50/80 transition-colors">
                              <td className="py-3 px-3 font-mono text-text-muted">{row.date}</td>
                              <td className="py-3 px-3 font-bold text-primary">{row.product}</td>
                              <td className="py-3 px-3">
                                <span className="px-2 py-0.5 bg-neutral-100 text-neutral-800 font-mono text-[10px] border border-neutral-200">
                                  {row.category}
                                </span>
                              </td>
                              <td className="py-3 px-3 text-text-muted text-[11px]">
                                {row.store} <span className="text-neutral-400">({row.country})</span>
                              </td>
                              <td className="py-3 px-3 text-right font-mono font-bold text-primary">
                                {row.quantity} Units
                              </td>
                              <td className="py-3 px-3 text-right font-mono font-bold text-emerald-600">
                                ${row.lineTotal.toLocaleString()}
                              </td>
                              <td className="py-3 px-3 text-center">
                                <span
                                  className={`inline-block px-2 py-0.5 text-[10px] font-mono font-bold border ${
                                    row.trend === "Up"
                                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                      : row.trend === "Down"
                                      ? "bg-rose-50 text-rose-700 border-rose-200"
                                      : "bg-neutral-50 text-neutral-600 border-neutral-200"
                                  }`}
                                >
                                  {row.trend === "Up" ? "↑ Surge" : row.trend === "Down" ? "↓ Drop" : "→ Stable"}
                                </span>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            );
          })()}

          {/* TAB 3: INVENTORY OPTIMIZATION */}
          {activeTab === "inventory" && (
            <motion.div
              key="tab-inventory"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border-subtle">
                <div>
                  <h2 className="font-headline-lg text-xl text-primary font-bold">
                    Multi-Warehouse Inventory Optimization
                  </h2>
                  <p className="font-body-md text-xs text-text-muted">
                    Automated buffer stock calculations and purchase order generation across regional fulfillment hubs.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-emerald-500 font-mono font-bold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    SYNCED WITH WAREHOUSE API
                  </span>
                </div>
              </div>

              {/* Warehouse Regional Stocks */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-surface border border-border-subtle p-5">
                  <div className="flex items-center justify-between text-xs font-label-sm text-text-muted mb-2">
                    <span>WAREHOUSE ALPHA (TOKYO)</span>
                    <span className="text-emerald-500 font-mono font-bold">88% CAP</span>
                  </div>
                  <div className="font-headline-lg text-xl font-bold text-primary">1,240 Units</div>
                  <p className="font-body-md text-[11px] text-text-muted mt-2">
                    Critical SKUs: <span className="font-mono text-amber-500 font-bold">1 Item</span>
                  </p>
                </div>

                <div className="bg-surface border border-border-subtle p-5">
                  <div className="flex items-center justify-between text-xs font-label-sm text-text-muted mb-2">
                    <span>WAREHOUSE BETA (FRANKFURT)</span>
                    <span className="text-emerald-500 font-mono font-bold">72% CAP</span>
                  </div>
                  <div className="font-headline-lg text-xl font-bold text-primary">2,180 Units</div>
                  <p className="font-body-md text-[11px] text-text-muted mt-2">
                    Critical SKUs: <span className="font-mono text-emerald-500">0 Items</span>
                  </p>
                </div>

                <div className="bg-surface border border-border-subtle p-5">
                  <div className="flex items-center justify-between text-xs font-label-sm text-text-muted mb-2">
                    <span>WAREHOUSE GAMMA (NEW YORK)</span>
                    <span className="text-amber-500 font-mono font-bold">94% CAP</span>
                  </div>
                  <div className="font-headline-lg text-xl font-bold text-primary">1,890 Units</div>
                  <p className="font-body-md text-[11px] text-text-muted mt-2">
                    Critical SKUs: <span className="font-mono text-amber-500 font-bold">2 Items</span>
                  </p>
                </div>
              </div>

              {/* Live Inventory Health & Auto PO Table */}
              <div className="bg-surface border border-border-subtle p-6 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
                  <h3 className="font-headline-lg text-sm text-primary font-bold uppercase tracking-wider">
                    SKU Stock Health & Automated Purchase Orders
                  </h3>
                  <span className="text-xs text-text-muted">
                    Click "Generate PO" to dispatch purchase orders instantly.
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="border-b border-border-subtle text-text-muted font-label-sm uppercase">
                        <th className="py-2">SKU</th>
                        <th className="py-2">Item Name</th>
                        <th className="py-2">Current Stock</th>
                        <th className="py-2">Safety Buffer</th>
                        <th className="py-2">Depletion Horizon</th>
                        <th className="py-2">Status</th>
                        <th className="py-2 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-subtle font-body-md">
                      {SAMPLE_PRODUCTS.map((prod) => {
                        const isLow = prod.stockQty <= 15;
                        return (
                          <tr key={prod.id} className="hover:bg-surface-container-low transition-colors">
                            <td className="py-3 font-mono text-text-muted">{prod.sku}</td>
                            <td className="py-3 font-bold text-primary">{prod.name}</td>
                            <td className="py-3 font-mono font-bold">
                              {prod.stockQty} Units
                            </td>
                            <td className="py-3 font-mono text-text-muted">20 Units</td>
                            <td className="py-3 font-mono text-text-muted">
                              {isLow ? "1-2 Days" : "14-30 Days"}
                            </td>
                            <td className="py-3">
                              {isLow ? (
                                <span className="text-[10px] bg-amber-950 text-amber-300 border border-amber-800 px-2 py-0.5 font-mono font-bold">
                                  REORDER REQ
                                </span>
                              ) : (
                                <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 font-mono">
                                  OPTIMAL
                                </span>
                              )}
                            </td>
                            <td className="py-3 text-right">
                              <button
                                onClick={() => {
                                  setPoModalItem(prod);
                                  setPoSuccess(false);
                                }}
                                className={`px-3 py-1 text-xs font-body-md transition-colors cursor-pointer ${
                                  isLow
                                    ? "bg-black text-white hover:bg-neutral-800 font-bold"
                                    : "bg-surface text-text-muted border border-border-subtle hover:text-primary"
                                }`}
                              >
                                {isLow ? "Auto-Generate PO" : "Manage Stock"}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 4: RECOMMENDATION ANALYTICS */}
          {activeTab === "recommendations" && (
            <motion.div
              key="tab-recommendations"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              {/* Section Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border-subtle">
                <div>
                  <h2 className="font-headline-lg text-xl text-primary font-bold">
                    Recommendation & Personalization Analytics
                  </h2>
                  <p className="font-body-md text-xs text-text-muted">
                    Detailed metrics and graphical affinity models tracking AI Stylist cross-sell performance, bundle co-purchases, and recommendation CTR.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-emerald-600 font-mono font-bold flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 px-3 py-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    RECOMMENDATION ENGINE ONLINE (v2.8)
                  </span>
                </div>
              </div>

              {/* Required Metrics Cards: Top Recommended Products, Recommendation Revenue, Most Purchased Together, Trending Products */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* 1. Top Recommended Products */}
                <div className="bg-surface border border-border-subtle p-5 shadow-2xs">
                  <div className="flex items-center justify-between text-xs font-label-sm text-text-muted mb-2">
                    <span>TOP RECOMMENDED ITEM</span>
                    <span className="material-symbols-outlined text-sm text-primary">auto_awesome</span>
                  </div>
                  <div className="font-headline-lg text-base font-bold text-primary truncate" title="Cartis Trench Parka">
                    Cartis Trench Parka
                  </div>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-border-subtle text-[11px] font-mono">
                    <span className="text-text-muted">CTR: <strong className="text-primary">26.2%</strong></span>
                    <span className="text-emerald-600 font-bold">$184,200 Rev</span>
                  </div>
                </div>

                {/* 2. Recommendation Revenue */}
                <div className="bg-surface border border-border-subtle p-5 shadow-2xs">
                  <div className="flex items-center justify-between text-xs font-label-sm text-text-muted mb-2">
                    <span>RECOMMENDATION REVENUE</span>
                    <span className="text-emerald-600 font-mono font-bold">+28.4%</span>
                  </div>
                  <div className="font-headline-lg text-2xl font-bold text-primary">
                    $482,000
                  </div>
                  <p className="font-body-md text-[11px] text-text-muted mt-2">
                    Represents <strong className="text-primary">26.2%</strong> of gross store revenue
                  </p>
                </div>

                {/* 3. Most Purchased Together */}
                <div className="bg-surface border border-border-subtle p-5 shadow-2xs">
                  <div className="flex items-center justify-between text-xs font-label-sm text-text-muted mb-2">
                    <span>MOST PURCHASED TOGETHER</span>
                    <span className="material-symbols-outlined text-sm text-blue-600">add_shopping_cart</span>
                  </div>
                  <div className="font-headline-lg text-base font-bold text-primary truncate" title="Parka + Leather Boot">
                    Parka + Leather Boot
                  </div>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-border-subtle text-[11px] font-mono">
                    <span className="text-text-muted">Bundles: <strong className="text-primary">480</strong></span>
                    <span className="text-emerald-600 font-bold">$384k Vol</span>
                  </div>
                </div>

                {/* 4. Trending Products */}
                <div className="bg-surface border border-border-subtle p-5 shadow-2xs">
                  <div className="flex items-center justify-between text-xs font-label-sm text-text-muted mb-2">
                    <span>TRENDING IN RECOMMENDATIONS</span>
                    <span className="material-symbols-outlined text-sm text-amber-500">trending_up</span>
                  </div>
                  <div className="font-headline-lg text-base font-bold text-primary truncate" title="Monolith Tech Sunglasses">
                    Monolith Tech Sunglasses
                  </div>
                  <p className="font-body-md text-[11px] text-amber-600 font-bold mt-2">
                    ⚡ +142% Recommendation Velocity
                  </p>
                </div>
              </div>

              {/* Visualization 1: Product Affinity Network */}
              <div className="bg-surface border border-border-subtle p-6 space-y-4 shadow-2xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border-subtle">
                  <div>
                    <h3 className="font-headline-lg text-sm text-primary font-bold uppercase tracking-wider flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm text-primary">hub</span>
                      Product Affinity Network Graph
                    </h3>
                    <p className="font-body-md text-xs text-text-muted">
                      Interactive network mapping co-recommendation affinity scores and bundling connections across catalog nodes.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-[11px] text-text-muted">
                    <span className="w-2.5 h-2.5 bg-black inline-block"></span> High Affinity (&gt;75%)
                    <span className="w-2.5 h-2.5 bg-neutral-400 inline-block ml-2"></span> Moderate Affinity (&gt;50%)
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* SVG Network Graph Canvas */}
                  <div className="lg:col-span-2 bg-surface-paper border border-border-subtle p-4 relative min-h-[300px] flex items-center justify-center overflow-hidden">
                    <svg className="w-full h-72 max-w-xl mx-auto overflow-visible" viewBox="0 0 500 280">
                      {/* Edges */}
                      {PRODUCT_AFFINITY_EDGES.map((edge, idx) => {
                        const srcNode = PRODUCT_AFFINITY_NODES.find((n) => n.id === edge.source);
                        const tgtNode = PRODUCT_AFFINITY_NODES.find((n) => n.id === edge.target);
                        if (!srcNode || !tgtNode) return null;

                        const isSelected = selectedAffinityNode === srcNode.id || selectedAffinityNode === tgtNode.id;

                        return (
                          <g key={idx}>
                            <line
                              x1={srcNode.cx}
                              y1={srcNode.cy}
                              x2={tgtNode.cx}
                              y2={tgtNode.cy}
                              stroke={isSelected ? "#000000" : "#cbd5e1"}
                              strokeWidth={isSelected ? 3 : edge.score * 3.5}
                              strokeDasharray={edge.score < 0.7 ? "4 4" : "none"}
                              className="transition-all duration-300"
                            />
                            {/* Score pill on edge center */}
                            <rect
                              x={(srcNode.cx + tgtNode.cx) / 2 - 16}
                              y={(srcNode.cy + tgtNode.cy) / 2 - 8}
                              width="32"
                              height="16"
                              fill="#ffffff"
                              stroke="#e2e8f0"
                              rx="2"
                            />
                            <text
                              x={(srcNode.cx + tgtNode.cx) / 2}
                              y={(srcNode.cy + tgtNode.cy) / 2 + 4}
                              textAnchor="middle"
                              fontSize="9"
                              fontFamily="monospace"
                              fontWeight="bold"
                              fill={isSelected ? "#000000" : "#64748b"}
                            >
                              {edge.strength}
                            </text>
                          </g>
                        );
                      })}

                      {/* Nodes */}
                      {PRODUCT_AFFINITY_NODES.map((node) => {
                        const isSelected = selectedAffinityNode === node.id;
                        return (
                          <g
                            key={node.id}
                            onClick={() => setSelectedAffinityNode(node.id)}
                            className="cursor-pointer group"
                          >
                            <circle
                              cx={node.cx}
                              cy={node.cy}
                              r={node.r + (isSelected ? 4 : 0)}
                              fill={node.color}
                              stroke={isSelected ? "#10b981" : "#ffffff"}
                              strokeWidth={isSelected ? 4 : 2}
                              className="transition-all duration-200 group-hover:opacity-90"
                            />
                            <text
                              x={node.cx}
                              y={node.cy + node.r + 14}
                              textAnchor="middle"
                              fontSize="10"
                              fontWeight="bold"
                              fill="#1e293b"
                            >
                              {node.name.split(" ")[0]} {node.name.split(" ")[1] || ""}
                            </text>
                            <text
                              x={node.cx}
                              y={node.cy + node.r + 26}
                              textAnchor="middle"
                              fontSize="9"
                              fill="#64748b"
                              fontFamily="monospace"
                            >
                              {node.category}
                            </text>
                          </g>
                        );
                      })}
                    </svg>
                  </div>

                  {/* Selected Affinity Node Details */}
                  <div className="bg-surface-paper border border-border-subtle p-5 space-y-4">
                    <div className="pb-2 border-b border-border-subtle">
                      <span className="text-[10px] font-mono text-text-muted uppercase block">NODE AFFINITY DIAGNOSTIC</span>
                      <h4 className="font-headline-lg text-sm font-bold text-primary">
                        {PRODUCT_AFFINITY_NODES.find((n) => n.id === selectedAffinityNode)?.name || "Cartis Trench Parka"}
                      </h4>
                    </div>

                    <div className="space-y-3 text-xs font-body-md">
                      <div className="p-3 bg-surface border border-border-subtle space-y-1.5">
                        <span className="font-bold text-primary block">Connected Recommendations:</span>
                        {PRODUCT_AFFINITY_EDGES.filter(
                          (e) => e.source === selectedAffinityNode || e.target === selectedAffinityNode
                        ).map((e, i) => {
                          const otherId = e.source === selectedAffinityNode ? e.target : e.source;
                          const otherNode = PRODUCT_AFFINITY_NODES.find((n) => n.id === otherId);
                          return (
                            <div key={i} className="flex items-center justify-between text-[11px]">
                              <span className="text-text-muted">↔ {otherNode?.name}</span>
                              <span className="font-mono font-bold text-emerald-600">{e.strength}</span>
                            </div>
                          );
                        })}
                      </div>

                      <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-1">
                        <span className="font-bold block text-[11px]">AI Bundle Optimization Suggestion:</span>
                        <p className="text-[11px]">
                          Pairing this item in checkout modals yields <strong className="font-bold">+31.4% average order value boost</strong>.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Visualization 2 & Table Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Frequently Bought Together Bundles */}
                <div className="bg-surface border border-border-subtle p-6 space-y-4 shadow-2xs">
                  <div className="pb-3 border-b border-border-subtle">
                    <h3 className="font-headline-lg text-sm text-primary font-bold uppercase tracking-wider flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm">inventory_2</span>
                      Frequently Bought Together Bundles
                    </h3>
                    <p className="font-body-md text-xs text-text-muted">
                      High-co-occurrence bundle recipes recommended by AI Stylist.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {FREQUENTLY_BOUGHT_TOGETHER.map((bundle) => (
                      <div key={bundle.bundleId} className="bg-surface-paper border border-border-subtle p-4 space-y-2">
                        <div className="flex items-center justify-between text-xs font-bold text-primary">
                          <span>{bundle.title}</span>
                          <span className="font-mono text-emerald-600">{bundle.bundlePrice} <span className="line-through text-text-muted font-normal text-[10px]">{bundle.regularPrice}</span></span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {bundle.items.map((item, idx) => (
                            <span key={idx} className="text-[10px] bg-surface border border-border-subtle px-2 py-0.5 font-mono text-text-muted">
                              + {item}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t border-border-subtle text-[11px] font-mono text-text-muted">
                          <span>Co-occurrence: <strong className="text-primary">{bundle.frequency}</strong></span>
                          <span>Conversion: <strong className="text-emerald-600">{bundle.conversionRate}</strong></span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top Recommended Products Matrix */}
                <div className="bg-surface border border-border-subtle p-6 space-y-4 shadow-2xs">
                  <div className="pb-3 border-b border-border-subtle">
                    <h3 className="font-headline-lg text-sm text-primary font-bold uppercase tracking-wider flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm">stars</span>
                      Top Recommended Products Matrix
                    </h3>
                    <p className="font-body-md text-xs text-text-muted">
                      Highest ranking items in AI recommendation queues.
                    </p>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead>
                        <tr className="border-b border-border-subtle text-text-muted font-label-sm uppercase">
                          <th className="py-2">Rank</th>
                          <th className="py-2">Product Name</th>
                          <th className="py-2">CTR</th>
                          <th className="py-2">Conv %</th>
                          <th className="py-2 text-right">Revenue</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border-subtle font-body-md">
                        {TOP_RECOMMENDED_PRODUCTS.map((prod) => (
                          <tr key={prod.rank} className="hover:bg-surface-container-low transition-colors">
                            <td className="py-2.5 font-mono font-bold text-text-muted">#{prod.rank}</td>
                            <td className="py-2.5 font-bold text-primary">{prod.name}</td>
                            <td className="py-2.5 font-mono text-emerald-600 font-bold">{prod.ctr}</td>
                            <td className="py-2.5 font-mono">{prod.conversion}</td>
                            <td className="py-2.5 font-mono font-bold text-right text-primary">{prod.revenue}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Visualizations 3 & 4: Recommendation CTR & Category Preferences */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Visualization 3: Recommendation CTR */}
                <div className="bg-surface border border-border-subtle p-6 space-y-4 shadow-2xs">
                  <div className="pb-3 border-b border-border-subtle">
                    <h3 className="font-headline-lg text-sm text-primary font-bold uppercase tracking-wider">
                      Recommendation CTR Across Placements
                    </h3>
                    <p className="font-body-md text-xs text-text-muted">
                      Weekly click-through rate progression across surfaces.
                    </p>
                  </div>

                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={RECOMMENDATION_CTR_TIMELINE}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                        <XAxis dataKey="period" stroke="#666" fontSize={11} />
                        <YAxis stroke="#666" fontSize={11} tickFormatter={(v) => `${v}%`} />
                        <Tooltip formatter={(val: number) => [`${val}%`, "CTR"]} contentStyle={{ backgroundColor: "#000", color: "#fff", fontSize: "12px" }} />
                        <Legend wrapperStyle={{ fontSize: "11px" }} />
                        <Line type="monotone" dataKey="personalStylist" name="Personal Stylist Widget" stroke="#000000" strokeWidth={2.5} />
                        <Line type="monotone" dataKey="pdpCrossSell" name="PDP Cross-Sell" stroke="#2563eb" strokeWidth={2} />
                        <Line type="monotone" dataKey="cartModal" name="Cart Recommendations" stroke="#10b981" strokeWidth={2} />
                        <Line type="monotone" dataKey="emailRetargeting" name="Email Retargeting" stroke="#888888" strokeWidth={1.5} strokeDasharray="3 3" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Visualization 4: Category Preferences */}
                <div className="bg-surface border border-border-subtle p-6 space-y-4 shadow-2xs">
                  <div className="pb-3 border-b border-border-subtle">
                    <h3 className="font-headline-lg text-sm text-primary font-bold uppercase tracking-wider">
                      Category Preferences by Customer Segment
                    </h3>
                    <p className="font-body-md text-xs text-text-muted">
                      Recommendation affinity scores across target shopper cohorts.
                    </p>
                  </div>

                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={CATEGORY_PREFERENCES_DATA}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                        <XAxis dataKey="category" stroke="#666" fontSize={10} />
                        <YAxis stroke="#666" fontSize={11} tickFormatter={(v) => `${v}%`} />
                        <Tooltip formatter={(val: number) => [`${val}%`, "Affinity Score"]} contentStyle={{ backgroundColor: "#000", color: "#fff", fontSize: "12px" }} />
                        <Legend wrapperStyle={{ fontSize: "11px" }} />
                        <Bar dataKey="vipShoppers" name="VIP Shoppers" fill="#111111" />
                        <Bar dataKey="techwearSegment" name="Techwear Enthusiasts" fill="#3b82f6" />
                        <Bar dataKey="firstTimeShoppers" name="First-Time Buyers" fill="#94a3b8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 5: PRODUCT ANALYTICS */}
          {activeTab === "product-analytics" && (
            <motion.div
              key="tab-product-analytics"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              {/* Section Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border-subtle">
                <div>
                  <h2 className="font-headline-lg text-xl text-primary font-bold">
                    Comprehensive Product Analytics & Catalog Performance
                  </h2>
                  <p className="font-body-md text-xs text-text-muted">
                    SKU-level financial velocity, top 20 rankings, Pareto revenue distribution, market share, and size/color attribute diagnostics.
                  </p>
                </div>
              </div>

              {/* Required KPI Cards: Best Selling Product, Worst Selling Product, Most Profitable Category, Fast Growing Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* 1. Best Selling Product */}
                <div className="bg-surface border border-border-subtle p-5 shadow-2xs">
                  <div className="flex items-center justify-between text-xs font-label-sm text-text-muted mb-2">
                    <span>BEST SELLING PRODUCT</span>
                    <span className="material-symbols-outlined text-sm text-emerald-600">trophy</span>
                  </div>
                  <div className="font-headline-lg text-base font-bold text-primary truncate" title="Cartis Modular Trench Parka">
                    Cartis Trench Parka
                  </div>
                  <div className="mt-2 pt-2 border-t border-border-subtle text-[11px] font-mono flex items-center justify-between">
                    <span className="text-text-muted">800 Units Sold</span>
                    <span className="text-emerald-600 font-bold">$384,000 Rev</span>
                  </div>
                </div>

                {/* 2. Worst Selling Product */}
                <div className="bg-surface border border-border-subtle p-5 shadow-2xs">
                  <div className="flex items-center justify-between text-xs font-label-sm text-text-muted mb-2">
                    <span>WORST SELLING PRODUCT</span>
                    <span className="material-symbols-outlined text-sm text-amber-500">warning</span>
                  </div>
                  <div className="font-headline-lg text-base font-bold text-primary truncate" title="Monolith Tech Sunglasses">
                    Monolith Tech Sunglasses
                  </div>
                  <div className="mt-2 pt-2 border-t border-border-subtle text-[11px] font-mono flex items-center justify-between">
                    <span className="text-text-muted">95 Units Sold</span>
                    <span className="text-amber-600 font-bold">14.2% Return Rate</span>
                  </div>
                </div>

                {/* 3. Most Profitable Category */}
                <div className="bg-surface border border-border-subtle p-5 shadow-2xs">
                  <div className="flex items-center justify-between text-xs font-label-sm text-text-muted mb-2">
                    <span>MOST PROFITABLE CATEGORY</span>
                    <span className="material-symbols-outlined text-sm text-blue-600">pie_chart</span>
                  </div>
                  <div className="font-headline-lg text-base font-bold text-primary truncate">
                    Outerwear
                  </div>
                  <div className="mt-2 pt-2 border-t border-border-subtle text-[11px] font-mono flex items-center justify-between">
                    <span className="text-text-muted">Margin: <strong className="text-primary">72.4%</strong></span>
                    <span className="text-emerald-600 font-bold">$680,000 Rev</span>
                  </div>
                </div>

                {/* 4. Fast Growing Category */}
                <div className="bg-surface border border-border-subtle p-5 shadow-2xs">
                  <div className="flex items-center justify-between text-xs font-label-sm text-text-muted mb-2">
                    <span>FAST GROWING CATEGORY</span>
                    <span className="material-symbols-outlined text-sm text-emerald-500">rocket_launch</span>
                  </div>
                  <div className="font-headline-lg text-base font-bold text-primary truncate">
                    Footwear
                  </div>
                  <div className="mt-2 pt-2 border-t border-border-subtle text-[11px] font-mono flex items-center justify-between">
                    <span className="text-emerald-600 font-bold">+48.2% MoM</span>
                    <span className="text-primary font-bold">$490,000 Rev</span>
                  </div>
                </div>
              </div>

              {/* Required Charts */}
              {/* Chart 1: Top 20 Products */}
              <div className="bg-surface border border-border-subtle p-6 space-y-4 shadow-2xs">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-border-subtle">
                  <div>
                    <h3 className="font-headline-lg text-sm text-primary font-bold uppercase tracking-wider flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm">format_list_bulleted</span>
                      Top 20 Products Leaderboard
                    </h3>
                    <p className="font-body-md text-xs text-text-muted">
                      Ranked catalog items by gross revenue, volume sold, and profit margin.
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Category Filter */}
                    <select
                      value={top20CategoryFilter}
                      onChange={(e) => setTop20CategoryFilter(e.target.value)}
                      className="bg-surface-paper border border-border-subtle text-xs px-3 py-1.5 text-primary focus:outline-none cursor-pointer"
                    >
                      <option value="All">All Categories</option>
                      <option value="Outerwear">Outerwear</option>
                      <option value="Footwear">Footwear</option>
                      <option value="Tailored Essentials">Tailored Essentials</option>
                      <option value="Tech Accessories">Tech Accessories</option>
                      <option value="Leather Goods">Leather Goods</option>
                    </select>

                    {/* Sort Toggle */}
                    <div className="flex items-center gap-1 border border-border-subtle p-0.5 bg-surface-paper">
                      <button
                        onClick={() => setTop20SortBy("revenue")}
                        className={`px-2.5 py-1 text-[11px] font-mono font-bold transition-colors cursor-pointer ${
                          top20SortBy === "revenue" ? "bg-primary text-on-primary" : "text-text-muted hover:text-primary"
                        }`}
                      >
                        By Revenue
                      </button>
                      <button
                        onClick={() => setTop20SortBy("units")}
                        className={`px-2.5 py-1 text-[11px] font-mono font-bold transition-colors cursor-pointer ${
                          top20SortBy === "units" ? "bg-primary text-on-primary" : "text-text-muted hover:text-primary"
                        }`}
                      >
                        By Units
                      </button>
                    </div>
                  </div>
                </div>

                {/* Leaderboard Table with Bar Indicators */}
                <div className="overflow-x-auto max-h-[380px] overflow-y-auto scrollbar-thin">
                  <table className="w-full text-xs text-left">
                    <thead className="sticky top-0 bg-surface border-b border-border-subtle text-text-muted font-label-sm uppercase z-10">
                      <tr>
                        <th className="py-2.5 px-2">Rank</th>
                        <th className="py-2.5 px-2">Product Name</th>
                        <th className="py-2.5 px-2">Category</th>
                        <th className="py-2.5 px-2">Margin</th>
                        <th className="py-2.5 px-2">Growth</th>
                        <th className="py-2.5 px-2">Units</th>
                        <th className="py-2.5 px-2 text-right">Revenue Share Bar</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-subtle font-body-md">
                      {TOP_20_PRODUCTS
                        .filter((p) => top20CategoryFilter === "All" || p.category === top20CategoryFilter)
                        .sort((a, b) => (top20SortBy === "revenue" ? b.revenue - a.revenue : b.units - a.units))
                        .map((prod, idx) => {
                          const maxVal = top20SortBy === "revenue" ? 384000 : 900;
                          const curVal = top20SortBy === "revenue" ? prod.revenue : prod.units;
                          const barWidth = Math.max(8, Math.round((curVal / maxVal) * 100));

                          return (
                            <tr key={prod.sku} className="hover:bg-surface-container-low transition-colors">
                              <td className="py-2 px-2 font-mono font-bold text-text-muted">#{idx + 1}</td>
                              <td className="py-2 px-2 font-bold text-primary">{prod.name}</td>
                              <td className="py-2 px-2 text-text-muted font-mono">{prod.category}</td>
                              <td className="py-2 px-2 font-mono text-emerald-600 font-bold">{prod.margin}</td>
                              <td className="py-2 px-2 font-mono text-emerald-600">{prod.growth}</td>
                              <td className="py-2 px-2 font-mono font-bold">{prod.units.toLocaleString()}</td>
                              <td className="py-2 px-2 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <span className="font-mono text-[11px] font-bold text-primary">
                                    ${prod.revenue.toLocaleString()}
                                  </span>
                                  <div className="w-24 bg-neutral-100 h-2 border border-neutral-200">
                                    <div className="bg-primary h-full" style={{ width: `${barWidth}%` }} />
                                  </div>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Charts 2 & 3: Product Revenue Distribution & Category Market Share */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Chart 2: Product Revenue Distribution (Pareto) */}
                <div className="bg-surface border border-border-subtle p-6 space-y-4 shadow-2xs">
                  <div className="pb-3 border-b border-border-subtle">
                    <h3 className="font-headline-lg text-sm text-primary font-bold uppercase tracking-wider">
                      Product Revenue Distribution (Pareto Curve)
                    </h3>
                    <p className="font-body-md text-xs text-text-muted">
                      Concentration analysis: Top 10% SKUs generate 64% of gross revenue.
                    </p>
                  </div>

                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={PRODUCT_REVENUE_DISTRIBUTION}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                        <XAxis dataKey="tier" stroke="#666" fontSize={10} />
                        <YAxis stroke="#666" fontSize={11} tickFormatter={(v) => `${v}%`} />
                        <Tooltip formatter={(val: number) => [`${val}%`, "Percentage"]} contentStyle={{ backgroundColor: "#000", color: "#fff", fontSize: "12px" }} />
                        <Area type="monotone" dataKey="cumulativePct" name="Cumulative Revenue %" stroke="#000" fill="#222" fillOpacity={0.15} strokeWidth={2} />
                        <Bar dataKey="directSharePct" name="Direct Share %" fill="#10b981" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Chart 3: Category Market Share */}
                <div className="bg-surface border border-border-subtle p-6 space-y-4 shadow-2xs">
                  <div className="pb-3 border-b border-border-subtle">
                    <h3 className="font-headline-lg text-sm text-primary font-bold uppercase tracking-wider">
                      Category Market Share
                    </h3>
                    <p className="font-body-md text-xs text-text-muted">
                      Proportional revenue breakdown across catalog categories.
                    </p>
                  </div>

                  <div className="h-64 w-full flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={SALES_BY_CATEGORY}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={80}
                          paddingAngle={3}
                          dataKey="value"
                          nameKey="name"
                        >
                          {SALES_BY_CATEGORY.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(val: number) => [`$${val.toLocaleString()}`, "Revenue"]} contentStyle={{ backgroundColor: "#000", color: "#fff", fontSize: "12px" }} />
                        <Legend wrapperStyle={{ fontSize: "11px" }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Charts 4 & 5: Size Analysis & Color Analysis */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Chart 4: Size Analysis */}
                <div className="bg-surface border border-border-subtle p-6 space-y-4 shadow-2xs">
                  <div className="pb-3 border-b border-border-subtle">
                    <h3 className="font-headline-lg text-sm text-primary font-bold uppercase tracking-wider">
                      Size Performance & Stockout Analysis
                    </h3>
                    <p className="font-body-md text-xs text-text-muted">
                      Sales volume (Units) vs Stockout Risk Rate (%) across apparel sizes.
                    </p>
                  </div>

                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={SIZE_ANALYSIS_DATA}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                        <XAxis dataKey="size" stroke="#666" fontSize={11} />
                        <YAxis yAxisId="left" stroke="#666" fontSize={11} />
                        <YAxis yAxisId="right" orientation="right" stroke="#10b981" fontSize={11} tickFormatter={(v) => `${v}%`} />
                        <Tooltip contentStyle={{ backgroundColor: "#000", color: "#fff", fontSize: "12px" }} />
                        <Legend wrapperStyle={{ fontSize: "11px" }} />
                        <Bar yAxisId="left" dataKey="salesUnits" name="Units Sold" fill="#111111" />
                        <Bar yAxisId="right" dataKey="stockoutRate" name="Stockout Rate (%)" fill="#10b981" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Chart 5: Color Analysis */}
                <div className="bg-surface border border-border-subtle p-6 space-y-4 shadow-2xs">
                  <div className="pb-3 border-b border-border-subtle">
                    <h3 className="font-headline-lg text-sm text-primary font-bold uppercase tracking-wider">
                      Color Palette Revenue Share
                    </h3>
                    <p className="font-body-md text-xs text-text-muted">
                      Sales distribution across seasonal colorways.
                    </p>
                  </div>

                  <div className="h-48 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={COLOR_ANALYSIS_DATA} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                        <XAxis type="number" stroke="#666" fontSize={10} tickFormatter={(v) => `$${v / 1000}k`} />
                        <YAxis type="category" dataKey="color" stroke="#333" fontSize={10} width={95} />
                        <Tooltip formatter={(val: number) => [`$${val.toLocaleString()}`, "Revenue"]} contentStyle={{ backgroundColor: "#000", color: "#fff", fontSize: "12px" }} />
                        <Bar dataKey="revenue" fill="#333333" radius={[0, 2, 2, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Color Swatch Indicators */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 border-t border-border-subtle text-[11px]">
                    {COLOR_ANALYSIS_DATA.map((col) => (
                      <div key={col.color} className="flex items-center gap-2 p-1.5 bg-surface-paper border border-border-subtle">
                        <span className="w-3.5 h-3.5 rounded-full border border-neutral-300" style={{ backgroundColor: col.hex }} />
                        <div className="truncate">
                          <span className="font-bold text-primary block truncate">{col.color}</span>
                          <span className="font-mono text-[10px] text-text-muted">{col.share}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 7: MONITORING & MODEL HEALTH */}
          {activeTab === "model-health" && (
            <motion.div
              key="tab-model-health"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border-subtle">
                <div>
                  <h2 className="font-headline-lg text-xl text-primary font-bold flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg">health_and_safety</span>
                    ML Model Health & Infrastructure Telemetry
                  </h2>
                  <p className="font-body-md text-xs text-text-muted">
                    Monitor model drift, latency, loss function convergence, and edge compilation status.
                  </p>
                </div>

                <button
                  onClick={handleTriggerRetrain}
                  disabled={isRetraining}
                  className="bg-primary text-on-primary font-body-md text-xs px-4 py-2 font-bold hover:bg-neutral-800 transition-colors disabled:opacity-50 cursor-pointer flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-sm">published_with_changes</span>
                  {isRetraining ? "Retraining Models..." : "Trigger Model Retraining"}
                </button>
              </div>

              {/* Progress Bar during retraining */}
              {isRetraining && (
                <div className="p-4 bg-surface-paper border border-border-subtle space-y-2">
                  <div className="flex justify-between text-xs font-mono font-bold">
                    <span>NEURAL MODEL RE-COMPILATION IN PROGRESS</span>
                    <span>{retrainProgress}%</span>
                  </div>
                  <div className="w-full bg-neutral-200 h-2">
                    <div
                      className="bg-primary h-2 transition-all duration-300"
                      style={{ width: `${retrainProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Model Pipeline Status Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-surface border border-border-subtle p-5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-primary">Demand Predictor v3.4</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  </div>
                  <div className="text-xs font-mono text-text-muted space-y-1">
                    <p>Accuracy: <span className="text-primary font-bold">99.2%</span></p>
                    <p>Drift Score: <span className="text-emerald-500">0.02 (Low)</span></p>
                    <p>Edge Latency: <span className="text-primary">12ms</span></p>
                  </div>
                </div>

                <div className="bg-surface border border-border-subtle p-5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-primary">Personalization v2.1</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  </div>
                  <div className="text-xs font-mono text-text-muted space-y-1">
                    <p>Accuracy: <span className="text-primary font-bold">98.8%</span></p>
                    <p>Drift Score: <span className="text-emerald-500">0.05 (Low)</span></p>
                    <p>Edge Latency: <span className="text-primary">18ms</span></p>
                  </div>
                </div>

                <div className="bg-surface border border-border-subtle p-5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-primary">Neural Fit Predictor</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  </div>
                  <div className="text-xs font-mono text-text-muted space-y-1">
                    <p>Accuracy: <span className="text-primary font-bold">99.6%</span></p>
                    <p>Drift Score: <span className="text-emerald-500">0.01 (Low)</span></p>
                    <p>Edge Latency: <span className="text-primary">8ms</span></p>
                  </div>
                </div>

                <div className="bg-surface border border-border-subtle p-5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-primary">Dynamic Pricing Model</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  </div>
                  <div className="text-xs font-mono text-text-muted space-y-1">
                    <p>Accuracy: <span className="text-primary font-bold">97.4%</span></p>
                    <p>Drift Score: <span className="text-amber-500">0.08 (Moderate)</span></p>
                    <p>Edge Latency: <span className="text-primary">22ms</span></p>
                  </div>
                </div>
              </div>

              {/* Logs Stream */}
              <div className="bg-black text-white p-6 font-mono text-xs border border-neutral-800 space-y-3">
                <div className="flex items-center justify-between text-neutral-400 border-b border-neutral-800 pb-2">
                  <span>ML SYSTEM TELEMETRY LOGS</span>
                  <span>NODE: US-EAST-1 / ASIA-EAST-1</span>
                </div>

                <div className="space-y-1 max-h-48 overflow-y-auto">
                  <p className="text-emerald-400">[02:29:10] Syncing batch embeddings across 12 distributed Edge workers...</p>
                  <p className="text-neutral-300">[02:29:12] Inference Server warm start completed. CPU utilization: 14.2%</p>
                  {retrainLogs.map((log, i) => (
                    <p key={i} className="text-amber-300">
                      {log}
                    </p>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Modal for PO Creation */}
      <AnimatePresence>
        {poModalItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-surface border border-border-subtle w-full max-w-md p-6 shadow-2xl relative"
            >
              <button
                onClick={() => setPoModalItem(null)}
                className="absolute top-4 right-4 text-text-muted hover:text-primary cursor-pointer"
              >
                ✕
              </button>

              <h3 className="font-headline-lg text-lg font-bold text-primary mb-2">
                Automated Restock Purchase Order
              </h3>
              <p className="font-body-md text-xs text-text-muted mb-4">
                Dispatch automated PO to manufacturer for <span className="font-bold text-primary">{poModalItem.name}</span> ({poModalItem.sku}).
              </p>

              {poSuccess ? (
                <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-mono text-center space-y-2">
                  <span className="material-symbols-outlined text-2xl text-emerald-600">check_circle</span>
                  <p className="font-bold">Purchase Order Dispatched!</p>
                  <p className="text-[11px]">PO #PO-99120 confirmed by Supplier Node. ETA: 3 Days.</p>
                  <button
                    onClick={() => setPoModalItem(null)}
                    className="mt-2 bg-emerald-900 text-white px-4 py-1.5 text-xs font-body-md cursor-pointer"
                  >
                    Close Window
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-3 bg-surface-paper border border-border-subtle text-xs font-mono space-y-1">
                    <p>Item: {poModalItem.name}</p>
                    <p>Current Stock: {poModalItem.stockQty} Units</p>
                    <p>Recommended Restock Batch: 50 Units</p>
                    <p>Unit Cost: ${(poModalItem.price * 0.35).toFixed(2)}</p>
                    <p className="font-bold text-primary">Total PO Value: ${(poModalItem.price * 0.35 * 50).toFixed(2)}</p>
                  </div>

                  <button
                    onClick={() => setPoSuccess(true)}
                    className="w-full bg-primary text-on-primary py-3 text-xs font-body-md font-bold hover:bg-neutral-800 transition-colors cursor-pointer"
                  >
                    Confirm & Dispatch Purchase Order
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Standalone ChatGPT-Style AI Copilot Overlay */}
      <AnimatePresence>
        {(isCopilotOpen || activeTab === "copilot") && (
          <CopilotInterface
            onClose={() => {
              setIsCopilotOpen(false);
              if (activeTab === "copilot") {
                setActiveTab("dashboard");
              }
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
