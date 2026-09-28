// app/menuSetup/page.tsx
"use client";
import React, { useState, useEffect, useRef, useCallback } from "react"; // Add useCallback
import Image from "next/image"; // Make sure to import Image

interface FoodItem {
  item_id: number; // This is the primary key from the database
  category_id: number;
  name: string;
  description: string;
  price: number;
  availability: string;
  image_url: string;
  spicy_level: string;
  quantity: number;
  category_name: string; // Ensure this is populated from the backend
}

const categoryMapping: Record<string, number> = {
  "Breakfast": 1,
  "Main Course": 2,
  "Entree": 4,
  "Drinks": 5,
};

const ITEMS_PER_PAGE_ADMIN_FOOD = 6; // Define how many food items to load per request

const AdminPage = () => {
  const [category, setCategory] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [availability] = useState("Available"); // Assuming it's always 'Available' for new items
  const [image, setImage] = useState<string | null>(null);
  const [spicyLevel, setSpicyLevel] = useState("");
  const [quantity, setQuantity] = useState<string>("");
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pagination states for food items
  const [foodPage, setFoodPage] = useState(0); // Start at page 0
  const [hasMoreFood, setHasMoreFood] = useState(true);
  const [loadingFood, setLoadingFood] = useState(true); // Initial loading state
  const [errorFood, setErrorFood] = useState<string | null>(null); // Renamed to avoid conflict

  const formRef = useRef<HTMLDivElement>(null);

  // --- Intersection Observer for Infinite Scrolling (Food Items) ---
  const observer = useRef<IntersectionObserver | null>(null);
  const lastFoodItemElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loadingFood || !hasMoreFood) return; // Don't trigger if loading or no more items
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMoreFood) {
          setFoodPage((prevPage) => prevPage + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loadingFood, hasMoreFood] // Dependencies for useCallback
  );

  // --- Data Fetching Logic for Food Items ---
  const fetchFoodItems = useCallback(async (page: number) => {
    setLoadingFood(true);
    setErrorFood(null); // Clear any previous errors
    try {
      const queryParams = new URLSearchParams();
      queryParams.append("page", page.toString());
      queryParams.append("limit", ITEMS_PER_PAGE_ADMIN_FOOD.toString());
      // No need for 'fetch_food_items' here, as this is the primary food item fetch

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

      const res = await fetch(`/api/menuitem?${queryParams.toString()}`, {
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

      setHasMoreFood(data.length === ITEMS_PER_PAGE_ADMIN_FOOD);
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
  }, []); // Stable function reference

  // Initial fetch for food items (page 0)
  useEffect(() => {
    fetchFoodItems(0);
  }, [fetchFoodItems]); // Depend on fetchFoodItems so it triggers on mount

  // Effect to load more food items when 'foodPage' state changes (triggered by observer)
  useEffect(() => {
    if (foodPage > 0) {
      fetchFoodItems(foodPage);
    }
  }, [foodPage, fetchFoodItems]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 350 * 1024) { // 350 KB
        alert("Image size exceeds 350KB limit.");
        e.target.value = ''; // Clear the input
        setImage(null);
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFoodSubmit = async () => {
    setIsSubmitting(true);
    setErrorFood(null); // Use errorFood for general errors
    try {
      const selectedCategoryName = category;
      const category_id = categoryMapping[selectedCategoryName];

      if (category_id === undefined) {
        alert("Please select a valid category.");
        setIsSubmitting(false);
        return;
      }
      if (!name || !description || !price || !spicyLevel || !quantity || !image) {
        alert("All fields are required.");
        setIsSubmitting(false);
        return;
      }
      if (isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
        alert("Please enter a valid price.");
        setIsSubmitting(false);
        return;
      }
      if (isNaN(parseInt(quantity, 10)) || parseInt(quantity, 10) <= 0) {
        alert("Please enter a valid item number (quantity).");
        setIsSubmitting(false);
        return;
      }

      const method = editingId ? "PUT" : "POST";
      const url = "/api/menuitem";

      const bodyData = {
        category_id,
        name,
        description,
        price: parseFloat(price),
        availability,
        image_url: image, // Use the base64 string directly
        quantity: parseInt(quantity, 10),
        spicy_level: spicyLevel,
        ...(editingId && { item_id: editingId }),
      };

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });

      const result = await response.json();

      if (!response.ok) {
        alert(result.error || "Failed to save menu item");
        setIsSubmitting(false);
        return;
      }

      if (method === "POST") {
        const newItemWithCategory: FoodItem = {
          ...result,
          category_name: result.category_name || selectedCategoryName
        };
        // For new items, add to the beginning of the list for immediate visibility
        setFoodItems((prev) => [newItemWithCategory, ...prev]);
        alert("Item added successfully!");
      } else { // PUT
        const updatedItemWithCategory: FoodItem = {
          ...result,
          category_name: result.category_name || selectedCategoryName
        };
        setFoodItems((prev) =>
          prev.map((item) => (item.item_id === updatedItemWithCategory.item_id ? updatedItemWithCategory : item))
        );
        alert("Item updated successfully!");
      }

      resetForm();
    } catch (err: unknown) {
      console.error("Error saving menu item:", err);
      if (err instanceof Error) {
        setErrorFood(err.message || "Failed to save menu item.");
      } else {
        setErrorFood("An unknown error occurred while saving.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteFoodItem = async (item_id: number, itemName: string) => {
    const confirmDelete = confirm(`Are you sure you want to delete "${itemName}"?`);
    if (!confirmDelete) return;

    setErrorFood(null);
    try {
      const res = await fetch("/api/menuitem", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ item_id: item_id }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to delete menu item");
      }

      setFoodItems((prev) => prev.filter((item) => item.item_id !== item_id));
      alert("Item deleted successfully!");
    } catch (err: unknown) {
      console.error("Error deleting food item:", err);
      if (err instanceof Error) {
        setErrorFood(err.message || "Failed to delete item.");
      } else {
        setErrorFood("An unknown error occurred while deleting.");
      }
    }
  };

  const editFoodItem = (item: FoodItem) => {
    setCategory(Object.keys(categoryMapping).find((key) => categoryMapping[key] === item.category_id) || "");
    setName(item.name);
    setDescription(item.description);
    setPrice(item.price.toString());
    setImage(item.image_url); // Set the image state directly from the item's image_url
    setSpicyLevel(item.spicy_level);
    setQuantity(item.quantity.toString());
    setEditingId(item.item_id);
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const resetForm = () => {
    setCategory("");
    setName("");
    setDescription("");
    setPrice("");
    setImage(null); // Clear image preview on reset
    setSpicyLevel("");
    setQuantity("");
    setEditingId(null);
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <h1 className="text-3xl font-bold text-center mb-2 mt-32">Admin Menu Setup</h1>

      <div className="flex justify-center mb-6">
        <button
          onClick={() => (window.location.href = "/adminDashboard")}
          className="bg-blue-800 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-900 transition-all duration-300"
        >
          ⬅️ Back to Dashboard
        </button>
      </div>

      {/* Form */}
      <div ref={formRef} className="bg-white shadow-lg rounded-xl p-6 max-w-lg mx-auto mb-8 border border-gray-200">
        <h2 className="text-xl font-semibold text-center text-gray-900 mb-4">
          {editingId !== null ? "Update Food" : "Add Food"}
        </h2>

        <select className="w-full mb-3 p-2 border rounded-lg" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">Select Category</option>
          {Object.keys(categoryMapping).map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <input className="w-full mb-3 p-2 border rounded-lg" type="text" placeholder="Food Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input className="w-full mb-3 p-2 border rounded-lg" type="number" placeholder="Price ($)" value={price} onChange={(e) => setPrice(e.target.value)} />
        <textarea className="w-full mb-3 p-2 border rounded-lg" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} rows={2} />
        <input className="w-full mb-3 p-2 border rounded-lg" type="text" placeholder="Spicy Level - mild/medium/high" value={spicyLevel} onChange={(e) => setSpicyLevel(e.target.value)} />
        <input className="w-full mb-3 p-2 border rounded-lg" type="text" placeholder="Item Number" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
        <label className="block mb-1 text-sm text-gray-600">
          Upload Image (Max: 350KB)
        </label>
        <input
          type="file"
          accept="image/*"
          className="w-full p-2 border rounded-lg"
          onChange={handleImageUpload}
          key={image || 'no-image'}
        />

        {image && <img src={image} alt="Preview" className="w-28 h-28 object-cover rounded-lg shadow-md mt-3" />}

        <button
          className="w-full mt-4 py-2 text-white font-semibold rounded-lg bg-blue-800 hover:bg-blue-900 transition-all duration-300"
          onClick={handleFoodSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting
            ? editingId !== null
              ? "Updating..."
              : "Adding..."
            : editingId !== null
            ? "Update Food"
            : "Add Food"}
        </button>
        {editingId && (
          <button
            className="w-full mt-2 py-2 text-blue-800 border border-blue-800 font-semibold rounded-lg hover:bg-blue-100 transition-all duration-300"
            onClick={resetForm}
            disabled={isSubmitting}
          >
            Cancel Edit
          </button>
        )}
      </div>

      {/* Food List */}
      <div className="w-full max-w-screen-xl mx-auto p-6">
        {errorFood && ( // Display error specific to food items fetch
          <div className="text-center text-red-500 text-xl font-semibold mt-10">
            Error: {errorFood}
            <button
              onClick={() => fetchFoodItems(0)} // Retry from page 0
              className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {foodItems.length > 0 ? (
            foodItems.map((item, index) => {
              // Attach ref to the last item for IntersectionObserver
              if (foodItems.length === index + 1 && hasMoreFood) {
                return (
                  <div
                    ref={lastFoodItemElementRef} // Ref for infinite scroll
                    key={item.item_id}
                    className="bg-white shadow-xl rounded-2xl overflow-hidden w-full max-w-xs mx-auto transform transition duration-300 hover:scale-105 relative"
                  >
                    <Image
                      src={item.image_url || "/placeholder.jpg"}
                      alt={item.name}
                      width={400}
                      height={208}
                      className="w-full h-52 object-cover rounded-t-2xl"
                      priority={true}
                      unoptimized={!!(item.image_url && item.image_url.startsWith('data:image/'))}
                    />

                    {item.category_name && (
                      <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs sm:text-sm font-semibold px-3 py-1 rounded-full shadow-md">
                        {item.category_name}
                      </div>
                    )}
                    <div className="p-4 text-center space-y-2">
                      <h2 className="text-2xl font-bold text-gray-900">{item.name}</h2>
                      <p className="text-gray-500 text-sm">{item.description}</p>
                      <p className="text-xl font-semibold text-blue-800">${item.price}</p>
                      <p className="text-md font-medium text-green-700">
                        Item Number: {item.quantity}
                      </p>

                      <div className="flex justify-center gap-4 mt-4">
                        <button
                          onClick={() => editFoodItem(item)}
                          className="bg-yellow-500 text-white px-6 py-2 rounded-lg font-semibold shadow-md hover:bg-yellow-600 transition-all"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => deleteFoodItem(item.item_id, item.name)}
                          className="bg-red-500 text-white px-6 py-2 rounded-lg font-semibold shadow-md hover:bg-red-600 transition-all"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              } else {
                return (
                  <div
                    key={item.item_id}
                    className="bg-white shadow-xl rounded-2xl overflow-hidden w-full max-w-xs mx-auto transform transition duration-300 hover:scale-105 relative"
                  >
                    <Image
                      src={item.image_url || "/placeholder.jpg"}
                      alt={item.name}
                      width={400}
                      height={208}
                      className="w-full h-52 object-cover rounded-t-2xl"
                      priority={true}
                      unoptimized={!!(item.image_url && item.image_url.startsWith('data:image/'))}
                    />

                    {item.category_name && (
                      <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs sm:text-sm font-semibold px-3 py-1 rounded-full shadow-md">
                        {item.category_name}
                      </div>
                    )}
                    <div className="p-4 text-center space-y-2">
                      <h2 className="text-2xl font-bold text-gray-900">{item.name}</h2>
                      <p className="text-gray-500 text-sm">{item.description}</p>
                      <p className="text-xl font-semibold text-blue-800">${item.price}</p>
                      <p className="text-md font-medium text-green-700">
                        Item Number: {item.quantity}
                      </p>

                      <div className="flex justify-center gap-4 mt-4">
                        <button
                          onClick={() => editFoodItem(item)}
                          className="bg-yellow-500 text-white px-6 py-2 rounded-lg font-semibold shadow-md hover:bg-yellow-600 transition-all"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => deleteFoodItem(item.item_id, item.name)}
                          className="bg-red-500 text-white px-6 py-2 rounded-lg font-semibold shadow-md hover:bg-red-600 transition-all"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              }
            })
          ) : (
            !loadingFood && !errorFood && ( // Only show "No items" if not loading and no error
              <div className="text-center text-gray-600 text-xl font-semibold mt-10 col-span-full">
                No menu items available. Start by adding one!
              </div>
            )
          )}
        </div>
        {loadingFood && <SkeletonGrid />} {/* Use the skeleton grid */}
        {!hasMoreFood && !loadingFood && foodItems.length > 0 && (
          <p className="text-center text-gray-600 mt-8 text-lg">
            You&apos;ve seen all available food items!
          </p>
        )}
      </div>
    </div>
  );
};

export default AdminPage;

// Skeleton Grid for loading effect (copied from your OfferSetup page)
const SkeletonGrid = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-6">
    {Array.from({ length: ITEMS_PER_PAGE_ADMIN_FOOD }).map((_, i) => (
      <div
        key={`skeleton-${i}`}
        className="animate-pulse bg-gray-200 rounded-2xl h-72 w-full"
      />
    ))}
  </div>
);