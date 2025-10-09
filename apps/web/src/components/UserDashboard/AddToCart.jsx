
"use client";

import { useEffect, useState } from "react";

export default function AddToCart() {
  const [cart, setCart] = useState([]);

  // Load cart items from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem("userCart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Remove item from cart
  const removeFromCart = (index) => {
    const updatedCart = cart.filter((_, i) => i !== index);
    setCart(updatedCart);
    localStorage.setItem("userCart", JSON.stringify(updatedCart));
  };

  // Clear entire cart
  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("userCart");
  };

  return (
    <div className="max-h-screen flex items-start justify-center py-6 bg-[#ECF39E]/30">
      <div className="w-full max-w-4xl bg-white shadow-xl rounded-2xl p-6 sm:p-10">
        <h1 className="text-3xl font-bold text-center mb-8 text-green-700">
          🛒 My Cart
        </h1>

        {cart.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">
            Your cart is empty. Add crops to your cart to see them here.
          </p>
        ) : (
          <div className="space-y-4">
            {cart.map((item, index) => (
              <div
                key={index}
                className="border p-4 rounded-lg shadow-sm bg-[#F4F9F1] flex justify-between items-center hover:shadow-md transition"
              >
                <div>
                  <p className="font-semibold text-lg text-gray-800">
                    {item.cropName}
                  </p>
                  <p className="text-gray-600">Quantity: {item.quantity}</p>
                  <p className="text-gray-600">Price: ₹{item.price}</p>
                </div>
                <button
                  onClick={() => removeFromCart(index)}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                >
                  Remove
                </button>
              </div>
            ))}

            <div className="flex justify-between mt-6">
              <button
                onClick={clearCart}
                className="px-6 py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-400 hover:text-white transition"
              >
                Clear Cart
              </button>
              <button
                className="px-6 py-3 bg-[#90A955] text-white font-semibold rounded-lg hover:bg-[#4F772D] transition"
              >
                Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}