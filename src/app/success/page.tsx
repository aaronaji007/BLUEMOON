"use client";

import Link from "next/link";
import { FaCheckCircle } from "react-icons/fa";
import { useEffect, useState, useRef } from "react";

interface CartItem {
  price: number;
  quantity: number;
  service_type: string;
  food_name: string;
  image: string;
}

interface ScheduledCartItem {
  price: number;
  quantity: number;
  service_type: string;
  food_name: string;
  scheduled_cart_id: number;
  special_note: string;
  scheduled_date: string;
  scheduled_time: string;
}

interface CustomerDetails {
  phone_number?: string;
  address?: string;
  city?: string;
  postCode?: string;
  state?: string;
}

export default function SuccessPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [scheduledCart, setScheduledCart] = useState<ScheduledCartItem[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [serviceType, setServiceType] = useState<string | null>(null);
  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("credit-card");
  const [finalTotal, setFinalTotal] = useState(0);
  const orderSaved = useRef(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [customerEmail, setCustomerEmail] = useState("");
  const [cardholderName, setCardholderName] = useState("");
  const [isScheduledOrder, setIsScheduledOrder] = useState(false);
  const [scheduledDate, setScheduledDate] = useState<string | null>(null);
  const [scheduledTime, setScheduledTime] = useState<string | null>(null);
  const [customerDetails, setCustomerDetails] = useState<CustomerDetails | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionIdFromUrl = params.get("session_id");
    setSessionId(sessionIdFromUrl);
    setIsScheduledOrder(params.get("scheduled") === "true");
    console.log("Session ID from URL:", sessionIdFromUrl); // Debugging
  }, []);

  const fetchCustomerInfo = async (email: string) => {
    try {
      const response = await fetch(`/api/user?email=${email}`);
      if (response.ok) {
        const userData = await response.json();
        setCustomerDetails(userData);
        console.log("Fetched customer details:", userData); // Debugging
      } else {
        console.error("Failed to fetch customer info");
        setCustomerDetails(null);
      }
    } catch (error) {
      console.error("Error fetching customer info:", error);
      setCustomerDetails(null);
    }
  };

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const isScheduled = params.get("scheduled") === "true";
  
        console.log("isScheduled:", isScheduled); // Important debug line
  
        if (isScheduled) {
          const res = await fetch("/api/scheduledcart/get");
          if (res.ok) {
            const scheduledCartData = await res.json();
            setScheduledCart(scheduledCartData);
            console.log("Scheduled Cart Data:", scheduledCartData); // Debug line
            if (scheduledCartData.length > 0) {
              setServiceType(scheduledCartData[0].service_type);
              const total = scheduledCartData.reduce(
                (acc: number, item: ScheduledCartItem) => acc + item.price * item.quantity,
                0
              );
              setTotalAmount(total);
              setScheduledDate(new Date(scheduledCartData[0].scheduled_date).toLocaleDateString());
              setScheduledTime(scheduledCartData[0].scheduled_time);
            }
          } else {
            console.error("Failed to fetch scheduled cart items");
          }
        } else {
          const res = await fetch("/api/cart/get");
          if (res.ok) {
            const cartData = await res.json();
            setCart(cartData);
            console.log("Cart Data:", cartData); // Debug line
            if (cartData.length > 0) {
              setServiceType(cartData[0].service_type);
              const total = cartData.reduce(
                (acc: number, item: CartItem) => acc + item.price * item.quantity,
                0
              );
              setTotalAmount(total);
            }
          } else {
            console.error("Failed to fetch cart items");
          }
        }
        if (sessionId) {
          console.log("Fetching session details for session ID:", sessionId);
          if (sessionId && !customerDetails) {
            const params = new URLSearchParams(window.location.search);
            const emailParam = params.get("email") || "";
            const nameParam = params.get("name") || "";
            const stripeRes = await fetch(`/api/checkout?session_id=${encodeURIComponent(sessionId)}&email=${encodeURIComponent(emailParam)}&name=${encodeURIComponent(nameParam)}`);
            if (stripeRes.ok) {
              const stripeData = await stripeRes.json();
              setCustomerEmail(stripeData.email);
              setCardholderName(stripeData.name);
              if (stripeData.payment_method) {
                setPaymentMethod(stripeData.payment_method);
              }
              if (stripeData.email) {
                fetchCustomerInfo(stripeData.email);
              }
            }
          }
        }

      } catch (err) {
        console.error("Error:", err);
      }
    };
  
    fetchOrderDetails();
  }, [sessionId, isScheduledOrder]);
  
  useEffect(()=>{
      console.log("scheduledCart state: ", scheduledCart);
  },[scheduledCart]);

  useEffect(() => {
    setDeliveryCharge(serviceType === "delivery" ? 0 : 0);
    setFinalTotal(totalAmount + deliveryCharge);
  }, [totalAmount, serviceType]);

  useEffect(() => {
    const saveOrderToDatabase = async () => {
      if (orderSaved.current) return;
      if ((cart.length > 0 || scheduledCart.length > 0) && customerEmail && cardholderName && customerDetails) {
        orderSaved.current = true;
        try {
          let cartItemsForDatabase;
          if (isScheduledOrder) {
            cartItemsForDatabase = scheduledCart.map((item) => ({
              food_name: item.food_name,
              quantity: item.quantity,
              price: item.price,
            }));
          } else {
            cartItemsForDatabase = cart.map((item) => ({
              food_name: item.food_name,
              quantity: item.quantity,
              price: item.price,
            }));
          }

          const orderData = {
            name: cardholderName,
            email: customerEmail,
            cart_items: cartItemsForDatabase,
            service_type: serviceType,
            total_amount: finalTotal,
            scheduled_date: scheduledDate,
            scheduled_time: scheduledTime,
            phone_number: customerDetails.phone_number || null,
            address: customerDetails.address || null,
            city: customerDetails.city || null,
            postCode: customerDetails.postCode || null,
            state: customerDetails.state || null,
          };

          const saveOrderRes = await fetch("/api/orders", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(orderData),
          });

          if (saveOrderRes.ok) {
            try {
              await fetch(isScheduledOrder ? "/api/scheduledcart/clear" : "/api/cart/clear", { method: "POST" });
            } catch (clearErr) {
              console.error("Failed to clear cart:", clearErr);
            }
          } else {
            console.error("Failed to save order to database");
            orderSaved.current = false;
          }
        } catch (error) {
          console.error("Error saving order:", error);
          orderSaved.current = false;
        }
      }
    };

    saveOrderToDatabase();
  }, [cart, scheduledCart, customerEmail, cardholderName, serviceType, finalTotal, isScheduledOrder, scheduledDate, scheduledTime, customerDetails]);



  return (
    <div className="flex items-center justify-center min-h-screen px-4 mt-[140px] bg-gray-100 mb-12">
      <div className="relative bg-[#1E3A8A] text-white shadow-lg rounded-xl p-8 max-w-xl w-full text-center border border-gray-700">
        <FaCheckCircle className="text-green-400 text-6xl mb-4 mx-auto drop-shadow-lg" />
        <h1 className="text-3xl font-semibold mb-3">Payment Successful</h1>
        <p className="text-sm text-gray-200 mb-6">
          Thank you for your order! It&apos;s being processed and will be delivered soon.
        </p>

        <div className="mb-6 bg-gradient-to-r from-[#1A2E66] to-[#203A8E] px-6 py-4 rounded-lg shadow-lg shadow-blue-500/30 border border-blue-400/50 text-left">
          <h3 className="text-lg font-semibold text-white mb-4">👤 Customer Info</h3>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-white font-medium w-28">Cardholder:</span>
            <span className="text-gray-200 text-sm truncate">{cardholderName || ""}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-white font-medium w-28">Email:</span>
            <span className="text-gray-200 text-sm truncate">{customerEmail || ""}</span>
          </div>

          
        </div>
        {customerDetails && (
  <div className="mb-6 bg-gradient-to-r from-[#1A2E66] to-[#203A8E] px-6 py-4 rounded-lg shadow-lg shadow-blue-500/30 border border-blue-400/50 text-left">
    <h3 className="text-lg font-semibold text-yellow-200 mb-4">📞 Contact & Delivery Info</h3>
    <div className="flex items-center gap-3 mb-2">
      <span className="text-white font-medium w-28">Phone:</span>
      <span className="text-gray-200 text-sm truncate">{customerDetails.phone_number || "N/A"}</span>
    </div>
    {serviceType === "delivery" ||serviceType === "DELIVERY"  && customerDetails.address && (
      <>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-white font-medium w-28">Address:</span>
          <span className="text-gray-200 text-sm truncate">{customerDetails.address}</span>
        </div>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-white font-medium w-28">City:</span>
          <span className="text-gray-200 text-sm truncate">{customerDetails.city}</span>
        </div>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-white font-medium w-28">State:</span>
          <span className="text-gray-200 text-sm truncate">{customerDetails.state}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-white font-medium w-28">Post Code:</span>
          <span className="text-gray-200 text-sm truncate">{customerDetails.postCode}</span>
        </div>
      </>
    )}
    {serviceType === "pickup" && !customerDetails.phone_number && (
              <p className="text-gray-200 text-sm">Phone number not available.</p>
            )}
  </div>
)}

        

        <div className="bg-gradient-to-r from-[#1A2E66] to-[#203A8E] px-6 py-4 rounded-lg text-left shadow-lg shadow-blue-500/30 border border-blue-400/50">
          <h3 className="text-lg font-medium text-white mb-2">🛒 Order Summary</h3>
          <p className="text-lg font-medium text-yellow-200 mb-2 uppercase">Service Type - {serviceType}</p>
          <ul className="divide-y divide-gray-500/50">
            {isScheduledOrder
              ? scheduledCart.map((item, index) => (
                  <li key={index} className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-4">
                     
                      <span className="text-gray-100 text-sm font-medium">
                        {item.food_name} × {item.quantity}
                      </span>
                    </div>
                    <span className="text-green-300 font-semibold text-md">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </li>
                ))
              : cart.map((item, index) => (
                  <li key={index} className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-4">
                      <img src={item.image} alt={item.food_name} className="w-12 h-12 rounded-lg shadow-md" />
                      <span className="text-gray-100 text-sm font-medium">
                        {item.food_name} × {item.quantity}
                      </span>
                    </div>
                    <span className="text-green-300 font-semibold text-md">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </li>
                ))}
          </ul>
        </div>

        {isScheduledOrder && (
          <div className="mt-8 rounded-xl border border-blue-400/40 bg-gradient-to-br from-[#1A2E66] to-[#203A8E] p-6 shadow-lg shadow-blue-500/30 transition-all duration-300 hover:shadow-blue-600/40">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <svg
                className="w-5 h-5 text-yellow-300"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              Scheduled Order Details
            </h3>

            <div className="mt-3 space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-300">📅 Scheduled Date:</span>
                <span className="text-sm font-medium text-yellow-300">
                  {scheduledDate || "N/A"}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-300">⏰ Scheduled Time:</span>
                <span className="text-sm font-medium text-yellow-300">
                  {scheduledTime || "N/A"}
                </span>
              </div>
            </div>
          </div>
        )}


        <div className="mt-6 bg-gradient-to-r from-[#1A2E66] to-[#203A8E] px-6 py-4 rounded-lg text-left shadow-lg shadow-blue-500/30 border border-blue-400/50">
          <h3 className="text-md font-medium text-white">💳 Payment Details</h3>
          <p className="text-gray-200 text-sm mt-2">
            Payment Method: <span className="font-medium capitalize text-orange-400">{paymentMethod.replace("-", " ")}</span>
          </p>
        </div>

        <div className="mt-6 bg-gradient-to-r from-[#1A2E66] to-[#203A8E] px-6 py-4 rounded-lg text-left shadow-lg shadow-blue-500/30 border border-blue-400/50">
          <div className="flex justify-between text-sm text-gray-200">
            <span>Sub-Total:</span>
            <span>${totalAmount.toFixed(2)}</span>
          </div>
          {serviceType === "delivery" && (
            <div className="flex justify-between text-sm text-gray-200">
              <span>Delivery Charge:</span>
              <span>${deliveryCharge.toFixed(2)}</span>
            </div>
          )}
          <div className="mt-3 flex justify-between text-lg font-semibold text-white px-3 py-2 bg-gradient-to-r from-[#203A8E] to-[#203A8E] rounded-md shadow">
            <span>Total Paid:</span>
            <span className="text-yellow-400 font-bold text-2xl">${finalTotal.toFixed(2)}</span>
          </div>
        </div>

        <Link
          href="/"
          className="inline-block bg-white text-blue-700 font-medium px-6 py-3 rounded-full shadow-md mt-5 text-md border border-white hover:bg-[#1A2E66] hover:text-white transition duration-300"
        >
          ⬅️ Back to Home
        </Link>
      </div>
    </div>
  );
}