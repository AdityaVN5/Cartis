import React, { useState } from "react";
import { UserRole } from "../types";

interface NavigationProps {
  currentPage: string;
  setPage: (page: string) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  cartCount: number;
  openCart: () => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
}

export default function Navigation({
  currentPage,
  setPage,
  userRole,
  setUserRole,
  cartCount,
  openCart,
  selectedCategory,
  setSelectedCategory,
}: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Retailer links vs Customer links
  const retailerNavItems = [
    { id: "dashboard", label: "Dashboard" },
    { id: "forecasting", label: "Demand Forecasting" },
    { id: "inventory", label: "Inventory Optimization" },
    { id: "recommendations", label: "Recommendation Analytics" },
    { id: "copilot", label: "AI Copilot" },
    { id: "product-analytics", label: "Product Analytics" },
    { id: "model-health", label: "Monitoring & Model Health" },
  ];

  const customerNavItems = [
    { id: "shop-all", label: "Shop All", cat: "All" },
    { id: "outerwear", label: "Outerwear", cat: "Outerwear" },
    { id: "footwear", label: "Footwear", cat: "Footwear" },
    { id: "tailored", label: "Tailored", cat: "Tailored Essentials" },
    { id: "tech", label: "Tech Accessories", cat: "Tech Accessories" },
  ];

  const handleLogoClick = () => {
    if (userRole === "customer") {
      setPage("shop");
      setSelectedCategory("All");
    } else {
      setPage("dashboard");
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <nav className="w-full top-0 sticky bg-surface border-b border-border-subtle z-50 glass-panel">
      <div className="flex justify-between items-center h-20 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        {/* Brand Logo */}
        <div className="flex items-center gap-4">
          <div
            onClick={handleLogoClick}
            className="font-headline-lg text-headline-lg tracking-tighter text-primary cursor-pointer hover:opacity-80 transition-opacity select-none flex items-center gap-2"
            id="nav-logo"
          >
            CARTIS
            <span className="text-[10px] font-mono uppercase bg-surface-container-low border border-border-subtle px-2 py-0.5 tracking-normal text-text-muted font-normal">
              {userRole === "customer" ? "STORE" : "ENTERPRISE"}
            </span>
          </div>
        </div>

        {/* Dynamic Navigation Links (Desktop) */}
        <div className="hidden lg:flex items-center gap-6 h-full">
          {userRole === "customer" &&
            customerNavItems.map((item) => {
              const isActive = currentPage === "shop" && selectedCategory === item.cat;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setPage("shop");
                    setSelectedCategory(item.cat);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className={`font-body-md text-xs md:text-sm cursor-pointer transition-colors duration-200 h-full flex items-center relative ${
                    isActive
                      ? "text-primary border-b-2 border-primary font-bold pt-[2px]"
                      : "text-text-muted hover:text-primary"
                  }`}
                  id={`nav-link-${item.id}`}
                >
                  {item.label}
                </button>
              );
            })}
        </div>

        {/* Trailing Actions: Customer & Retailer Role Switcher Buttons */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Cart Icon in Customer Mode */}
          {userRole === "customer" && (
            <button
              onClick={openCart}
              className="relative p-2 text-primary hover:opacity-80 cursor-pointer flex items-center justify-center mr-1"
              title="View Cart"
              id="nav-cart-btn"
            >
              <span className="material-symbols-outlined text-2xl">shopping_bag</span>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] font-mono font-bold w-5 h-5 rounded-full flex items-center justify-center border border-white">
                  {cartCount}
                </span>
              )}
            </button>
          )}

          {/* Role Switcher Toggle Buttons: Customer (Plain White) & Retailer (Black) */}
          <div className="flex items-center p-1 bg-surface-paper border border-border-subtle shadow-sm gap-1" id="role-toggle-group">
            {/* Customer Button (Plain White) */}
            <button
              onClick={() => {
                setUserRole("customer");
                setPage("shop");
              }}
              className={`font-body-md text-xs md:text-sm px-3 md:px-4 py-2 font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                userRole === "customer"
                  ? "bg-white text-black border border-black shadow-md font-bold ring-1 ring-black"
                  : "bg-white text-neutral-800 border border-neutral-300 opacity-80 hover:opacity-100"
              }`}
              id="nav-customer-btn"
            >
              {userRole === "customer" && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
              )}
              Customer
            </button>

            {/* Retailer Button (Black Background) */}
            <button
              onClick={() => {
                setUserRole("retailer");
              }}
              className={`font-body-md text-xs md:text-sm px-3 md:px-4 py-2 font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                userRole === "retailer"
                  ? "bg-black text-white border border-black shadow-md font-bold ring-1 ring-neutral-700"
                  : "bg-black text-white border border-black opacity-80 hover:opacity-100"
              }`}
              id="nav-retailer-btn"
            >
              {userRole === "retailer" && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              )}
              Retailer
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-primary p-2 focus:outline-none cursor-pointer"
            aria-label="Toggle Menu"
            id="nav-mobile-toggle"
          >
            <span className="material-symbols-outlined select-none" style={{ fontSize: "28px" }}>
              {mobileMenuOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden w-full bg-surface border-b border-border-subtle flex flex-col px-margin-mobile py-6 gap-3 animate-fade-in"
          id="mobile-dropdown"
        >
          <p className="font-label-sm text-[10px] uppercase text-text-muted tracking-wider px-3">
            {userRole === "customer" ? "Store Navigation" : "Enterprise Navigation"}
          </p>

          {userRole === "customer" ? (
            customerNavItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setPage("shop");
                  setSelectedCategory(item.cat);
                  setMobileMenuOpen(false);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className={`text-left font-body-md text-sm py-2 px-3 ${
                  currentPage === "shop" && selectedCategory === item.cat
                    ? "text-primary font-bold border-l-2 border-primary bg-surface-container-low"
                    : "text-text-muted hover:text-primary"
                }`}
              >
                {item.label}
              </button>
            ))
          ) : (
            <div className="px-3 py-2 text-xs font-mono text-text-muted bg-surface-container-low border border-border-subtle">
              Operational Command Center Active
            </div>
          )}

          <div className="h-px bg-border-subtle my-2" />

          {/* Mobile Role Switcher */}
          <div className="flex items-center gap-2 px-3 pt-2">
            <span className="text-xs text-text-muted">Mode:</span>
            <button
              onClick={() => {
                setUserRole("customer");
                setPage("shop");
                setMobileMenuOpen(false);
              }}
              className="bg-white text-black border border-black px-3 py-1 text-xs font-bold"
            >
              Customer
            </button>
            <button
              onClick={() => {
                setUserRole("retailer");
                setMobileMenuOpen(false);
              }}
              className="bg-black text-white border border-black px-3 py-1 text-xs font-bold"
            >
              Retailer
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
