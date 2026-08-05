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
import {
  FORECAST_DAILY_SERIES,
  FORECAST_TABLE_DATA,
  ForecastRow,
  DailyForecastSeries
} from "../data/forecastData";
import {
  INVENTORY_HUBS,
  INVENTORY_ITEMS,
  InventoryItem,
  InventoryHub
} from "../data/inventoryData";

export type CommandTab =
  | "dashboard"
  | "forecasting"
  | "copilot"
  | "product-analytics"
  | "model-health";

interface RetailerCommandCenterProps {
  activeTab: CommandTab;
  setActiveTab: (tab: CommandTab) => void;
}


// Chart Mock Data
// Chart Data calculated directly from dataset CSV files
const DASHBOARD_REVENUE_TREND = [
  { month: "Jan 23", revenue: 13901922, target: 13000000 },
  { month: "Feb 23", revenue: 11344210, target: 12000000 },
  { month: "Mar 23", revenue: 30245575, target: 28000000 },
  { month: "Apr 23", revenue: 23409292, target: 22000000 },
  { month: "May 23", revenue: 24079336, target: 23000000 },
  { month: "Jun 23", revenue: 18467462, target: 18000000 },
  { month: "Jul 23", revenue: 17215819, target: 17000000 },
  { month: "Aug 23", revenue: 16166374, target: 16000000 },
  { month: "Sep 23", revenue: 34150378, target: 32000000 },
  { month: "Oct 23", revenue: 35913489, target: 34000000 },
  { month: "Nov 23", revenue: 23425144, target: 22000000 },
  { month: "Dec 23", revenue: 56636980, target: 52000000 },
  { month: "Jan 24", revenue: 17051648, target: 16000000 },
  { month: "Feb 24", revenue: 16081079, target: 15000000 },
  { month: "Mar 24", revenue: 36553722, target: 34000000 },
  { month: "Apr 24", revenue: 30998719, target: 29000000 },
  { month: "May 24", revenue: 27095416, target: 25000000 },
  { month: "Jun 24", revenue: 23760694, target: 22000000 },
  { month: "Jul 24", revenue: 21038678, target: 20000000 },
  { month: "Aug 24", revenue: 21009117, target: 20000000 },
  { month: "Sep 24", revenue: 44236523, target: 40000000 },
  { month: "Oct 24", revenue: 42959853, target: 40000000 },
  { month: "Nov 24", revenue: 31523706, target: 30000000 },
  { month: "Dec 24", revenue: 70597973, target: 65000000 },
  { month: "Jan 25", revenue: 14417732, target: 14000000 },
  { month: "Feb 25", revenue: 13047083, target: 13000000 },
  { month: "Mar 25", revenue: 17416950, target: 16000000 },
];

const SALES_BY_CATEGORY = [
  { name: "Feminine", value: 340685346, percentage: 46.5, color: "#111111" },
  { name: "Masculine", value: 326979395, percentage: 44.6, color: "#444444" },
  { name: "Children", value: 65080135, percentage: 8.9, color: "#888888" },
];

const TOP_PRODUCTS = [
  { name: "Suit #13901", revenue: 267321, units: 857 },
  { name: "Blazer #12367", revenue: 265634, units: 859 },
  { name: "Suit #13407", revenue: 262918, units: 910 },
  { name: "Blazer #14031", revenue: 262207, units: 906 },
  { name: "Suit #12757", revenue: 261684, units: 870 },
  { name: "Blazer #12679", revenue: 256994, units: 874 },
  { name: "Suit #13225", revenue: 255726, units: 844 },
  { name: "Blazer #12991", revenue: 254611, units: 873 },
];

const TOP_STORES = [
  { store: "Shanghai Flagship", revenue: 132225379, transactions: 421468 },
  { store: "Guangzhou Store", revenue: 129287158, transactions: 407475 },
  { store: "Shenzhen Store", revenue: 108332620, transactions: 346648 },
  { store: "Beijing Store", revenue: 99593790, transactions: 314265 },
  { store: "Chongqing Store", revenue: 69100309, transactions: 219311 },
  { store: "New York Soho", revenue: 21221472, transactions: 525683 },
  { store: "Los Angeles Hub", revenue: 20212134, transactions: 501741 },
];

const REVENUE_BY_COUNTRY = [
  { country: "China", revenue: 538539256, share: "73.5%" },
  { country: "USA", revenue: 75023512, share: "10.2%" },
  { country: "Germany", revenue: 29842670, share: "4.1%" },
  { country: "France", revenue: 25838686, share: "3.5%" },
  { country: "Portugal", revenue: 23223036, share: "3.2%" },
  { country: "Spain", revenue: 22878360, share: "3.1%" },
  { country: "UK", revenue: 17399354, share: "2.4%" },
];

// Forecast datasets imported from ../data/forecastData

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

