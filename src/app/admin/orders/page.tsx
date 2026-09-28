// app/admin/orders/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast, Toaster } from "react-hot-toast";

interface CartItem {
  food_name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: number;
  name: string;
  email: string;
  cart_items: CartItem[];
  service_type: string;
  total_amount: number;
  scheduled_date: string | null;
  scheduled_time: string | null;
  phone_number: string | null;
  address: string | null;
  city: string | null;
  postCode: string | null;
  state: string | null;
  created_at: string;
  status: string; // Add the status field
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "scheduled" | "immediate">(
    "all"
  );

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/orders/get");
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      interface ApiResponse {
        success: boolean;
        orders: Array<
          Omit<Order, "total_amount"> & {
            total_amount: string;
            cart_items: CartItem[];
            status: string; // Ensure 'status' is received from API
          }
        >;
        error?: string;
      }

      const data: ApiResponse = await response.json();

      if (data.success) {
        const parsedOrders: Order[] = data.orders.map((orderData) => ({
          ...orderData,
          cart_items: orderData.cart_items,
          total_amount: parseFloat(orderData.total_amount),
          status: orderData.status || "pending", // Default to 'pending' if not provided
        }));
        setOrders(parsedOrders);
      } else {
        setError(data.error || "Failed to fetch orders.");
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleDeleteOrder = async (orderId: number) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this order? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      toast.loading("Deleting order...", { id: "deleteToast" });
      const response = await fetch("/api/orders/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: orderId }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success("Order deleted successfully!", { id: "deleteToast" });
        fetchOrders(); // Re-fetch orders to update the list
      } else {
        throw new Error(data.error || "Failed to delete order.");
      }
    } catch (err) {
      console.error("Deletion error:", err);
      toast.error(
        `Error deleting order: ${
          err instanceof Error ? err.message : "An unknown error occurred."
        }`,
        { id: "deleteToast" }
      );
    }
  };

  // New function to handle marking an order as complete
  const handleMarkAsComplete = async (orderId: number) => {
    try {
      toast.loading("Updating order status...", { id: "statusUpdateToast" });
      const response = await fetch("/api/orders/updateStatus", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: orderId, status: "completed" }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success("Order marked as complete!", { id: "statusUpdateToast" });
        fetchOrders(); // Re-fetch orders to update the UI
      } else {
        throw new Error(data.error || "Failed to update order status.");
      }
    } catch (err) {
      console.error("Error marking order as complete:", err);
      toast.error(
        `Error marking order as complete: ${
          err instanceof Error ? err.message : "An unknown error occurred."
        }`,
        { id: "statusUpdateToast" }
      );
    }
  };

  const scheduledOrders = orders.filter(
    (order) => order.scheduled_date && order.scheduled_time
  );
  const immediateOrders = orders.filter(
    (order) => !order.scheduled_date && !order.scheduled_time
  );

  const displayedOrders =
    filter === "scheduled"
      ? scheduledOrders
      : filter === "immediate"
      ? immediateOrders
      : orders;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl text-gray-700">Loading orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8 mt-[100px]">
      <Toaster />
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <Link
            href="/adminDashboard"
            className="inline-block bg-blue-600 text-white font-medium px-8 py-4 rounded-full shadow-lg text-lg hover:bg-blue-700 transition duration-300"
          >
            Back to Dashboard
          </Link>
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">
          All Orders
        </h1>

        <div className="mb-8 flex justify-center space-x-4">
          <button
            onClick={() => setFilter("all")}
            className={`px-6 py-3 rounded-full font-semibold transition duration-300 ${
              filter === "all"
                ? "bg-indigo-600 text-white shadow-lg"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            All Orders ({orders.length})
          </button>
          <button
            onClick={() => setFilter("scheduled")}
            className={`px-6 py-3 rounded-full font-semibold transition duration-300 ${
              filter === "scheduled"
                ? "bg-indigo-600 text-white shadow-lg"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Scheduled Orders ({scheduledOrders.length})
          </button>
          <button
            onClick={() => setFilter("immediate")}
            className={`px-6 py-3 rounded-full font-semibold transition duration-300 ${
              filter === "immediate"
                ? "bg-indigo-600 text-white shadow-lg"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Immediate Orders ({immediateOrders.length})
          </button>
        </div>

        {displayedOrders.length === 0 ? (
          <p className="text-center text-gray-600 text-lg">
            No{" "}
            {filter === "scheduled"
              ? "scheduled"
              : filter === "immediate"
              ? "immediate"
              : ""}{" "}
            orders found.
          </p>
        ) : (
          <div className="space-y-8">
            {displayedOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white shadow-lg rounded-xl p-6 border border-gray-200"
              >
                <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200">
                  <h2 className="text-2xl font-bold text-blue-800">
                    Order ID: {order.id}
                  </h2>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-500">
                      {new Date(order.created_at).toLocaleString()}
                    </span>
                    {/* Display Order Status */}
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        order.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : order.status === "cancelled"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800" // Default for 'pending', 'preparing', etc.
                      }`}
                    >
                      {order.status.charAt(0).toUpperCase() +
                        order.status.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">
                      Customer Details
                    </h3>
                    <p className="text-gray-600">
                      <span className="font-medium">Name:</span> {order.name}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium">Email:</span> {order.email}
                    </p>
                    {order.phone_number && (
                      <p className="text-gray-600">
                        <span className="font-medium">Phone:</span>{" "}
                        {order.phone_number}
                      </p>
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">
                      Service & Delivery Info
                    </h3>
                    <p className="text-gray-600 capitalize">
                      <span className="font-medium">Service Type:</span>{" "}
                      <span className="bg-blue-100 text-blue-800 font-semibold px-3 py-1 rounded-full inline-block">
                        {order.service_type}
                      </span>
                    </p>

                    {order.service_type === "delivery" && order.address && (
                      <>
                        <p className="text-gray-600">
                          <span className="font-medium">Address:</span>{" "}
                          {order.address}, {order.city}, {order.state} -{" "}
                          {order.postCode}
                        </p>
                      </>
                    )}
                    {order.scheduled_date && order.scheduled_time ? (
                      <>
                        <p className="text-gray-600">
                          <span className="font-medium">Scheduled Date:</span>{" "}
                          {new Date(order.scheduled_date).toLocaleDateString()}
                        </p>
                        <p className="text-gray-600">
                          <span className="font-medium">Scheduled Time:</span>{" "}
                          {order.scheduled_time}
                        </p>
                      </>
                    ) : (
                      <p className="text-gray-600">
                        <span className="font-medium">Order Type:</span>{" "}
                        <span className="bg-green-100 text-green-800 font-semibold px-3 py-1 rounded-full inline-block">
                          Immediate
                        </span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    Order Items
                  </h3>
                  <ul className="divide-y divide-gray-200">
                    {order.cart_items.map((item, idx) => (
                      <li
                        key={idx}
                        className="flex justify-between items-center py-2"
                      >
                        <span className="text-gray-700">
                          {item.food_name} x {item.quantity}
                        </span>
                        <span className="font-medium text-green-600">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex justify-between items-center border-t border-gray-200 pt-4">
                  <span className="text-xl font-bold text-gray-800">
                    Total Amount:
                  </span>
                  <span className="text-3xl font-extrabold text-indigo-700 ml-4">
                    ${order.total_amount.toFixed(2)}
                  </span>
                  {/* Mark as Done Button */}
                  {order.status !== "completed" && (
                    <button
                      onClick={() => handleMarkAsComplete(order.id)}
                      className="ml-6 bg-green-500 text-white font-medium px-4 py-2 rounded-lg shadow-md hover:bg-green-600 transition duration-300 flex items-center"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Mark as Done
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteOrder(order.id)}
                    className="ml-2 bg-red-500 text-white font-medium px-4 py-2 rounded-lg shadow-md hover:bg-red-600 transition duration-300 flex items-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm6 0a1 1 0 012 0v6a1 1 0 11-2 0V8z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}