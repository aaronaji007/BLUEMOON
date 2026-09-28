// app/admin-reviews/page.tsx
"use client";
import { useEffect, useState, useCallback } from "react";
import { format } from "date-fns";
import { FiTrash2 } from "react-icons/fi"; // For the delete icon
import EditUserSidebar from "@/app/components/editSidebar"; // Assuming this path is correct

interface Review {
  id: number;
  name: string;
  gender?: string;
  rating: number;
  experience: string;
  created_at: string;
  email?: string; // Added email
  phone_number?: string; // Added phone_number
}

export default function AdminReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Custom modal state and functions to replace alert/confirm
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmModalMessage, setConfirmModalMessage] = useState("");
  const [confirmAction, setConfirmAction] = useState<(() => void) | null>(null);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertModalMessage, setAlertModalMessage] = useState("");

  const openConfirmModal = (message: string, action: () => void) => {
    setConfirmModalMessage(message);
    setConfirmAction(() => action);
    setShowConfirmModal(true);
  };

  const closeConfirmModal = () => {
    setShowConfirmModal(false);
    setConfirmAction(null);
  };

  const handleConfirm = () => {
    if (confirmAction) {
      confirmAction();
    }
    closeConfirmModal();
  };

  const openAlertModal = (message: string) => {
    setAlertModalMessage(message);
    setShowAlertModal(true);
  };

  const closeAlertModal = () => {
    setShowAlertModal(false);
  };


  const fetchReviews = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/reviews");
      if (response.ok) {
        const data = await response.json();
        setReviews(data);
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to fetch reviews");
        console.error("Failed to fetch reviews:", errorData);
      }
    } catch (err) {
      setError("An unexpected error occurred while fetching reviews.");
      console.error("Error fetching reviews:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleDelete = async (id: number) => {
    openConfirmModal("Are you sure you want to delete this review?", async () => {
      try {
        const response = await fetch(`/api/reviews?id=${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          setReviews((prevReviews) => prevReviews.filter((review) => review.id !== id));
          openAlertModal("Review deleted successfully!");
        } else {
          const errorData = await response.json();
          openAlertModal(`Failed to delete review: ${errorData.error || "Unknown error"}`);
          console.error("Failed to delete review:", errorData);
        }
      } catch (err) {
        openAlertModal("An unexpected error occurred during deletion.");
        console.error("Error deleting review:", err);
      }
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
        <span className="ml-3 text-lg text-gray-700">Loading reviews...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-red-50 text-red-700 font-bold text-xl p-4 rounded-md shadow-md">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-gray-800 to-black text-white mt-24">
      <EditUserSidebar />
      <div className="flex-grow">
        {reviews.length === 0 ? (
          <p className="text-center text-gray-600 text-lg">No reviews found.</p>
        ) : (
          <div className="overflow-x-auto p-4"> {/* Added padding here for better spacing */}
            <table className="min-w-full bg-white border border-gray-200 mt-24 rounded-lg overflow-hidden shadow-lg"> {/* Added rounded corners and shadow */}
              <thead>
                <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                  <th className="py-3 px-6 text-left">ID</th>
                  <th className="py-3 px-6 text-left">Name</th>
                  <th className="py-3 px-6 text-left">Gender</th>
                  <th className="py-3 px-6 text-left">Email</th> {/* New Header */}
                  <th className="py-3 px-6 text-left">Phone Number</th> {/* New Header */}
                  <th className="py-3 px-6 text-center">Rating</th>
                  <th className="py-3 px-6 text-left">Experience</th>
                  <th className="py-3 px-6 text-left">Created At</th>
                  <th className="py-3 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 text-sm font-light">
                {reviews.map((review) => (
                  <tr key={review.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-6 text-left whitespace-nowrap">{review.id}</td>
                    <td className="py-3 px-6 text-left">{review.name}</td>
                    <td className="py-3 px-6 text-left">{review.gender || "N/A"}</td>
                    <td className="py-3 px-6 text-left">{review.email || "N/A"}</td> {/* Display Email */}
                    <td className="py-3 px-6 text-left">{review.phone_number || "N/A"}</td> {/* Display Phone Number */}
                    <td className="py-3 px-6 text-center">
                      {Array.from({ length: review.rating }).map((_, index) => (
                        <span key={index} className="text-yellow-400 text-lg">⭐</span>
                      ))}
                    </td>
                    <td className="py-3 px-6 text-left max-w-xs overflow-hidden text-ellipsis whitespace-nowrap">
                      {review.experience}
                    </td>
                    <td className="py-3 px-6 text-left">
                      {format(new Date(review.created_at), "PPP")}
                    </td>
                    <td className="py-3 px-6 text-center">
                      <button
                        onClick={() => handleDelete(review.id)}
                        className="text-red-600 hover:text-red-800 focus:outline-none"
                        title="Delete Review"
                      >
                        <FiTrash2 size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl text-gray-800">
            <p className="mb-4 text-lg">{confirmModalMessage}</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={closeConfirmModal}
                className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Alert Modal */}
      {showAlertModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl text-gray-800">
            <p className="mb-4 text-lg">{alertModalMessage}</p>
            <div className="flex justify-end">
              <button
                onClick={closeAlertModal}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
