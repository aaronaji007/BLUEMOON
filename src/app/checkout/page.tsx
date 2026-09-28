"use client";

import React, { useEffect, useState } from "react";
import { IoChevronBack } from "react-icons/io5";
import Link from "next/link";

const CheckoutPage = () => {
   const [loggedInUserInfo, setLoggedInUserInfo] = useState<{ phone_number?: string; address?: string; city?: string; postCode?: string; state?: string; first_name?: string; last_name?: string } | null>(null);
  const [totalAmount, setTotalAmount] = useState(0);
  const [serviceType, setServiceType] = useState<string | null>(null);
  const [deliveryInfo, setDeliveryInfo] = useState({
    address: "",
    city: "",
    state: "",
    postCode: "",
  });
  const [authOption, setAuthOption] = useState<"email" | "guest" | "signup" | "forgotPassword" | null>(null);
  const [emailLoginInfo, setEmailLoginInfo] = useState({
    email: "",
    password: "",
  });
  const [guestInfo, setGuestInfo] = useState({
    firstName: "",
    lastName: "",
    mobileNumber: "",
    email: "",
  });
  const [authError, setAuthError] = useState<string | null>(null);
  const [loginSuccess, setLoginSuccess] = useState<boolean>(false);
  const [guestLoginSuccess, setGuestLoginSuccess] = useState<boolean>(false);

  const [signupInfo, setSignupInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
  });
  const [forgotPasswordInfo, setForgotPasswordInfo] = useState({
    email: "",
    newPassword: "",
  });
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState<string | null>(null);
  const [signupSuccess, setSignupSuccess] = useState<boolean>(false);

  interface CartItem {
    price: number;
    quantity: number;
    service_type: string;
    food_name: string;
  }

 
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const res = await fetch("/api/cart/get");
        if (res.ok) {
          const cartData = await res.json();
          setCart(cartData);
          if (cartData.length > 0) {
            setServiceType(cartData[0].service_type);
            const total = cartData.reduce(
              (acc: number, item: CartItem) => acc + item.price * item.quantity,
              0
            );
            setTotalAmount(total);
          } else {
            setServiceType(null);
            setTotalAmount(0);
          }
        }
      } catch (error) {
        console.error("Error fetching cart data:", error);
      }
    };

    fetchCartData();
  }, []);

  const deliveryCharge = serviceType === "delivery" ? 0 : 0;
  const finalTotal = totalAmount + deliveryCharge;

  const handleLogin = async () => {
    try {
      const response = await fetch("/api/loginIn", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(emailLoginInfo),
      });

      if (response.ok) {
        console.log("Login successful");
        setAuthError(null);
        setLoginSuccess(true);
        // Fetch user info after successful login
        fetchLoggedInUserInfo(emailLoginInfo.email);
      } else {
        const errorData = await response.json();
        if (response.status === 401) {
          setAuthError(errorData.error || "Account does not exist or invalid credentials.");
        } else {
          setAuthError(errorData.error || "Failed to login.");
        }
        setLoginSuccess(false);
        setLoggedInUserInfo(null);
      }
    } catch (error) {
      console.error("Login error:", error);
      setAuthError("Failed to login.");
      setLoginSuccess(false);
      setLoggedInUserInfo(null);
    }
  };
  const fetchLoggedInUserInfo = async (email: string) => {
    try {
      const response = await fetch(`/api/user?email=${email}`);
      if (response.ok) {
        const userData = await response.json();
        console.log("Fetched user data:", userData); // What does this log?
        setLoggedInUserInfo(userData);
        console.log("loggedInUserInfo after update:", loggedInUserInfo); // Log the state *after* setting it
      } else {
        console.error("Failed to fetch user info");
        setLoggedInUserInfo(null);
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
      setLoggedInUserInfo(null);
    }
  };

  const handleGuestSubmit = async () => {
    try {
      if (!guestInfo.firstName || !guestInfo.lastName || !guestInfo.email) {
        setAuthError("Please fill in all required fields.");
        setGuestLoginSuccess(false);
        setLoginSuccess(false);
        return;
      }

      if (serviceType === "delivery" && (!deliveryInfo.address || !deliveryInfo.city || !deliveryInfo.state || !deliveryInfo.postCode)) {
        setAuthError("Please fill in all delivery information.");
        setGuestLoginSuccess(false);
        setLoginSuccess(false);
        return;
      }

      const response = await fetch("/api/guestOrder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...guestInfo, ...deliveryInfo, serviceType }),
      });

      if (response.ok) {
        setGuestLoginSuccess(true);
        setLoginSuccess(true);
        setAuthError(null);
        // For guest login, we don't have a persistent user ID to fetch further details
        setLoggedInUserInfo({ phone_number: guestInfo.mobileNumber, ...deliveryInfo });
      } else {
        const errorData = await response.json();
        setAuthError(errorData.error || "Failed to save guest info.");
        setGuestLoginSuccess(false);
        setLoginSuccess(false);
        setLoggedInUserInfo(null);
      }
    } catch (error) {
      console.error("Guest info error:", error);
      setAuthError("Failed to save guest info.");
      setGuestLoginSuccess(false);
      setLoginSuccess(false);
      setLoggedInUserInfo(null);
    }
  };

  const handleSignup = async () => {
    try {
      if (signupInfo.password !== signupInfo.confirmPassword) {
        setAuthError("Passwords do not match.");
        setSignupSuccess(false);
        return;
      }

      if (serviceType === "delivery" && (!deliveryInfo.address || !deliveryInfo.city || !deliveryInfo.state || !deliveryInfo.postCode)) {
        setAuthError("Please fill in all delivery information.");
        setSignupSuccess(false);
        return;
      }

      const response = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...signupInfo, ...deliveryInfo, serviceType }),
      });

      if (response.ok) {
        setSignupSuccess(true);
        setAuthError(null);
        
      } else {
        const errorData = await response.json();
        if (response.status === 409 && errorData.error === 'Email ID already exists') {
          setAuthError(errorData.error); // Display the specific email exists error
        } else {
          setAuthError(errorData.error || "Failed to create account.");
        }
        setSignupSuccess(false);
      }
    } catch (error) {
      console.error("Signup error:", error);
      setAuthError("Failed to create account.");
      setSignupSuccess(false);
    }
  };


  const handleProceedToPayment = async () => {
    if (!loginSuccess && !signupSuccess) {
      alert("Please login or signup first.");
      return;
    }
  
    setAuthError(null);
    console.log("Proceeding to payment...");

    const customerName = guestLoginSuccess
      ? `${guestInfo.firstName} ${guestInfo.lastName}`.trim()
      : signupSuccess
        ? `${signupInfo.firstName} ${signupInfo.lastName}`.trim()
        : loggedInUserInfo?.first_name
          ? `${loggedInUserInfo.first_name} ${loggedInUserInfo.last_name || ""}`.trim()
          : "Valued Customer";

    const customerEmail = guestLoginSuccess
      ? guestInfo.email
      : signupSuccess
        ? signupInfo.email
        : emailLoginInfo.email;
  
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: finalTotal,
          name: customerName,
          email: customerEmail,
        }),
      });
  
      if (!response.ok) {
        throw new Error(`Server error: ${response.status} ${response.statusText}`);
      }
  
      const text = await response.text(); // Read raw response as text
      console.log("Response Text:", text);
  
      try {
        const data = JSON.parse(text); // Parse JSON response
        console.log("Parsed JSON:", data);
  
        if (data.url) {
          window.location.href = data.url; // Redirect to Stripe checkout
        } else {
          throw new Error("No checkout URL received.");
        }
      } catch (jsonError) {
        throw new Error(`JSON Parse Error: ${(jsonError as Error).message}`);
      }
    } catch (error) {
      console.error("Payment Error:", (error as Error).message);
      alert(`Payment error: ${(error as Error).message}`);
    }
  };
  
  
  
  

  const handleForgotPassword = async () => {
    try {
      const response = await fetch("/api/forgotpassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(forgotPasswordInfo),
      });

      if (response.ok) {
        setForgotPasswordMessage("Successfully created!");
      } else {
        try {
          const errorData = await response.json();
          setForgotPasswordMessage(errorData.error || "Account not found.");
        } catch (jsonError) {
          try {
            const errorText = await response.text();
            console.error("Server returned HTML:", errorText);
            setForgotPasswordMessage("An unexpected error occurred. Please try again.");
          } catch (textError) {
            console.error("Failed to parse both JSON and text:", jsonError, textError);
            setForgotPasswordMessage("An unexpected error occurred. Please try again.");
          }
        }
      }
    } catch (error) {
      console.error("Forgot password error:", error);
      setForgotPasswordMessage("An error occurred.");
    }
  };

 

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 p-6 mt-32">
      <div className="max-w-2xl w-full bg-white p-8 rounded-lg shadow-lg">
      <div className="max-w-xl mx-auto space-y-4">
      {authOption === null && (
            <>
              <button
                className="w-full bg-blue-700 text-white text-lg font-medium py-3 rounded-lg shadow-md hover:bg-blue-900 transition"
                onClick={() => setAuthOption("email")}
              >
                LOGIN WITH EMAIL
              </button>
              <button
                className="w-full bg-blue-700 text-white text-lg font-medium py-3 rounded-lg shadow-md hover:bg-blue-900 transition"
                onClick={() => setAuthOption("guest")}
              >
                PROCEED AS GUEST
              </button>
            </>
          )}
          {authOption === "email" && (
            <>
              <input
                type="email"
                placeholder="Email"
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                value={emailLoginInfo.email}
                onChange={(e) => setEmailLoginInfo({ ...emailLoginInfo, email: e.target.value })}
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500" value={emailLoginInfo.password}
                onChange={(e) => setEmailLoginInfo({ ...emailLoginInfo, password: e.target.value })}
              />
              <button
                className="text-sm text-blue-600 hover:underline"
                onClick={() => setAuthOption("forgotPassword")}
              >
                Forgot Password?
              </button>
              <button
                className="w-full bg-blue-700 text-white text-lg font-medium py-3 rounded-lg shadow-md hover:bg-blue-900 transition"
                onClick={handleLogin}
              >
                Login
              </button>
              {authError && <p className="text-red-500 mt-2">{authError}</p>}
              {loginSuccess && <p className="text-green-500 mt-2">Login successful</p>}
              <p className="text-center">
                Don&apos;t have an account?{" "}
                <button className="text-blue-600 hover:underline" onClick={() => setAuthOption("signup")}>
                  Create one
                </button>
              </p>
            </>
          )}
          {authOption === "guest" && (
            <>
              <input
                type="text"
                placeholder="First Name"
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                value={guestInfo.firstName}
                onChange={(e) => setGuestInfo({ ...guestInfo, firstName: e.target.value })}
              />
              <input
                type="text"
                placeholder="Last Name"
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                value={guestInfo.lastName}
                onChange={(e) => setGuestInfo({ ...guestInfo, lastName: e.target.value })}
              />
              <input
                type="tel"
                placeholder="Mobile Number"
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                value={guestInfo.mobileNumber}
                onChange={(e) => setGuestInfo({ ...guestInfo, mobileNumber: e.target.value })}
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                value={guestInfo.email}
                onChange={(e) => setGuestInfo({ ...guestInfo, email: e.target.value })}
              />
              {serviceType === "delivery" && (
                <>
                  <input
                    type="text"
                    placeholder="Address"
                    className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    value={deliveryInfo.address}
                    onChange={(e) => setDeliveryInfo({ ...deliveryInfo, address: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="City"
                    className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    value={deliveryInfo.city}
                    onChange={(e) => setDeliveryInfo({ ...deliveryInfo, city: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="Post Code"
                    className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    value={deliveryInfo.postCode}
                    onChange={(e) => setDeliveryInfo({ ...deliveryInfo, postCode: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="State"
                    className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    value={deliveryInfo.state}
                    onChange={(e) => setDeliveryInfo({ ...deliveryInfo, state: e.target.value })}
                  />
                </>
              )}
              <button
                className="w-full bg-blue-700 text-white text-lg font-medium py-3 rounded-lg shadow-md hover:bg-blue-900 transition"
                onClick={handleGuestSubmit}
              >
                Submit
              </button>
              {guestLoginSuccess && <p className="text-green-500 mt-2">Login successful</p>}
              {authError && <p className="text-red-500 mt-2">{authError}</p>}
            </>
          )}
          {authOption === "signup" && (
            <>
              <input
                type="text"
                placeholder="First Name"
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                value={signupInfo.firstName}
                onChange={(e) => setSignupInfo({ ...signupInfo, firstName: e.target.value })}
              />
              <input
                type="text"
                placeholder="Last Name"
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                value={signupInfo.lastName}
                onChange={(e) => setSignupInfo({ ...signupInfo, lastName: e.target.value })}
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                value={signupInfo.email}
                onChange={(e) => setSignupInfo({ ...signupInfo, email: e.target.value })}
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                value={signupInfo.password}
                onChange={(e) => setSignupInfo({ ...signupInfo, password: e.target.value })}
              />
              <input
                type="password"
                placeholder="Confirm Password"
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                value={signupInfo.confirmPassword}
                onChange={(e) => setSignupInfo({ ...signupInfo, confirmPassword: e.target.value })}
              />
              <input
                type="tel"
                placeholder="Phone Number"
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                value={signupInfo.phoneNumber}
                onChange={(e) => setSignupInfo({ ...signupInfo, phoneNumber: e.target.value })}
              />
              {serviceType === "delivery" && (
                <>
                  <input
                    type="text"
                    placeholder="Address"
                    className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    value={deliveryInfo.address}
                    onChange={(e) => setDeliveryInfo({ ...deliveryInfo, address: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="City"
                    className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    value={deliveryInfo.city}
                    onChange={(e) => setDeliveryInfo({ ...deliveryInfo, city: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="State"
                    className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    value={deliveryInfo.state}
                    onChange={(e) => setDeliveryInfo({ ...deliveryInfo, state: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="Post Code"
                    className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    value={deliveryInfo.postCode}
                    onChange={(e) => setDeliveryInfo({ ...deliveryInfo, postCode: e.target.value })}
                  />
                </>
              )}
              <button className="w-full bg-green-700 text-white text-lg font-medium py-3 rounded-lg shadow-md hover:bg-green-900 transition"
                onClick={handleSignup}
              >
                Sign Up
              </button>
              {authError && <p className="text-red-500 mt-2">{authError}</p>}
              {signupSuccess && <p className="text-green-500 mt-2">Successfully created!</p>}
            </>
          )}
          {authOption === "forgotPassword" && (
            <>
              <input
                type="email"
                placeholder="Email"
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                value={forgotPasswordInfo.email}
                onChange={(e) => setForgotPasswordInfo({ ...forgotPasswordInfo, email: e.target.value })}
              />
              <input
                type="password"
                placeholder="New Password"
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                value={forgotPasswordInfo.newPassword}
                onChange={(e) => setForgotPasswordInfo({ ...forgotPasswordInfo, newPassword: e.target.value })}
              />
              <button
                className="w-full bg-blue-700 text-white text-lg font-medium py-3 rounded-lg shadow-md hover:bg-blue-900 transition"
                onClick={handleForgotPassword}
              >
                Change Password
              </button>
              {forgotPasswordMessage && (
                <p
                  className={`mt-4 text-center ${
                    forgotPasswordMessage === "Successfully created!" ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {forgotPasswordMessage}
                </p>
              )}
            </>
          )}
        </div>
        {(loginSuccess || guestLoginSuccess) && loggedInUserInfo && (
  <div className="mt-6 bg-white p-6 rounded-lg shadow-lg">
    <h2 className="text-xl font-bold mb-2">Contact Information</h2>
    <p className="text-gray-700 mb-2">
      <strong>Phone Number:</strong> {loggedInUserInfo.phone_number || loggedInUserInfo.phone_number || ''}
    </p>
    {serviceType === "delivery" && loggedInUserInfo.address && (
      <>
        <p className="text-gray-700 mb-1">
          <strong>Address:</strong> {loggedInUserInfo.address}
        </p>
        {loggedInUserInfo.city && (
          <p className="text-gray-700 mb-1">
            <strong>City:</strong> {loggedInUserInfo.city}
          </p>
        )}
        {loggedInUserInfo.state && (
          <p className="text-gray-700 mb-1">
            <strong>State:</strong> {loggedInUserInfo.state}
          </p>
        )}
        {loggedInUserInfo.postCode && (
          <p className="text-gray-700 mb-1">
            <strong>Post Code:</strong> {loggedInUserInfo.postCode}
          </p>
        )}
      </>
    )}
  </div>
)}


        <div className="max-w-xl mx-auto mt-6 bg-white p-6 rounded-lg shadow-lg">
          
          
          {serviceType && (
            <h2 className="text-xl font-bold mb-2">
              Service Type: <span className="ml-2 text-green-600 capitalize">{serviceType}</span>
            </h2>
          )}

          {/* Display Cart Items */}
      <div className="mt-4 bg-gradient-to-br from-blue-50 to-blue-100 shadow-md rounded-lg p-5">
        <h3 className="text-xl font-bold mb-4 text-blue-800">🛒 Order Summary</h3>
        <ul className="divide-y divide-blue-300">
          {cart.map((item, index) => (
            <li key={index} className="flex items-center justify-between py-3">
              <div className="flex items-center gap-4">
                <span className="text-blue-900 font-medium">{item.food_name}</span>
                <span className="text-blue-700 bg-blue-200 px-2 py-1 rounded-md text-sm">x {item.quantity}</span>
              </div>
              <span className="text-green-700 font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
            </li>
          ))}
        </ul>
      </div>



          <div className="mt-6 border-t pt-4">
            <div className="flex justify-between text-lg text-gray-900 px-2 py-2">
              <span>Sub-Total:</span>
              <span>${totalAmount.toFixed(2)}</span>
            </div>

            {serviceType === "delivery" && (
              <div className="flex justify-between text-lg text-gray-900 px-2 py-2">
                <span>Delivery Charge :</span>
                <span>${deliveryCharge.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-2xl font-bold text-gray-900 px-2 py-3 bg-gray-100 rounded-md shadow">
              <span>Total:</span>
              <span>${finalTotal.toFixed(2)}</span>
            </div>
          </div>

          <button
            className="w-full mt-4 py-3 text-white font-medium bg-green-600 hover:bg-green-500 rounded-lg transition text-lg shadow-md cursor-pointer"
            onClick={handleProceedToPayment}
          >
            {process.env.NEXT_PUBLIC_ENABLE_STRIPE === "true" ? "Proceed To Payment" : "Place Order (Pay on Delivery / Pickup)"}
          </button>

        </div>

        <div className="flex justify-center mt-8">
          <Link
            href="/cart"
            className="bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold text-lg shadow-md hover:bg-blue-900 transition flex items-center"
          >
            <IoChevronBack className="mr-2" /> Back to Cart
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;