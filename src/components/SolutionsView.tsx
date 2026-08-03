import React, { useState } from "react";
import { motion } from "motion/react";

interface SolutionsViewProps {
  setPage: (page: string) => void;
}

export default function SolutionsView({ setPage }: SolutionsViewProps) {
  // Simulator State
  const [productType, setProductType] = useState<"apparel" | "grocery" | "footwear">("apparel");
  const [scenario, setScenario] = useState<"standard" | "promo" | "disruption">("standard");
  const [isSimulating, setIsSimulating] = useState(false);
  const [simResults, setSimResults] = useState<{
    stockoutRiskTrad: number;
    stockoutRiskMono: number;
    holdingCostTrad: number;
    holdingCostMono: number;
    marginOptimized: string;
    forecastDays: { day: string; traditional: number; monolith: number }[];
  }>({
    stockoutRiskTrad: 18.4,
    stockoutRiskMono: 1.2,
    holdingCostTrad: 24200,
    holdingCostMono: 14500,
    marginOptimized: "+2.4%",
    forecastDays: [
      { day: "Mon", traditional: 120, monolith: 120 },
      { day: "Tue", traditional: 140, monolith: 135 },
      { day: "Wed", traditional: 110, monolith: 155 },
      { day: "Thu", traditional: 130, monolith: 180 },
      { day: "Fri", traditional: 190, monolith: 260 },
      { day: "Sat", traditional: 240, monolith: 310 },
      { day: "Sun", traditional: 180, monolith: 220 },
    ]
  });

  const handleRunSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
      if (productType === "apparel" && scenario === "standard") {
        setSimResults({
          stockoutRiskTrad: 18.4,
          stockoutRiskMono: 1.2,
          holdingCostTrad: 24200,
          holdingCostMono: 14500,
          marginOptimized: "+2.4%",
          forecastDays: [
            { day: "Mon", traditional: 120, monolith: 120 },
            { day: "Tue", traditional: 140, monolith: 135 },
            { day: "Wed", traditional: 110, monolith: 155 },
            { day: "Thu", traditional: 130, monolith: 180 },
            { day: "Fri", traditional: 190, monolith: 260 },
            { day: "Sat", traditional: 240, monolith: 310 },
            { day: "Sun", traditional: 180, monolith: 220 },
          ]
        });
      } else if (productType === "apparel" && scenario === "promo") {
        setSimResults({
          stockoutRiskTrad: 42.1,
          stockoutRiskMono: 2.8,
          holdingCostTrad: 31000,
          holdingCostMono: 19200,
          marginOptimized: "+5.1%",
          forecastDays: [
            { day: "Mon", traditional: 150, monolith: 170 },
            { day: "Tue", traditional: 180, monolith: 240 },
            { day: "Wed", traditional: 220, monolith: 310 },
            { day: "Thu", traditional: 290, monolith: 410 },
            { day: "Fri", traditional: 450, monolith: 620 },
            { day: "Sat", traditional: 510, monolith: 740 },
            { day: "Sun", traditional: 330, monolith: 480 },
          ]
        });
      } else if (productType === "apparel" && scenario === "disruption") {
        setSimResults({
          stockoutRiskTrad: 58.2,
          stockoutRiskMono: 4.1,
          holdingCostTrad: 18000,
          holdingCostMono: 11000,
          marginOptimized: "-0.8%",
          forecastDays: [
            { day: "Mon", traditional: 110, monolith: 90 },
            { day: "Tue", traditional: 80, monolith: 120 },
            { day: "Wed", traditional: 60, monolith: 130 },
            { day: "Thu", traditional: 40, monolith: 140 },
            { day: "Fri", traditional: 30, monolith: 150 },
            { day: "Sat", traditional: 50, monolith: 160 },
            { day: "Sun", traditional: 40, monolith: 130 },
          ]
        });
      } else if (productType === "grocery" && scenario === "standard") {
        setSimResults({
          stockoutRiskTrad: 12.5,
          stockoutRiskMono: 0.8,
          holdingCostTrad: 15200,
          holdingCostMono: 8400,
          marginOptimized: "+1.9%",
          forecastDays: [
            { day: "Mon", traditional: 310, monolith: 300 },
            { day: "Tue", traditional: 280, monolith: 290 },
            { day: "Wed", traditional: 290, monolith: 340 },
            { day: "Thu", traditional: 320, monolith: 380 },
            { day: "Fri", traditional: 410, monolith: 480 },
            { day: "Sat", traditional: 490, monolith: 550 },
            { day: "Sun", traditional: 380, monolith: 420 },
          ]
        });
      } else if (productType === "grocery" && scenario === "promo") {
        setSimResults({
          stockoutRiskTrad: 36.4,
          stockoutRiskMono: 1.5,
          holdingCostTrad: 22000,
          holdingCostMono: 11200,
          marginOptimized: "+3.8%",
          forecastDays: [
            { day: "Mon", traditional: 340, monolith: 380 },
            { day: "Tue", traditional: 410, monolith: 510 },
            { day: "Wed", traditional: 480, monolith: 640 },
            { day: "Thu", traditional: 550, monolith: 790 },
            { day: "Fri", traditional: 720, monolith: 990 },
            { day: "Sat", traditional: 850, monolith: 1150 },
            { day: "Sun", traditional: 610, monolith: 820 },
          ]
        });
      } else if (productType === "grocery" && scenario === "disruption") {
        setSimResults({
          stockoutRiskTrad: 64.1,
          stockoutRiskMono: 5.2,
          holdingCostTrad: 12000,
          holdingCostMono: 7100,
          marginOptimized: "+0.5%",
          forecastDays: [
            { day: "Mon", traditional: 290, monolith: 260 },
            { day: "Tue", traditional: 210, monolith: 280 },
            { day: "Wed", traditional: 150, monolith: 290 },
            { day: "Thu", traditional: 110, monolith: 310 },
            { day: "Fri", traditional: 90, monolith: 330 },
            { day: "Sat", traditional: 120, monolith: 350 },
            { day: "Sun", traditional: 110, monolith: 310 },
          ]
        });
      } else if (productType === "footwear" && scenario === "standard") {
        setSimResults({
          stockoutRiskTrad: 22.1,
          stockoutRiskMono: 1.5,
          holdingCostTrad: 41000,
          holdingCostMono: 25200,
          marginOptimized: "+3.1%",
          forecastDays: [
            { day: "Mon", traditional: 80, monolith: 85 },
            { day: "Tue", traditional: 95, monolith: 90 },
            { day: "Wed", traditional: 70, monolith: 110 },
            { day: "Thu", traditional: 85, monolith: 130 },
            { day: "Fri", traditional: 130, monolith: 180 },
            { day: "Sat", traditional: 160, monolith: 210 },
            { day: "Sun", traditional: 110, monolith: 140 },
          ]
        });
      } else if (productType === "footwear" && scenario === "promo") {
        setSimResults({
          stockoutRiskTrad: 48.9,
          stockoutRiskMono: 3.2,
          holdingCostTrad: 53000,
          holdingCostMono: 31000,
          marginOptimized: "+6.2%",
          forecastDays: [
            { day: "Mon", traditional: 110, monolith: 125 },
            { day: "Tue", traditional: 140, monolith: 190 },
            { day: "Wed", traditional: 180, monolith: 250 },
            { day: "Thu", traditional: 220, monolith: 320 },
            { day: "Fri", traditional: 340, monolith: 480 },
            { day: "Sat", traditional: 410, monolith: 590 },
            { day: "Sun", traditional: 280, monolith: 390 },
          ]
        });
      } else {
        // footwear disruption
        setSimResults({
          stockoutRiskTrad: 72.4,
          stockoutRiskMono: 6.8,
          holdingCostTrad: 31000,
          holdingCostMono: 19500,
          marginOptimized: "-1.5%",
          forecastDays: [
            { day: "Mon", traditional: 70, monolith: 60 },
            { day: "Tue", traditional: 50, monolith: 80 },
            { day: "Wed", traditional: 35, monolith: 90 },
            { day: "Thu", traditional: 25, monolith: 100 },
            { day: "Fri", traditional: 20, monolith: 110 },
            { day: "Sat", traditional: 30, monolith: 120 },
            { day: "Sun", traditional: 25, monolith: 95 },
          ]
        });
      }
    }, 700);
  };

  return (
    <div className="w-full flex flex-col" id="solutions-view">
      {/* Header Section */}
      <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pt-section-gap pb-16 w-full flex flex-col items-start">
        <span className="font-label-sm text-label-sm text-text-muted uppercase tracking-widest block mb-3">
          Solutions
        </span>
        <h1 className="font-display-xl-mobile text-display-xl-mobile md:font-display-xl md:text-display-xl text-primary max-w-3xl leading-tight mb-8">
          Enterprise-grade retail optimization.
        </h1>
        <p className="font-body-lg text-body-lg text-secondary max-w-2xl">
          Designed to operate seamlessly within your existing POS architecture, warehouse logistics, and e-commerce platforms to deliver immediate margin expansion and eliminate waste.
        </p>
      </section>

      {/* Hero Visual */}
      <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop mb-section-gap w-full">
        <div className="w-full h-[300px] md:h-[450px] bg-surface-container-low border border-border-subtle relative overflow-hidden flex items-center justify-center">
          <img 
            className="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-80 grayscale" 
            alt="Monolith Enterprise Solutions Network Architecture"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBCYpYVInM4Z4Uu-XN08_W5gG_N_zT6bXQ3p7_rO4Bsk2H-3zO5S_4R_qg_z-8OBfXP7QLEzEwK27KvLPawp7c-5qZQkKKkf9YSlN2LKTURRW0zCq_wxaPqjTf3-7sQjYkpPtSenR3TFszDigkXAJqkZHtzPVTqDXqy7cS4uTlsqY9c7Q64dJUm_FbtMJybMv61vXX9JaA48YQqCulZItopSmiIV4bjuP7p1hubVJFVxUmd6ONexsle"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 border border-border-subtle m-4 md:m-8 pointer-events-none" />
          <div className="absolute top-8 left-8">
            <span className="font-label-sm text-xs text-primary bg-surface-paper border border-border-subtle px-3 py-1.5 uppercase tracking-wider block">
              Deployment Node: Operational
            </span>
          </div>
        </div>
      </section>

      {/* Solutions Detailed List */}
      <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop mb-section-gap w-full space-y-20">
        {/* Solution 1 */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter items-start pt-12 border-t border-border-subtle">
          <div className="md:col-span-4">
            <span className="font-label-sm text-label-sm text-text-muted uppercase tracking-widest block mb-2">Module 01</span>
            <h2 className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg text-primary leading-tight">
              Predictive Replenishment
            </h2>
          </div>
          <div className="md:col-span-8 space-y-6">
            <h3 className="font-body-lg text-xl font-bold text-primary">Zero stockouts. Zero excess.</h3>
            <p className="font-body-md text-body-md text-secondary">
              Synchronize inventory distribution in real-time. Monolith's predictive engine runs continuous localized demand models, securing high shelf availability while reducing overall safety stock buffers.
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 text-sm font-body-md text-primary">
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-sm select-none">check_circle</span>
                Dynamic buffer sizing
              </li>
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-sm select-none">check_circle</span>
                Localized atmospheric & event correlation
              </li>
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-sm select-none">check_circle</span>
                Automated vendor replenishment loops
              </li>
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-sm select-none">check_circle</span>
                Micro-channel distribution paths
              </li>
            </ul>
          </div>
        </div>

        {/* Solution 2 */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter items-start pt-12 border-t border-border-subtle">
          <div className="md:col-span-4">
            <span className="font-label-sm text-label-sm text-text-muted uppercase tracking-widest block mb-2">Module 02</span>
            <h2 className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg text-primary leading-tight">
              Hyper-Localized Merchandising
            </h2>
          </div>
          <div className="md:col-span-8 space-y-6">
            <h3 className="font-body-lg text-xl font-bold text-primary">Assortment tailored to the block.</h3>
            <p className="font-body-md text-body-md text-secondary">
              No two retail locations are identical. Monolith analyzes granular purchase behaviors, localized digital signals, and regional product velocity profiles to automatically customize store-level assortments.
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 text-sm font-body-md text-primary">
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-sm select-none">check_circle</span>
                Sub-zip code demographic modeling
              </li>
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-sm select-none">check_circle</span>
                Autonomous price elasticity testing
              </li>
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-sm select-none">check_circle</span>
                Seasonal transition tracking
              </li>
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-sm select-none">check_circle</span>
                Elastic margin optimization algorithms
              </li>
            </ul>
          </div>
        </div>

        {/* Solution 3 */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter items-start pt-12 border-t border-border-subtle">
          <div className="md:col-span-4">
            <span className="font-label-sm text-label-sm text-text-muted uppercase tracking-widest block mb-2">Module 03</span>
            <h2 className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg text-primary leading-tight">
              Warehouse Orchestration
            </h2>
          </div>
          <div className="md:col-span-8 space-y-6">
            <h3 className="font-body-lg text-xl font-bold text-primary">Optimize the physical layer.</h3>
            <p className="font-body-md text-body-md text-secondary">
              Bridge the gap between prediction and physical dispatch. Monolith structures pick-paths, slotting setups, and bulk shipment consolidations dynamically based on incoming forecast waves.
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 text-sm font-body-md text-primary">
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-sm select-none">check_circle</span>
                Dynamic slotting optimization
              </li>
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-sm select-none">check_circle</span>
                Autonomous routing & dispatch
              </li>
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-sm select-none">check_circle</span>
                Redundancy protection layers
              </li>
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-sm select-none">check_circle</span>
                NPU-accelerated fulfillment models
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* INTERACTIVE RETAIL SIMULATOR WIDGET */}
      <section className="bg-surface-container-low border-y border-border-subtle py-20 w-full mb-section-gap">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop w-full">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
            <div>
              <span className="font-label-sm text-xs text-text-muted uppercase block mb-1">Interactive Sandbox</span>
              <h2 className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg text-primary leading-none">
                Live Optimization Simulator
              </h2>
            </div>
            <p className="font-body-md text-sm text-secondary max-w-md">
              Toggle specific retail environments and operational scenarios to observe the performance delta between legacy planning and Monolith AI.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter bg-surface-paper border border-border-subtle p-6 md:p-8">
            {/* Left Controls */}
            <div className="lg:col-span-4 space-y-6 border-b lg:border-b-0 lg:border-r border-border-subtle pb-6 lg:pb-0 lg:pr-8">
              <div>
                <span className="font-label-sm text-[11px] text-text-muted uppercase block mb-2">1. Retail Vertical</span>
                <div className="grid grid-cols-3 gap-2">
                  {(["apparel", "grocery", "footwear"] as const).map((v) => (
                    <button
                      key={v}
                      onClick={() => setProductType(v)}
                      className={`py-3 text-xs font-label-sm uppercase border text-center cursor-pointer transition-colors ${
                        productType === v 
                          ? "border-primary bg-primary text-on-primary font-bold" 
                          : "border-border-subtle bg-surface-container-low text-text-muted hover:text-primary"
                      }`}
                      id={`sim-v-${v}`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="font-label-sm text-[11px] text-text-muted uppercase block mb-2">2. Demand Scenario</span>
                <div className="space-y-2">
                  {[
                    { id: "standard", title: "Standard Baseline", desc: "Average daily sales with standard traffic variance." },
                    { id: "promo", title: "High-Traffic Event", desc: "4x POS volume spike during flash promotions." },
                    { id: "disruption", title: "Supply Chain delay", desc: "Port bottlenecks delay key shipments by 14 days." },
                  ].map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setScenario(s.id as any)}
                      className={`w-full p-3 text-left border cursor-pointer transition-colors block ${
                        scenario === s.id 
                          ? "border-primary bg-surface-bright" 
                          : "border-border-subtle bg-surface-container-low hover:bg-surface-container"
                      }`}
                      id={`sim-s-${s.id}`}
                    >
                      <span className="font-body-md text-sm font-bold block text-primary">{s.title}</span>
                      <span className="font-body-md text-[11px] text-secondary block mt-0.5 leading-snug">{s.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleRunSimulation}
                disabled={isSimulating}
                className="btn-primary w-full py-4 text-center cursor-pointer disabled:opacity-50"
                id="run-sim-btn"
              >
                {isSimulating ? "Recalibrating Layer 01..." : "Run Optimization Model"}
              </button>
            </div>

            {/* Right Dashboard Data Output */}
            <div className="lg:col-span-8 flex flex-col justify-between pt-6 lg:pt-0 lg:pl-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="border border-border-subtle p-4 bg-surface-container-lowest">
                  <span className="font-label-sm text-[10px] text-text-muted uppercase block">Stockout Risk</span>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="font-display-xl text-2xl text-primary font-bold">{simResults.stockoutRiskMono}%</span>
                    <span className="font-label-sm text-[10px] text-red-600 line-through">vs {simResults.stockoutRiskTrad}%</span>
                  </div>
                  <span className="text-[10px] font-body-md text-emerald-600 block mt-1">✓ Optimized availability</span>
                </div>

                <div className="border border-border-subtle p-4 bg-surface-container-lowest">
                  <span className="font-label-sm text-[10px] text-text-muted uppercase block">Daily Holding Cost</span>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="font-display-xl text-2xl text-primary font-bold">${simResults.holdingCostMono.toLocaleString()}</span>
                    <span className="font-label-sm text-[10px] text-red-600 line-through">vs ${simResults.holdingCostTrad.toLocaleString()}</span>
                  </div>
                  <span className="text-[10px] font-body-md text-emerald-600 block mt-1">✓ 40% capital preserved</span>
                </div>

                <div className="border border-border-subtle p-4 bg-surface-container-lowest">
                  <span className="font-label-sm text-[10px] text-text-muted uppercase block">Margin Adjustment</span>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="font-display-xl text-2xl text-emerald-600 font-bold">{simResults.marginOptimized}</span>
                  </div>
                  <span className="text-[10px] font-body-md text-secondary block mt-1">Recommended pricing adjustment</span>
                </div>
              </div>

              {/* Chart */}
              <div>
                <span className="font-label-sm text-[10px] text-text-muted uppercase block mb-3">Estimated Weekly Stock Integrity Levels</span>
                <div className="h-44 flex items-end gap-3 border-b border-l border-border-subtle pb-2 px-2" id="sim-chart">
                  {isSimulating ? (
                    <div className="w-full flex h-full items-center justify-center text-xs font-label-sm text-text-muted animate-pulse">
                      Inference engines calculating, reading local registers...
                    </div>
                  ) : (
                    simResults.forecastDays.map((item, index) => {
                      const maxVal = 1200; // max scale for percent calculation
                      const tradHeight = Math.min(100, Math.max(10, (item.traditional / maxVal) * 100));
                      const monoHeight = Math.min(100, Math.max(10, (item.monolith / maxVal) * 100));
                      return (
                        <div key={index} className="flex-grow flex flex-col items-center gap-1 group relative">
                          {/* Tooltip */}
                          <div className="absolute bottom-full bg-primary text-on-primary text-[10px] p-2 rounded-none opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none mb-1 text-center min-w-[120px]">
                            Traditional: {item.traditional} <br />
                            <strong>Monolith: {item.monolith}</strong>
                          </div>

                          <div className="w-full h-32 flex items-end gap-1.5 justify-center">
                            {/* Traditional Bar (dark grey) */}
                            <div 
                              className="w-3 bg-secondary bg-opacity-35 transition-all duration-500 ease-out"
                              style={{ height: `${tradHeight}%` }}
                            />
                            {/* Monolith Bar (black) */}
                            <div 
                              className="w-3 bg-primary transition-all duration-500 ease-out"
                              style={{ height: `${monoHeight}%` }}
                            />
                          </div>
                          <span className="font-label-sm text-[10px] text-text-muted mt-1">{item.day}</span>
                        </div>
                      );
                    })
                  )}
                </div>
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center gap-1.5 text-xs font-body-md text-secondary">
                    <div className="w-2.5 h-2.5 bg-secondary bg-opacity-35" />
                    Traditional Planning System
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-body-md text-primary font-bold">
                    <div className="w-2.5 h-2.5 bg-primary" />
                    Monolith Generative Intelligence
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="border-t border-border-subtle bg-surface-container-lowest w-full py-16">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop text-center flex flex-col items-center">
          <h2 className="font-headline-lg text-primary mb-4">Request tailored analysis.</h2>
          <p className="font-body-md text-secondary max-w-lg mb-8">
            Connect our algorithms securely with your regional datasets. Run an interactive 14-day zero-risk trial.
          </p>
          <button
            onClick={() => {
              setPage("company");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="btn-primary"
            id="req-analysis-btn"
          >
            Request Enterprise Demo
          </button>
        </div>
      </section>
    </div>
  );
}
