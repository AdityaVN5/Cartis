import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

interface LogEntry {
  timestamp: string;
  level: "INFO" | "SUCCESS" | "WARN";
  message: string;
}

export default function TechnologyView() {
  const [selectedLayer, setSelectedLayer] = useState<"ingestion" | "transformer" | "decoupler">("ingestion");
  const [liveLogs, setLiveLogs] = useState<LogEntry[]>([]);

  // Simulate background log streaming
  useEffect(() => {
    const messages = [
      { level: "INFO", text: "POS Stream sync established with registered terminals (Region: US-EAST)." },
      { level: "INFO", text: "Reading spatial temperature variables and traffic anomalies." },
      { level: "SUCCESS", text: "Demand Transformer weight calculations refreshed (v2.4.1)." },
      { level: "INFO", text: "Triggering autonomous routing calibration for distribution hubs." },
      { level: "INFO", text: "Evaluating price elasticity limits for retail vertical Apparel." },
      { level: "SUCCESS", text: "Database isolation checks passed. Tenant encryption keys verified." },
      { level: "WARN", text: "Logistics queue delay detected at Chicago Central terminal. Rerouting..." },
      { level: "SUCCESS", text: "Self-healing route created. Shipments redirected through Terminal-09." }
    ];

    const initialLogs = Array.from({ length: 4 }).map((_, idx) => {
      const msg = messages[idx % messages.length];
      return {
        timestamp: new Date(Date.now() - (4 - idx) * 3000).toLocaleTimeString(),
        level: msg.level as any,
        message: msg.text
      };
    });
    setLiveLogs(initialLogs);

    const interval = setInterval(() => {
      const randomMsg = messages[Math.floor(Math.random() * messages.length)];
      setLiveLogs((prev) => [
        ...prev.slice(-6),
        {
          timestamp: new Date().toLocaleTimeString(),
          level: randomMsg.level as any,
          message: randomMsg.text
        }
      ]);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const architectureLayers = {
    ingestion: {
      title: "POS Stream Synapse",
      subtitle: "Layer 01: Low-latency data ingestion",
      description: "Operates directly over active POS endpoints and inventory streams. By routing millions of transactions through decentralized pipelines, Layer 01 isolates localized sales vectors in real-time.",
      code: `// Layer 01: POS Stream Ingest Connection Handler
import { IngestStream, TenantIsolation } from "@monolith/layer01";

export async function handlePOSIngest(posRegisterId: string) {
  const stream = await IngestStream.connect(posRegisterId, {
    cryptography: "AES-GCM-256",
    bufferMode: "direct-npu",
    rateLimit: "unlimited"
  });

  stream.on("transaction", async (payload) => {
    const anonymousPayload = await TenantIsolation.anonymize(payload);
    await IngestStream.flushToBuffer(anonymousPayload);
    console.log(\`[Layer01] Flushed transaction vector: \${anonymousPayload.id}\`);
  });
}`
    },
    transformer: {
      title: "Demand Transformer Core",
      subtitle: "Layer 02: Multi-modal context model",
      description: "Our core foundation transformer. Weights are trained on global retail patterns to instantly convert POS, temperature, demographic, and macro datasets into deterministic replenishment actions.",
      code: `// Layer 02: Demand Inference Prediction Core
import { DemandTransformer, WeightModel } from "@monolith/core";

export async function runInference(skuId: string, regionCode: string) {
  const model = await DemandTransformer.load(WeightModel.V2_PRO_STABLE);
  
  const context = await model.gatherContext({
    temporalVector: true,
    localAtmosphere: true,
    competitorAnalytics: true
  });

  const prediction = await model.predict(skuId, {
    region: regionCode,
    confidenceThreshold: 0.99
  });

  return prediction.optimalStockAllocation;
}`
    },
    decoupler: {
      title: "Fulfillment Decoupler",
      subtitle: "Layer 03: Autonomous logistics layer",
      description: "Converts neural insights into tangible supply actions. Automatically coordinates warehouse slotting, fleet routes, and replenishment schedules, securing delivery speeds with zero human delay.",
      code: `// Layer 03: Fulfillment Route Dispatch & Automation
import { FleetCoordinator, WarehouseSlotter } from "@monolith/layer03";

export async function dispatchAutonomousReplenishment(orderId: string) {
  const routes = await FleetCoordinator.calculateOptimalPaths(orderId, {
    avoidCongestion: true,
    prioritizeFuel: false
  });

  if (routes.disruptionDetected) {
    console.warn("[Layer03] Logistics disruption. Re-routing dispatch...");
    await FleetCoordinator.triggerSelfHealingRoute(orderId);
  }

  await WarehouseSlotter.reSlotAllocation(orderId);
}`
    }
  };

  return (
    <div className="w-full flex flex-col" id="technology-view">
      {/* Header Section */}
      <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pt-section-gap pb-16 w-full flex flex-col items-start">
        <span className="font-label-sm text-label-sm text-text-muted uppercase tracking-widest block mb-3">
          Technology
        </span>
        <h1 className="font-display-xl-mobile text-display-xl-mobile md:font-display-xl md:text-display-xl text-primary max-w-3xl leading-tight mb-8">
          Built for zero latency. Built for scale.
        </h1>
        <p className="font-body-lg text-body-lg text-secondary max-w-2xl">
          Monolith operates on a decentralized proprietary hardware layer and deep neural pipelines. We bypass legacy latency, syncing operations to active market velocity.
        </p>
      </section>

      {/* Hero Visual */}
      <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop mb-section-gap w-full">
        <div className="w-full h-[300px] md:h-[450px] bg-surface-container-low border border-border-subtle relative overflow-hidden flex items-center justify-center">
          <img 
            className="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-80 grayscale" 
            alt="Monolith Enterprise Neural Core Infrastructure"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuB3R70mJ6K3Uorv7vFksS2N1C7Uu-zT6bXQ3p7_rO4Bsk2H-3zO5S_4R_qg_z-8OBfXP7QLEzEwK27KvLPawp7c-5qZQkKKkf9YSlN2LKTURRW0zCq_wxaPqjTf3-7sQjYkpPtSenR3TFszDigkXAJqkZHtzPVTqDXqy7cS4uTlsqY9c7Q64dJUm_FbtMJybMv61vXX9JaA48YQqCulZItopSmiIV4bjuP7p1hubVJFVxUmd6ONexsle"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 border border-border-subtle m-4 md:m-8 pointer-events-none" />
          <div className="absolute bottom-8 right-8">
            <span className="font-label-sm text-xs text-primary bg-surface-paper border border-border-subtle px-3 py-1.5 uppercase tracking-wider block">
              Inference Speed: 0.12ms
            </span>
          </div>
        </div>
      </section>

      {/* Technology Specifications */}
      <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop mb-section-gap w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
          <div className="border border-border-subtle p-8 bg-surface-container-lowest">
            <span className="font-label-sm text-xs text-text-muted uppercase block mb-6">Spec 01</span>
            <h3 className="font-headline-lg-mobile text-2xl text-primary mb-4">Core Model Topology</h3>
            <p className="font-body-md text-sm text-secondary">
              Our distributed transformer weights scale with precision, incorporating local event registries and weather metrics directly into every individual inference.
            </p>
          </div>
          <div className="border border-border-subtle p-8 bg-surface-container-lowest">
            <span className="font-label-sm text-xs text-text-muted uppercase block mb-6">Spec 02</span>
            <h3 className="font-headline-lg-mobile text-2xl text-primary mb-4">The Monolith Edge</h3>
            <p className="font-body-md text-sm text-secondary">
              NPU-accelerated edge routers interface directly with POS networks, achieving local data ingestion within milliseconds, guaranteeing zero centralized latency.
            </p>
          </div>
          <div className="border border-border-subtle p-8 bg-surface-container-lowest">
            <span className="font-label-sm text-xs text-text-muted uppercase block mb-6">Spec 03</span>
            <h3 className="font-headline-lg-mobile text-2xl text-primary mb-4">Enterprise Isolation</h3>
            <p className="font-body-md text-sm text-secondary">
              Multi-tenant isolation frameworks secure transactional data integrity. Cryptographic barriers ensure model training happens with complete tenant privacy.
            </p>
          </div>
        </div>
      </section>

      {/* INTERACTIVE MODEL ARCHITECTURE EXPLORER & LIVE LOGS */}
      <section className="bg-surface-container-low border-y border-border-subtle py-20 w-full">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop w-full">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
            <div>
              <span className="font-label-sm text-xs text-text-muted uppercase block mb-1">Architecture Playground</span>
              <h2 className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg text-primary leading-none">
                Software Layer Explorer
              </h2>
            </div>
            <p className="font-body-md text-sm text-secondary max-w-md">
              Select any architectural layer of the Monolith ecosystem to review active production SDK methods and live-streaming console outputs.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
            {/* Left Controls */}
            <div className="lg:col-span-4 space-y-3">
              {(["ingestion", "transformer", "decoupler"] as const).map((layer) => {
                const isActive = selectedLayer === layer;
                return (
                  <button
                    key={layer}
                    onClick={() => setSelectedLayer(layer)}
                    className={`w-full p-6 text-left border rounded-none cursor-pointer transition-all ${
                      isActive 
                        ? "border-primary bg-surface-paper shadow-sm" 
                        : "border-border-subtle bg-surface-container-lowest hover:bg-surface-bright"
                    }`}
                    id={`layer-btn-${layer}`}
                  >
                    <span className="font-label-sm text-[10px] text-text-muted uppercase block mb-1">
                      {architectureLayers[layer].subtitle}
                    </span>
                    <span className="font-headline-lg text-xl text-primary block">
                      {architectureLayers[layer].title}
                    </span>
                  </button>
                );
              })}

              {/* LIVE SERVER LOG PANEL */}
              <div className="border border-border-subtle bg-primary text-on-primary p-5 rounded-none flex flex-col h-[210px]" id="live-log-panel">
                <div className="flex justify-between items-center mb-3">
                  <span className="font-label-sm text-[10px] text-on-primary-container uppercase tracking-wider block">Live Node Logs</span>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="font-label-sm text-[9px] text-emerald-400">CONNECT</span>
                  </div>
                </div>

                <div className="flex-grow overflow-y-auto font-label-sm text-[10px] text-secondary space-y-2 pr-1.5 scrollbar-thin select-none">
                  {liveLogs.map((log, idx) => (
                    <div key={idx} className="flex gap-2">
                      <span className="text-on-primary-container text-opacity-60">{log.timestamp}</span>
                      <span className={`font-bold ${
                        log.level === "SUCCESS" 
                          ? "text-emerald-400" 
                          : log.level === "WARN" 
                            ? "text-amber-400" 
                            : "text-blue-400"
                      }`}>
                        [{log.level}]
                      </span>
                      <span className="text-on-primary font-medium">{log.message}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Terminal Code Viewer */}
            <div className="lg:col-span-8 border border-border-subtle bg-surface-paper p-6 md:p-8 flex flex-col justify-between min-h-[400px]">
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-4 border-b border-border-subtle">
                  <div>
                    <h3 className="font-headline-lg text-xl text-primary">{architectureLayers[selectedLayer].title}</h3>
                    <p className="font-body-md text-xs text-text-muted mt-1">{architectureLayers[selectedLayer].subtitle}</p>
                  </div>
                  <span className="font-label-sm text-xs bg-surface-container px-3 py-1 text-primary border border-border-subtle uppercase">
                    TypeScript SDK v2.4
                  </span>
                </div>
                
                <p className="font-body-md text-sm text-secondary">
                  {architectureLayers[selectedLayer].description}
                </p>
              </div>

              {/* Code Snippet */}
              <div className="relative mt-6">
                <div className="absolute top-3 right-3 flex gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 bg-opacity-70" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500 bg-opacity-70" />
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500 bg-opacity-70" />
                </div>
                <pre className="bg-primary text-on-primary font-label-sm text-xs md:text-[13px] p-5 overflow-x-auto rounded-none border border-border-subtle select-all whitespace-pre leading-relaxed">
                  <code>{architectureLayers[selectedLayer].code}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