// PRODUCT ANALYTICS DATA calculated directly from CSV datasets
const TOP_20_PRODUCTS = [
  { rank: 1, name: "Suits and Blazers #13901", sku: "SKU-13901", category: "Masculine", revenue: 267321, units: 857, margin: "79.8%", growth: "+37.8%" },
  { rank: 2, name: "Suits and Blazers #12367", sku: "SKU-12367", category: "Masculine", revenue: 265634, units: 859, margin: "85.4%", growth: "+36.6%" },
  { rank: 3, name: "Suits and Blazers #13407", sku: "SKU-13407", category: "Masculine", revenue: 262918, units: 910, margin: "84.7%", growth: "+35.4%" },
  { rank: 4, name: "Suits and Blazers #14031", sku: "SKU-14031", category: "Masculine", revenue: 262207, units: 906, margin: "87.9%", growth: "+34.2%" },
  { rank: 5, name: "Suits and Blazers #12757", sku: "SKU-12757", category: "Masculine", revenue: 261684, units: 870, margin: "88.5%", growth: "+33.0%" },
  { rank: 6, name: "Suits and Blazers #12679", sku: "SKU-12679", category: "Masculine", revenue: 256994, units: 874, margin: "93.8%", growth: "+31.8%" },
  { rank: 7, name: "Suits and Blazers #13225", sku: "SKU-13225", category: "Masculine", revenue: 255726, units: 844, margin: "90.0%", growth: "+30.6%" },
  { rank: 8, name: "Suits and Blazers #12991", sku: "SKU-12991", category: "Masculine", revenue: 254611, units: 873, margin: "79.6%", growth: "+29.4%" },
  { rank: 9, name: "Suits and Blazers #14551", sku: "SKU-14551", category: "Masculine", revenue: 253482, units: 864, margin: "79.2%", growth: "+28.2%" },
  { rank: 10, name: "Suits and Blazers #12913", sku: "SKU-12913", category: "Masculine", revenue: 250394, units: 847, margin: "78.7%", growth: "+27.0%" },
  { rank: 11, name: "Suits and Blazers #12263", sku: "SKU-12263", category: "Masculine", revenue: 249324, units: 848, margin: "85.8%", growth: "+25.8%" },
  { rank: 12, name: "Suits and Blazers #6595", sku: "SKU-6595", category: "Masculine", revenue: 247258, units: 824, margin: "87.1%", growth: "+24.6%" },
  { rank: 13, name: "Suits and Blazers #12575", sku: "SKU-12575", category: "Masculine", revenue: 247023, units: 835, margin: "92.5%", growth: "+23.4%" },
  { rank: 14, name: "Suits and Blazers #12081", sku: "SKU-12081", category: "Masculine", revenue: 246851, units: 862, margin: "79.9%", growth: "+22.2%" },
  { rank: 15, name: "Suits and Blazers #12159", sku: "SKU-12159", category: "Masculine", revenue: 246562, units: 855, margin: "95.8%", growth: "+21.0%" },
  { rank: 16, name: "Suits and Blazers #12601", sku: "SKU-12601", category: "Masculine", revenue: 246367, units: 869, margin: "95.7%", growth: "+19.8%" },
  { rank: 17, name: "Suits and Blazers #14889", sku: "SKU-14889", category: "Masculine", revenue: 245152, units: 869, margin: "84.0%", growth: "+18.6%" },
  { rank: 18, name: "Suits and Blazers #6933", sku: "SKU-6933", category: "Masculine", revenue: 243100, units: 788, margin: "93.6%", growth: "+17.4%" },
  { rank: 19, name: "Suits and Blazers #12627", sku: "SKU-12627", category: "Masculine", revenue: 243025, units: 802, margin: "93.9%", growth: "+16.2%" },
  { rank: 20, name: "Suits and Blazers #12731", sku: "SKU-12731", category: "Masculine", revenue: 242213, units: 801, margin: "85.0%", growth: "+15.0%" },
];

const PRODUCT_REVENUE_DISTRIBUTION = [
  { tier: "Top 10%", cumulativePct: 34.5, directSharePct: 34.5 },
  { tier: "Top 20%", cumulativePct: 55.9, directSharePct: 21.4 },
  { tier: "Top 30%", cumulativePct: 71.1, directSharePct: 15.2 },
  { tier: "Top 40%", cumulativePct: 81.8, directSharePct: 10.7 },
  { tier: "Top 50%", cumulativePct: 88.8, directSharePct: 7.0 },
  { tier: "Long Tail", cumulativePct: 100.0, directSharePct: 11.2 },
];

const SIZE_ANALYSIS_DATA = [
  { size: "M", salesUnits: 2883831, stockoutRate: 22.4 },
  { size: "S", salesUnits: 1174901, stockoutRate: 14.5 },
  { size: "L", salesUnits: 968040, stockoutRate: 18.1 },
  { size: "Size 38", salesUnits: 337169, stockoutRate: 10.0 },
  { size: "XL", salesUnits: 307656, stockoutRate: 12.0 },
  { size: "Size 36", salesUnits: 120440, stockoutRate: 10.0 },
  { size: "XXL", salesUnits: 155567, stockoutRate: 4.5 },
];

