'use client';
import { useEffect, useState } from "react";
import ReactPlayer from "react-player";

type Video = {
  id: number;
  title: string;
  description: string;
  video_url: string;
  thumbnail_url: string;
  category: string;
};

export default function CookingVideosPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [videos, setVideos] = useState<Video[]>([]);
  const [filteredVideos, setFilteredVideos] = useState<Video[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(false); // State for loading

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true); // Set loading to true when fetching starts
      try {
        const res = await fetch("/api/getvideo");
        const data: Video[] = await res.json();
        setVideos(data);
        setFilteredVideos(data);
        setSelectedVideo(data[0] || null);
      } catch (error) {
        console.error("Failed to fetch videos:", error);
        // Optionally set an error state here
      } finally {
        setLoading(false); // Set loading to false when fetching completes
      }
    };

    fetchVideos();
  }, []);

  const handleSearch = () => {
    setLoading(true); // Set loading when search starts
    const results = videos.filter(video =>
      video.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredVideos(results);
    setSelectedVideo(results.length > 0 ? results[0] : null);
    setLoading(false); // Set loading to false after filtering
  };

  const handleCategoryChange = (cat: string) => {
    setLoading(true); // Set loading when category changes
    setCategory(cat);
    const filtered =
      cat === "All" ? videos : videos.filter((video) => video.category === cat);
    setFilteredVideos(filtered);
    setSelectedVideo(filtered.length > 0 ? filtered[0] : null);
    setLoading(false); // Set loading to false after filtering
  };

  return (
    <div className="min-h-screen relative text-[#3345A7] flex flex-col items-center bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/base.jpg')" }}>

      <div className="min-h-screen w-full bg-black/60 flex flex-col items-center text-white px-4 pt-24">
        <h2 className="text-3xl font-bold text-white text-center mb-6 px-6 py-3 rounded-lg mt-10">
          🍳 Cooking Videos
        </h2>

        {/* 🔍 Search */}
        <div className="flex gap-4 mb-6">
          <input
            type="text"
            placeholder="Search videos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 rounded-md text-black"
          />
          <button
            onClick={handleSearch}
            className="bg-yellow-500 px-4 py-2 rounded-md"
            disabled={loading} // Disable button while loading
          >
            {loading ? <span className="animate-spin">&#9696;</span> : "Search"}
          </button>
        </div>

        {/* 🗂 Categories */}
        <div className="flex gap-4 mb-6">
          {["All", "Veg", "Non-Veg", "Dessert", "Breakfast"].map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-4 py-2 rounded-md ${category === cat ? "bg-green-500" : "bg-gray-500"} ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={loading} // Disable buttons while loading
            >
              {loading && category === cat ? <span className="animate-spin">&#9696;</span> : cat}
            </button>
          ))}
        </div>

        {loading && (
          <div className="flex justify-center items-center mt-6">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white-500"></div>
            <span className="ml-3 text-white font-semibold">Loading videos...</span>
          </div>
        )}

        {!loading && selectedVideo && (
          <div className="max-w-3xl w-full bg-white p-4 rounded-lg shadow-md border border-gray-300 text-black">
            <div className="w-full flex justify-center">
              <ReactPlayer
                url={selectedVideo.video_url}
                controls
                width="640px"
                height="360px"
                className="rounded-lg"
              />
            </div>

            <h3 className="mt-3 text-md font-semibold text-gray-700 text-center">
              {selectedVideo.title}
            </h3>
            <p className="text-gray-600 text-sm mt-1 text-center">
              {selectedVideo.description}
            </p>
          </div>
        )}

        {!loading && (
          <div className="max-w-5xl w-full mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-2">
            {filteredVideos.map((video, index) => (
              <div
                key={index}
                onClick={() => setSelectedVideo(video)}
                className="cursor-pointer bg-white p-3 rounded-lg shadow-md border border-gray-300 hover:shadow-lg transition flex flex-col items-center"
                style={{ width: "220px" }}
              >
                <img
                  src={video.thumbnail_url}
                  alt={video.title}
                  className="w-full h-32 object-cover rounded-md"
                />
                <h4 className="text-sm font-medium text-gray-700 mt-2 text-center">{video.title}</h4>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}