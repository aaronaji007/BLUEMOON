"use client";

import { useState, useEffect, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SubscribeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SubscribeModal: React.FC<SubscribeModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"; // Prevent scrolling when modal is open
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setMessageType("");

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        setMessage("🎉 Subscribed successfully!");
        setMessageType("success");
        setName("");
        setEmail("");
      } else if (response.status === 409) {
        setMessage("⚠ You are already subscribed!");
        setMessageType("error");
      } else {
        setMessage(data?.error || "❌ Something went wrong!");
        setMessageType("error");
      }
    } catch {
      setLoading(false);
      setMessage("❌ Failed to connect. Please try again later.");
      setMessageType("error");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white p-6 rounded-2xl shadow-xl w-96 max-h-screen overflow-auto"
            role="dialog"
            aria-modal="true"
            initial={{ y: -50, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -50, opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
          >
            {/* Heading */}
            <motion.h2
              className="text-2xl font-bold mb-4 text-center text-blue-600"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              🎁 Subscribe for Exclusive Offers
            </motion.h2>

            {/* Subscription Form */}
            <form onSubmit={handleSubmit} className="flex flex-col">
              <motion.input
                type="text"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border p-3 mb-3 rounded-xl focus:ring-2 focus:ring-blue-500 shadow-sm text-black" // Added text-black
                required
                autoFocus
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              />
              <motion.input
                type="email"
                placeholder="Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border p-3 mb-3 rounded-xl focus:ring-2 focus:ring-blue-500 shadow-sm text-black" // Added text-black
                required
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              />
              <motion.button
                type="submit"
                className="bg-gradient-to-r from-blue-500 to-blue-700 text-white py-3 rounded-xl font-bold text-lg hover:scale-105 transition-transform"
                disabled={loading}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {loading ? "Subscribing..." : "Subscribe"}
              </motion.button>
            </form>

            {/* Message with Color Coding */}
            {message && (
              <motion.p
                className={`mt-3 text-center text-lg font-semibold ${
                  messageType === "success" ? "text-green-600" : "text-red-600"
                }`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {message}
              </motion.p>
            )}

            {/* Close Button */}
            <motion.button
              onClick={onClose}
              className="mt-4 text-red-600 hover:underline block w-full text-center font-medium text-lg"
              aria-label="Close subscription modal"
              whileHover={{ scale: 1.1 }}
            >
              ❌ Close
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SubscribeModal;