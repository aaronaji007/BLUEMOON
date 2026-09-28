// pages/food-display.tsx
"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import TVNavbar from "../components/TVNavbar";

interface FoodItem {
  item_id: number;
  category_id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  spicy_level: string;
  quantity: number;
  category_name?: string;
}

const FoodDisplayPage = () => {
  const [foodItemsByCategory, setFoodItemsByCategory] = useState<{ [key: string]: FoodItem[] }>({});
  const [error, setError] = useState<string | null>(null);
  const [isLoadingInitial, setIsLoadingInitial] = useState(true); // Renamed for clarity
  const [loadingCategoryData, setLoadingCategoryData] = useState<Set<string>>(new Set()); // Tracks categories whose data is being fetched
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // New state to keep track of categories whose UI content has been "activated" by Intersection Observer
  const [activatedCategories, setActivatedCategories] = useState<Set<string>>(new Set());
  // Ref to store IntersectionObserver instances for each category
  const categoryObserverRefs = useRef<Record<string, IntersectionObserver | null>>({});

  const categoryOrder = ["Breakfast", "Main Course", "Entree", "Drinks"];

  // Function to fetch data for a specific category
  const fetchCategoryItems = useCallback(async (categoryName: string, retryCount = 0) => {
    const maxRetries = 3;
    const timeout = 10000; // 10 seconds timeout

    if (loadingCategoryData.has(categoryName)) {
      console.log(`Already fetching data for ${categoryName}. Skipping.`);
      return; // Prevent duplicate fetches
    }

    setLoadingCategoryData(prev => new Set(prev).add(categoryName));
    setError(null); // Clear any previous errors

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      // Fetch only items for the specific category, without pagination for this display
      const res = await fetch(`/api/menuitem?category=${encodeURIComponent(categoryName)}&no_pagination=true`, {
        signal: controller.signal,
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }

      const data: FoodItem[] = await res.json();
      console.log(`Fetched data for category: ${categoryName}`, data);

      setFoodItemsByCategory(prev => ({
        ...prev,
        [categoryName]: data
      }));
      setLoadingCategoryData(prev => {
        const newSet = new Set(prev);
        newSet.delete(categoryName);
        return newSet;
      });
      setIsLoadingInitial(false); // If this is the initial fetch for the first category

    } catch (err: unknown) {
      console.error(`Fetch attempt ${retryCount + 1} for ${categoryName} failed:`, err);
      setLoadingCategoryData(prev => {
        const newSet = new Set(prev);
        newSet.delete(categoryName);
        return newSet;
      });

      if (retryCount < maxRetries) {
        const delay = Math.pow(2, retryCount) * 1000;
        setTimeout(() => fetchCategoryItems(categoryName, retryCount + 1), delay);
      } else {
        const errorMessage = err instanceof Error ? err.message : "Network error - please check connection";
        setError(`Failed to load ${categoryName}: ${errorMessage}`);
        setIsLoadingInitial(false);
      }
    }
  }, [loadingCategoryData]); // Depend on loadingCategoryData to prevent re-creating this function unnecessarily

  // Initial fetch: only for the first category
  useEffect(() => {
    if (categoryOrder.length > 0 && !foodItemsByCategory[categoryOrder[0]] && !isLoadingInitial) {
      // If the first category isn't loaded yet, and it's not the initial loading state (which would already trigger a fetch)
      fetchCategoryItems(categoryOrder[0]);
    } else if (categoryOrder.length > 0 && isLoadingInitial) {
        // This is the initial fetch for the first category
        fetchCategoryItems(categoryOrder[0]).then(() => {
          setIsLoadingInitial(false); // Mark initial loading as complete after the first category loads
          setActivatedCategories(prev => new Set(prev).add(categoryOrder[0])); // Immediately activate the first category
        });
    } else if (categoryOrder.length === 0) {
      setIsLoadingInitial(false); // No categories to load
    }
  }, [fetchCategoryItems, categoryOrder, foodItemsByCategory, isLoadingInitial]);

  // Intersection Observer for Category Visibility (to trigger data fetch and UI activation)
  useEffect(() => {
    const observerOptions = {
      root: containerRef.current, // Observe visibility within the scrolling container
      rootMargin: '0px 0px 100px 0px', // Load categories slightly before they are fully in view
      threshold: 0.05, // Category is considered visible when 5% is in view
    };

    // Disconnect previous observers if any
    Object.values(categoryObserverRefs.current).forEach(observer => {
      if (observer) observer.disconnect();
    });
    categoryObserverRefs.current = {}; // Clear the ref map

    categoryOrder.forEach(categoryName => {
      const categorySection = document.getElementById(`category-${categoryName.replace(/\s+/g, '-')}`);
      if (categorySection) {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              setActivatedCategories(prev => new Set(prev).add(categoryName)); // Activate UI rendering
              // If data for this category isn't loaded yet, fetch it
              if (!foodItemsByCategory[categoryName] && !loadingCategoryData.has(categoryName)) {
                fetchCategoryItems(categoryName);
              }
              // Once activated and data loaded, we can stop observing this category's section
              if (foodItemsByCategory[categoryName] && categoryObserverRefs.current[categoryName]) {
                 categoryObserverRefs.current[categoryName]?.disconnect();
                 categoryObserverRefs.current[categoryName] = null; // Clear the observer
              }
            }
          });
        }, observerOptions);
        observer.observe(categorySection);
        categoryObserverRefs.current[categoryName] = observer; // Store the observer
      }
    });

    // Cleanup observers when component unmounts or dependencies change
    return () => {
      Object.values(categoryObserverRefs.current).forEach(observer => {
        if (observer) observer.disconnect();
      });
      categoryObserverRefs.current = {};
    };
  }, [categoryOrder, foodItemsByCategory, fetchCategoryItems, loadingCategoryData]);

  // Optimized scroll animation with better performance
  useEffect(() => {
    const container = containerRef.current;
    // Only start scrolling if initial loading is done, no error, and at least some categories have been loaded
    if (!container || isLoadingInitial || error || Object.keys(foodItemsByCategory).length === 0) {
      return;
    }

    // Clear any existing animations
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    // Delay scroll start to allow initial categories/images to load
    scrollTimeoutRef.current = setTimeout(() => {
      let startTime: number | null = null;
      const duration = 300000; // 5 minutes
      const totalScrollHeight = container.scrollHeight - container.clientHeight;

      if (totalScrollHeight <= 0) return; // No need to scroll if content fits

      const scrollStep = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        container.scrollTop = progress * totalScrollHeight;

        if (progress < 1) {
          animationFrameRef.current = requestAnimationFrame(scrollStep);
        } else {
          // Reset and start over
          container.scrollTop = 0;
          startTime = null; // Reset startTime for a fresh loop
          animationFrameRef.current = requestAnimationFrame(scrollStep);
        }
      };

      animationFrameRef.current = requestAnimationFrame(scrollStep);
    }, 2000); // Wait 2 seconds for initial content to settle before starting scroll

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [foodItemsByCategory, error, isLoadingInitial]); // Dependencies for auto-scroll

  // Loading state (initial page load)
  if (isLoadingInitial) {
    return (
      <div className="relative min-h-screen w-full flex items-center justify-center bg-[url('/sec11.jpg')] bg-cover bg-center before:absolute before:inset-0 before:bg-gradient-to-b before:from-black/70 before:to-black/80 before:z-0">
        <TVNavbar />
        <div className="relative z-10 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-white border-solid mx-auto mb-4"></div>
          <p className="text-white text-3xl font-bold">Loading Menu...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="relative min-h-screen w-full flex items-center justify-center bg-[url('/sec11.jpg')] bg-cover bg-center before:absolute before:inset-0 before:bg-gradient-to-b before:from-black/70 before:to-black/80 before:z-0">
        <TVNavbar />
        <div className="relative z-10 text-center">
          <p className="text-red-400 text-2xl font-bold mb-4">⚠️ {error}</p>
          <button
            onClick={() => {
              setIsLoadingInitial(true); // Reset initial loading state
              setError(null);
              // Trigger initial fetch for the first category again
              if (categoryOrder.length > 0) {
                fetchCategoryItems(categoryOrder[0]).then(() => setIsLoadingInitial(false));
              } else {
                setIsLoadingInitial(false); // No categories to load
              }
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-[url('/sec11.jpg')] bg-cover bg-center before:absolute before:inset-0 before:bg-gradient-to-b before:from-black/70 before:to-black/80 before:z-0">
      <TVNavbar />

      <section className="relative py-24 mt-12 overflow-hidden bg-[url('/sec11.jpg')] bg-cover bg-center">
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/85 to-black/90 z-0" />
        <div className="relative container mx-auto px-4 z-10">
          <div
            ref={containerRef}
            className="flex flex-col gap-8 overflow-y-auto max-h-[75vh] hide-scrollbar"
            style={{ scrollBehavior: "auto" }}
          >
            {categoryOrder.map(
              (categoryName, index) =>
                (foodItemsByCategory[categoryName]?.length > 0 || !foodItemsByCategory[categoryName]) && ( // Render section even if data not loaded yet for skeleton
                  <div key={categoryName} id={`category-${categoryName.replace(/\s+/g, '-')}`}>
                    <div className="relative flex justify-center mt-12">
                      <h2 className="relative inline-block text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#d2d7ef] via-[#cad1f6] to-[#cbd2f4] tracking-wider mb-8 drop-shadow-[0_4px_10px_rgba(74,96,210,0.35)] after:content-[''] after:block after:h-[4px] after:w-20 after:mx-auto after:mt-3 after:bg-gradient-to-r after:from-[#2C3E91] after:to-[#4A60D2] after:rounded-full">
                        {categoryName}
                      </h2>
                    </div>

                    {/* Conditionally render items or skeleton loaders */}
                    {activatedCategories.has(categoryName) && foodItemsByCategory[categoryName] ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                        {foodItemsByCategory[categoryName].map((item) => (
                          <div
                            key={item.item_id}
                            className="relative h-60 rounded-xl overflow-hidden group shadow-md hover:shadow-xl transition-shadow duration-300"
                          >
                            <Image
                              src={item.image_url || "/placeholder.jpg"}
                              alt={item.name}
                              fill
                              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                              style={{ objectFit: "cover" }}
                              // Priority for the first category, lazy for others
                              priority={index === 0}
                              loading={index === 0 ? "eager" : "lazy"}
                              placeholder="blur"
                              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAwAQAFwBAAgBAAENAAIf/xAAUAAEAAAAAAAAAAAAAAAAAAAAJ/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/xAGhEAAgIDAAAAAAAAAAAAAAAAAQIAEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+Wque2nLVwm7Hp7cWG3M4QLrBM6XEJwUFsAE8DgBgdAbT3RCxJz5j4RCSF0UEbUcnJTEu5rqr35kYdGb2w/rLNKBBAAAG/bE8T1zxe+5kXTPk0/9k="
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-transparent flex flex-col justify-end p-4">
                              <h3 className="text-lg md:text-xl font-extrabold text-white drop-shadow-sm">
                                {item.name}
                              </h3>
                              <p className="text-sm text-gray-200 drop-shadow-sm">Token: {item.quantity}</p>
                              <p className="text-xl font-bold text-yellow-400 drop-shadow-sm">${item.price}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      // Render skeleton loaders if category is activated but data isn't loaded yet, or if it's the first category loading
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                        {Array.from({ length: 5 }).map((_, idx) => (
                          <div key={`skeleton-${categoryName}-${idx}`} className="relative h-60 rounded-xl overflow-hidden animate-pulse bg-gray-700" />
                        ))}
                      </div>
                    )}
                  </div>
                )
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default FoodDisplayPage;