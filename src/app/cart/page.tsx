//cart.tsx
"use client";

import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import Link from "next/link";

interface CartItem {
  cart_id: number;
  food_name: string;
  price: number;
  image: string;
  quantity: number;
  special_note: string;
  service_type: string; // Add service_type
}

const CartPage = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [serviceType, setServiceType] = useState<string | null>(null);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const res = await fetch("/api/cart/get");
        if (res.ok) {
          const cartData = await res.json();
          setCart(cartData);
          if (cartData.length > 0) {
            setServiceType(cartData[0].service_type); // Get service_type from first item
          }
        }
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    };
    fetchCartItems();
  }, []);

  const removeItem = async (cartId: number) => {
    try {
      const response = await fetch('/api/cart/remove', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cart_id: cartId }),
      });
      if (response.ok) {
        const cartData = await (await fetch('/api/cart/get')).json();
        setCart(cartData);
        if (cartData.length > 0) {
          setServiceType(cartData[0].service_type);
        } else {
          setServiceType(null);
        }
      }
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const clearCart = async () => {
    try {
      const response = await fetch('/api/cart/clear', {
        method: 'POST',
      });
      if (response.ok) {
        const cartData = await (await fetch('/api/cart/get')).json();
        setCart(cartData);
        setServiceType(null); // Clear service type when cart is cleared
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  const totalAmount = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const finalTotal = totalAmount;

  return (
    <div className="min-h-screen bg-gray-100 p-8 mt-32">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">ORDER DETAILS</h1>

      {cart.length === 0 ? (
        <div className="text-center text-gray-600">
          <p className="text-lg">Your cart is empty.</p>
        </div>
      ) : (
        <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-lg">
          <div className="space-y-6">
            {cart.map((item) => (
              <div key={item.cart_id} className="flex items-center space-x-4 p-4 border-b bg-gray-50 rounded-lg shadow-sm">
                <img src={item.image} alt={item.food_name} className="w-20 h-20 rounded-md object-cover" />
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-800">{item.food_name}</h3>
                  <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                  {item.special_note && <p className="text-sm italic text-gray-500">Note: {item.special_note}</p>}
                  <p className="text-lg font-bold text-blue-600">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
                <button onClick={() => removeItem(item.cart_id)} className="text-red-500 hover:text-red-700 transition">
                  <IoClose size={24} />
                </button>
              </div>
            ))}
          </div>

          <div className="mt-6 border-t pt-4">
            {serviceType && (
              <div className="flex justify-between text-lg text-gray-900 px-2 py-2">
                <span>Service Type:</span>
                <span style={{ color: "green", textTransform: "uppercase" }}>{serviceType}</span>
              </div>
            )}
            <div className="flex justify-between text-lg text-gray-900 px-2 py-2">
              <span>Sub-Total:</span>
              <span>${totalAmount.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-2xl font-bold text-gray-900 px-2 py-3 bg-gray-100 rounded-md shadow">
              <span>Total:</span>
              <span>${finalTotal.toFixed(2)}</span>
            </div>
          </div>

          <Link href="/checkout">
            <button className="w-full mt-4 py-3 text-white font-medium bg-green-600 hover:bg-green-500 rounded-lg transition text-lg shadow-md">
              Proceed to Checkout
            </button>
          </Link>

          <button onClick={clearCart} className="w-full mt-3 py-3 text-white font-medium bg-red-500 hover:bg-red-400 rounded-lg transition text-lg shadow-md">
            Clear Cart
          </button>
        </div>
      )}

      <div className="flex justify-center mt-8">
        <Link href="/viewMenu" onClick={() => sessionStorage.setItem("fromCart", "true")} className="bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold text-lg shadow-md hover:bg-blue-900 transition">
          Add More Items
        </Link>
      </div>
    </div>
  );
};

export default CartPage;