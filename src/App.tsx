import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { UserRole, Product, CartItem } from "./types";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import HomeView from "./components/HomeView";
import SolutionsView from "./components/SolutionsView";
import TechnologyView from "./components/TechnologyView";
import CompanyView from "./components/CompanyView";
import CustomerShopView from "./components/CustomerShopView";
import RetailerCommandCenter, { CommandTab } from "./components/RetailerCommandCenter";
import CartDrawer from "./components/CartDrawer";
import CustomerChatAssistant from "./components/CustomerChatAssistant";
import RetailerLoginModal from "./components/RetailerLoginModal";

export default function App() {
  const [userRole, setUserRole] = useState<UserRole>("customer");
  const [page, setPage] = useState<string>("shop");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  // Retailer Authentication state
  const [isRetailerAuthenticated, setIsRetailerAuthenticated] = useState<boolean>(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);

  // Cart State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  // Add to cart handler
  const addToCart = (product: Product, size = "M", color = "Default", qty = 1) => {
    setCart((prev) => {
      const existingIdx = prev.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedSize === size &&
          item.selectedColor === color
      );
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += qty;
        return updated;
      } else {
        return [
          ...prev,
          {
            product,
            selectedSize: size || product.sizes[0] || "M",
            selectedColor: color || product.colors[0]?.name || "Default",
            quantity: qty,
          },
        ];
      }
    });
  };

  const updateQuantity = (index: number, newQty: number) => {
    if (newQty <= 0) {
      removeFromCart(index);
      return;
    }
    setCart((prev) => {
      const updated = [...prev];
      updated[index].quantity = newQty;
      return updated;
    });
  };

  const removeFromCart = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Handle role switch cleanly
  const handleSetRole = (role: UserRole) => {
    if (role === "retailer" && !isRetailerAuthenticated) {
      setIsLoginModalOpen(true);
      return;
    }
    setUserRole(role);
    if (role === "customer") {
      setPage("shop");
    } else {
      setPage("dashboard");
    }
  };

  const validTabs: CommandTab[] = [
    "dashboard",
    "forecasting",
    "inventory",
    "recommendations",
    "copilot",
    "product-analytics",
    "model-health",
  ];
  const activeRetailerTab: CommandTab = validTabs.includes(page as CommandTab)
    ? (page as CommandTab)
    : "dashboard";

  return (
    <div className="min-h-screen bg-background text-on-background flex flex-col font-body-md" id="app-root">
      {/* Header Navigation with Customer / Retailer Toggle */}
      <Navigation
        currentPage={page}
        setPage={setPage}
        userRole={userRole}
        setUserRole={handleSetRole}
        cartCount={totalCartCount}
        openCart={() => setIsCartOpen(true)}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      {/* Main Content with Animated View Transition */}
      <main className="flex-grow flex flex-col w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${userRole}-${page}-${selectedCategory}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="w-full flex flex-col"
          >
            {userRole === "customer" ? (
              <CustomerShopView
                cart={cart}
                addToCart={addToCart}
                openCart={() => setIsCartOpen(true)}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
              />
            ) : (
              <RetailerCommandCenter
                activeTab={activeRetailerTab}
                setActiveTab={(tab) => setPage(tab)}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Slide-over Shopping Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        updateQuantity={updateQuantity}
        removeItem={removeFromCart}
        clearCart={clearCart}
      />

      {/* Floating Support Assistant for Customers */}
      {userRole === "customer" && <CustomerChatAssistant />}

      {/* Retailer Credentials Modal */}
      <AnimatePresence>
        {isLoginModalOpen && (
          <RetailerLoginModal
            isOpen={isLoginModalOpen}
            onClose={() => setIsLoginModalOpen(false)}
            onSuccess={() => {
              setIsRetailerAuthenticated(true);
              setIsLoginModalOpen(false);
              setUserRole("retailer");
              setPage("dashboard");
            }}
          />
        )}
      </AnimatePresence>

      {/* Footer */}
      <Footer setPage={setPage} />
    </div>
  );
}
