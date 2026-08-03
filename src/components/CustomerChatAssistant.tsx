import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

interface Message {
  id: string;
  sender: "user" | "assistant";
  text: string;
  time: string;
  options?: { label: string; action: () => void }[];
}

export default function CustomerChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(1);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "msg-1",
      sender: "assistant",
      text: "Welcome to CARTIS Customer Care. I am your personal AI shopping assistant. How can I assist you today?",
      time: "Just now",
    },
  ]);

  // Auto scroll to bottom of chat
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      setUnreadCount(0);
    }
  }, [messages, isOpen]);

  const handleSend = async (userText?: string) => {
    const textToSend = userText || input;
    if (!textToSend.trim()) return;

    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      sender: "user",
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!userText) setInput("");
    setIsTyping(true);

    try {
      const response = await fetch("http://localhost:8000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: textToSend,
          role: "customer",
          customer_id: 10142,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          id: data.id || `ast-${Date.now()}`,
          sender: "assistant",
          text: data.text || "Thank you for reaching out.",
          time: data.time || new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } catch (err) {
      console.warn("Backend API unavailable, using fallback:", err);
      let reply = "";
      const lower = textToSend.toLowerCase();

      if (lower.includes("track") || lower.includes("order") || lower.includes("status")) {
        reply =
          "📦 **Order Status**: Order **#CRT-89421** is currently in transit with DHL Express. Estimated delivery: Tomorrow by 2:00 PM. Tracking code: `DHL-99201481`.";
      } else if (lower.includes("size") || lower.includes("fit") || lower.includes("measurement")) {
        reply =
          "📏 **Size & Fit Guide**: CARTIS apparel features a tailored, architectural cut. For outerwear like the Trench Parka, we recommend selecting your true size. You can also use our **Neural Size Predictor** on any product page!";
      } else if (lower.includes("return") || lower.includes("refund") || lower.includes("exchange")) {
        reply =
          "↺ **Returns & Exchange Policy**: We offer a **30-day effortless return window** on all unworn items with original tags. Return labels are complimentary and included in your shipment box.";
      } else if (lower.includes("ship") || lower.includes("delivery") || lower.includes("express")) {
        reply =
          "✈️ **Worldwide Shipping**: Standard shipping (3-5 business days) is complimentary on all orders over $150. Express 24h courier delivery is available at checkout for $25.";
      } else if (lower.includes("style") || lower.includes("recommend") || lower.includes("outfit") || lower.includes("jacket")) {
        reply =
          "✨ **Style Recommendation**: Pair the **Cartis Modular Trench Parka** with our **NPU Cyber Runner Sneakers** for a sleek, modern technical look. Both items feature high weather defense and high AI demand match scores.";
      } else {
        reply =
          `Thank you for reaching out regarding "${textToSend}". Our CARTIS Concierge service is active 24/7. Is there a specific product, order number, or style you would like to explore further?`;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `ast-${Date.now()}`,
          sender: "assistant",
          text: reply,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickPrompt = (promptText: string) => {
    handleSend(promptText);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end" id="customer-chat-assistant">
      <AnimatePresence>
        {/* Chat Window */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 24 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="w-[380px] max-w-[calc(100vw-2rem)] h-[540px] bg-surface border border-border-subtle shadow-2xl flex flex-col overflow-hidden mb-4 rounded-none"
          >
            {/* Header */}
            <div className="bg-primary text-on-primary px-4 py-3.5 border-b border-border-subtle flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-8 h-8 rounded-none bg-surface-paper text-primary flex items-center justify-center border border-border-subtle font-bold text-xs font-mono">
                    M
                  </div>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-none border border-black"></span>
                </div>
                <div>
                  <h3 className="font-headline-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 text-on-primary">
                    CARTIS Assistant
                  </h3>
                  <p className="font-mono text-[10px] text-text-muted">24/7 Concierge & Care AI</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    setMessages([
                      {
                        id: "msg-reset",
                        sender: "assistant",
                        text: "Chat reset. How can CARTIS Assistant help you today?",
                        time: "Just now",
                      },
                    ])
                  }
                  title="Reset conversation"
                  className="text-text-muted hover:text-on-primary p-1 transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base">restart_alt</span>
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-text-muted hover:text-on-primary p-1 transition-colors cursor-pointer"
                  id="close-chat-assistant"
                >
                  <span className="material-symbols-outlined text-base">close</span>
                </button>
              </div>
            </div>

            {/* Messages Feed */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-surface-paper/30">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex flex-col ${
                    msg.sender === "user" ? "items-end" : "items-start"
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="font-mono text-[9px] text-text-muted uppercase">
                      {msg.sender === "user" ? "You" : "MONOLITH Care"}
                    </span>
                    <span className="font-mono text-[9px] text-text-muted">• {msg.time}</span>
                  </div>

                  <div
                    className={`p-3 text-xs font-body-md leading-relaxed rounded-none max-w-[85%] border ${
                      msg.sender === "user"
                        ? "bg-primary text-on-primary border-primary"
                        : "bg-surface text-primary border-border-subtle shadow-sm"
                    }`}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-2 text-[11px] font-mono text-text-muted p-2">
                  <span className="w-1.5 h-1.5 rounded-none bg-primary animate-ping"></span>
                  MONOLITH Assistant is typing...
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestion Chips */}
            <div className="px-3 py-2 bg-surface border-t border-border-subtle flex gap-1.5 overflow-x-auto scrollbar-none">
              {[
                "🚚 Track Order",
                "📏 Size Guide",
                "↺ Returns Policy",
                "✨ Style Advice",
              ].map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuickPrompt(chip)}
                  className="text-[11px] font-body-md px-2.5 py-1 bg-surface-container-low hover:bg-primary hover:text-on-primary border border-border-subtle text-primary shrink-0 transition-colors cursor-pointer rounded-none"
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Input Footer */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="p-3 bg-surface border-t border-border-subtle flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about orders, size, returns..."
                className="flex-1 bg-surface-paper border border-border-subtle text-xs px-3 py-2 focus:outline-none focus:border-primary text-primary"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="bg-primary text-on-primary px-3.5 py-2 text-xs font-bold hover:bg-neutral-800 disabled:opacity-40 transition-opacity cursor-pointer flex items-center justify-center rounded-none"
              >
                <span className="material-symbols-outlined text-sm">send</span>
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Launcher Trigger */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
        onClick={() => setIsOpen(!isOpen)}
        className="relative bg-primary text-on-primary p-3.5 md:p-4 rounded-none shadow-2xl border border-neutral-800 hover:bg-neutral-800 transition-colors cursor-pointer flex items-center gap-2.5 group"
        id="trigger-chat-assistant"
      >
        <span className="material-symbols-outlined text-xl">
          {isOpen ? "close" : "chat_bubble"}
        </span>
        <span className="hidden md:inline-block text-xs font-headline-lg font-bold uppercase tracking-wider pr-1">
          Support Assistant
        </span>

        {/* Unread Ping / Badge */}
        {!isOpen && unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 text-[9px] font-mono text-black font-bold items-center justify-center">
              1
            </span>
          </span>
        )}
      </motion.button>
    </div>
  );
}
