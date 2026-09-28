'use client';

import { useState, useEffect } from "react";
import EditUserSidebar from "@/app/components/editSidebar";

interface Video {
  id: number;
  title: string;
  video_url: string;
  thumbnail_url: string;
  description: string;
  category: string;
}

export default function CookingVideoEdit() {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Veg",
  });

  const [uploadStatus, setUploadStatus] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [uploadedVideos, setUploadedVideos] = useState<Video[]>([]);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
        setIsFetching(true);
        setFetchError(null);
        try {
          const res = await fetch("/api/getvideo");
          if (!res.ok) {
            // Handle HTTP errors
            const errorText = await res.text(); // Read error message from response
            throw new Error(`HTTP error! Status: ${res.status} - ${errorText}`);
          }
          const data = await res.json();
          setUploadedVideos(data);
        } catch (error) {
          console.error("Error fetching videos:", error);
          // Ensure error is of type Error
          if (error instanceof Error) {
            setFetchError(error.message);
          } else {
            setFetchError("An unknown error occurred");
          }
          setUploadedVideos([]);
        } finally {
          setIsFetching(false);
        }
      };
      

    fetchVideos();
  }, [videoUrl]); // Re-fetch videos when a new video is uploaded (videoUrl changes)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleVideoUpload = async () => {
    if (!form.title || !form.description) {
      alert("Please fill in all fields.");
      return;
    }

    setUploadStatus(editingVideoId ? "Updating video..." : "Uploading to Cloudinary...");

    try {
      let finalVideoUrl = videoUrl;
      let thumbnailUrl = videoUrl
        .replace("/upload/", "/upload/so_1/")
        .replace(/\.\w+$/, ".jpg");

      // If uploading a new file
      if (videoFile) {
        const formData = new FormData();
        formData.append("file", videoFile);
        formData.append("upload_preset", "unsigned_preset");

        const cloudinaryRes = await fetch("https://api.cloudinary.com/v1_1/dc0mrjkjy/video/upload", {
          method: "POST",
          body: formData,
        });

        const cloudinaryData = await cloudinaryRes.json();
        if (!cloudinaryRes.ok || !cloudinaryData.secure_url) throw new Error("Upload failed");

        finalVideoUrl = cloudinaryData.secure_url;
        thumbnailUrl = finalVideoUrl
          .replace("/upload/", "/upload/so_1/")
          .replace(/\.\w+$/, ".jpg");
      }

      const apiUrl = editingVideoId ? "/api/updatevideo" : "/api/savemetadata";
      const method = editingVideoId ? "PUT" : "POST";

      const saveRes = await fetch(apiUrl, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingVideoId,
          title: form.title,
          description: form.description,
          category: form.category,
          video_url: finalVideoUrl,
          thumbnail_url: thumbnailUrl,
        }),
      });

      if (!saveRes.ok) throw new Error("Failed to save video");

      setUploadStatus(editingVideoId ? "✅ Video updated!" : "✅ Upload successful!");
      setForm({ title: "", description: "", category: "Veg" });
      setVideoFile(null);
      setVideoUrl(finalVideoUrl); // <---- UPDATE THIS LINE
      setEditingVideoId(null); // Reset editing mode
    } catch (err: unknown) {
        // Type guard to check if error is an instance of Error
        if (err instanceof Error) {
          setUploadStatus("❌ Failed: " + err.message);
        } else {
          setUploadStatus("❌ Failed: An unknown error occurred.");
        }
      }
  };
  
  const handleDelete = async (id: number) => {
    const confirmDelete = confirm("Are you sure you want to delete this video?");
    if (!confirmDelete) return;
  
    try {
      const res = await fetch(`/api/deletevideo?id=${id}`, { method: "DELETE" });
      const data = await res.json();
  
      if (!res.ok) throw new Error(data.error || "Delete failed");
  
      // Refresh video list
      setVideoUrl(prev => prev + "?refresh=" + Date.now());
    } catch (err: unknown) {
        // Type guard to check if error is an instance of Error
        if (err instanceof Error) {
          alert("Failed to delete video: " + err.message);
        } else {
          alert("Failed to delete video: An unknown error occurred.");
        }
      }
  };

  const [editingVideoId, setEditingVideoId] = useState<number | null>(null);
  
  
  const handleEdit = (video: Video) => {
    setForm({
      title: video.title,
      description: video.description,
      category: video.category,
    });
    setEditingVideoId(video.id); // store id for update
    setVideoUrl(video.video_url); // optional: show preview
  
    // Scroll to top of the page smoothly
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleUpdateVideo = async () => {
    if (!editingVideoId) return;
  
    try {
      const res = await fetch(`/api/updatevideo`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingVideoId,
          title: form.title,
          description: form.description,
          category: form.category,
        }),
      });
  
      if (!res.ok) throw new Error("Update failed");
  
      setUploadStatus("✅ Video updated successfully!");
      setEditingVideoId(null);
      setForm({ title: "", description: "", category: "Veg" });
      setVideoFile(null);
      setVideoUrl(""); // reset preview
      setVideoUrl(prev => prev + "?refresh=" + Date.now()); // refresh list
    } catch (err: unknown) {
    // Type guard to check if error is an instance of Error
    if (err instanceof Error) {
      console.error(err);
      setUploadStatus(`❌ Update failed: ${err.message}`);
    } else {
      console.error(err);
      setUploadStatus("❌ Update failed: An unknown error occurred.");
    }
    }
  };
    
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-gray-800 to-black text-white mt-24">
      <EditUserSidebar />

      <div className="flex-1 flex flex-col items-center py-16 px-6 sm:px-10 md:px-16">
        <div className="w-full max-w-3xl backdrop-blur-md bg-[#2c2f45]/70 border border-gray-600 p-6 sm:p-10 rounded-2xl shadow-2xl mb-10">
          <h2 className="text-4xl font-bold mb-8 text-center text-blue-700 font-bold">🍽️ Upload Cooking Video</h2>

          <div className="space-y-5">
            <input
              type="text"
              name="title"
              placeholder="Video Title"
              value={form.title}
              onChange={handleChange}
              className="w-full p-3 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-green-500"
            />

            <textarea
              name="description"
              placeholder="Video Description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              className="w-full p-3 rounded-lg text-black resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
            />

            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full p-3 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="Veg">Veg</option>
              <option value="Non-Veg">Non-Veg</option>
              <option value="Dessert">Dessert</option>
              <option value="Breakfast">Breakfast</option>
            </select>

            <input
              type="file"
              accept="video/*"
              onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
              className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 hover:file:cursor-pointer"
            />

