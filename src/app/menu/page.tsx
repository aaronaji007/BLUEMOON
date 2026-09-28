//app/menu/page.tsx
"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image"; // Make sure you have next/image installed: npm install next-image

interface FoodItem {
  item_id: number; // Corrected: Using 'item_id' as your database's primary key column name
  category_id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  quantity: number;
}

const categoryImages: Record<string, string> = {
  "All Menu": "/base.jpg",
  Breakfast: "/breakfast.png",
  "Main Course": "/1.jpg",
  Drinks: "/tea.png",
  Entree: "/snacks.jpg",
};

const categoryMapping: Record<number, string> = {
  1: "Breakfast",
  2: "Main Course",
  4: "Entree",
  5: "Drinks",
};

const ITEMS_PER_PAGE = 6; // Define how many items to load per request

const MenuPage = () => {
  const [items, setItems] = useState<FoodItem[]>([]); // This will hold the currently displayed items
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0); // Current page for pagination (0-indexed)
  const [hasMore, setHasMore] = useState(true); // True if there's more data to load

  // --- Intersection Observer for Infinite Scrolling ---
  const observer = useRef<IntersectionObserver | null>(null);
  const lastItemElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return; // Don't trigger if already loading
      if (observer.current) observer.current.disconnect(); // Disconnect previous observer

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          // If the last item is intersecting and there's more data, load next page
          setPage((prevPage) => prevPage + 1);
        }
      });

      if (node) observer.current.observe(node); // Observe the last item
    },
    [loading, hasMore] // Dependencies: re-create observer if loading or hasMore changes
  );

  // --- Data Fetching Logic ---
  const fetchItems = useCallback(
    async (category: string | null, currentPage: number) => {
      setLoading(true);
      setError(null);
      try {
        const queryParams = new URLSearchParams();
        queryParams.append("page", currentPage.toString());
        queryParams.append("limit", ITEMS_PER_PAGE.toString());

        if (category && category !== "All Menu") {
          queryParams.append("category", category);
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

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
          `Fetched page ${currentPage} for category "${category || "All Menu"}":`,
          data
        );

        if (currentPage === 0) {
          setItems(data); // First page, replace items
        } else {
          setItems((prevItems) => [...prevItems, ...data]); // Subsequent pages, append items
        }

        setHasMore(data.length === ITEMS_PER_PAGE); // If we received less than ITEMS_PER_PAGE, assume no more data
      }// Inside your fetchItems useCallback:
catch (err: unknown) { // Changed 'any' to 'unknown'
  console.error("Failed to fetch menu items:", err);
  if (err instanceof Error) { // Type guard: check if err is an instance of Error
    if (err.name === "AbortError") {
      setError("Request timed out. Please try again.");
    } else {
      setError(err.message || "Failed to load menu items.");
    }
  } else {
    // Handle cases where the error is not an Error object (e.g., a string or number)
    setError("An unknown error occurred.");
  }
  setHasMore(false); // Stop trying to load more on error
} finally {
  setLoading(false);
}
    },
    [] // No dependencies, this function reference remains stable
  );

  // Effect to trigger initial fetch when a category is selected or changed
  useEffect(() => {
    if (selectedCategory !== null) {
      setItems([]); // Clear existing items when category changes
      setPage(0); // Reset page to 0 for new category
      setHasMore(true); // Assume there's more data for the new category
      fetchItems(selectedCategory, 0); // Fetch the first page of items for the new category
    }
  }, [selectedCategory, fetchItems]);

  // Effect to load more items when the 'page' state changes (triggered by observer)
  useEffect(() => {
    // Only fetch more if a category is selected and we're not on the initial load (page 0 handled by above effect)
    if (page > 0 && selectedCategory !== null) {
      fetchItems(selectedCategory, page);
    }
  }, [page, selectedCategory, fetchItems]);

  const handleCategoryClick = useCallback((category: string | null) => {
    setSelectedCategory(category);
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

  return (
    <div
      className="min-h-screen bg-gray-100 p-6 relative overflow-hidden"
      style={{
        backgroundImage: "url(/sec11.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black opacity-80" />
      <div className="relative z-10 min-h-screen p-6">
        {/* Category Cards - Shown when no category is selected */}
        {!selectedCategory && (
          <div className="flex flex-wrap justify-center gap-10 mt-16">
            {[
              { label: "All Menu" },
              ...Object.values(categoryMapping).map((label) => ({ label })),
            ].map(({ label }) => (
              <CategoryCard
                key={`category-${label}`}
                label={label}
                imageUrl={categoryImages[label] || "/placeholder.jpg"}
                onClick={() => handleCategoryClick(label)}
              />
            ))}
          </div>
        )}

        {/* Selected Category View - Shown when a category is selected */}
        {selectedCategory && (
          <>
            <div className="flex justify-center mt-12">
              <button
                onClick={() => handleCategoryClick(null)}
                className="mt-12 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-500 text-white font-semibold rounded-full shadow-xl hover:scale-105 transition-transform"
                type="button"
              >
                ⬅️ Back to Categories
              </button>
            </div>

            <div className="mt-12">
              <h2 className="text-3xl text-white font-bold mb-4">
                {selectedCategory}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {items.map((item, index) => {
                  // Attach ref to the last item for IntersectionObserver
                  if (items.length === index + 1) {
                    return (
                      <div
                        ref={lastItemElementRef}
                        key={`item-${item.item_id}`} // Corrected: Use item.item_id for unique key
                      >
                        <Card item={item} />
                      </div>
                    );
                  } else {
                    return (
                      <Card
                        key={`item-${item.item_id}`} // Corrected: Use item.item_id for unique key
                        item={item}
                      />
                    );
                  }
                })}
              </div>

              {/* Loading indicator and messages */}
              {loading && <SkeletonGrid />}
              {!loading && items.length === 0 && !hasMore && (
                <p className="text-white text-center mt-8 text-lg">
                  No items found for this category.
                </p>
              )}
              {!hasMore && !loading && items.length > 0 && (
                <p className="text-white text-center mt-8 text-lg">
                  You&apos;ve reached the end of the menu!
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// Memoized category card component
const CategoryCard = React.memo(
  ({
    label,
    imageUrl,
    onClick,
  }: {
    label: string;
    imageUrl: string;
    onClick: () => void;
  }) => (
    <div
      onClick={onClick}
      className="relative group w-80 h-96 rounded-3xl overflow-hidden cursor-pointer transition-transform duration-300 hover:scale-105"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
    >
      <Image
        src={imageUrl}
        alt={label}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        priority={label === "All Menu"} // Prioritize "All Menu" image
      />
<div className="absolute bottom-0 w-full h-[20%] bg-black/40 backdrop-blur-md rounded-b-xl p-4 flex items-center justify-center">
  <h2 className="text-2xl font-extrabold text-white drop-shadow-lg tracking-wider">
    {label}
  </h2>
</div>


    </div>
  )
);

CategoryCard.displayName = "CategoryCard";

// Memoized card component for better performance
const Card = React.memo(({ item }: { item: FoodItem }) => (
  <div className="shadow-xl rounded-xl overflow-hidden transform transition duration-300 hover:scale-105 bg-white/30 backdrop-blur-md hover:bg-white/40">
    <div className="relative w-full h-52">
      <Image
        src={item.image_url || "/placeholder.jpg"}
        alt={item.name}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        loading="lazy" // Native lazy loading for images
      />
    </div>
    <div className="p-4 bg-black/30 text-white">
      <h4 className="text-xs font-semibold bg-gradient-to-r from-blue-500 to-indigo-600 px-2 py-1 rounded-full inline-block mb-2">
        {categoryMapping[item.category_id] || "Uncategorized"}
      </h4>
      <h3 className="text-xl font-bold">{item.name}</h3>
      <p className="text-sm text-white/90">
        {item.description.length > 50
          ? `${item.description.slice(0, 50)}...`
          : item.description}
      </p>
      <div className="flex justify-between items-center mt-3">
        <span className="text-lg font-bold text-red-400">${item.price}</span>
        <span className="text-sm font-bold bg-white/10 px-3 py-1 rounded-md">
          🏷️ {item.quantity}
        </span>
      </div>
    </div>
  </div>
));

Card.displayName = "Card";

// Optimized skeleton grid to match ITEMS_PER_PAGE
const SkeletonGrid = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-12">
    {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
      <div
        key={`skeleton-${i}`}
        className="animate-pulse bg-white/20 rounded-xl h-80 w-full"
      />
    ))}
  </div>
);

export default MenuPage;