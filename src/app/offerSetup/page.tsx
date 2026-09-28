// app/offerSetup/page.tsx
"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image"; // Import Image for optimization

interface FoodItem {
  item_id: number;
  name: string;
  description: string;
  price: number;
  availability: boolean;
  image_url: string;
  quantity: number;
}

interface Offer {
  id: number;
  selected_items: string; // Ensure this is stored as a JSON string in the database
  total_price: number;
  discounted_price: number;
  offer_type: string;
  start_date: string;
  end_date: string;
  created_at: string;
}

const ITEMS_PER_PAGE_FOOD = 8; // Define how many food items to load per request

export default function OfferSetup() {
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [discountedPrice, setDiscountedPrice] = useState<number | "">("");
  const [offerType, setOfferType] = useState("Daily");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [editingOfferId, setEditingOfferId] = useState<number | null>(null);

  // Pagination states for food items
  const [foodPage, setFoodPage] = useState(0);
  const [hasMoreFood, setHasMoreFood] = useState(true);
  const [loadingFood, setLoadingFood] = useState(false);
  const [errorFood, setErrorFood] = useState<string | null>(null);

  // --- Intersection Observer for Infinite Scrolling (Food Items) ---
  const observer = useRef<IntersectionObserver | null>(null);
  const lastFoodItemElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loadingFood) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMoreFood) {
          setFoodPage((prevPage) => prevPage + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loadingFood, hasMoreFood]
  );

  // --- Data Fetching Logic for Food Items ---
  const fetchFoodItems = useCallback(
    async (page: number) => {
      setLoadingFood(true);
      setErrorFood(null);
      try {
        const queryParams = new URLSearchParams();
        queryParams.append("page", page.toString());
        queryParams.append("limit", ITEMS_PER_PAGE_FOOD.toString());
        queryParams.append("fetch_food_items", "true"); // Indicate that we only want food items

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

        const res = await fetch(`/api/offers?${queryParams.toString()}`, {
          cache: "no-store", // Or 'no-cache' depending on desired freshness
          signal: controller.signal,
          headers: {
            "Content-Type": "application/json",
          },
        });

        clearTimeout(timeoutId);

        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(
            `HTTP error! status: ${res.status}, Message: ${errorText}`
          );
        }

        const data: FoodItem[] = await res.json();
        console.log(`Fetched food items page ${page}:`, data);

        if (page === 0) {
          setFoodItems(data);
        } else {
          setFoodItems((prevItems) => [...prevItems, ...data]);
        }

        setHasMoreFood(data.length === ITEMS_PER_PAGE_FOOD);
      } catch (err: unknown) {
        console.error("Failed to fetch food items:", err);
        if (err instanceof Error) {
          if (err.name === "AbortError") {
            setErrorFood("Request timed out. Please try again.");
          } else {
            setErrorFood(err.message || "Failed to load food items.");
          }
        } else {
          setErrorFood("An unknown error occurred while loading food items.");
        }
        setHasMoreFood(false); // Stop trying to load more on error
      } finally {
        setLoadingFood(false);
      }
    },
    [] // Stable function reference
  );

  // --- Data Fetching Logic for Offers (No Pagination Needed Here) ---
  const fetchOffers = useCallback(async () => {
    try {
      // Fetch offers without pagination (assuming fewer offers than food items)
      const res = await fetch("/api/offers?no_pagination=true&fetch_offers=true");
      const data = await res.json();
      setOffers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching offers:", error);
      setOffers([]);
    }
  }, []);

  // Initial fetch for food items (page 0) and offers
  useEffect(() => {
    fetchFoodItems(0);
    fetchOffers();
  }, [fetchFoodItems, fetchOffers]);

  // Effect to load more food items when 'foodPage' state changes (triggered by observer)
  useEffect(() => {
    if (foodPage > 0) {
      fetchFoodItems(foodPage);
    }
  }, [foodPage, fetchFoodItems]);

  const handleItemSelection = (itemId: number) => {
    setSelectedItems((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
    );
  };

  const handleCancelEdit = () => {
    setSelectedItems([]);
    setDiscountedPrice("");
    setOfferType("Daily");
    setStartDate("");
    setEndDate("");
    setEditingOfferId(null);
  };

  const calculateTotalPrice = () => {
    return selectedItems.reduce((sum, id) => {
      const item = foodItems.find((item) => item.item_id === id);
      return sum + (item ? Number(item.price) : 0); // Ensure price is number
    }, 0);
  };

  const handleSubmit = async () => {
    const totalPrice = calculateTotalPrice();

    if (selectedItems.length < 2 || !discountedPrice || totalPrice <= 0) {
      alert(
        "Please select at least 2 food items, enter a valid discounted price, and ensure the total price is valid."
      );
      return;
    }

    const requestBody = {
      selectedItems,
      totalPrice,
      discountedPrice: Number(discountedPrice),
      offerType,
      startDate,
      endDate,
    };

    console.log("Submitting requestBody:", requestBody);

    try {
      const res = await fetch(
        editingOfferId ? `/api/offers/${editingOfferId}` : "/api/offers",
        {
          method: editingOfferId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        }
      );

      const responseData = await res.json();

      if (res.ok) {
        alert(editingOfferId ? "Offer updated successfully!" : "Offer created successfully!");
        handleCancelEdit(); // Reset form after successful submission
        fetchOffers(); // Refresh offers list
      } else {
        alert(`Error: ${responseData.error}`);
      }
    } catch (error) {
      console.error("Error submitting offer:", error);
      alert("An error occurred while submitting the offer.");
    }
  };

  const handleEdit = (offer: Offer) => {
    setEditingOfferId(offer.id);
    setSelectedItems(
      typeof offer.selected_items === "string"
        ? JSON.parse(offer.selected_items)
        : offer.selected_items
    );
    setDiscountedPrice(offer.discounted_price);
    setOfferType(offer.offer_type);
    setStartDate(offer.start_date.split("T")[0]); // Extract the date part
    setEndDate(offer.end_date.split("T")[0]); // Extract the date part
  };

  const handleDelete = async (offerId: number) => {
    if (!confirm("Are you sure you want to delete this offer?")) return;

    try {
      const res = await fetch(`/api/offers/${offerId}`, { method: "DELETE" });

      if (res.ok) {
        alert("Offer deleted successfully!");
        fetchOffers(); // Refresh offers list
      } else {
        const errorData = await res.json();
        alert(`Error: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error deleting offer:", error);
      alert("An error occurred while trying to delete the offer.");
    }
  };

  return (
    <div className="container mx-auto p-4 mt-20">
      <h1 className="text-3xl font-extrabold mb-6 text-center text-gray-800">
        ✨ Offer Management Panel ✨
      </h1>
      <div className="flex justify-center mb-6">
        <button
          onClick={() => (window.location.href = "/adminDashboard")}
          className="bg-indigo-600 text-white px-8 py-3 rounded-full shadow-lg hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-300"
        >
          ⬅️ Back to Dashboard
        </button>
      </div>

      {/* Food Items Display Section */}
      <div className="bg-white p-6 rounded-lg shadow-xl mb-8">
        <h2 className="text-2xl font-bold mb-4 text-center text-blue-700">
          Select Food Items for Offer
        </h2>
        {errorFood && (
          <div className="text-red-600 text-center mb-4">{errorFood}</div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {foodItems.length > 0 ? (
            foodItems.map((item, index) => {
              // Attach ref to the last item for IntersectionObserver
              if (foodItems.length === index + 1 && hasMoreFood) {
                return (
                  <div
                    ref={lastFoodItemElementRef}
                    key={item.item_id}
                    className={`relative border p-4 rounded-xl shadow-md transition duration-300 transform hover:scale-105 cursor-pointer ${
                      selectedItems.includes(item.item_id)
                        ? "bg-blue-100 border-blue-500 ring-2 ring-blue-500"
                        : "bg-white"
                    }`}
                    onClick={() => handleItemSelection(item.item_id)}
                  >
                    <Image
                      src={item.image_url}
                      alt={item.name}
                      width={200}
                      height={160}
                      className="w-full h-40 object-cover rounded-lg shadow-md mb-3"
                    />
                    <h2 className="text-lg font-bold text-gray-800">
                      {item.name}
                    </h2>
                    <span className="absolute top-2 right-2 bg-gray-800 text-white text-xs px-2 py-1 rounded-full shadow-md">
                      🏷️ No: {item.quantity}
                    </span>
                    <p className="text-md font-semibold mt-1 text-green-700">
                      💰 ${Number(item.price).toFixed(2)}
                    </p>
                  </div>
                );
              } else {
                return (
                  <div
                    key={item.item_id}
                    className={`relative border p-4 rounded-xl shadow-md transition duration-300 transform hover:scale-105 cursor-pointer ${
                      selectedItems.includes(item.item_id)
                        ? "bg-blue-100 border-blue-500 ring-2 ring-blue-500"
                        : "bg-white"
                    }`}
                    onClick={() => handleItemSelection(item.item_id)}
                  >
                    <Image
                      src={item.image_url}
                      alt={item.name}
                      width={200}
                      height={160}
                      className="w-full h-40 object-cover rounded-lg shadow-md mb-3"
                    />
                    <h2 className="text-lg font-bold text-gray-800">
                      {item.name}
                    </h2>
                    <span className="absolute top-2 right-2 bg-gray-800 text-white text-xs px-2 py-1 rounded-full shadow-md">
                      🏷️ No: {item.quantity}
                    </span>
                    <p className="text-md font-semibold mt-1 text-green-700">
                      💰 ${Number(item.price).toFixed(2)}
                    </p>
                  </div>
                );
              }
            })
          ) : (
            <p className="text-center text-gray-500 text-sm col-span-full">
              {loadingFood ? "Loading food items..." : "No food items found."}
            </p>
          )}
        </div>
        {loadingFood && <SkeletonGrid />}
        {!hasMoreFood && !loadingFood && foodItems.length > 0 && (
          <p className="text-center text-gray-600 mt-8 text-lg">
            You&apos;ve seen all available food items!
          </p>
        )}
      </div>

      {/* Form for offers */}
      <div className="bg-white p-6 rounded-lg shadow-xl mb-8 flex flex-col items-center">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-center py-3 rounded-t-lg w-full">
            {editingOfferId ? "✍️ Edit Offer" : "➕ Create New Offer"}
          </h2>
          <div className="p-4 border border-t-0 border-gray-200 rounded-b-lg">
            <div className="mb-4">
              <label htmlFor="offerType" className="block text-gray-700 text-sm font-bold mb-2">Offer Type:</label>
              <select
                id="offerType"
                value={offerType}
                onChange={(e) => setOfferType(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                <option value="Daily">Daily</option>
                <option value="Weekend">Weekend</option>
                <option value="Seasonal">Seasonal</option>
              </select>
            </div>

            <p className="text-xl font-bold text-center mb-4">
              Total Price of Selected Items:{" "}
              <span className="text-indigo-600">
                ${calculateTotalPrice().toFixed(2)}
              </span>
            </p>

            <div className="mb-4">
              <label htmlFor="discountedPrice" className="block text-gray-700 text-sm font-bold mb-2">Discounted Price:</label>
              <input
                id="discountedPrice"
                type="number"
                placeholder="Enter discounted price"
                value={discountedPrice}
                onChange={(e) =>
                  setDiscountedPrice(
                    e.target.value === "" ? "" : Number(e.target.value)
                  )
                }
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="startDate" className="block text-gray-700 text-sm font-bold mb-2">Start Date:</label>
              <input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="endDate" className="block text-gray-700 text-sm font-bold mb-2">End Date:</label>
              <input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>

            <button
              onClick={handleSubmit}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full transition duration-200 ease-in-out transform hover:scale-105"
            >
              {editingOfferId ? "Update Offer" : "Submit Offer"}
            </button>
            {editingOfferId && (
              <button
                onClick={handleCancelEdit}
                className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded w-full mt-2 transition duration-200 ease-in-out transform hover:scale-105"
              >
                Cancel Edit
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Available Offers Display Section */}
      <div className="bg-white p-6 rounded-lg shadow-xl">
        <h2 className="text-2xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-600 text-white text-center py-3 rounded-lg shadow-md mb-6">
          🎉 Currently Available Offers 🎉
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {offers.length > 0 ? (
            offers.map((offer) => (
              <div
                key={offer.id}
                className="p-5 border border-gray-300 rounded-xl bg-white shadow-lg hover:shadow-2xl transition duration-300 transform hover:scale-[1.02]"
              >
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-center font-semibold py-1.5 rounded-t-xl text-sm tracking-wide shadow-md">
                  ⭐ {offer.offer_type} Offer
                </div>

                <div className="text-center my-3">
                  <p className="text-red-500 line-through text-sm font-medium">
                    💲 Total Price:{" "}
                    <span className="font-semibold">
                      ${Number(offer.total_price).toFixed(2)}
                    </span>
                  </p>
                  <p className="text-green-600 font-bold text-lg">
                    ✅ Discounted Price:{" "}
                    <span className="text-xl">
                      ${Number(offer.discounted_price).toFixed(2)}
                    </span>
                  </p>
                  <p className="text-gray-600 text-sm mt-1">
                    🗓️ {new Date(offer.start_date).toLocaleDateString()} -{" "}
                    {new Date(offer.end_date).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex flex-wrap justify-center gap-3">
                  {(typeof offer.selected_items === "string"
                    ? JSON.parse(offer.selected_items)
                    : offer.selected_items
                  ).map((itemId: number) => {
                    const item = foodItems.find((food) => food.item_id === itemId); // Find item from already fetched list
                    return item ? (
                      <div key={item.item_id} className="text-center w-20">
                        <Image
                          src={item.image_url}
                          alt={item.name}
                          width={64}
                          height={64}
                          className="w-16 h-16 object-cover rounded-lg shadow-md"
                        />
                        <p className="text-xs font-medium mt-1">{item.name}</p>
                        <p className="text-[10px] font-semibold text-gray-700 bg-gray-200 px-2 py-1 rounded-md mt-1">
                          No. {item.quantity}
                        </p>
                      </div>
                    ) : null;
                  })}
                </div>

                <div className="flex justify-between mt-5">
                  <button
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-lg transition"
                    onClick={() => handleEdit(offer)}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-lg transition"
                    onClick={() => handleDelete(offer.id)}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-600 text-base col-span-full">
              No offers have been created yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// Skeleton Grid for loading effect
const SkeletonGrid = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
    {Array.from({ length: ITEMS_PER_PAGE_FOOD }).map((_, i) => (
      <div
        key={`skeleton-${i}`}
        className="animate-pulse bg-gray-200 rounded-xl h-64 w-full"
      />
    ))}
  </div>
);