<button
  onClick={editingVideoId ? handleUpdateVideo : handleVideoUpload}
  className={`w-full ${editingVideoId ? "bg-yellow-600 hover:bg-yellow-700" : "bg-blue-700 hover:bg-blue-800"} px-6 py-3 rounded-lg text-white text-lg font-semibold transition cursor-pointer`}
  disabled={!form.title || !form.description || (!videoFile && !editingVideoId)}
>
  {editingVideoId ? "Update Video" : "Upload Video"}
</button>




            {uploadStatus && (
              <p className="text-center text-sm text-gray-300">{uploadStatus}</p>
            )}

            {videoUrl && (
            <div className="pt-6">
                <h3 className="text-xl font-semibold mb-3">🎉 Uploaded Video Preview:</h3>
                <video
                src={videoUrl}
                controls
                className="w-full h-auto rounded-xl border border-gray-600"
                style={{ maxWidth: '500px', maxHeight: '320px' }}
                />
            </div>
            )}

          </div>
        </div>

        {/* Display Uploaded Videos */}
<div className="w-full max-w-7xl mx-auto mt-10 px-4 sm:px-6 lg:px-8">
  <div className="backdrop-blur-md bg-[#2c2f45]/70 border border-gray-600 p-6 sm:p-10 rounded-2xl shadow-2xl">
    <h2 className="text-3xl font-bold mb-8 text-center text-green-500">
      🎬 Uploaded Cooking Videos
    </h2>

    {isFetching ? (
      <p className="text-center text-gray-300">Fetching uploaded videos...</p>
    ) : fetchError ? (
      <p className="text-center text-red-500">{fetchError}</p>
    ) : uploadedVideos.length > 0 ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
        {uploadedVideos.map((video) => (
          <div
            key={video.id}
            className="bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-105 duration-200"
          >
            <div className="aspect-video">
              <img
                src={video.thumbnail_url}
                alt={video.title}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="p-4 bg-[#1A1A1A] rounded-2xl shadow-lg h-full border border-[#2A2A2A]">
  <h3 className="text-lg font-semibold text-white mb-2 line-clamp-1">{video.title}</h3>
  <p className="text-sm text-gray-400 line-clamp-2">{video.description}</p>
  <p className="text-xs text-gray-500 mt-2 italic">Category: {video.category}</p>

  {/* Watch Button */}
  <div className="mt-4">
    <a
      href={video.video_url}
      target="_blank"
      rel="noopener noreferrer"
      className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-md text-sm text-center"
    >
      ▶ Watch Video
    </a>
  </div>

  {/* Edit + Delete side-by-side */}
  <div className="flex justify-between gap-3 mt-3">
    <button
      onClick={() => handleEdit(video)}
      className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2.5 px-4 rounded-md text-sm"
    >
      Edit
    </button>

    <button
      onClick={() => handleDelete(video.id)}
      className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 px-4 rounded-md text-sm"
    >
      Delete
    </button>
  </div>
</div>


          </div>
        ))}
      </div>
    ) : (
      <p className="text-center text-gray-300">No videos have been uploaded yet.</p>
    )}
  </div>
</div>

      </div>
    </div>
  );
}