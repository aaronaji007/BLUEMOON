// OffersCarousel.tsx
"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MdLocalOffer } from "react-icons/md";

// Updated FoodItem interface for direct use
interface FoodItemForCarousel {
  item_id: number;
  name: string;
  image_url: string;
  quantity: number;
}

// Updated Offer interface to directly include detailed items
interface Offer {
  id: number;
  total_price: number | string | null;
  discounted_price: number | string | null;
  // This `selected_items` property will now contain the actual item details, not just IDs.
  selected_items_details: FoodItemForCarousel[]; // <<< CRITICAL CHANGE HERE
  offer_type: string;
  start_date: string;
  end_date: string;
}

const OffersCarousel = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const totalSlides = offers.length;

  useEffect(() => {
    const fetchCarouselOffers = async () => {
      try {
        // --- CRITICAL CHANGE HERE ---
        // Fetch using the new specific parameter for carousel offers
        const res = await fetch("/api/offers?fetch_carousel_offers=true");
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data: Offer[] = await res.json(); // Data is now directly an array of Offer objects
        console.log("Fetched carousel offers:", data);

        if (!Array.isArray(data)) {
          console.error("Invalid data format for carousel offers:", data);
          setOffers([]);
          return;
        }
        setOffers(data);
      } catch (err) {
        console.error("Error fetching carousel offers:", err);
        // Optionally set an error state here to inform the user
      } finally {
        setLoading(false);
      }
    };

    fetchCarouselOffers();
  }, []);

  // Removed the foodItems and foodItemLookup states and their useEffects
  // because the data is now pre-joined on the server.

  useEffect(() => {
    if (offers.length > 1 && !isHovered) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % offers.length);
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [offers, isHovered]);

  if (loading)
    return (
      <div className="w-full h-[500px] flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-yellow-500"></div>
        <span className="ml-3 text-gray-700 font-semibold">Loading offers...</span>
      </div>
    );
  if (offers.length === 0) return <p className="text-center text-gray-600 mt-8">No offers available.</p>;

  const prevIndex = (currentIndex - 1 + totalSlides) % totalSlides;
  const nextIndex = (currentIndex + 1) % totalSlides;

  // The getSelectedItems function now just returns the pre-joined array
  const getSelectedItems = (offer: Offer): FoodItemForCarousel[] => {
    return offer.selected_items_details || []; // Ensure it returns an empty array if null/undefined
  };

  return (
    <div
      className="relative w-full h-[520px] flex items-center justify-center bg-gradient-to-br from-white to-white overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <AnimatePresence>
        {/* Previous Slide */}
        <motion.div
          key={prevIndex}
          className="absolute left-[15%] w-[380px] h-[380px] flex flex-col items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 text-white shadow-2xl rounded-xl p-4 opacity-70 border border-gray-700 hidden xl:flex"
          initial={{ x: "-100vw" }}
          animate={{ x: "-25vw" }}
          exit={{ x: "-100vw" }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <h2 className="text-lg bg-yellow-500 px-3 py-1 rounded-md mb-3 mt-[-50px] w-[200px] text-center flex items-center justify-center gap-1 shadow-md">
            <MdLocalOffer className="text-white text-base" />
            {offers[prevIndex].offer_type} Offer
          </h2>
          <div className="flex flex-wrap justify-center gap-x-2 gap-y-2 mt-1 overflow-hidden">
            {getSelectedItems(offers[prevIndex]).map((item) => (
              <div key={item.item_id} className="text-center flex flex-col items-center w-[70px] flex-shrink-0">
                <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-yellow-500 shadow-md">
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="mt-1 text-xs font-semibold text-yellow-400 leading-tight truncate w-full">
                  {item.name}
                </p>
                <div className="mt-1 text-[9px] font-medium text-gray-300 border border-orange-500 px-1 py-[1px] rounded-md inline-block">
                  Item No: {item.quantity}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 text-center text-base font-semibold">
            <p className="text-gray-400 line-through text-sm">Actual Price: ${offers[prevIndex].total_price}</p>
            <p className="text-yellow-300 font-bold text-xl">Discounted Price: ${offers[prevIndex].discounted_price}</p>
            <p className="text-gray-400 text-xs mt-1">
              🗓️ {new Date(offers[prevIndex].start_date).toLocaleDateString('en-GB')} -{" "}
              {new Date(offers[prevIndex].end_date).toLocaleDateString('en-GB')}
            </p>
          </div>
        </motion.div>

        {/* Center Slide */}
        <motion.div
          key={currentIndex}
          className="relative w-[90%] max-w-[700px] md:max-w-[600px] sm:max-w-[450px]
                     min-h-[500px] lg:min-h-[560px] h-auto
                     bg-[#131722] text-white rounded-2xl p-6 sm:p-10 shadow-xl border border-gray-700
                     flex flex-col items-center justify-between
                     mt-6 sm:mt-10 lg:mt-14 mb-6 sm:mb-10 lg:mb-14"
          initial={{ x: "100vw" }}
          animate={{ x: "0vw" }}
          exit={{ x: "-25vw" }}
          transition={{ duration: 1, ease: "easeOut" }}
        >

          {/* Offer Header */}
          <h2 className="mt-6 text-lg sm:text-xl lg:text-2xl font-semibold bg-gradient-to-r from-yellow-500 to-orange-500 text-white
                                  px-6 py-3 sm:px-7 sm:py-4 rounded-lg flex items-center gap-3 w-full text-center justify-center shadow-lg">
            <MdLocalOffer className="text-white text-xl sm:text-2xl lg:text-3xl" />
            {offers[currentIndex].offer_type} Offer
          </h2>

          {/* Items Section - Adjusted for up to 5 items */}
          <div className="flex flex-wrap justify-center gap-x-3 sm:gap-x-5 lg:gap-x-7 gap-y-3 mt-2 sm:mt-3 lg:mt-4 overflow-hidden">
            {getSelectedItems(offers[currentIndex]).map((item) => (
              <div key={item.item_id} className="text-center flex flex-col items-center w-[75px] sm:w-[90px] lg:w-[100px] flex-shrink-0">
                {/* Image Container */}
                <div className="relative w-14 h-14 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full overflow-hidden border-2 border-gray-500 shadow-md">
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Item Name */}
                <p className="mt-1 text-xs sm:text-sm lg:text-base font-bold text-yellow-400 leading-tight truncate w-full px-1">
                  {item.name}
                </p>
                {/* Item Number */}
                <div className="mt-1 text-[10px] sm:text-xs lg:text-sm font-medium text-gray-300 border border-gray-500 px-1 py-[2px] rounded-md">
                  Item No: {item.quantity}
                </div>
              </div>
            ))}
          </div>

          {/* Price Section */}
          <div className="mt-2 sm:mt-4 text-center text-xl sm:text-2xl lg:text-2xl font-semibold mb-5">
            <p className="text-gray-400 line-through">Actual Price: ${offers[currentIndex].total_price}</p>
            <p className="text-yellow-300 font-bold text-2xl sm:text-3xl lg:text-3xl">
              Discounted Price: ${offers[currentIndex].discounted_price}
            </p>
            {/* 🗓️ Display Date Range for Center Slide */}
            <p className="text-gray-400 text-sm mt-1">
              🗓️ {new Date(offers[currentIndex].start_date).toLocaleDateString('en-GB')} -{" "}
              {new Date(offers[currentIndex].end_date).toLocaleDateString('en-GB')}
            </p>
          </div>
        </motion.div>

        {/* Next Slide */}
        <motion.div
          key={nextIndex}
          className="absolute right-[15%] w-[380px] h-[380px] flex flex-col items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 text-white shadow-2xl rounded-xl p-4 opacity-70 border border-gray-700 hidden xl:flex"
          initial={{ x: "100vw" }}
          animate={{ x: "25vw" }}
          exit={{ x: "100vw" }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <h2 className="text-lg bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-semibold px-3 py-1 rounded-lg mb-3 mt-[-50px] w-[200px] text-center flex items-center justify-center gap-1 shadow-xl">
            <MdLocalOffer className="text-white text-base" />
            {offers[nextIndex].offer_type} Offer
          </h2>
          <div className="flex flex-wrap justify-center gap-x-2 gap-y-2 mt-1 overflow-hidden">
            {getSelectedItems(offers[nextIndex]).map((item) => (
              <div key={item.item_id} className="text-center flex flex-col items-center w-[70px] flex-shrink-0">
                <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-yellow-500">
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="mt-1 text-xs font-semibold text-yellow-400 leading-tight truncate w-full">
                  {item.name}
                </p>
                <div className="mt-1 text-[9px] font-medium text-gray-300 border border-yellow-500 px-1 py-[1px] rounded-md inline-block">
                  Item No: {item.quantity}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 text-center text-base font-semibold">
            <p className="text-gray-400 line-through text-sm">Actual Price: ${offers[nextIndex].total_price}</p>
            <p className="text-yellow-300 font-bold text-xl">Discounted Price: ${offers[nextIndex].discounted_price}</p>
            <p className="text-gray-400 text-xs mt-1">
              🗓️ {new Date(offers[nextIndex].start_date).toLocaleDateString('en-GB')} -{" "}
              {new Date(offers[nextIndex].end_date).toLocaleDateString('en-GB')}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default OffersCarousel;