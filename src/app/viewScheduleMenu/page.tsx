// app/viewschedulemenu/page.tsx (Assuming this is the correct path for your ViewScheduleMenuPage)
"use client";

import React, { useState, useEffect, Suspense, useRef, useCallback } from "react";
import { FiShoppingCart } from "react-icons/fi";
import ScheduleOrderModal from "../components/ScheduleOrderModal";
import { useSearchParams } from 'next/navigation';
import Link from "next/link";
import Image from "next/image"; // Import Next.js Image component

interface FoodItem {
  item_id: number;
  category_id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  spicy_level: string;
  quantity: number;
  category_name?: string; // Add category_name to the interface
}

interface CartItem {
  scheduled_cart_id: number;
  food_name: string;
  price: number;
  image: string;
  quantity: number;
  special_note: string;
  item_id: number;
  user_id: number;
  scheduled_date: string;
  scheduled_time: string;
  service_type: string;
}

const categoryMapping: Record<number, string> = {
  1: "Breakfast",
  2: "Main Course",
  4: "Entree",
  5: "Drinks",
};

const ITEMS_PER_PAGE = 6; // Define how many items to load per request for specific categories

const ViewScheduleMenuPage = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ViewScheduleMenuContent />
    </Suspense>
  );
};

const ViewScheduleMenuContent = () => {
  const searchParams = useSearchParams();
  const service = searchParams.get('service');
  const date = searchParams.get('date');
  const time = searchParams.get('time');

  const [items, setItems] = useState<FoodItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<FoodItem | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0); // Current page (or category index for "All Menu")
  const [hasMore, setHasMore] = useState(true); // True if there's more data/categories to load
  const [filteredCategory, setFilteredCategory] = useState<string | null>(null); // State to hold the currently filtered category

  // --- Intersection Observer for Infinite Scrolling ---
  const observer = useRef<IntersectionObserver | null>(null);
  const lastItemElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  // --- Data Fetching Logic for Menu Items ---
  const fetchMenuItems = useCallback(
    async (category: string | null, currentPage: number) => {
      setLoading(true);
      setError(null);
      try {
        const queryParams = new URLSearchParams();

        if (category === null || category === "All Menu") {
          // Special logic for "All Menu": paginate by category
          const categoriesInOrder = Object.values(categoryMapping);
          const categoryToFetch = categoriesInOrder[currentPage]; // currentPage acts as category index

          if (!categoryToFetch) {
            // No more categories left to fetch
            setHasMore(false);
            setLoading(false);
            return;
          }

          queryParams.append("category", categoryToFetch);
          queryParams.append("limit", "500"); // Fetch all items for this specific category (large limit)
          // No 'page' param for this specific category request, as we want all of it.
        } else {
          // Standard pagination for a single selected category
          queryParams.append("page", currentPage.toString());
          queryParams.append("limit", ITEMS_PER_PAGE.toString());
          queryParams.append("category", category || "");
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000);

        const res = await fetch(`/api/menuitem?${queryParams.toString()}`, {
          cache: "no-store",
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
        console.log(
          `Fetched page ${currentPage} for category "${
            category || "All Menu"
          }":`,
          data
        );

        // Map category_id to category_name for each item
        const itemsWithCategoryNames = data.map((item) => ({
          ...item,
          category_name: categoryMapping[item.category_id] || "Unknown Category",
        }));

        if (currentPage === 0) {
          setItems(itemsWithCategoryNames);
        } else {
          setItems((prevItems) => [...prevItems, ...itemsWithCategoryNames]);
        }

        // Determine hasMore based on the selected category logic
        if (category === null || category === "All Menu") {
          const categoriesInOrder = Object.values(categoryMapping);
          // Has more if there are still categories left to fetch
          setHasMore(currentPage < categoriesInOrder.length - 1);
        } else {
          // For specific categories, hasMore based on ITEMS_PER_PAGE
          setHasMore(data.length === ITEMS_PER_PAGE);
        }
      } catch (err: unknown) {
        console.error("Failed to fetch menu items:", err);
        if (err instanceof Error) {
          if (err.name === "AbortError") {
            setError("Request timed out. Please try again.");
          } else {
            setError(err.message || "Failed to load menu items.");
          }
        } else {
          setError("An unknown error occurred.");
        }
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // --- Data Fetching Logic for Scheduled Cart Items ---
  const fetchScheduledCartItems = async () => {
    try {
      const res = await fetch("/api/scheduledcart/get");
      if (res.ok) {
        const cartData = await res.json();
        setCart(cartData);
      }
    } catch (error) {
      console.error("Error fetching scheduled cart:", error);
      setError("Failed to load scheduled cart items.");
    }
  };

  const clearScheduledCart = async () => {
    try {
      const response = await fetch('/api/scheduledcart/clear', {
        method: 'POST',
      });
      if (response.ok) {
        setCart([]);
      } else {
        console.error('Failed to clear scheduled cart');
      }
    } catch (error) {
      console.error('Error clearing scheduled cart:', error);
    }
  };

  // Initial load effect for menu items and cart logic
  useEffect(() => {
    const fromCart = searchParams.get('fromCart');

    const handleInitialLoad = async () => {
      // Set an initial category to trigger the first fetch
      setFilteredCategory("All Menu"); // Trigger fetchMenuItems for page 0

      if (!fromCart) {
        await clearScheduledCart();
      }
      await fetchScheduledCartItems(); // Fetch cart in any case.
    };

    handleInitialLoad();
  }, [searchParams]); // Depend on searchParams to react to changes from schedule-order page

  // Effect to trigger menu item fetch when filteredCategory changes or page changes
  useEffect(() => {
    if (filteredCategory !== null) {
      if (page === 0) {
        setItems([]); // Clear existing items when category changes (or initial load)
        setHasMore(true); // Assume there's more data for the new category (will be set accurately after fetch)
        fetchMenuItems(filteredCategory, 0); // Fetch the first page/category
      } else {
        // Only fetch more if a category is selected, we're not on the initial load, and hasMore is true
        if (hasMore) { // Ensure hasMore is true before triggering next fetch
            fetchMenuItems(filteredCategory, page);
        }
      }
    }
  }, [filteredCategory, page, fetchMenuItems, hasMore]);

  const addToCart = async (item: FoodItem, quantity: number, specialNote: string) => {
    try {
      const response = await fetch('/api/scheduledcart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          item_id: item.item_id,
          quantity: quantity,
          special_note: specialNote,
          scheduledDate: date,
          scheduledTime: time,
          serviceType: service,
        }),
      });

      if (!response.ok) {
        let errorMessage = `Failed to add to scheduled cart: ${response.status} - ${response.statusText}`;
        try {
          const errorData = await response.json();
          errorMessage += ` - ${JSON.stringify(errorData)}`;
        } catch {
          errorMessage += ` - Could not parse error response`;
        }
        throw new Error(errorMessage);
      }

      await fetchScheduledCartItems(); // Re-fetch cart after adding
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error adding to scheduled cart:', error.message);
        setError(error.message); // Set error state
      } else {
        console.error('An unknown error occurred:', error);
        setError('An unknown error occurred.'); // Set error state
      }
    }
  };

  const handleCategoryFilter = useCallback((category: string | null) => {
    setFilteredCategory(category);
    setPage(0); // Reset page/category index when filtering
    setItems([]); // Clear current items to show skeleton loader for new category
    setHasMore(true); // Assume there's more data for the new category
  }, []);

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Error Loading Menu
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            type="button"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const displayCategories = [
    { label: "All Menu", value: "All Menu" }, // Changed value to "All Menu" for clarity in state
    ...Object.values(categoryMapping).map((label) => ({ label, value: label })),
  ];

  // Group fetched items by category for display, maintaining order
  const groupedItems = items.reduce(
    (acc: Record<string, FoodItem[]>, item) => {
      const categoryName =
        item.category_name || categoryMapping[item.category_id] || "Uncategorized";
      if (!acc[categoryName]) {
        acc[categoryName] = [];
      }
      acc[categoryName].push(item);
      return acc;
    },
    {}
  );

  return (
    <div className="min-h-screen py-6 bg-[url('/sec1.jpg')] bg-cover bg-center bg-no-repeat relative">
      <div className="absolute inset-0 bg-gradient-to-b from-black/90 to-black opacity-90"></div>
      <div className="relative z-10 mb-10 px-4 sm:px-8 mt-32">
        {/* Cart Button */}
        <div className="flex justify-center lg:justify-end lg:absolute lg:top-0 lg:right-2 w-full">
          <Link
            href={{
              pathname: "/scheduledCart",
              query: {
                service: service || "",
                date: date || "",
                time: time || "",
              },
            }}
            className="mb-4 lg:mb-0 flex items-center space-x-2 bg-blue-600 text-white px-4 sm:px-5 py-3 sm:py-3 rounded-lg shadow-md hover:bg-blue-500 transition"
          >
            <FiShoppingCart size={22} className="sm:size-[26px]" />
            <span className="text-base sm:text-lg font-semibold">Cart ({cart.length})</span>
          </Link>
        </div>

        {/* Heading */}
        <div className="flex flex-col justify-center items-center ">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-wide text-center">
            Scheduled Order
          </h1>

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
        </div>
      </div>

      {/* Category Filter Buttons */}
      <div className="z-10 flex flex-wrap justify-center gap-4 mb-8 px-4">
        {displayCategories.map((cat) => (
          <button
            key={cat.label}
            onClick={() => handleCategoryFilter(cat.value)}
            className={`px-5 py-2 rounded-full font-semibold transition-all duration-300 ease-in-out
              ${
                filteredCategory === cat.value
                  ? "bg-gradient-to-r from-red-600 to-red-400 text-white shadow-lg"
                  : "bg-white/20 text-white hover:bg-white/40"
              }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Display Items based on Filter */}
      <div className="mt-12 px-2 sm:px-4">
        <h2 className="mb-6 text-3xl font-bold text-center text-white py-3 relative uppercase tracking-wide">
          {filteredCategory === null || filteredCategory === "All Menu"
            ? "All Menu"
            : filteredCategory}
          <span className="absolute left-1/2 bottom-0 w-16 h-1 bg-gradient-to-r from-[#3345A7] to-blue-400 transform -translate-x-1/2"></span>
        </h2>
        {items.length > 0 ? (
            // Conditional rendering based on filteredCategory
            <>
                {(filteredCategory === null || filteredCategory === "All Menu") ? (
                    // When "All Menu" or no filter, iterate through categories in order
                    Object.values(categoryMapping).map((categoryName) => {
                        const itemsInCategory = groupedItems[categoryName];
                        if (!itemsInCategory || itemsInCategory.length === 0) return null;

                        return (
                            <div key={categoryName} className="mb-8">
                                <h3 className="text-2xl text-white font-bold mb-4 text-center relative">
                                    {categoryName}
                                </h3>
                                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-5">
                                    {itemsInCategory.map((item) => {
                                        const isLastItemOverall = items.length === items.indexOf(item) + 1;
                                        return (
                                            <div
                                                key={`item-${item.item_id}`}
                                                ref={isLastItemOverall ? lastItemElementRef : null}
                                                className="z-10 group bg-white/90 backdrop-blur-md shadow-[0_8px_24px_rgba(0,0,0,0.15)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.2)] hover:scale-[1.03] transition-all duration-300 ease-in-out rounded-2xl overflow-hidden hover:bg-[#b7cbf9] text-sm sm:text-base"
                                            >
                                                <Card item={item} setSelectedItem={setSelectedItem} />
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    // For specific categories, display as a single grid with standard pagination
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-5 px-2 sm:px-4">
                        {items.map((item, index) => {
                            const isLastItemInList = items.length === index + 1;
                            return (
                                <div
                                    ref={isLastItemInList ? lastItemElementRef : null}
                                    key={`item-${item.item_id}`}
                                    className="z-10 group bg-white/90 backdrop-blur-md shadow-[0_8px_24px_rgba(0,0,0,0.15)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.2)] hover:scale-[1.03] transition-all duration-300 ease-in-out rounded-2xl overflow-hidden hover:bg-[#b7cbf9] text-sm sm:text-base"
                                >
                                    <Card item={item} setSelectedItem={setSelectedItem} />
                                </div>
                            );
                        })}
                    </div>
                )}
            </>
        ) : (
          !loading && (
            <p className="text-center text-white text-lg mt-8">
              No items found for this category.
            </p>
          )
        )}

        {/* Loading indicator and messages */}
        {loading && <SkeletonGrid />}
        {!hasMore && !loading && items.length > 0 && (
          <p className="text-white text-center mt-8 text-lg">
            You&apos;ve reached the end of the menu!
          </p>
        )}
      </div>

      {selectedItem && (
        <ScheduleOrderModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onAddToCart={addToCart}
          scheduledDate={date || ""}
          scheduledTime={time || ""}
          serviceType={service || ""}
        />
      )}
    </div>
  );
};

// Memoized card component for better performance, modified to handle order button click
const Card = React.memo(
  ({
    item,
    setSelectedItem,
  }: {
    item: FoodItem;
    setSelectedItem: (item: FoodItem) => void;
  }) => (
    <>
      <div className="relative w-full h-32 sm:h-48">
        <Image
          src={item.image_url || "/placeholder.jpg"}
          alt={item.name}
          fill
          className="object-cover rounded-t-xl transition-transform duration-300 group-hover:scale-110"
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16vw"
          loading="lazy"
        />
        {item.category_name && (
          <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs sm:text-sm font-semibold px-3 py-1 rounded-full shadow-md">
            {item.category_name}
          </div>
        )}
      </div>
      <div className="p-2 sm:p-3 text-center rounded-b-xl">
        <h3 className="text-sm sm:text-lg font-bold text-blue-900 tracking-wide truncate">
          {item.name}
        </h3>
        <p className="text-xs sm:text-sm text-gray-500 mb-2 line-clamp-2">
          {item.description}
        </p>
        <div className="flex justify-between items-center text-xs sm:text-sm font-semibold text-gray-700 bg-gray-100 p-2 rounded-md mb-2 sm:mb-4">
          <span className="text-blue-800 font-semibold">${item.price}</span>
          <span className="text-gray-500">Item No: {item.quantity}</span>
        </div>

        <button
          onClick={() => setSelectedItem(item)}
          className="w-full py-2 sm:py-2.5 text-white font-semibold rounded-lg bg-blue-700 hover:bg-blue-800 transition duration-200 transform active:scale-95"
        >
          Order Now
        </button>
      </div>
    </>
  )
);

Card.displayName = "Card";

// Optimized skeleton grid to match ITEMS_PER_PAGE
const SkeletonGrid = () => (
  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-5 px-2 sm:px-4 mt-8">
    {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
      <div
        key={`skeleton-${i}`}
        className="animate-pulse bg-white/20 rounded-xl h-64 w-full"
      />
    ))}
  </div>
);

const LoadingSpinner = () => (
  <div className="min-h-screen flex justify-center items-center bg-gray-100">
    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
    <span className="ml-3 text-blue-500 font-semibold">Loading...</span>
  </div>
);

export default ViewScheduleMenuPage;