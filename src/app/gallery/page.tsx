"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

const categories = [
  { id: "all", name: "All" },
  { id: "interior", name: "Interior" },
  { id: "dishes", name: "Signature Dishes" },
  { id: "events", name: "Events" },
  { id: "drinks", name: "Drinks" },
];

interface GalleryItem {
  id: number;
  type: "image" | "video";
  src: string;
  alt?: string;
  category: string;
  title: string;
}

// Sample static data
const sampleItems: GalleryItem[] = [
  {
    id: 1,
    type: "image",
    src: "/DSC05783.jpg",
    category: "dishes",
    title: "Signature Dish",
  },
  {
    id: 2,
    type: "image",
    src: "/DSC03118-Enhanced-NR.jpg",
    category: "drinks",
    title: "Drinks Corner",
  },
  {
    id: 3,
    type: "video", 
    src: "/photo reel.mp4",
    category: "events",
    title: "Food Highlight",
  },
  {
    id: 4,
    type: "video",
    src: "https://www.youtube.com/watch?v=HU3wAPrJ-I8&t=13s",
    category: "events",
    title: "Event",
  },
  {
    id: 5,
    type: "image",
    src: "/DSC05767.jpg",
    category: "dishes",
    title: "Kerala Food",
  },
  {
    id: 6,
    type: "video", 
    src: "/Bluemoon.mp4",
    category: "events",
    title: "New Event Video",
  },
  {
    id: 7,
    type: "image",
    src: "/DSC05744.jpg",
    category: "interior",
    title: "Elegant Interior",
  },
  {
    id: 8,
    type: "image",
    src: "/DSC03068-Enhanced-NR.jpg",
    category: "dishes",
    title: "Thali",
  },
  {
    id: 9,
    type: "image",
    src: "/DSC05743.jpg",
    category: "interior",
    title: "Interior",
  },
  {
    id: 10,
    type: "video", // This is important!
    src: "https://www.youtube.com/watch?v=WtpatE5-Okc&t=11s",
    category: "events",
    title: "Events",
  },
  {
    id: 11,
    type: "image",
    src: "/DSC05746.jpg",
    category: "dishes",
    title: "Dish",
  },
  {
    id: 12,
    type: "image",
    src: "/DSC03072.jpg",
    category: "dishes",
    title: "Elegant Dish",
  },

];