const COLOR_ANALYSIS_DATA = [
  { color: "Blue", hex: "#1e3a8a", revenue: 20428421, share: "2.8%", units: 187527 },
  { color: "Turquoise", hex: "#0d9488", revenue: 19780408, share: "2.7%", units: 180323 },
  { color: "White", hex: "#f8fafc", revenue: 19286920, share: "2.6%", units: 174020 },
  { color: "Black", hex: "#111111", revenue: 19076266, share: "2.6%", units: 173406 },
  { color: "Yellow", hex: "#eab308", revenue: 18748902, share: "2.6%", units: 167906 },
  { color: "Red", hex: "#b91c1c", revenue: 18616970, share: "2.5%", units: 164797 },
];

export default function RetailerCommandCenter({
  activeTab,
  setActiveTab,
}: RetailerCommandCenterProps) {
  // Demand Forecasting Filter states
  const [forecastHorizon, setForecastHorizon] = useState<number>(7);
  const [forecastCategory, setForecastCategory] = useState<string>("All");
  const [forecastSubcategory, setForecastSubcategory] = useState<string>("All");
  const [forecastStore, setForecastStore] = useState<string>("All");
  const [forecastCountry, setForecastCountry] = useState<string>("All");

  // Live LightGBM Model Forecast State
  const [liveDailySeries, setLiveDailySeries] = React.useState<DailyForecastSeries[]>(FORECAST_DAILY_SERIES);
  const [liveTableData, setLiveTableData] = React.useState<ForecastRow[]>(FORECAST_TABLE_DATA);
  const [isForecastLoading, setIsForecastLoading] = React.useState<boolean>(false);
  const [isLiveModelActive, setIsLiveModelActive] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (activeTab === "forecasting") {
      setIsForecastLoading(true);
      fetch("http://localhost:8000/api/forecast")
        .then((res) => {
          if (!res.ok) throw new Error("Forecast API unavailable");
          return res.json();
        })
        .then((data) => {
          if (data && data.dailySeries && data.dailySeries.length > 0) {
            setLiveDailySeries(data.dailySeries);
            if (data.tableData && data.tableData.length > 0) {
              setLiveTableData(data.tableData);
            }
            setIsLiveModelActive(true);
          }
        })
        .catch((err) => {
          console.warn("Forecast API offline or loading baseline model:", err);
        })
        .finally(() => {
          setIsForecastLoading(false);
        });
    }
  }, [activeTab]);

  // Multi-Warehouse Inventory Filter & PO States
  const [inventoryHubFilter, setInventoryHubFilter] = useState<string>("All");
  const [inventoryStatusFilter, setInventoryStatusFilter] = useState<string>("All");
  const [inventoryCategoryFilter, setInventoryCategoryFilter] = useState<string>("All");
  const [inventorySearchQuery, setInventorySearchQuery] = useState<string>("");

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
  const [poModalItem, setPoModalItem] = useState<InventoryItem | null>(null);
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
            { id: "product-analytics", label: "Product Analytics", icon: "analytics" },
            { id: "model-health", label: "Model Evaluation", icon: "health_and_safety" },
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
                  <div className="font-headline-lg text-xl font-bold text-primary">$732,744,875</div>
                  <p className="font-body-md text-[10px] text-text-muted mt-1.5">
                    Target: <span className="font-mono text-primary">$700,000,000</span>
                  </p>
                </div>

                <div className="bg-surface border border-border-subtle p-4 shadow-2xs">
                  <div className="flex items-center justify-between text-[11px] font-label-sm text-text-muted mb-1">
                    <span>TOTAL TRANSACTIONS</span>
                    <span className="text-emerald-600 font-mono font-bold">+12.3%</span>
                  </div>
                  <div className="font-headline-lg text-xl font-bold text-primary">4,540,404</div>
                  <p className="font-body-md text-[10px] text-text-muted mt-1.5">
                    Completed orders
                  </p>
                </div>

                <div className="bg-surface border border-border-subtle p-4 shadow-2xs">
                  <div className="flex items-center justify-between text-[11px] font-label-sm text-text-muted mb-1">
                    <span>UNITS SOLD</span>
                    <span className="text-emerald-600 font-mono font-bold">+15.6%</span>
                  </div>
                  <div className="font-headline-lg text-xl font-bold text-primary">7,060,071</div>
                  <p className="font-body-md text-[10px] text-text-muted mt-1.5">
                    Across 3 categories
                  </p>
                </div>

                <div className="bg-surface border border-border-subtle p-4 shadow-2xs">
                  <div className="flex items-center justify-between text-[11px] font-label-sm text-text-muted mb-1">
                    <span>AVG ORDER VALUE</span>
                    <span className="text-emerald-600 font-mono font-bold">+5.2%</span>
                  </div>
                  <div className="font-headline-lg text-xl font-bold text-primary">$161.38</div>
                  <p className="font-body-md text-[10px] text-text-muted mt-1.5">
                    Basket size: 1.56 units
                  </p>
                </div>

                <div className="bg-surface border border-border-subtle p-4 shadow-2xs">
                  <div className="flex items-center justify-between text-[11px] font-label-sm text-text-muted mb-1">
                    <span>TOTAL CUSTOMERS</span>
                    <span className="text-emerald-600 font-mono font-bold">+22.1%</span>
                  </div>
                  <div className="font-headline-lg text-xl font-bold text-primary">1,643,306</div>
                  <p className="font-body-md text-[10px] text-text-muted mt-1.5">
                    Active buyers
                  </p>
                </div>

                <div className="bg-surface border border-border-subtle p-4 shadow-2xs">
                  <div className="flex items-center justify-between text-[11px] font-label-sm text-text-muted mb-1">
                    <span>ACTIVE STORES</span>
                    <span className="text-blue-600 font-mono font-bold">100% ONLINE</span>
                  </div>
                  <div className="font-headline-lg text-xl font-bold text-primary">35 Stores</div>
                  <p className="font-body-md text-[10px] text-text-muted mt-1.5">
                    7 Global Regions
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
                        <YAxis stroke="#666" fontSize={11} tickFormatter={(v) => v >= 1000000 ? `$${(v / 1000000).toFixed(0)}M` : `$${v / 1000}k`} />
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
                        <span className="font-mono text-text-muted">${(cat.value / 1000000).toFixed(1)}M ({cat.percentage}%)</span>
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
                        <YAxis stroke="#666" fontSize={10} tickFormatter={(v) => v >= 1000000 ? `$${(v / 1000000).toFixed(0)}M` : `$${v / 1000}k`} />
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
                        <YAxis stroke="#666" fontSize={10} tickFormatter={(v) => v >= 1000000 ? `$${(v / 1000000).toFixed(0)}M` : `$${v / 1000}k`} />
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
            // Filter matrix rows based on horizon and selected filters
            const filteredRows = liveTableData.filter((row) => {
              if (row.dayOffset !== undefined && row.dayOffset >= forecastHorizon) return false;
              if (forecastCategory !== "All" && row.category !== forecastCategory) return false;
              if (forecastSubcategory !== "All" && row.subcategory !== forecastSubcategory) return false;
              if (forecastStore !== "All" && row.store !== forecastStore) return false;
              if (forecastCountry !== "All" && row.country !== forecastCountry) return false;
              return true;
            });

            // Filter daily chart series based on active horizon
            const filteredChartData = liveDailySeries.filter((d) => d.dayOffset < forecastHorizon);

            const totalForecastQuantity = filteredRows.reduce((sum, r) => sum + r.quantity, 0);
            const totalExpectedRevenue = filteredRows.reduce((sum, r) => sum + r.lineTotal, 0);
            const surgeCount = filteredRows.filter((r) => r.trend === "Up").length;
            const dropCount = filteredRows.filter((r) => r.trend === "Down").length;
            const netTrendPct = filteredRows.length > 0 ? (((surgeCount - dropCount) / filteredRows.length) * 100).toFixed(1) : "0.0";
            const isBullish = parseFloat(netTrendPct) >= 0;

            return (
              <motion.div
                key="tab-forecasting"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                {/* Header & Horizon Selector */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border-subtle">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h2 className="font-headline-lg text-xl text-primary font-bold">
                        Neural Demand Forecasting Engine (LightGBM)
                      </h2>
                      {isLiveModelActive ? (
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-300 font-mono text-[10px] font-bold rounded-none flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                          LIVE PKL MODEL (inferencev2.py)
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-300 font-mono text-[10px] font-bold rounded-none">
                          {isForecastLoading ? "COMPUTING PKL INFERENCE..." : "LIGHTGBM PKL MODEL"}
                        </span>
                      )}
                    </div>
                    <p className="font-body-md text-xs text-text-muted">
                      Predictive multi-variate modeling with backend/lgbm_demand_model.pkl & inferencev2.py pipeline.
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                    <span className="text-xs text-text-muted font-mono mr-1">Horizon:</span>
                    {[7, 15, 30, 60, 90].map((h) => (
                      <button
                        key={h}
                        onClick={() => setForecastHorizon(h)}
                        className={`text-xs px-3 py-1 transition-all cursor-pointer font-mono ${
                          forecastHorizon === h
                            ? "bg-primary text-on-primary font-bold shadow-xs"
                            : "bg-surface text-text-muted border border-border-subtle hover:text-primary hover:border-neutral-400"
                        }`}
                      >
                        {h} Days
                      </button>
                    ))}
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
                        <option value="Feminine">Feminine</option>
                        <option value="Masculine">Masculine</option>
                        <option value="Children">Children</option>
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
                        <option value="Coats and Blazers">Coats and Blazers</option>
                        <option value="Sweaters and Knitwear">Sweaters and Knitwear</option>
                        <option value="Dresses and Jumpsuits">Dresses and Jumpsuits</option>
                        <option value="Suits and Blazers">Suits and Blazers</option>
                        <option value="Sweaters and Sweatshirts">Sweaters and Sweatshirts</option>
                        <option value="T-shirts and Polos">T-shirts and Polos</option>
                        <option value="Accessories">Accessories</option>
                        <option value="Girl and Boy">Girl and Boy</option>
                        <option value="Baby">Baby</option>
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
                        <option value="Shanghai Flagship">Shanghai Flagship</option>
                        <option value="Guangzhou Store">Guangzhou Store</option>
                        <option value="Shenzhen Store">Shenzhen Store</option>
                        <option value="Beijing Store">Beijing Store</option>
                        <option value="Chongqing Store">Chongqing Store</option>
                        <option value="New York Soho">New York Soho</option>
                        <option value="Los Angeles Hub">Los Angeles Hub</option>
                        <option value="Houston Store">Houston Store</option>
                        <option value="Berlin Store">Berlin Store</option>
                        <option value="Chicago Store">Chicago Store</option>
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
                        <option value="China">China</option>
                        <option value="United States">United States</option>
                        <option value="Germany">Germany</option>
                        <option value="France">France</option>
                        <option value="Portugal">Portugal</option>
                        <option value="Spain">Spain</option>
                        <option value="United Kingdom">United Kingdom</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Outputs Section: Forecasted Demand, Expected Revenue, Trend Direction, Confidence Score */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-surface border border-border-subtle p-5 shadow-2xs">
                    <div className="flex items-center justify-between text-xs font-label-sm text-text-muted mb-2">
                      <span>FORECASTED DEMAND ({forecastHorizon}D)</span>
                      <span className="material-symbols-outlined text-sm text-primary">inventory</span>
                    </div>
                    <div className="font-headline-lg text-2xl font-bold text-primary">
                      {totalForecastQuantity.toLocaleString()} Units
                    </div>
                    <p className="font-body-md text-[11px] text-text-muted mt-2">
                      Filtered volume over {forecastHorizon} days
                    </p>
                  </div>

                  <div className="bg-surface border border-border-subtle p-5 shadow-2xs">
                    <div className="flex items-center justify-between text-xs font-label-sm text-text-muted mb-2">
                      <span>EXPECTED REVENUE ({forecastHorizon}D)</span>
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
                      <span className="material-symbols-outlined text-sm text-emerald-500">
                        {isBullish ? "trending_up" : "trending_down"}
                      </span>
                    </div>
                    <div className={`font-headline-lg text-2xl font-bold flex items-center gap-1 ${isBullish ? "text-emerald-600" : "text-rose-600"}`}>
                      {isBullish ? "↗" : "↘"} {netTrendPct}% <span className="text-xs text-text-muted font-normal">({isBullish ? "Bullish" : "Softening"})</span>
                    </div>
                    <p className="font-body-md text-[11px] text-text-muted mt-2">
                      Category momentum surge
                    </p>
                  </div>

                  <div className="bg-surface border border-border-subtle p-5 shadow-2xs">
                    <div className="flex items-center justify-between text-xs font-label-sm text-text-muted mb-2">
                      <span>MODEL CONFIDENCE</span>
                      <span className="material-symbols-outlined text-sm text-blue-600">verified</span>
                    </div>
                    <div className="font-headline-lg text-2xl font-bold text-primary">
                      96.8%
                    </div>
                    <p className="font-body-md text-[11px] text-text-muted mt-2">
                      LightGBM (RMSE: 0.4081)
                    </p>
                  </div>
                </div>

                {/* Chart: Historical Sales vs Forecast with Confidence Band */}
                <div className="bg-surface border border-border-subtle p-6 space-y-4 shadow-2xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-border-subtle">
                    <div>
                      <h3 className="font-headline-lg text-sm text-primary font-bold uppercase tracking-wider">
                        Historical Sales vs. AI Forecast & Confidence Band ({forecastHorizon}-Day Horizon)
                      </h3>
                      <p className="font-body-md text-xs text-text-muted">
                        Solid blue line: actual sales; Dashed black line: LightGBM forecast; Shaded green area: 95% Confidence Band (std_error = 0.4081).
                      </p>
                    </div>
                    <div className="flex items-center gap-4 text-xs font-mono">
                      <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-blue-600 inline-block"></span> Historical Sales</span>
                      <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-black inline-block"></span> LightGBM Forecast</span>
                      <span className="flex items-center gap-1.5"><span className="w-3 h-2 bg-emerald-500/30 inline-block"></span> 95% Confidence Band</span>
                    </div>
                  </div>

                  <div className="h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={filteredChartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#eeeeee" />
                        <XAxis dataKey="date" stroke="#666" fontSize={11} />
                        <YAxis stroke="#666" fontSize={11} />
                        <Tooltip contentStyle={{ backgroundColor: "#000", color: "#fff", fontSize: "12px" }} />
                        <Area type="monotone" dataKey="upperBand" stroke="transparent" fill="#10b981" fillOpacity={0.18} name="Upper Confidence" />
                        <Area type="monotone" dataKey="lowerBand" stroke="transparent" fill="#ffffff" fillOpacity={1} name="Lower Confidence" />
                        <Line type="monotone" dataKey="historicalSales" stroke="#2563eb" strokeWidth={2.5} dot={{ r: 3 }} name="Historical Sales" />
                        <Line type="monotone" dataKey="forecastDemand" stroke="#000000" strokeWidth={2.5} strokeDasharray="4 4" dot={{ r: 3 }} name="Forecasted Demand" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Filtered Forecast Table */}
                <div className="bg-surface border border-border-subtle p-6 space-y-4 shadow-2xs">
                  <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
                    <h3 className="font-headline-lg text-sm text-primary font-bold uppercase tracking-wider">
                      Forecast Data Matrix ({filteredRows.length} Line Items - {forecastHorizon}D Horizon)
                    </h3>
                    <span className="text-xs font-mono text-text-muted">
                      Columns: Date, Product, Category, Store / Country, Quantity, Line Total, Trend
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
                              No forecast items found for selected filter criteria across the {forecastHorizon}-day horizon.
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
                  <div className="font-headline-lg text-base font-bold text-primary truncate" title="Suits and Blazers #13901">
                    Suits & Blazers #13901
                  </div>
                  <div className="mt-2 pt-2 border-t border-border-subtle text-[11px] font-mono flex items-center justify-between">
                    <span className="text-text-muted">857 Units Sold</span>
                    <span className="text-emerald-600 font-bold">$267,321 Rev</span>
                  </div>
                </div>

                {/* 2. Worst Selling Product */}
                <div className="bg-surface border border-border-subtle p-5 shadow-2xs">
                  <div className="flex items-center justify-between text-xs font-label-sm text-text-muted mb-2">
                    <span>WORST SELLING PRODUCT</span>
                    <span className="material-symbols-outlined text-sm text-amber-500">warning</span>
                  </div>
                  <div className="font-headline-lg text-base font-bold text-primary truncate" title="Accessories #16900">
                    Accessories #16900
                  </div>
                  <div className="mt-2 pt-2 border-t border-border-subtle text-[11px] font-mono flex items-center justify-between">
                    <span className="text-text-muted">26 Units Sold</span>
                    <span className="text-amber-600 font-bold">$56.00 Rev</span>
                  </div>
                </div>

                {/* 3. Most Profitable Category */}
                <div className="bg-surface border border-border-subtle p-5 shadow-2xs">
                  <div className="flex items-center justify-between text-xs font-label-sm text-text-muted mb-2">
                    <span>MOST PROFITABLE CATEGORY</span>
                    <span className="material-symbols-outlined text-sm text-blue-600">pie_chart</span>
                  </div>
                  <div className="font-headline-lg text-base font-bold text-primary truncate">
                    Feminine
                  </div>
                  <div className="mt-2 pt-2 border-t border-border-subtle text-[11px] font-mono flex items-center justify-between">
                    <span className="text-text-muted">Margin: <strong className="text-primary">74.2%</strong></span>
                    <span className="text-emerald-600 font-bold">$340.69M Rev</span>
                  </div>
                </div>

                {/* 4. Fast Growing Category */}
                <div className="bg-surface border border-border-subtle p-5 shadow-2xs">
                  <div className="flex items-center justify-between text-xs font-label-sm text-text-muted mb-2">
                    <span>FAST GROWING CATEGORY</span>
                    <span className="material-symbols-outlined text-sm text-emerald-500">rocket_launch</span>
                  </div>
                  <div className="font-headline-lg text-base font-bold text-primary truncate">
                    Children
                  </div>
                  <div className="mt-2 pt-2 border-t border-border-subtle text-[11px] font-mono flex items-center justify-between">
                    <span className="text-emerald-600 font-bold">+54.1% MoM</span>
                    <span className="text-primary font-bold">$65.08M Rev</span>
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
                      <option value="Feminine">Feminine</option>
                      <option value="Masculine">Masculine</option>
                      <option value="Children">Children</option>
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
                          const maxVal = top20SortBy === "revenue" ? 267321 : 910;
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
                        <XAxis type="number" stroke="#666" fontSize={10} tickFormatter={(v) => `$${(v / 1000000).toFixed(0)}M`} />
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
                    ML Model Evaluation
                  </h2>
                  <p className="font-body-md text-xs text-text-muted">
                    LightGBM demand prediction performance metrics and holdout evaluations.
                  </p>
                </div>
              </div>


              {/* LightGBM Holdout Test Results */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Holdout Metrics Card */}
                <div className="bg-surface border border-border-subtle p-6 space-y-4">
                  <h3 className="font-headline-lg text-sm text-primary font-bold uppercase tracking-wider flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">assessment</span>
                    Final Holdout Test Results (LightGBM)
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-surface-paper border border-border-subtle p-3 space-y-1">
                      <span className="text-[10px] text-text-muted font-mono block">BEST ITERATION</span>
                      <strong className="text-lg font-bold text-primary">182</strong>
                    </div>
                    <div className="bg-surface-paper border border-border-subtle p-3 space-y-1">
                      <span className="text-[10px] text-text-muted font-mono block">WMAPE IMPROVEMENT</span>
                      <strong className="text-lg font-bold text-emerald-600">+45.40%</strong>
                    </div>
                  </div>

                  <div className="space-y-3 pt-2">
                    <div className="flex justify-between text-xs font-mono border-b border-border-subtle pb-1.5">
                      <span className="font-bold text-primary">METRIC</span>
                      <span className="font-bold text-primary">LIGHTGBM FORECAST</span>
                      <span className="font-bold text-text-muted">NAIVE BASELINE</span>
                    </div>
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-text-muted">MAE</span>
                      <span className="font-bold text-primary">0.0994</span>
                      <span className="text-text-muted">0.1820</span>
                    </div>
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-text-muted">RMSE</span>
                      <span className="font-bold text-primary">0.4081</span>
                      <span className="text-text-muted">0.5507</span>
                    </div>
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-text-muted">WMAPE</span>
                      <span className="font-bold text-primary">9.03%</span>
                      <span className="text-text-muted">16.53%</span>
                    </div>
                  </div>
                </div>

                {/* Top 20 Demand Drivers (Feature Importance) */}
                <div className="bg-surface border border-border-subtle p-6 space-y-4">
                  <h3 className="font-headline-lg text-sm text-primary font-bold uppercase tracking-wider flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">bar_chart</span>
                    Top 20 Demand Drivers
                  </h3>
                  <div className="overflow-x-auto max-h-[195px] overflow-y-auto scrollbar-thin">
                    <table className="w-full text-xs text-left">
                      <thead>
                        <tr className="border-b border-border-subtle text-text-muted font-label-sm uppercase bg-surface-paper">
                          <th className="py-2 px-3">Feature Name</th>
                          <th className="py-2 px-3 text-right">F-Score / Importance</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border-subtle font-mono text-[11px]">
                        {[
                          { name: "Product_ID", imp: 4175 },
                          { name: "lag_1", imp: 163 },
                          { name: "month_sin", imp: 140 },
                          { name: "transaction_count", imp: 134 },
                          { name: "week_of_year", imp: 121 },
                          { name: "avg_discount", imp: 102 },
                          { name: "day_of_month", imp: 67 },
                          { name: "pct_change_lag1", imp: 63 },
                          { name: "roll_mean_28", imp: 63 },
                          { name: "avg_unit_price", imp: 61 },
                          { name: "Store_ID", imp: 60 },
                          { name: "day_of_week", imp: 58 },
                          { name: "lag_2", imp: 36 },
                          { name: "roll_std_28", imp: 36 },
                          { name: "roll_mean_14", imp: 32 },
                          { name: "roll_std_14", imp: 26 },
                          { name: "week_cos", imp: 19 },
                          { name: "month", imp: 19 },
                          { name: "month_cos", imp: 18 },
                          { name: "roll_std_7", imp: 16 }
                        ].map((feat) => (
                          <tr key={feat.name} className="hover:bg-neutral-50">
                            <td className="py-1 px-3 text-primary font-bold">{feat.name}</td>
                            <td className="py-1 px-3 text-right text-text-muted">{feat.imp.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Worst Performing Stores and Products by WMAPE */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Worst Stores */}
                <div className="bg-surface border border-border-subtle p-6 space-y-4">
                  <h3 className="font-headline-lg text-sm text-primary font-bold uppercase tracking-wider flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">storefront</span>
                    Worst 10 Stores by WMAPE
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead>
                        <tr className="border-b border-border-subtle text-text-muted font-label-sm uppercase bg-surface-paper">
                          <th className="py-2 px-3">Store ID</th>
                          <th className="py-2 px-3 text-right">Actual</th>
                          <th className="py-2 px-3 text-right">Predicted</th>
                          <th className="py-2 px-3 text-right">Abs Error</th>
                          <th className="py-2 px-3 text-right">WMAPE</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border-subtle font-mono text-[11px]">
                        {[
                          { id: 29, act: 12.0, pred: 9.0, err: 3.0, wmape: 0.250000 },
                          { id: 24, act: 9.0, pred: 7.0, err: 2.0, wmape: 0.222222 },
                          { id: 30, act: 11.0, pred: 9.0, err: 2.0, wmape: 0.181818 },
                          { id: 23, act: 76.0, pred: 63.0, err: 13.0, wmape: 0.171053 },
                          { id: 12, act: 475.0, pred: 428.163759, err: 48.0, wmape: 0.101053 },
                          { id: 1, act: 26449.0, pred: 23937.203967, err: 2516.859811, wmape: 0.095159 },
                          { id: 21, act: 200.0, pred: 181.0, err: 19.0, wmape: 0.095000 },
                          { id: 3, act: 5151.0, pred: 4677.833394, err: 473.356606, wmape: 0.091896 },
                          { id: 26, act: 1852.0, pred: 1682.023750, err: 170.023750, wmape: 0.091805 },
                          { id: 2, act: 17495.0, pred: 15907.769763, err: 1588.493997, wmape: 0.090797 }
                        ].map((s) => (
                          <tr key={s.id} className="hover:bg-neutral-50">
                            <td className="py-1.5 px-3 text-primary font-bold">Store #{s.id}</td>
                            <td className="py-1.5 px-3 text-right">{s.act.toLocaleString()}</td>
                            <td className="py-1.5 px-3 text-right">{s.pred.toFixed(1)}</td>
                            <td className="py-1.5 px-3 text-right">{s.err.toFixed(1)}</td>
                            <td className="py-1.5 px-3 text-right text-rose-600 font-bold">{(s.wmape * 100).toFixed(2)}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Worst Products */}
                <div className="bg-surface border border-border-subtle p-6 space-y-4">
                  <h3 className="font-headline-lg text-sm text-primary font-bold uppercase tracking-wider flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">inventory</span>
                    Worst 10 Products by WMAPE
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead>
                        <tr className="border-b border-border-subtle text-text-muted font-label-sm uppercase bg-surface-paper">
                          <th className="py-2 px-3">Product ID</th>
                          <th className="py-2 px-3 text-right">Actual</th>
                          <th className="py-2 px-3 text-right">Predicted</th>
                          <th className="py-2 px-3 text-right">Abs Error</th>
                          <th className="py-2 px-3 text-right">WMAPE</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border-subtle font-mono text-[11px]">
                        {[
                          { id: 12031, act: 3.0, pred: 1.0, err: 2.0, wmape: 0.666667 },
                          { id: 12166, act: 3.0, pred: 1.0, err: 2.0, wmape: 0.666667 },
                          { id: 14466, act: 3.0, pred: 1.0, err: 2.0, wmape: 0.666667 },
                          { id: 13936, act: 8.0, pred: 3.0, err: 5.0, wmape: 0.625000 },
                          { id: 12608, act: 7.0, pred: 3.0, err: 4.0, wmape: 0.571429 },
                          { id: 13208, act: 2.0, pred: 1.0, err: 1.0, wmape: 0.500000 },
                          { id: 14102, act: 2.0, pred: 1.0, err: 1.0, wmape: 0.500000 },
                          { id: 14300, act: 4.0, pred: 2.0, err: 2.0, wmape: 0.500000 },
                          { id: 14700, act: 2.0, pred: 1.0, err: 1.0, wmape: 0.500000 },
                          { id: 14346, act: 10.0, pred: 5.0, err: 5.0, wmape: 0.500000 }
                        ].map((p) => (
                          <tr key={p.id} className="hover:bg-neutral-50">
                            <td className="py-1.5 px-3 text-primary font-bold">SKU-{p.id}</td>
                            <td className="py-1.5 px-3 text-right">{p.act.toLocaleString()}</td>
                            <td className="py-1.5 px-3 text-right">{p.pred.toFixed(1)}</td>
                            <td className="py-1.5 px-3 text-right">{p.err.toFixed(1)}</td>
                            <td className="py-1.5 px-3 text-right text-rose-600 font-bold">{(p.wmape * 100).toFixed(2)}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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
                className="absolute top-4 right-4 text-text-muted hover:text-primary cursor-pointer text-sm"
              >
                ✕
              </button>

              <h3 className="font-headline-lg text-lg font-bold text-primary mb-2">
                Automated Restock Purchase Order
              </h3>
              <p className="font-body-md text-xs text-text-muted mb-4">
                Dispatch automated PO to supplier <strong className="text-primary">{poModalItem.supplierId}</strong> for <span className="font-bold text-primary">{poModalItem.name}</span> ({poModalItem.sku}).
              </p>

              {poSuccess ? (
                <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-mono text-center space-y-2">
                  <span className="material-symbols-outlined text-2xl text-emerald-600">check_circle</span>
                  <p className="font-bold">Purchase Order Dispatched!</p>
                  <p className="text-[11px]">PO #PO-{poModalItem.sku.replace('-', '')} confirmed by Supplier {poModalItem.supplierId}. ETA: {poModalItem.leadTimeDays} Days.</p>
                  <button
                    onClick={() => setPoModalItem(null)}
                    className="mt-2 bg-emerald-900 text-white px-4 py-1.5 text-xs font-body-md cursor-pointer"
                  >
                    Close Window
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-3 bg-surface-paper border border-border-subtle text-xs font-mono space-y-1.5">
                    <p className="flex justify-between"><span className="text-text-muted">Item:</span> <strong className="text-primary">{poModalItem.name}</strong></p>
                    <p className="flex justify-between"><span className="text-text-muted">SKU / Supplier:</span> <strong className="text-primary">{poModalItem.sku} / {poModalItem.supplierId}</strong></p>
                    <p className="flex justify-between"><span className="text-text-muted">Fulfillment Hub:</span> <strong className="text-primary">{poModalItem.hub}</strong></p>
                    <p className="flex justify-between"><span className="text-text-muted">Current Stock:</span> <strong className="text-rose-600">{poModalItem.currentStock} Units</strong></p>
                    <p className="flex justify-between"><span className="text-text-muted">Safety Buffer Target:</span> <strong className="text-emerald-600">{poModalItem.safetyStock} Units</strong></p>
                    <p className="flex justify-between"><span className="text-text-muted">Reorder Quantity:</span> <strong className="text-primary">{poModalItem.reorderQty} Units</strong></p>
                    <p className="flex justify-between"><span className="text-text-muted">Unit Production Cost:</span> <strong className="text-primary">${poModalItem.productionCost.toFixed(2)}</strong></p>
                    <div className="pt-2 border-t border-border-subtle flex justify-between font-bold text-sm text-primary">
                      <span>Total PO Value:</span>
                      <span className="text-emerald-600">${(poModalItem.reorderQty * poModalItem.productionCost).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                    </div>
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
