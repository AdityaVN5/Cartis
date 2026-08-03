import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface HomeViewProps {
  setPage: (page: string) => void;
}

export default function HomeView({ setPage }: HomeViewProps) {
  const [showWhitepaper, setShowWhitepaper] = useState(false);
  const [showDevDocs, setShowDevDocs] = useState(false);
  const [showCaseStudies, setShowCaseStudies] = useState(false);
  
  // Interactive console state for dev docs
  const [apiEndpoint, setApiEndpoint] = useState<string>("/api/v2.4/forecast");
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [apiLoading, setApiLoading] = useState(false);
  const [selectedSku, setSelectedSku] = useState("SKU-9904");
  const [selectedRegion, setSelectedRegion] = useState("US-EAST-1");

  const runSimulatedQuery = () => {
    setApiLoading(true);
    setApiResponse(null);
    setTimeout(() => {
      setApiLoading(false);
      setApiResponse({
        status: "success",
        timestamp: new Date().toISOString(),
        model_version: "v2.4.12-pro",
        input: {
          sku: selectedSku,
          region: selectedRegion,
          temporal_vector: [0.82, 0.44, 0.91, 0.23, 0.77],
          pos_volume_30d: 412000,
        },
        inference: {
          forecast_demand_qty: 489310,
          confidence_score: 0.9924,
          optimal_stock_allocation: {
            "HUB-CHICAGO": 180000,
            "HUB-NJ-EAST": 200000,
            "HUB-LA-WEST": 109310
          },
          recommended_margin_adjustment: "+1.8%",
          weather_correlation_coefficient: 0.884
        }
      });
    }, 1000);
  };

  const caseStudiesData = [
    {
      client: "Aether Department Stores",
      metrics: "12x ROI / 40% waste cut",
      challenge: "Aether was holding over $40M in excess winter inventory due to lagging predictions from legacy Oracle planners.",
      solution: "Deployed Monolith NPU Core over active POS Streams. Our models predicted localized cold fronts with 99.1% accuracy.",
      result: "Calibrated inventory levels precisely to weekly demand shifts, clearing excess stock and maximizing margins during operational Q1."
    },
    {
      client: "Crest Global Grocery",
      metrics: "99.9% fresh-stock availability",
      challenge: "Disruptions in port logistics caused sudden shortages in organic fresh food across 400 retail hubs.",
      solution: "Activated Monolith self-healing logistics layer to automatically reroute distribution nodes instantly upon delay detection.",
      result: "Maintained seamless shelf availability with zero manual logistics overhead or expedited carrier costs."
    }
  ];

  return (
    <div className="w-full flex flex-col" id="home-view">
      {/* Hero Section */}
      <header className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pt-section-gap pb-24 md:pb-section-gap flex flex-col items-start w-full">
        <h1 className="font-display-xl-mobile text-display-xl-mobile md:font-display-xl md:text-display-xl text-primary max-w-[800px] leading-tight select-none">
          Retail, redefined by AI.
        </h1>
        <p className="font-body-lg text-body-lg text-secondary max-w-2xl mt-8">
          Monolith Enterprise brings generative intelligence to the core of your retail operations. Predict demand, personalize experiences, and optimize supply chains with unprecedented precision and invisible elegance.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mt-12 w-full sm:w-auto">
          <button 
            onClick={() => {
              setPage("solutions");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="bg-primary text-on-primary font-body-md text-body-md px-8 py-4 rounded-none hover:bg-on-surface-variant transition-colors w-full sm:w-auto text-center cursor-pointer font-medium"
            id="hero-explore-btn"
          >
            Explore the Platform
          </button>
          <button 
            onClick={() => setShowWhitepaper(true)}
            className="bg-transparent text-primary border border-primary font-body-md text-body-md px-8 py-4 rounded-none hover:bg-surface-container-highest transition-colors w-full sm:w-auto text-center cursor-pointer font-medium"
            id="hero-whitepaper-btn"
          >
            Read the Whitepaper
          </button>
        </div>
      </header>

      {/* Hero Visual / Abstract Data Canvas */}
      <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop mb-section-gap w-full">
        <div className="w-full h-[400px] md:h-[600px] bg-surface-container-low border border-border-subtle relative overflow-hidden flex items-center justify-center">
          <img 
            className="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-80 grayscale" 
            alt="Monolith Enterprise neural retail structure"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBBIwQ9d8-7O8TYZcxI-hI1fI18pd8ThdZkk19GIoPm93mg7dnAxR_s3mBVU0OBfX2PDqLBzEwK27KvLPawp7c-5qZQkKKkf9YSlN2LKTURRW0zCq_wxaPqjTf3-7sQjYkpPtSenR3TFszDigkXAJqkZHtzPVTqDXqy7cS4uTlsqY9c7Q64dJUm_FbtMJybMv61vXX9JaA48YQqCulZItopSmiIV4bjuP7p1hubVJFVxUmd6ONexsle"
            referrerPolicy="no-referrer"
          />
          {/* Decorative Minimalist Elements over image */}
          <div className="absolute inset-0 border border-border-subtle m-4 md:m-8 pointer-events-none" />
          <div className="absolute bottom-12 left-12 hidden md:block z-10">
            <div className="font-label-sm text-label-sm text-primary bg-surface-paper px-3 py-1.5 border border-border-subtle uppercase">
              System Output: Optimized
            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid / Features */}
      <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop mb-section-gap w-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-4">
          <h2 className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg text-primary max-w-xl leading-tight">
            The architecture of modern commerce.
          </h2>
          <p className="font-body-md text-body-md text-secondary max-w-sm">
            Built from the ground up to handle the complexity of global retail networks with zero latency.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
          {/* Large Feature Card */}
          <div className="md:col-span-8 border border-border-subtle p-8 md:p-12 bg-surface-container-lowest flex flex-col justify-between min-h-[400px] hover:bg-surface-bright transition-colors duration-500 group">
            <span className="font-label-sm text-label-sm text-on-primary-container bg-surface-container px-2.5 py-1 self-start uppercase tracking-widest mb-8">
              Predictive Demand
            </span>
            <div>
              <h3 className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg text-primary mb-4">
                Anticipate the market.
              </h3>
              <p className="font-body-lg text-body-lg text-secondary max-w-xl">
                Our proprietary models analyze millions of data points in real-time to forecast consumer behavior, ensuring your inventory is precisely calibrated to actual demand, eliminating waste and maximizing margins.
              </p>
            </div>
          </div>

          {/* Small Feature Card 1 */}
          <div className="md:col-span-4 border border-border-subtle p-8 bg-surface-container-lowest flex flex-col justify-between min-h-[400px] hover:bg-surface-bright transition-colors duration-500">
            <span className="font-label-sm text-label-sm text-on-primary-container bg-surface-container px-2.5 py-1 self-start uppercase tracking-widest mb-8">
              Hyper-Personalization
            </span>
            <div>
              <div className="mb-6">
                <span className="material-symbols-outlined text-[32px] text-primary select-none">
                  person_search
                </span>
              </div>
              <h3 className="font-body-lg text-body-lg text-primary font-bold mb-2">
                Individual scale.
              </h3>
              <p className="font-body-md text-body-md text-secondary">
                Craft unique shopping journeys and dynamic pricing structures for every single customer simultaneously.
              </p>
            </div>
          </div>

          {/* Small Feature Card 2 */}
          <div className="md:col-span-6 border border-border-subtle p-8 bg-surface-container-lowest flex flex-col justify-between min-h-[300px] hover:bg-surface-bright transition-colors duration-500">
            <span className="font-label-sm text-label-sm text-on-primary-container bg-surface-container px-2.5 py-1 self-start uppercase tracking-widest mb-8">
              Autonomous Logistics
            </span>
            <div>
              <h3 className="font-body-lg text-body-lg text-primary font-bold mb-2">
                Self-healing supply chains.
              </h3>
              <p className="font-body-md text-body-md text-secondary">
                Route inventory globally with AI that automatically detects and bypasses disruptions before they impact your stores.
              </p>
            </div>
          </div>

          {/* Small Feature Card 3 - Clickable Developer Documentation */}
          <div className="md:col-span-6 border border-border-subtle p-8 bg-surface-container-low flex flex-col justify-center items-center text-center min-h-[300px]">
            <p className="font-body-lg text-body-lg text-primary mb-6">
              Ready to integrate intelligence into your stack?
            </p>
            <button 
              onClick={() => setShowDevDocs(true)}
              className="bg-primary text-on-primary font-body-md text-body-md px-6 py-3 rounded-none hover:bg-on-surface-variant transition-colors cursor-pointer"
              id="dev-docs-trigger"
            >
              View Developer Documentation
            </button>
          </div>
        </div>
      </section>

      {/* Metrics Display */}
      <section className="border-y border-border-subtle bg-surface-container-lowest w-full">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-gutter divide-y md:divide-y-0 md:divide-x divide-border-subtle">
            <div className="flex flex-col gap-4 pt-8 md:pt-0 md:px-8 first:pt-0 first:px-0">
              <div className="font-display-xl-mobile text-display-xl-mobile md:font-display-xl md:text-display-xl text-primary select-none">
                40%
              </div>
              <div className="font-label-sm text-label-sm text-secondary uppercase tracking-widest leading-relaxed max-w-[200px]">
                Reduction in excess global inventory
              </div>
            </div>
            <div className="flex flex-col gap-4 pt-8 md:pt-0 md:px-8">
              <div className="font-display-xl-mobile text-display-xl-mobile md:font-display-xl md:text-display-xl text-primary select-none">
                12x
              </div>
              <div className="font-label-sm text-label-sm text-secondary uppercase tracking-widest leading-relaxed max-w-[200px]">
                Average ROI within the first operational quarter
              </div>
            </div>
            <div className="flex flex-col gap-4 pt-8 md:pt-0 md:px-8">
              <div className="font-display-xl-mobile text-display-xl-mobile md:font-display-xl md:text-display-xl text-primary select-none">
                99.9%
              </div>
              <div className="font-label-sm text-label-sm text-secondary uppercase tracking-widest leading-relaxed max-w-[200px]">
                Uptime guarantee on core intelligence infrastructure
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Innovation Banner / Final CTA */}
      <section className="w-full bg-primary text-on-primary">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-section-gap flex flex-col md:flex-row justify-between items-start md:items-center gap-12">
          <h2 className="font-display-xl-mobile text-display-xl-mobile md:font-display-xl md:text-display-xl max-w-2xl text-on-primary leading-tight select-none">
            Scale intelligence. <br /> Zero friction.
          </h2>
          <div className="flex flex-col gap-4 w-full md:w-auto">
            <button 
              onClick={() => {
                setPage("company");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="bg-surface-paper text-primary font-body-md text-body-md px-8 py-4 rounded-none hover:bg-surface-container-high transition-colors text-center cursor-pointer font-medium"
              id="cta-sales-btn"
            >
              Contact Enterprise Sales
            </button>
            <button 
              onClick={() => setShowCaseStudies(true)}
              className="bg-transparent text-on-primary border border-on-primary font-body-md text-body-md px-8 py-4 rounded-none hover:bg-on-secondary-fixed-variant transition-colors text-center cursor-pointer font-medium"
              id="cta-case-btn"
            >
              View Case Studies
            </button>
          </div>
        </div>
      </section>

      {/* WHITE PAPER MODAL */}
      <AnimatePresence>
        {showWhitepaper && (
          <div className="fixed inset-0 bg-primary/30 backdrop-blur-md flex items-center justify-center z-[100] p-4" onClick={() => setShowWhitepaper(false)} id="whitepaper-modal">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="bg-surface-paper border border-border-subtle p-8 max-w-2xl w-full relative max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setShowWhitepaper(false)}
                className="absolute top-4 right-4 text-primary hover:opacity-60 cursor-pointer"
                id="close-whitepaper"
              >
                <span className="material-symbols-outlined select-none">close</span>
              </button>
              
              <span className="font-label-sm text-label-sm text-text-muted uppercase tracking-widest block mb-2">Technical Whitepaper</span>
              <h3 className="font-headline-lg text-primary text-3xl mb-6">Redefining Retail Core Infrastructure via Generative Intelligence</h3>
              
              <div className="font-body-md text-sm text-secondary space-y-6">
                <p>
                  <strong>Abstract:</strong> Traditional retail supply chains operate on reactive statistical models that fail during extreme demand deviations or systemic macro shocks. Monolith Enterprise introduces a deterministic foundation model framework designed specifically for high-velocity transaction structures.
                </p>
                
                <h4 className="font-bold text-primary uppercase text-xs tracking-wider">I. Multi-Modal POS Integration</h4>
                <p>
                  By direct stream ingestion from distributed registers, our Layer 01 core isolates micro-purchasing behaviors in real-time, mapping vector paths that correlate localization factors such as atmospheric conditions, local traffic indexes, and digital search trends.
                </p>
                
                <h4 className="font-bold text-primary uppercase text-xs tracking-wider">II. Decentralized Inventory Calibration</h4>
                <p>
                  Instead of static monthly allocations, our model drives dynamic self-healing logistics pipelines. Inventory nodes continuously re-balance stocks autonomously to secure optimal margins across regional distribution hubs.
                </p>

                <h4 className="font-bold text-primary uppercase text-xs tracking-wider">III. Real-world Operational Outcomes</h4>
                <p>
                  Deployments inside Fortune 100 commerce chains demonstrate a systemic reduction in holding costs of up to 40% with a correlated increase in Customer Lifetime Value (LTV) through ultra-accurate predictive restocking.
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-border-subtle flex justify-end">
                <button 
                  onClick={() => setShowWhitepaper(false)}
                  className="btn-primary w-full sm:w-auto cursor-pointer"
                  id="acknowledge-whitepaper"
                >
                  Download PDF & Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DEV DOCS INTERACTIVE MODAL */}
      <AnimatePresence>
        {showDevDocs && (
          <div className="fixed inset-0 bg-primary/30 backdrop-blur-md flex items-center justify-center z-[100] p-4" onClick={() => setShowDevDocs(false)} id="devdocs-modal">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="bg-surface-paper border border-border-subtle p-8 max-w-3xl w-full relative max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setShowDevDocs(false)}
                className="absolute top-4 right-4 text-primary hover:opacity-60 cursor-pointer"
                id="close-devdocs"
              >
                <span className="material-symbols-outlined select-none">close</span>
              </button>

              <span className="font-label-sm text-label-sm text-text-muted uppercase tracking-widest block mb-2">Developer Integration Suite</span>
              <h3 className="font-headline-lg text-primary text-3xl mb-6">Monolith API Sandbox</h3>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                <div className="md:col-span-5 space-y-4">
                  <p className="font-body-md text-sm text-secondary">
                    Configure and execute live simulated API requests to our predictive demand inference endpoints.
                  </p>

                  <div className="space-y-3">
                    <div>
                      <label className="font-label-sm text-[11px] text-text-muted uppercase block mb-1">Target SKU</label>
                      <select 
                        value={selectedSku} 
                        onChange={(e) => setSelectedSku(e.target.value)}
                        className="w-full bg-surface-container-low border border-border-subtle p-2 text-sm font-label-sm rounded-none focus:outline-none"
                        id="sku-selector"
                      >
                        <option value="SKU-9904">SKU-9904 (Premium Outerwear)</option>
                        <option value="SKU-8821">SKU-8821 (Performance Footwear)</option>
                        <option value="SKU-7740">SKU-7740 (Activewear Core)</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-label-sm text-[11px] text-text-muted uppercase block mb-1">Distribution Region</label>
                      <select 
                        value={selectedRegion} 
                        onChange={(e) => setSelectedRegion(e.target.value)}
                        className="w-full bg-surface-container-low border border-border-subtle p-2 text-sm font-label-sm rounded-none focus:outline-none"
                        id="region-selector"
                      >
                        <option value="US-EAST-1">US-EAST-1 (NY Central)</option>
                        <option value="US-WEST-2">US-WEST-2 (LA Terminal)</option>
                        <option value="EU-WEST-1">EU-WEST-1 (London Core)</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-label-sm text-[11px] text-text-muted uppercase block mb-1">API Endpoint</label>
                      <input 
                        type="text" 
                        readOnly 
                        value={apiEndpoint} 
                        className="w-full bg-surface-container-low border border-border-subtle p-2 text-sm font-label-sm rounded-none focus:outline-none text-secondary"
                        id="endpoint-input"
                      />
                    </div>
                  </div>

                  <button 
                    onClick={runSimulatedQuery}
                    disabled={apiLoading}
                    className="btn-primary w-full mt-2 cursor-pointer disabled:opacity-50"
                    id="execute-query-btn"
                  >
                    {apiLoading ? "Analyzing..." : "Execute API Query"}
                  </button>
                </div>

                <div className="md:col-span-7 flex flex-col h-[320px]">
                  <span className="font-label-sm text-[11px] text-text-muted uppercase block mb-1">Inference Response Terminal</span>
                  <div className="flex-grow bg-primary text-on-primary font-label-sm text-xs p-4 overflow-auto border border-border-subtle flex flex-col select-all rounded-none" id="terminal-screen">
                    {apiLoading && (
                      <div className="flex flex-col gap-1 text-on-primary-container animate-pulse">
                        <p>&gt; Connection established with secure node US-EAST-1...</p>
                        <p>&gt; POST /api/v2.4/forecast HTTP/1.1</p>
                        <p>&gt; Processing multi-modal transactional vectors (40 petabytes dataset)...</p>
                        <p>&gt; Running inference on NPU Core layer...</p>
                      </div>
                    )}
                    
                    {!apiLoading && !apiResponse && (
                      <div className="text-on-primary-container m-auto text-center py-8">
                        <p className="mb-2">TERMINAL IDLE</p>
                        <p className="text-[10px] opacity-70">Click "Execute API Query" to run live system simulation.</p>
                      </div>
                    )}

                    {!apiLoading && apiResponse && (
                      <pre className="text-emerald-400 whitespace-pre-wrap leading-relaxed select-all">
                        {JSON.stringify(apiResponse, null, 2)}
                      </pre>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-border-subtle flex justify-between items-center">
                <span className="font-label-sm text-[10px] text-text-muted">Documentation V2.4 © 2026 Monolith Inc.</span>
                <button 
                  onClick={() => setShowDevDocs(false)}
                  className="btn-secondary py-2.5 px-6 cursor-pointer"
                  id="dismiss-devdocs"
                >
                  Close Terminal
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CASE STUDIES MODAL */}
      <AnimatePresence>
        {showCaseStudies && (
          <div className="fixed inset-0 bg-primary/30 backdrop-blur-md flex items-center justify-center z-[100] p-4" onClick={() => setShowCaseStudies(false)} id="casestudies-modal">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="bg-surface-paper border border-border-subtle p-8 max-w-3xl w-full relative max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setShowCaseStudies(false)}
                className="absolute top-4 right-4 text-primary hover:opacity-60 cursor-pointer"
                id="close-casestudies"
              >
                <span className="material-symbols-outlined select-none">close</span>
              </button>

              <span className="font-label-sm text-label-sm text-text-muted uppercase tracking-widest block mb-2">Proven Integrations</span>
              <h3 className="font-headline-lg text-primary text-3xl mb-6">Enterprise Case Studies</h3>

              <div className="space-y-8 divide-y divide-border-subtle">
                {caseStudiesData.map((study, idx) => (
                  <div key={idx} className={`${idx > 0 ? "pt-8" : ""} space-y-4`}>
                    <div className="flex justify-between items-start flex-wrap gap-2">
                      <h4 className="font-headline-lg text-xl text-primary font-bold">{study.client}</h4>
                      <span className="font-label-sm text-xs bg-surface-container px-3 py-1 text-primary border border-border-subtle uppercase">
                        {study.metrics}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-body-md text-sm">
                      <div>
                        <span className="font-label-sm text-[10px] text-text-muted uppercase block">Challenge</span>
                        <p className="text-secondary mt-1">{study.challenge}</p>
                      </div>
                      <div>
                        <span className="font-label-sm text-[10px] text-text-muted uppercase block">Solution</span>
                        <p className="text-secondary mt-1">{study.solution}</p>
                      </div>
                      <div>
                        <span className="font-label-sm text-[10px] text-text-muted uppercase block">Result</span>
                        <p className="text-secondary mt-1">{study.result}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-border-subtle flex justify-end">
                <button 
                  onClick={() => setShowCaseStudies(false)}
                  className="btn-primary w-full sm:w-auto cursor-pointer"
                  id="acknowledge-casestudies"
                >
                  Close Case Studies
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
