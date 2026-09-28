// app/admin/contact/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast, Toaster } from "react-hot-toast";

// Define the interface for a single contact message
interface ContactMessage {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  created_at: string; // Timestamp from the database
}

export default function ContactMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch contact messages from the API
  const fetchContactMessages = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/contact"); // Your existing GET endpoint
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      // The API returns an array of messages directly
      const data: ContactMessage[] = await response.json();
      setMessages(data);
    } catch (err) {
      console.error("Error fetching contact messages:", err);
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setLoading(false);
    }
  };

  // Function to handle deleting a contact message
  const handleDeleteMessage = async (messageId: number) => {
    // Use window.confirm for a simple confirmation dialog
    if (!window.confirm("Are you sure you want to delete this message? This action cannot be undone.")) {
      return;
    }

    try {
      toast.loading("Deleting message...", { id: "deleteMessageToast" }); // Show loading toast
      const response = await fetch("/api/contact/delete", { // New DELETE API endpoint
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: messageId }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success("Message deleted successfully!", { id: "deleteMessageToast" }); // Show success toast
        fetchContactMessages(); // Re-fetch messages to update the list
      } else {
        throw new Error(data.error || "Failed to delete message.");
      }
    } catch (err) {
      console.error("Deletion error:", err);
      toast.error(
        `Error deleting message: ${
          err instanceof Error ? err.message : "An unknown error occurred."
        }`,
        { id: "deleteMessageToast" }
      );
    }
  };

  // Fetch messages on component mount
  useEffect(() => {
    fetchContactMessages();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-xl text-gray-700">Loading contact messages...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-xl text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8 mt-[80px] sm:mt-[100px]">
      <Toaster /> {/* For displaying toasts */}
      <div className="max-w-xl sm:max-w-3xl lg:max-w-5xl mx-auto">
        <div className="text-center mb-8 mt-4">
          <Link
            href="/adminDashboard"
            className="inline-block bg-blue-600 text-white font-medium px-6 py-3 sm:px-8 sm:py-4 rounded-full shadow-lg text-base sm:text-lg hover:bg-blue-700 transition duration-300 transform hover:scale-105"
          >
            Back to Dashboard
          </Link>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-8 text-center leading-tight">
          Customer Contact Messages
        </h1>

        {messages.length === 0 ? (
          <p className="text-center text-gray-600 text-lg sm:text-xl p-6 bg-white rounded-lg shadow-md">
            No contact messages found.
          </p>
        ) : (
          <div className="space-y-6 sm:space-y-8">
            {messages.map((message) => (
              <div
                key={message.id}
                className="bg-white shadow-lg rounded-xl p-5 sm:p-6 border border-gray-200 hover:shadow-xl transition duration-300"
              >
                <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 pb-4 border-b border-gray-200">
                  <h2 className="text-xl sm:text-2xl font-bold text-blue-800 mb-2 sm:mb-0">
                    Message from: {message.name}
                  </h2>
                  <span className="text-sm text-gray-500">
                    {new Date(message.created_at).toLocaleString()}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 md:gap-x-8 mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">
                      Contact Details
                    </h3>
                    <p className="text-gray-600 break-words">
                      <span className="font-medium">Email:</span> {message.email}
                    </p>
                    {message.phone && (
                      <p className="text-gray-600 break-words">
                        <span className="font-medium">Phone:</span>{" "}
                        {message.phone}
                      </p>
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2 mt-4 md:mt-0">
                      Message Details
                    </h3>
                    {message.subject && (
                      <p className="text-gray-600 break-words">
                        <span className="font-medium">Subject:</span>{" "}
                        {message.subject}
                      </p>
                    )}
                    <div className="text-gray-600 mt-2">
                      <span className="font-medium">Message:</span>{" "}
                      <div className="bg-gray-50 p-3 rounded-md border border-gray-200 text-gray-800 italic mt-1 max-h-40 overflow-y-auto">
                        {message.message}
                      </div>
                    </div>
                  </div>
                </div>
                {/* Delete Button */}
                <div className="flex justify-end items-center border-t border-gray-200 pt-4">
                  <button
                    onClick={() => handleDeleteMessage(message.id)}
                    className="ml-2 bg-red-500 text-white font-medium px-4 py-2 rounded-lg shadow-md hover:bg-red-600 transition duration-300 flex items-center text-sm sm:text-base"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm6 0a1 1 0 012 0v6a1 1 0 11-2 0V8z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Delete Message
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