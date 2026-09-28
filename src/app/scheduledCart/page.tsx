"use client";

import React, { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import Link from "next/link";

interface ScheduledCartItem {
    scheduled_cart_id: number;
    food_name: string;
    price: number;
    image: string;
    quantity: number;
    special_note: string;
    scheduled_date: string;
    scheduled_time: string;
    service_type: string;
}

const ScheduledCart = () => {
    const [scheduledCartItems, setScheduledCartItems] = useState<ScheduledCartItem[]>([]);
    const [service, setService] = useState<string>("");
    const [date, setDate] = useState<string>("");
    const [time, setTime] = useState<string>("");

    useEffect(() => {
        const fetchScheduledCartItems = async () => {
            try {
                const res = await fetch("/api/scheduledcart/get");
                if (res.ok) {
                    const data = await res.json();
                    setScheduledCartItems(data);
                    if (data.length > 0) {
                        setService(data[0].service_type);
                        setDate(new Date(data[0].scheduled_date).toLocaleDateString());
                        setTime(data[0].scheduled_time);
                    }
                } else {
                    console.error("Failed to fetch scheduled cart items");
                }
            } catch (error) {
                console.error("Error fetching scheduled cart items:", error);
            }
        };
        fetchScheduledCartItems();
    }, []);

    const removeItem = async (scheduled_cart_id: number) => {
        try {
            const response = await fetch('/api/scheduledcart/delete', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ scheduled_cart_id }),
            });
            if (response.ok) {
                const cartData = await (await fetch('/api/scheduledcart/get')).json();
                setScheduledCartItems(cartData);
            }
        } catch (error) {
            console.error('Error removing item:', error);
        }
    };

    const clearCart = async () => {
        try {
            const response = await fetch('/api/scheduledcart/clear', {
                method: 'POST',
            });
            if (response.ok) {
                const cartData = await (await fetch('/api/scheduledcart/get')).json();
                setScheduledCartItems(cartData);
            }
        } catch (error) {
            console.error('Error clearing scheduled cart:', error);
        }
    };

    const totalAmount = scheduledCartItems.reduce((acc, item: ScheduledCartItem) => acc + item.price * item.quantity, 0);
    const discount = scheduledCartItems.length > 0 && scheduledCartItems[0].service_type === "pickup" ? totalAmount * 0.1 : 0;
    const deliveryCharge = scheduledCartItems.length > 0 && scheduledCartItems[0].service_type === "delivery" ? 0 : 0;
    const finalTotal = totalAmount - discount + deliveryCharge;
    return (
      <div className="min-h-screen bg-gray-100 p-8 mt-32">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">
              SCHEDULED ORDER DETAILS
          </h1>
  
          {scheduledCartItems.length === 0 ? (
              <div className="text-center text-gray-600">
                  <p className="text-lg">Your scheduled cart is empty.</p>
                  <Link
                      href="/viewScheduleMenu"
                      className="text-blue-600 mt-4 inline-block text-lg font-semibold hover:underline"
                  >
                      Continue Scheduling
                  </Link>
              </div>
          ) : (
              <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-lg">
                  <div className="space-y-6">
                      {scheduledCartItems.map((item) => (
                          <div
                              key={item.scheduled_cart_id}
                              className="flex items-center space-x-4 p-4 border-b bg-gray-50 rounded-lg shadow-sm"
                          >
                              <img
                                  src={item.image}
                                  alt={item.food_name}
                                  className="w-20 h-20 rounded-md object-cover"
                              />
                              <div className="flex-1">
                                  <h3 className="text-lg font-bold text-gray-800">
                                      {item.food_name}
                                  </h3>
                                  <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                                  {item.special_note && (
                                      <p className="text-sm italic text-gray-500">
                                          Note: {item.special_note}
                                      </p>
                                  )}
                                  <p className="text-lg font-bold text-blue-600">
                                      ${(item.price * item.quantity).toFixed(2)}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                      Scheduled Date: {new Date(item.scheduled_date).toLocaleDateString()}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                      Scheduled Time: {item.scheduled_time}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                      Service Type: {item.service_type}
                                  </p>
                              </div>
                              <button
                                  onClick={() => removeItem(item.scheduled_cart_id)}
                                  className="text-red-500 hover:text-red-700 transition"
                              >
                                  <IoClose size={24} />
                              </button>
                          </div>
                      ))}
                  </div>
  
                  <div className="mt-6 text-center space-y-2 bg-gray-100 p-4 rounded-lg shadow-md">
                      <p className="text-xl font-bold text-gray-800">
                          Service: <span className="text-blue-600">{service}</span>
                      </p>
                      <p className="text-lg text-gray-700">
                          📅 Date: <span className="font-medium">{date}</span>
                      </p>
                      <p className="text-lg text-gray-700">
                          ⏰ Time: <span className="font-medium">{time}</span>
                      </p>
                  </div>
  
                  <div className="mt-6 border-t pt-4">
                      <div className="flex justify-between text-lg text-gray-900 px-2 py-2">
                          <span>Sub-Total:</span>
                          <span>${totalAmount.toFixed(2)}</span>
                      </div>
  
                      {scheduledCartItems.length > 0 && scheduledCartItems[0].service_type === "pickup" && (
                          <div className="flex justify-between text-lg text-green-600 px-2 py-2">
                              <span>Discount (Pickup -10%):</span>
                              <span>-${discount.toFixed(2)}</span>
                          </div>
                      )}
  
                      {scheduledCartItems.length > 0 && scheduledCartItems[0].service_type === "delivery" && (
                          <div className="flex justify-between text-lg text-gray-900 px-2 py-2">
                              <span>Delivery Charge:</span>
                              <span>${deliveryCharge.toFixed(2)}</span>
                          </div>
                      )}
  
                      <div className="flex justify-between text-2xl font-bold text-gray-900 px-2 py-3 bg-gray-100 rounded-md shadow">
                          <span>Total:</span>
                          <span>${finalTotal.toFixed(2)}</span>
                      </div>
                  </div>
  
                  <Link href="/scheduledCheckoutPage">
                      <button className="w-full mt-4 py-3 text-white font-medium bg-green-600 hover:bg-green-500 rounded-lg transition text-lg shadow-md">
                          Proceed to Checkout
                      </button>
                  </Link>
  
                  <button
                      onClick={clearCart}
                      className="w-full mt-3 py-3 text-white font-medium bg-red-500 hover:bg-red-400 rounded-lg transition text-lg shadow-md"
                  >
                      Clear Cart
                  </button>
              </div>
          )}
  
            <div className="flex justify-center mt-8">
                <Link
                    href={{
                        pathname: "/viewScheduleMenu",
                        query: {
                            service: service,
                            date: date,
                            time: time,
                            fromCart: true,
                        },
                    }}
                    className="bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold text-lg shadow-md hover:bg-blue-900 transition"
                >
                    Add More Items
                </Link>
            </div>
      </div>
  );
};

export default ScheduledCart;