const Gallery = () => {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchGalleryItems = async () => {
      if (activeCategory === "events") {
        try {
          const res = await fetch("/api/gallery/events");
          if (res.ok) {
            const data = await res.json();
            setGalleryItems(data);
          } else {
            console.error("Failed to fetch event videos");
          }
        } catch (error) {
          console.error("Error fetching event videos:", error);
        }
      } else {
        setGalleryItems(
          sampleItems.filter((item) =>
            activeCategory === "all" ? true : item.category === activeCategory
          )
        );
      }
    };

    fetchGalleryItems();
  }, [activeCategory]);

  const filteredItems = galleryItems;

  const getVideoId = (url: string): string | null => {
    const videoIdMatch = url.match(
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/i
    );
    return videoIdMatch ? videoIdMatch[1] : null;
  };

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = "auto";
  };

  const goToPrevious = () =>
    setCurrentImageIndex((prev) =>
      prev === 0 ? filteredItems.length - 1 : prev - 1
    );

  const goToNext = () =>
    setCurrentImageIndex((prev) =>
      prev === filteredItems.length - 1 ? 0 : prev + 1
    );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxOpen) return;
      if (e.key === "ArrowLeft") goToPrevious();
      if (e.key === "ArrowRight") goToNext();
      if (e.key === "Escape") closeLightbox();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [lightboxOpen, filteredItems]);

  const groupItemsIntoRows = (items: GalleryItem[]) => {
    const rows = [];
    for (let i = 0; i < items.length; i += 4) {
      rows.push(items.slice(i, i + 4));
    }
    return rows;
  };

  const itemRows = groupItemsIntoRows(filteredItems);

  return (
    <main className="relative w-full text-white">
      <div
        className="relative w-full bg-cover bg-center"
        style={{
          backgroundImage:
            "linear-gradient(to bottom, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.9)), url('/sec22.jpg')",
        }}
      >
        <div className="container mx-auto px-4 py-12 text-center">
          <h2 className="text-4xl font-bold mb-4 mt-24">Our Gallery</h2>
          <div className="w-24 h-1 bg-white mx-auto mb-6"></div>
          <p className="max-w-2xl mx-auto">
            Experience the elegant ambiance and exquisite cuisine of Bluemoon
            Restaurant through our gallery.
          </p>
        </div>

        <div className="flex justify-center gap-2 md:gap-4 py-4 overflow-x-auto">
          {categories.map((category) => (
            <button
              key={category.id}
              className={`px-3 py-2 md:px-4 md:py-2 rounded-lg transition-all text-xs md:text-sm whitespace-nowrap ${
                activeCategory === category.id
                  ? "bg-blue-500"
                  : "bg-gray-700 hover:bg-gray-600"
              }`}
              onClick={() => setActiveCategory(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {activeCategory === "all" && (
        <div
          className="absolute top-1/2 left-0 w-full h-[400px] bg-cover bg-center z-[-1]"
          style={{
            backgroundImage:
              "linear-gradient(to bottom, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.9)), url('/sec2.jpg')",
            backgroundAttachment: "fixed",
          }}
        ></div>
      )}

      <div className="w-full">
        {itemRows.map((row, rowIndex) => (
          <React.Fragment key={rowIndex}>
            <div
              className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 p-6 bg-cover bg-center"
              style={{
                backgroundImage:
                  rowIndex % 2 === 0
                    ? "linear-gradient(to bottom, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.9)), url('/sec11.jpg')"
                    : "linear-gradient(to bottom, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.9)), url('/sec4.jpg')",
              }}
            >
              {row.map((item, index) => (
                <div
                  key={item.id}
                  className="relative group cursor-pointer"
                  onClick={() => openLightbox(rowIndex * 4 + index)}
                >
                  <div className="w-full h-[300px] relative overflow-hidden rounded-lg shadow-md transition-opacity group-hover:opacity-80">
                    {item.type === "image" && (
                      <Image
                        src={item.src}
                        alt={item.alt || item.title}
                        fill
                        className="object-cover"
                        priority={rowIndex < 1 && index < 4}
                      />
                    )}
                    {item.type === "video" && getVideoId(item.src) && (
                      <iframe
                        src={`https://www.youtube-nocookie.com/embed/${getVideoId(item.src)}`} // Use https://
                        title={item.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        className="w-full h-full"
                      ></iframe>
                    )}
                    {item.type === "video" && !getVideoId(item.src) && (
                      <video
                        src={item.src}
                        controls
                        className="object-cover w-full h-full"
                      />
                    )}
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-center text-white p-2 opacity-0 group-hover:opacity-100 transition-all">
                    {item.title}
                  </div>
                </div>
              ))}
            </div>
            {rowIndex < itemRows.length - 1 && (
              <div
                className="w-full h-[100px] bg-cover bg-center"
                style={{
                  backgroundImage:
                    "linear-gradient(to bottom, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.9)), url('/sec2.jpg')",
                  backgroundAttachment: "fixed",
                }}
              ></div>
            )}
          </React.Fragment>
        ))}
      </div>

      {lightboxOpen && filteredItems[currentImageIndex] && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
          <button
            className="absolute top-5 right-5 text-white"
            onClick={closeLightbox}
          >
            <X size={32} />
          </button>
          <button className="absolute left-5 text-white" onClick={goToPrevious}>
            <ChevronLeft size={48} />
          </button>
          <div className="max-w-[90vw] max-h-[90vh] rounded-lg shadow-lg bg-black flex items-center justify-center">
            {filteredItems[currentImageIndex].type === "image" && (
              <Image
                src={filteredItems[currentImageIndex].src}
                alt={
                  filteredItems[currentImageIndex].alt ||
                  filteredItems[currentImageIndex].title
                }
                width={500}
                height={600}
                className="object-contain"
                priority
              />
            )}
            {filteredItems[currentImageIndex].type === "video" && getVideoId(filteredItems[currentImageIndex].src) && (
  <iframe
    src={`https://www.youtube-nocookie.com/embed/${getVideoId(filteredItems[currentImageIndex].src)}?autoplay=1&mute=1`} // Use https://
    title={filteredItems[currentImageIndex].title}
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    allowFullScreen
    className="w-full h-full"
  ></iframe>
)}
            {filteredItems[currentImageIndex].type === "video" && !getVideoId(filteredItems[currentImageIndex].src) && (
              <video
                src={filteredItems[currentImageIndex].src}
                controls
                className="object-contain w-full h-full"
              />
            )}
          </div>
          <button className="absolute right-5 text-white" onClick={goToNext}>
            <ChevronRight size={48} />
          </button>
        </div>
      )}
    </main>
  );
};

export default Gallery;
