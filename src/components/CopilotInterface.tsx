import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  PanelLeftClose,
  PanelLeftOpen,
  X,
  Plus,
  MessageSquare,
  Trash2,
  CheckCircle,
  ChevronLeft,
  BarChart,
  Zap,
  Paperclip,
  ArrowUp,
  Package,
  Sparkles,
  Briefcase,
  Cpu
} from "lucide-react";

function parseMarkdownInline(text: string): React.ReactNode[] {
  // Matches bold (**text**) and code (`text`) inline markdown
  const regex = /(\*\*.*?\*\*|`.*?`)/g;
  const parts = text.split(regex);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index} className="font-bold text-primary">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={index} className="px-1.5 py-0.5 bg-surface-container-low text-primary font-mono text-[11px] border border-border-subtle">{part.slice(1, -1)}</code>;
    }
    return part;
  });
}

function MarkdownRenderer({ text }: { text: string }) {
  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];
  
  let inTable = false;
  let tableRows: string[][] = [];
  
  let inCodeBlock = false;
  let codeLines: string[] = [];
  let codeLang = "";
  
  let currentListItems: { text: string; type: "bullet" | "ordered" }[] = [];

  const flushTable = (key: number) => {
    if (tableRows.length > 0) {
      const headers = tableRows[0];
      const rows = tableRows.slice(1).filter(row => {
        return !row.every(c => c.trim().match(/^:?-+:?$/));
      });
      elements.push(
        <div key={`table-${key}`} className="overflow-x-auto my-3 border border-border-subtle">
          <table className="w-full text-xs font-mono border-collapse bg-surface-paper">
            <thead>
              <tr className="bg-surface border-b border-border-subtle text-left">
                {headers.map((h, i) => (
                  <th key={i} className="p-2 font-bold text-primary">{h.trim()}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rIdx) => (
                <tr key={rIdx} className="border-b border-border-subtle/50 hover:bg-neutral-50/50">
                  {row.map((cell, cIdx) => (
                    <td key={cIdx} className="p-2 text-text-muted">{parseMarkdownInline(cell.trim())}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      tableRows = [];
      inTable = false;
    }
  };

  const flushList = (key: number) => {
    if (currentListItems.length > 0) {
      const listType = currentListItems[0].type;
      if (listType === "bullet") {
        elements.push(
          <ul key={`list-${key}`} className="list-disc pl-5 my-2 space-y-1 text-xs md:text-sm">
            {currentListItems.map((item, idx) => (
              <li key={idx}>{parseMarkdownInline(item.text)}</li>
            ))}
          </ul>
        );
      } else {
        elements.push(
          <ol key={`list-${key}`} className="list-decimal pl-5 my-2 space-y-1 text-xs md:text-sm">
            {currentListItems.map((item, idx) => (
              <li key={idx}>{parseMarkdownInline(item.text)}</li>
            ))}
          </ol>
        );
      }
      currentListItems = [];
    }
  };

  const flushCodeBlock = (key: number) => {
    if (codeLines.length > 0) {
      elements.push(
        <div key={`code-${key}`} className="relative my-3">
          {codeLang && (
            <div className="bg-surface border-t border-x border-border-subtle px-3 py-1 text-[10px] font-mono text-text-muted select-none flex justify-between items-center">
              <span>{codeLang}</span>
            </div>
          )}
          <pre className="bg-primary text-on-primary p-4 overflow-x-auto text-xs font-mono leading-relaxed border border-border-subtle max-h-[300px]">
            <code>{codeLines.join("\n")}</code>
          </pre>
        </div>
      );
      codeLines = [];
      inCodeBlock = false;
      codeLang = "";
    }
  };

  for (let idx = 0; idx < lines.length; idx++) {
    const line = lines[idx];
    const trimmed = line.trim();

    // 1. Handle Code Blocks
    if (trimmed.startsWith("```")) {
      if (inCodeBlock) {
        flushCodeBlock(idx);
      } else {
        if (inTable) flushTable(idx);
        if (currentListItems.length > 0) flushList(idx);
        inCodeBlock = true;
        codeLang = trimmed.slice(3).trim();
      }
      continue;
    }

    if (inCodeBlock) {
      codeLines.push(line);
      continue;
    }

    // 2. Handle Tables
    if (trimmed.startsWith("|")) {
      if (currentListItems.length > 0) flushList(idx);
      inTable = true;
      const cells = line.split("|").slice(1, -1);
      tableRows.push(cells);
      continue;
    } else {
      if (inTable) {
        flushTable(idx);
      }
    }

    // 3. Handle Lists
    const bulletMatch = trimmed.match(/^([•\*\-])\s+(.*)/);
    const orderedMatch = trimmed.match(/^(\d+)\.\s+(.*)/);

    if (bulletMatch) {
      if (currentListItems.length > 0 && currentListItems[0].type !== "bullet") {
        flushList(idx);
      }
      currentListItems.push({ text: bulletMatch[2], type: "bullet" });
      continue;
    } else if (orderedMatch) {
      if (currentListItems.length > 0 && currentListItems[0].type !== "ordered") {
        flushList(idx);
      }
      currentListItems.push({ text: orderedMatch[2], type: "ordered" });
      continue;
    } else {
      if (currentListItems.length > 0) {
        flushList(idx);
      }
    }

    // 4. Headers and Paragraphs
    if (trimmed === "") {
      elements.push(<div key={idx} className="h-2" />);
    } else if (trimmed.startsWith("###")) {
      elements.push(
        <h4 key={idx} className="text-xs font-bold text-primary uppercase font-mono tracking-wider mt-4 mb-2">
          {parseMarkdownInline(trimmed.slice(3).trim())}
        </h4>
      );
    } else if (trimmed.startsWith("##")) {
      elements.push(
        <h3 key={idx} className="text-sm font-bold text-primary font-mono tracking-tight mt-4 mb-2">
          {parseMarkdownInline(trimmed.slice(2).trim())}
        </h3>
      );
    } else if (trimmed.startsWith("#")) {
      elements.push(
        <h2 key={idx} className="text-base font-bold text-primary font-mono tracking-tight mt-4 mb-2">
          {parseMarkdownInline(trimmed.slice(1).trim())}
        </h2>
      );
    } else {
      elements.push(
        <p key={idx} className="text-xs md:text-sm leading-relaxed">
          {parseMarkdownInline(line)}
        </p>
      );
    }
  }

  if (inCodeBlock) flushCodeBlock(lines.length);
  if (inTable) flushTable(lines.length);
  if (currentListItems.length > 0) flushList(lines.length);

  return <div className="space-y-1">{elements}</div>;
}

interface CopilotMessage {
  id: string;
  sender: "user" | "copilot";
  text: string;
  time: string;
  agentId?: "inventory" | "recommendation" | "executive" | "general";
  dataCard?: {
    title: string;
    items: { label: string; value: string; badge?: string }[];
    actionLabel?: string;
    onAction?: () => void;
  };
}

const AGENTS = [
  {
    id: "inventory",
    name: "Inventory Agent",
    icon: Package,
    color: "text-blue-600 bg-blue-50 border-blue-200",
    badgeColor: "bg-blue-100 text-blue-800 border-blue-300",
    description: "Computes replenishment targets, balances holding costs against stockout penalties, and factors in lead times and service-level requirements.",
    keywords: ["inventory", "replenish", "holding", "stockout", "lead", "service", "warehouse", "po", "restock", "order", "sku", "stock"]
  },
  {
    id: "recommendation",
    name: "Recommendation Agent",
    icon: Sparkles,
    color: "text-emerald-600 bg-emerald-50 border-emerald-200",
    badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-300",
    description: "Suggests which products to push based on inventory/sales data.",
    keywords: ["recommend", "recommendation", "suggest", "bought together", "push", "sales data", "co-occurrence", "bundle", "affinity", "cross-sell", "affinities"]
  },
  {
    id: "executive",
    name: "Executive Insights Agent",
    icon: Briefcase,
    color: "text-purple-600 bg-purple-50 border-purple-200",
    badgeColor: "bg-purple-100 text-purple-800 border-purple-300",
    description: "Aggregates outputs from all other agents into leadership-ready summaries — margin risk, forecast variance, campaign ROI — for dashboard consumption.",
    keywords: ["executive", "insight", "aggregate", "leader", "leadership", "summary", "margin", "risk", "variance", "forecast variance", "roi", "campaign", "report", "financial"]
  }
] as const;

interface ChatSession {
  id: string;
  title: string;
  updatedAt: string;
  messages: CopilotMessage[];
}

interface CopilotInterfaceProps {
  onClose: () => void;
}

const INITIAL_SESSIONS: ChatSession[] = [
  {
    id: "sess-1",
    title: "📦 Tokyo Inventory Re-allocation",
    updatedAt: "Just now",
    messages: [
      {
        id: "m-1",
        sender: "copilot",
        text: "Hello. I am Cartis Copilot, synchronized with your 3 regional fulfillment centers (Tokyo, London, NYC). How can I assist your supply chain today?",
        time: "09:00 AM",
      },
    ],
  },
  {
    id: "sess-2",
    title: "⚠️ Q3 Stockout Anomaly Risk",
    updatedAt: "2 hours ago",
    messages: [
      {
        id: "m-2",
        sender: "copilot",
        text: "Telemetry alert: 3 high-margin SKUs show heightened stockout probability over the next 7 business days.",
        time: "07:15 AM",
        dataCard: {
          title: "Flagged High-Risk SKUs",
          items: [
            { label: "Cartis Modular Trench Parka (SKU-9904)", value: "14 units left", badge: "STOCKOUT 3 DAYS" },
            { label: "NPU Cyber Runner Sneakers (SKU-8821)", value: "28 units left", badge: "STOCKOUT 5 DAYS" },
            { label: "Cartis Ceramic Tech Sunglasses (SKU-4419)", value: "18 units left", badge: "STOCKOUT 6 DAYS" },
          ],
          actionLabel: "Generate Emergency PO to Factory A",
        },
      },
    ],
  },
  {
    id: "sess-3",
    title: "🏷️ Dynamic Outerwear Pricing",
    updatedAt: "Yesterday",
    messages: [
      {
        id: "m-3",
        sender: "copilot",
        text: "Outerwear demand elasticity is currently +18% higher in northern Europe. Increasing price point by +$20 maintains 92% conversion while raising projected gross margin by $42,000.",
        time: "Yesterday",
      },
    ],
  },
];

export default function CopilotInterface({ onClose }: CopilotInterfaceProps) {
  const [sessions, setSessions] = useState<ChatSession[]>(INITIAL_SESSIONS);
  const [activeSessionId, setActiveSessionId] = useState<string>("sess-1");
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [poExecuted, setPoExecuted] = useState(false);
  const [activeAgentId, setActiveAgentId] = useState<"auto" | "inventory" | "recommendation" | "executive" | "general">("auto");

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeSession = sessions.find((s) => s.id === activeSessionId) || sessions[0];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeSession?.messages, isLoading]);

  const handleNewChat = () => {
    const newId = `sess-${Date.now()}`;
    const newSession: ChatSession = {
      id: newId,
      title: "New Intelligence Query",
      updatedAt: "Just now",
      messages: [
        {
          id: `m-${Date.now()}`,
          sender: "copilot",
          text: "Cartis Copilot session initialized. Ask me anything regarding demand forecasting, stock re-allocation, purchase order generation, or margin tuning.",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ],
    };
    setSessions([newSession, ...sessions]);
    setActiveSessionId(newId);
    setIsSidebarOpen(false);
  };

  const handleDeleteSession = (idToDelete: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (sessions.length <= 1) return;
    const filtered = sessions.filter((s) => s.id !== idToDelete);
    setSessions(filtered);
    if (activeSessionId === idToDelete) {
      setActiveSessionId(filtered[0].id);
    }
  };

  const handleSend = async (userQuery?: string) => {
    const textToSend = userQuery || input;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: CopilotMessage = {
      id: `usr-${Date.now()}`,
      sender: "user",
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    // Update session title if first user prompt
    setSessions((prevSessions) =>
      prevSessions.map((sess) => {
        if (sess.id === activeSessionId) {
          const isFirstUserMsg = sess.messages.filter((m) => m.sender === "user").length === 0;
          const updatedTitle = isFirstUserMsg
            ? textToSend.slice(0, 30) + (textToSend.length > 30 ? "..." : "")
            : sess.title;

          return {
            ...sess,
            title: updatedTitle,
            updatedAt: "Just now",
            messages: [...sess.messages, userMsg],
          };
        }
        return sess;
      })
    );

    if (!userQuery) setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:8000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: textToSend,
          role: "retailer",
          agent_id: activeAgentId,
        }),
      });

      if (!response.ok) {
        throw new Error(`API response error: ${response.statusText}`);
      }

      const data = await response.json();

      let validAgentId: "inventory" | "recommendation" | "executive" | "general" = "executive";
      if (data.agent_id && ["inventory", "recommendation", "executive", "general"].includes(data.agent_id)) {
        validAgentId = data.agent_id;
      }

      const copilotMsg: CopilotMessage = {
        id: data.id || `cpl-${Date.now()}`,
        sender: "copilot",
        text: data.text || "No response received.",
        time: data.time || new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        agentId: validAgentId,
        dataCard: data.dataCard || undefined,
      };

      setSessions((prevSessions) =>
        prevSessions.map((sess) => {
          if (sess.id === activeSessionId) {
            return {
              ...sess,
              messages: [...sess.messages, copilotMsg],
            };
          }
          return sess;
        })
      );
    } catch (err) {
      console.warn("Backend API call failed:", err);

      const copilotMsg: CopilotMessage = {
        id: `cpl-err-${Date.now()}`,
        sender: "copilot",
        text: `⚠️ **Connection Error**: Unable to reach backend server. Please verify python backend is running on port 8000.\n\n*Error details: ${err instanceof Error ? err.message : String(err)}*`,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        agentId: "general",
      };

      setSessions((prevSessions) =>
        prevSessions.map((sess) => {
          if (sess.id === activeSessionId) {
            return {
              ...sess,
              messages: [...sess.messages, copilotMsg],
            };
          }
          return sess;
        })
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleActionClick = (cardTitle: string) => {
    setPoExecuted(true);
    setTimeout(() => setPoExecuted(false), 4000);

    const confirmationMsg: CopilotMessage = {
      id: `conf-${Date.now()}`,
      sender: "copilot",
      text: `✅ **Action Executed Successfully**: ${cardTitle} has been authorized and dispatched to Cartis ERP system. Real-time telemetry updated across all nodes.`,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setSessions((prevSessions) =>
      prevSessions.map((sess) => {
        if (sess.id === activeSessionId) {
          return {
            ...sess,
            messages: [...sess.messages, confirmationMsg],
          };
        }
        return sess;
      })
    );
  };

  return (
    <div className="fixed inset-0 z-[100] bg-background text-primary flex flex-col md:flex-row overflow-hidden font-sans selection:bg-neutral-200 selection:text-black">
      {/* Toast Notification when PO Executed */}
      <AnimatePresence>
        {poExecuted && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-5 left-1/2 -translate-x-1/2 z-[120] bg-primary text-on-primary border border-neutral-700 px-5 py-3 rounded-none shadow-xl flex items-center gap-3 text-xs font-mono"
          >
            <CheckCircle className="text-emerald-400 w-5 h-5 shrink-0" />
            <span>Purchase Order Authorized & Pushed to Factory API</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* LEFT SIDEBAR (ChatGPT Style - Compact Light Architectural Theme) */}
      <div
        className={`${
          isSidebarOpen ? "w-56 opacity-100 border-r" : "w-0 opacity-0 border-none overflow-hidden"
        } fixed md:relative inset-y-0 left-0 z-30 bg-surface-paper border-border-subtle flex flex-col justify-between shrink-0 h-full transition-all duration-300 ease-in-out`}
      >
        {/* Top Header & New Chat Button */}
        <div className="p-2.5 flex flex-col gap-2">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded-none bg-black shrink-0" />
              <span className="font-bold text-xs tracking-tight text-primary">Cartis Copilot</span>
            </div>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="text-text-muted hover:text-primary p-1 cursor-pointer"
              title="Collapse sidebar"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handleNewChat}
            className="w-full flex items-center gap-2 bg-surface hover:bg-neutral-100 border border-border-subtle rounded-none px-2.5 py-2 text-[11px] font-semibold text-primary transition-colors cursor-pointer shadow-xs text-left"
          >
            <Plus className="w-4 h-4 text-primary shrink-0" />
            <span>New Chat Session</span>
          </button>
        </div>

        {/* Chat Sessions History List */}
        <div className="flex-1 overflow-y-auto px-1.5 space-y-0.5 py-1 scrollbar-none">
          <p className="px-2 text-[9px] font-mono text-text-muted uppercase tracking-wider mb-1.5">
            Chat Sessions
          </p>

          {sessions.map((sess) => {
            const isActive = sess.id === activeSessionId;
            return (
              <div
                key={sess.id}
                onClick={() => {
                  setActiveSessionId(sess.id);
                  if (window.innerWidth < 768) setIsSidebarOpen(false);
                }}
                className={`group flex items-center justify-between px-2 py-1.5 rounded-none text-[11px] cursor-pointer transition-colors border ${
                  isActive
                    ? "bg-surface text-primary border-border-subtle font-bold shadow-2xs"
                    : "text-text-muted border-transparent hover:bg-surface/60 hover:text-primary"
                }`}
              >
                <div className="flex items-center gap-1.5 overflow-hidden pr-1">
                  <MessageSquare className={`w-3.5 h-3.5 shrink-0 ${isActive ? "text-primary" : "text-text-muted"}`} />
                  <span className="truncate">{sess.title}</span>
                </div>

                {sessions.length > 1 && (
                  <button
                    onClick={(e) => handleDeleteSession(sess.id, e)}
                    title="Delete session"
                    className="opacity-0 group-hover:opacity-100 text-text-muted hover:text-red-500 p-0.5 transition-opacity cursor-pointer flex items-center justify-center"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Sidebar Status */}
        <div className="p-2.5 border-t border-border-subtle space-y-2 bg-surface">
          <div className="flex items-center gap-1.5 px-1">
            <span className="w-1.5 h-1.5 rounded-none bg-emerald-500 animate-pulse"></span>
            <span className="text-[10px] font-mono text-text-muted">Cartis Copilot Engine</span>
          </div>
        </div>
      </div>

      {/* MAIN CHATGPT WORKSPACE */}
      <div className="flex-1 flex flex-col h-full bg-background relative overflow-hidden">
        {/* Top Header Bar */}
        <div className="h-14 border-b border-border-subtle px-4 md:px-6 flex items-center justify-between bg-surface shrink-0 z-20">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-primary hover:bg-neutral-100 p-2 border border-border-subtle rounded-none cursor-pointer flex items-center justify-center transition-colors shadow-2xs"
              title={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
              id="toggle-copilot-sidebar-btn"
            >
              {isSidebarOpen ? <PanelLeftClose className="w-5 h-5" /> : <PanelLeftOpen className="w-5 h-5" />}
            </button>
          </div>

          {/* Single Top Right Close AI Copilot Button */}
          <button
            onClick={onClose}
            className="bg-primary hover:bg-neutral-800 text-on-primary font-bold text-xs px-4 py-2 rounded-none flex items-center gap-1.5 cursor-pointer transition-colors shadow-sm"
            id="close-copilot-top-btn"
          >
            <X className="w-4 h-4" />
            <span>Close AI Copilot</span>
          </button>
        </div>

        {/* Multi-Agent Orchestrator Status Panel */}
        <div className="bg-surface border-b border-border-subtle px-4 py-3 shrink-0">
          <div className="max-w-3xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-primary shrink-0 animate-pulse" />
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono font-bold uppercase text-primary tracking-wider block">
                  Agentic Dispatch Center
                </span>
                <span className="text-[9px] font-mono text-text-muted block">
                  Active neural dispatchers based on operational queries
                </span>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-1.5 md:gap-2 w-full max-w-xl">
              {/* Auto Dynamic Router Option */}
              <button
                onClick={() => {
                  setActiveAgentId("auto");
                  setInput("");
                }}
                className={`p-2 border rounded-none transition-all text-left flex flex-col justify-between cursor-pointer ${
                  activeAgentId === "auto"
                    ? "bg-surface-paper border-primary shadow-xs ring-1 ring-primary/20"
                    : "bg-surface border-border-subtle hover:bg-neutral-50"
                }`}
                title="Dynamically route to the best suited agent based on your query"
              >
                <div className="flex items-center justify-between gap-1 w-full mb-1">
                  <span className="p-0.5 text-rose-600 bg-rose-50 border border-rose-100">
                    <Cpu className="w-3.5 h-3.5 animate-spin-slow" />
                  </span>
                  <span className="relative flex h-1.5 w-1.5">
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${activeAgentId === "auto" ? "bg-rose-400" : "bg-neutral-300"}`}></span>
                    <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${activeAgentId === "auto" ? "bg-rose-500" : "bg-neutral-400"}`}></span>
                  </span>
                </div>
                <span className="text-[9px] font-bold text-primary truncate block leading-tight">
                  Auto Router
                </span>
              </button>

              {AGENTS.map((agent) => {
                const AgentIcon = agent.icon;
                const isSelected = activeAgentId === agent.id;
                return (
                  <button
                    key={agent.id}
                    onClick={() => {
                      setActiveAgentId(agent.id);
                      setInput(
                        agent.id === "inventory"
                          ? "Compute replenishment targets and safety stock factoring lead times"
                          : agent.id === "recommendation"
                          ? "Suggest which products to push based on inventory/sales data"
                          : "Aggregate leadership summary: margin risk, forecast variance, ROI"
                      );
                    }}
                    className={`p-2 border rounded-none transition-all text-left flex flex-col justify-between cursor-pointer ${
                      isSelected
                        ? "bg-surface-paper border-primary shadow-xs ring-1 ring-primary/20"
                        : "bg-surface border-border-subtle hover:bg-neutral-50"
                    }`}
                    title={agent.description}
                  >
                    <div className="flex items-center justify-between gap-1 w-full mb-1">
                      <span className={`p-0.5 ${agent.color}`}>
                        <AgentIcon className="w-3.5 h-3.5" />
                      </span>
                      <span className="relative flex h-1.5 w-1.5">
                        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isSelected ? "bg-emerald-400" : "bg-neutral-300"}`}></span>
                        <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${isSelected ? "bg-emerald-500" : "bg-neutral-400"}`}></span>
                      </span>
                    </div>
                    <span className="text-[9px] font-bold text-primary truncate block leading-tight">
                      {agent.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Chat Feed Area */}
        <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 space-y-6 bg-background">
          <div className="max-w-3xl mx-auto space-y-6">
            {activeSession.messages.length === 0 ? (
              /* Fresh Session Greeting */
              <div className="py-12 text-center space-y-6">
                <div className="w-10 h-10 rounded-none bg-black mx-auto shadow-sm" />
                <div>
                  <h2 className="text-xl font-bold text-primary mb-1">Cartis AI Operations Copilot</h2>
                  <p className="text-xs text-text-muted font-mono">
                    Conversational Neural Intelligence for Supply Chain & Retail Decision Making
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left max-w-xl mx-auto pt-4">
                  {[
                    { label: "⚠️ Stockout Risks", prompt: "Which SKUs are at risk of stockout in the next 7 days?" },
                    { label: "📦 Restock Plan", prompt: "Generate an automated restock plan for Tokyo Warehouse" },
                    { label: "🏷️ Pricing Optimization", prompt: "Suggest dynamic margin optimization for outerwear items" },
                    { label: "📊 Accuracy Score", prompt: "What is our current model prediction accuracy and MAE score?" },
                  ].map((card, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(card.prompt)}
                      className="p-3 bg-surface hover:bg-surface-paper border border-border-subtle rounded-none text-left transition-colors cursor-pointer group shadow-sm"
                    >
                      <span className="text-xs font-semibold text-primary block mb-1 group-hover:underline">
                        {card.label}
                      </span>
                      <span className="text-[11px] text-text-muted line-clamp-2">{card.prompt}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* Active Message Stream */
              activeSession.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 md:gap-4 ${
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {msg.sender === "copilot" && (
                    <div className={`w-7 h-7 rounded-none flex items-center justify-center shrink-0 border ${
                      msg.agentId === "inventory"
                        ? "bg-blue-50 text-blue-600 border-blue-200"
                        : msg.agentId === "recommendation"
                        ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                        : msg.agentId === "executive"
                        ? "bg-purple-50 text-purple-600 border-purple-200"
                        : "bg-black text-white border-black"
                    }`}>
                      {msg.agentId === "inventory" ? (
                        <Package className="w-4 h-4" />
                      ) : msg.agentId === "recommendation" ? (
                        <Sparkles className="w-4 h-4" />
                      ) : msg.agentId === "executive" ? (
                        <Briefcase className="w-4 h-4" />
                      ) : (
                        <Cpu className="w-4 h-4 text-white" />
                      )}
                    </div>
                  )}

                  <div
                    className={`max-w-[88%] sm:max-w-[80%] space-y-2 ${
                      msg.sender === "user" ? "items-end" : "items-start"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-text-muted uppercase">
                        {msg.sender === "user" ? (
                          "You"
                        ) : msg.agentId ? (
                          <span className="font-bold text-primary">
                            🤖 {msg.agentId === "inventory" ? "Inventory Agent" : msg.agentId === "recommendation" ? "Recommendation Agent" : "Executive Insights Agent"}
                          </span>
                        ) : (
                          "Cartis Copilot"
                        )}
                      </span>
                      <span className="text-[10px] font-mono text-text-muted">• {msg.time}</span>
                    </div>

                    {/* Message Bubble Body */}
                    <div
                      className={`p-4 rounded-none text-xs md:text-sm leading-relaxed border ${
                        msg.sender === "user"
                          ? "bg-primary text-on-primary border-primary shadow-md"
                          : "bg-surface text-primary border-border-subtle shadow-sm space-y-3"
                      }`}
                    >
                      <MarkdownRenderer text={msg.text} />

                      {/* Interactive Telemetry / PO Data Card */}
                      {msg.dataCard && (
                        <div className="mt-3 p-4 bg-surface-paper border border-border-subtle rounded-none space-y-3">
                          <div className="flex items-center justify-between border-b border-border-subtle pb-2">
                            <h4 className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1.5 font-mono">
                              <BarChart className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              {msg.dataCard.title}
                            </h4>
                          </div>

                          <div className="space-y-2">
                            {msg.dataCard.items.map((item, idx) => (
                              <div
                                key={idx}
                                className="flex flex-col sm:flex-row sm:items-center justify-between text-xs py-1 border-b border-border-subtle/50 gap-1"
                              >
                                <span className="text-text-muted font-mono">{item.label}:</span>
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-primary font-mono">{item.value}</span>
                                  {item.badge && (
                                    <span className="text-[9px] font-mono bg-amber-100 text-amber-800 border border-amber-300 px-1.5 py-0.2 rounded-none font-bold">
                                      {item.badge}
                                    </span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>

                          {msg.dataCard.actionLabel && (
                            <button
                              onClick={() => handleActionClick(msg.dataCard!.title)}
                              className="w-full mt-2 bg-primary hover:bg-neutral-800 text-on-primary font-bold py-2.5 px-3 rounded-none text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                            >
                              <Zap className="w-3.5 h-3.5" />
                              {msg.dataCard.actionLabel}
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {msg.sender === "user" && (
                    <div className="w-8 h-8 rounded-none bg-surface-paper border border-border-subtle text-primary flex items-center justify-center font-bold text-xs shrink-0 font-mono">
                      U
                    </div>
                  )}
                </div>
              ))
            )}

            {isLoading && (
              <div className="flex items-center gap-3 text-xs font-mono text-text-muted p-2.5 bg-surface rounded-none border border-border-subtle w-fit shadow-sm">
                <span className="w-2 h-2 rounded-none bg-emerald-500 animate-ping"></span>
                <span>Cartis Neural Engine processing response...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Bottom Input Area */}
        <div className="p-4 bg-surface border-t border-border-subtle shrink-0">
          <div className="max-w-3xl mx-auto space-y-2">
            {/* Quick Suggestion Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {[
                "⚠️ Stockout Risks",
                "📦 Tokyo Restock",
                "🏷️ Pricing Plan",
                "📊 Model MAE Score",
              ].map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    const prompts: Record<string, string> = {
                      "⚠️ Stockout Risks": "Which SKUs are at risk of stockout in the next 7 days?",
                      "📦 Tokyo Restock": "Generate an automated restock plan for Tokyo Warehouse",
                      "🏷️ Pricing Plan": "Suggest dynamic margin optimization for outerwear items",
                      "📊 Model MAE Score": "What is our current model prediction accuracy and MAE score?",
                    };
                    handleSend(prompts[chip] || chip);
                  }}
                  className="text-[11px] bg-surface-paper hover:bg-surface border border-border-subtle text-primary px-3 py-1 rounded-none shrink-0 transition-colors cursor-pointer font-medium"
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Input Box Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="relative bg-surface border border-border-subtle focus-within:border-primary rounded-none p-2 shadow-sm flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Message Cartis Copilot regarding inventory, stockout risks, POs..."
                className="flex-1 bg-transparent text-primary placeholder-text-muted text-xs md:text-sm px-2 focus:outline-none"
              />

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  title="Attach file or dataset"
                  className="text-text-muted hover:text-primary p-1.5 transition-colors cursor-pointer flex items-center justify-center"
                  onClick={() => alert("Dataset attachment enabled: CSV/JSON supply chain logs attached.")}
                >
                  <Paperclip className="w-4 h-4" />
                </button>

                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="bg-primary text-on-primary hover:bg-neutral-800 disabled:opacity-30 p-2 rounded-none transition-all cursor-pointer flex items-center justify-center font-bold"
                  id="send-copilot-msg-btn"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
              </div>
            </form>

            <p className="text-[10px] text-center text-text-muted font-mono pt-1">
              Cartis Copilot v3.4 Omni Model • Real-Time Supply Chain Decision Support
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
