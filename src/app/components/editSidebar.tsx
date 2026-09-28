"use client";
import { useRouter } from "next/navigation";

export default function EditUserSidebar() {
  const router = useRouter();

  return (
    <aside className="w-full md:w-1/4 bg-blue-900 bg-opacity-90 backdrop-blur-lg text-white p-6 flex flex-col gap-6 shadow-2xl md:rounded-r-3xl border-r-4 border-blue-800">
      <h2 className="text-2xl md:text-3xl font-extrabold text-center tracking-wide drop-shadow-lg mt-8 md:mt-32">
        🛠️ Edit
      </h2>

      <nav className="flex flex-col gap-4">
        <button
          className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg hover:scale-105 transition-all duration-300 shadow-lg"
          onClick={() => router.push("/adminDashboard")}
        >
          ⬅️ Back to Dashboard
        </button>

        <button
          className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg hover:scale-105 transition-all duration-300 shadow-lg"
          onClick={() => router.push("/admin/edit/editBlog")}
        >
          🍳 BLOGS
        </button>

        <button
          className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg hover:scale-105 transition-all duration-300 shadow-lg"
          onClick={() => router.push("/admin/edit/editCookingVideo")}
        >
          🍽️ COOKING VIDEOS
        </button>

        <button
          className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg hover:scale-105 transition-all duration-300 shadow-lg"
          onClick={() => router.push("/admin/edit/editGallery")}
        >
          🖼️ GALLERY
        </button>
        <button
          className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg hover:scale-105 transition-all duration-300 shadow-lg"
          onClick={() => router.push("/admin/edit/editReviews")}
        >
          ⭐ REVIEWS
        </button>
      </nav>
    </aside>
  );
}