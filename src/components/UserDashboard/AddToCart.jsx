"use client";

import { useEffect, useState } from "react";
import { Trash2, Plus, Minus, Loader2, CheckCircle, AlertCircle, ArrowRight, ShoppingBag } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function AddToCart() {
  const { user } = useAuth();
  const router = useRouter();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  // Load cart items from localStorage
  const loadCart = () => {
    try {
      const savedCart = localStorage.getItem("userCart");
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      } else {
        setCart([]);
      }
    } catch (e) {
      console.error("Error reading cart:", e);
    }
  };

  useEffect(() => {
    loadCart();

    // Sync if updated in other components
    window.addEventListener("cartUpdated", loadCart);
    return () => {
      window.removeEventListener("cartUpdated", loadCart);
    };
  }, []);

  // Update localStorage and notify
  const updateCart = (updatedCart) => {
    setCart(updatedCart);
    localStorage.setItem("userCart", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  // Adjust item quantity
  const handleQuantityChange = (index, delta) => {
    const updatedCart = [...cart];
    const item = updatedCart[index];
    const newQty = item.quantity + delta;

    if (newQty < 1) return;
    if (item.maxQuantity && newQty > item.maxQuantity) {
      alert(`Only ${item.maxQuantity} units available in stock.`);
      return;
    }

    item.quantity = newQty;
    updateCart(updatedCart);
  };

  // Remove item from cart
  const removeFromCart = (index) => {
    const updatedCart = cart.filter((_, i) => i !== index);
    updateCart(updatedCart);
  };

  // Clear entire cart
  const clearCart = () => {
    if (confirm("Are you sure you want to clear your cart?")) {
      updateCart([]);
    }
  };

  // Calculations
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const delivery = subtotal > 500 || subtotal === 0 ? 0 : 50;
  const gst = Math.round(subtotal * 0.05); // 5% GST
  const total = subtotal + delivery + gst;

  // Handle Checkout
  const handleCheckout = async () => {
    if (!user) {
      router.push("/login?redirect=cart");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/user/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cart: cart.map(item => ({
            batchId: item.batchId,
            quantity: item.quantity
          }))
        })
      });

      const data = await res.json();
      if (data.success) {
        // Record orders in localStorage
        const savedOrders = JSON.parse(localStorage.getItem("userOrders") || "[]");
        const newOrders = cart.map(item => ({
          cropName: item.cropName,
          quantity: item.quantity,
          price: item.price * item.quantity,
          date: new Date().toLocaleDateString("en-IN", {
            year: "numeric",
            month: "long",
            day: "numeric"
          }),
          batchId: item.batchId
        }));

        localStorage.setItem("userOrders", JSON.stringify([...newOrders, ...savedOrders]));

        // Clear cart
        localStorage.setItem("userCart", JSON.stringify([]));
        window.dispatchEvent(new Event("cartUpdated"));

        setCheckoutSuccess(true);
        setCart([]);
      } else {
        setError(data.message || "Something went wrong during checkout.");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      setError("Failed to connect to the checkout server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (checkoutSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 bg-white rounded-2xl shadow-xl border border-green-100 max-w-lg mx-auto text-center animate-fade-in mt-10">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-6">
          <CheckCircle className="w-12 h-12" />
        </div>
        <h2 className="text-3xl font-extrabold text-indigo-950 mb-3">Order Placed Successfully!</h2>
        <p className="text-gray-600 mb-8 max-w-sm">
          Your payment was processed and your order has been registered in the supply chain ledger.
        </p>
        <button
          onClick={() => {
            window.location.href = window.location.pathname + "?tab=orders";
          }}
          className="flex items-center gap-2 px-6 py-3 bg-[#90A955] text-white font-bold rounded-xl hover:bg-[#4F772D] transition shadow-md hover:shadow-lg"
        >
          View My Orders
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="max-h-screen py-4">
      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* Left Column: Cart items */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex justify-between items-center pb-4 border-b border-gray-100 mb-6">
            <h1 className="text-2xl font-bold text-indigo-950 flex items-center gap-2">
              <ShoppingBag className="w-6 h-6 text-[#90A955]" />
              My Shopping Cart
            </h1>
            {cart.length > 0 && (
              <button
                onClick={clearCart}
                className="text-sm font-semibold text-red-500 hover:text-red-700 transition flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                Clear All
              </button>
            )}
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-lg flex gap-3 items-start">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-red-800">Checkout Failed</h4>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          )}

          {cart.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4 border">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <p className="text-gray-500 text-lg font-medium">Your cart is empty.</p>
              <p className="text-gray-400 text-sm mt-1 mb-6">Explore the marketplace to add items to your cart.</p>
              <a
                href="/marketplace"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#90A955] text-white font-bold rounded-xl hover:bg-[#4F772D] transition shadow-sm"
              >
                Go to Marketplace
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          ) : (
            <div className="space-y-4 max-h-[550px] overflow-y-auto pr-1">
              {cart.map((item, index) => (
                <div
                  key={`${item.batchId}-${index}`}
                  className="border border-gray-100 p-4 rounded-xl bg-gray-50/50 hover:bg-gray-50 transition flex flex-col sm:flex-row gap-4 items-center justify-between"
                >
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="w-16 h-16 bg-white border border-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center p-1 shadow-sm overflow-hidden">
                      {item.image ? (
                        <img src={item.image} alt={item.cropName} className="object-cover w-full h-full rounded" />
                      ) : (
                        <div className="w-full h-full bg-[#ECF39E]/20 text-[#4F772D] font-bold text-xs flex items-center justify-center">
                          {item.cropName?.substring(0, 2).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-indigo-950 text-base">{item.cropName}</h3>
                      <p className="text-xs text-gray-500 mt-0.5">Batch: {item.batchId}</p>
                      <p className="text-xs text-gray-500">Weight: {item.weightGm}g per unit</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between w-full sm:w-auto sm:gap-8">
                    {/* Stepper */}
                    <div className="flex items-center border border-gray-200 bg-white rounded-lg p-1 shadow-sm">
                      <button
                        onClick={() => handleQuantityChange(index, -1)}
                        className="p-1 hover:bg-gray-100 rounded text-gray-500 transition"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="px-3 font-semibold text-gray-800 text-sm">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(index, 1)}
                        className="p-1 hover:bg-gray-100 rounded text-gray-500 transition"
                        disabled={item.maxQuantity && item.quantity >= item.maxQuantity}
                        title={item.maxQuantity && item.quantity >= item.maxQuantity ? "Max stock reached" : ""}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Price and Action */}
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-bold text-[#4F772D] text-base">₹{item.price * item.quantity}</p>
                        <p className="text-[10px] text-gray-400">₹{item.price} each</p>
                      </div>
                      <button
                        onClick={() => removeFromCart(index)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                        title="Remove Item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Pricing details */}
        {cart.length > 0 && (
          <div className="lg:col-span-4 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
            <h2 className="text-xl font-bold text-indigo-950 pb-3 border-b border-gray-100">
              Order Summary
            </h2>

            <div className="space-y-3.5">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span className="font-semibold">₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>GST (5%)</span>
                <span className="font-semibold">₹{gst}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Delivery Charges</span>
                <span>
                  {delivery === 0 ? (
                    <span className="text-green-600 font-semibold">FREE</span>
                  ) : (
                    <span className="font-semibold">₹{delivery}</span>
                  )}
                </span>
              </div>

              {delivery > 0 && (
                <div className="text-[11px] text-[#4F772D] bg-[#ECF39E]/30 p-2.5 rounded-lg border border-[#90A955]/30">
                  💡 Add items worth <strong>₹{500 - subtotal}</strong> more for <strong>FREE Delivery</strong>!
                </div>
              )}

              <div className="border-t border-gray-100 pt-3.5 flex justify-between text-base font-bold text-indigo-950">
                <span>Total Amount</span>
                <span className="text-lg text-[#4F772D]">₹{total}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-[#90A955] hover:bg-[#4F772D] disabled:bg-gray-300 text-white font-extrabold rounded-xl transition shadow-md hover:shadow-lg cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing Order...
                </>
              ) : (
                <>
                  Proceed to Checkout
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="text-[10px] text-gray-400 text-center">
              By checking out, you agree to place this record into the verifiable Ayurसाथी organic supply chain ledger.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}