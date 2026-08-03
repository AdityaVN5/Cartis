import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CartItem } from "../types";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  updateQuantity: (index: number, newQty: number) => void;
  removeItem: (index: number) => void;
  clearCart: () => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cart,
  updateQuantity,
  removeItem,
  clearCart,
}: CartDrawerProps) {
  const [promoCode, setPromoCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoError, setPromoError] = useState("");
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);

  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const discountAmount = (subtotal * discountPercent) / 100;
  const shipping = subtotal > 200 || subtotal === 0 ? 0 : 25;
  const tax = (subtotal - discountAmount) * 0.08;
  const total = subtotal - discountAmount + shipping + tax;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === "CARTIS10" || promoCode.trim().toUpperCase() === "MONOLITH10") {
      setDiscountPercent(10);
      setPromoError("");
    } else {
      setPromoError("Invalid code. Try CARTIS10");
    }
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsCheckingOut(true);
    setTimeout(() => {
      setIsCheckingOut(false);
      setOrderConfirmed(true);
      clearCart();
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Slide-over panel */}
        <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="w-screen max-w-md bg-surface border-l border-border-subtle flex flex-col justify-between shadow-2xl z-50 text-on-surface"
            id="cart-drawer-panel"
          >
            {/* Header */}
            <div className="p-6 border-b border-border-subtle flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-xl text-primary">shopping_bag</span>
                <h2 className="font-headline-lg text-lg text-primary font-bold">Shopping Bag</h2>
                <span className="text-xs font-mono bg-surface-container-low px-2 py-0.5 border border-border-subtle">
                  {cart.length} {cart.length === 1 ? "item" : "items"}
                </span>
              </div>

              <button
                onClick={onClose}
                className="text-text-muted hover:text-primary p-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            {/* Content Body */}
            {orderConfirmed ? (
              <div className="p-8 text-center flex flex-col items-center justify-center flex-1 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-950 text-emerald-400 flex items-center justify-center border border-emerald-800">
                  <span className="material-symbols-outlined text-3xl">check_circle</span>
                </div>
                <h3 className="font-headline-lg text-xl text-primary font-bold">Order Confirmed!</h3>
                <p className="font-body-md text-xs text-text-muted leading-relaxed max-w-xs">
                  Your order #CRT-88291 has been dispatched to Cartis Neural Fulfillment. Tracking info sent to your email.
                </p>
                <div className="p-4 bg-surface-paper border border-border-subtle text-left w-full text-xs font-mono space-y-1">
                  <p>Order ID: CRT-88291</p>
                  <p>Estimated Delivery: 2 Business Days</p>
                  <p>Stock Allocation: Warehouse A-04</p>
                </div>
                <button
                  onClick={() => {
                    setOrderConfirmed(false);
                    onClose();
                  }}
                  className="w-full bg-primary text-on-primary py-3 text-xs font-body-md hover:bg-neutral-800 cursor-pointer"
                >
                  Continue Shopping
                </button>
              </div>
            ) : cart.length === 0 ? (
              <div className="p-12 text-center flex flex-col items-center justify-center flex-1 space-y-3">
                <span className="material-symbols-outlined text-4xl text-text-muted">shopping_cart</span>
                <h3 className="font-headline-lg text-base text-primary font-bold">Your bag is empty</h3>
                <p className="font-body-md text-xs text-text-muted">
                  Explore our sample products and add items to your cart.
                </p>
                <button
                  onClick={onClose}
                  className="mt-2 bg-primary text-on-primary px-6 py-2.5 text-xs font-body-md hover:bg-neutral-800 cursor-pointer"
                >
                  Browse Store
                </button>
              </div>
            ) : (
              <>
                {/* Cart Items List */}
                <div className="flex-1 overflow-y-auto p-6 divide-y divide-border-subtle">
                  {cart.map((item, idx) => (
                    <div key={`${item.product.id}-${idx}`} className="py-4 flex gap-4 first:pt-0 last:pb-0">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        referrerPolicy="no-referrer"
                        className="w-20 h-24 object-cover bg-surface-container-low border border-border-subtle"
                      />

                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between">
                            <h4 className="font-body-md text-xs font-bold text-primary line-clamp-1">
                              {item.product.name}
                            </h4>
                            <button
                              onClick={() => removeItem(idx)}
                              className="text-text-muted hover:text-red-400 text-xs ml-2 cursor-pointer"
                            >
                              ✕
                            </button>
                          </div>
                          <p className="font-label-sm text-[11px] text-text-muted mt-1">
                            Size: {item.selectedSize} • Color: {item.selectedColor}
                          </p>
                        </div>

                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center border border-border-subtle text-xs">
                            <button
                              onClick={() => updateQuantity(idx, item.quantity - 1)}
                              className="px-2 py-0.5 hover:bg-surface-container-low cursor-pointer"
                            >
                              -
                            </button>
                            <span className="px-3 font-mono">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(idx, item.quantity + 1)}
                              className="px-2 py-0.5 hover:bg-surface-container-low cursor-pointer"
                            >
                              +
                            </button>
                          </div>

                          <span className="font-headline-lg text-sm text-primary font-bold">
                            ${(item.product.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer Totals & Checkout */}
                <div className="p-6 border-t border-border-subtle bg-surface-paper space-y-4">
                  {/* Promo Form */}
                  <form onSubmit={handleApplyPromo} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Promo code (CARTIS10)"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="flex-1 bg-background border border-border-subtle px-3 py-1.5 text-xs font-body-md text-primary focus:outline-none focus:border-primary"
                    />
                    <button
                      type="submit"
                      className="bg-primary text-on-primary px-3 py-1.5 text-xs font-body-md hover:bg-neutral-800 cursor-pointer"
                    >
                      Apply
                    </button>
                  </form>
                  {promoError && <p className="text-[10px] text-red-400">{promoError}</p>}
                  {discountPercent > 0 && (
                    <p className="text-[10px] text-emerald-400 font-mono">
                      10% CARTIS VIP Discount Applied!
                    </p>
                  )}

                  {/* Summary Breakdown */}
                  <div className="space-y-1.5 text-xs font-body-md border-t border-border-subtle/50 pt-3">
                    <div className="flex justify-between text-text-muted">
                      <span>Subtotal</span>
                      <span className="font-mono">${subtotal.toFixed(2)}</span>
                    </div>

                    {discountAmount > 0 && (
                      <div className="flex justify-between text-emerald-400 font-mono">
                        <span>Discount</span>
                        <span>-${discountAmount.toFixed(2)}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-text-muted">
                      <span>Shipping</span>
                      <span className="font-mono">
                        {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
                      </span>
                    </div>

                    <div className="flex justify-between text-text-muted">
                      <span>Estimated Tax (8%)</span>
                      <span className="font-mono">${tax.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between text-sm font-bold text-primary border-t border-border-subtle pt-2">
                      <span>Total</span>
                      <span className="font-mono">${total.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <form onSubmit={handleCheckoutSubmit}>
                    <button
                      type="submit"
                      disabled={isCheckingOut}
                      className="w-full bg-primary text-on-primary py-3 text-xs font-body-md font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                      id="cart-checkout-btn"
                    >
                      {isCheckingOut ? (
                        <>
                          <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                          Processing Neural Payment...
                        </>
                      ) : (
                        `Checkout • $${total.toFixed(2)}`
                      )}
                    </button>
                  </form>
                </div>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}
