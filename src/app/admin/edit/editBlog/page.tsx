"use client";
import { useState, useEffect, useRef } from "react";
import EditUserSidebar from "@/app/components/editSidebar";
interface BlogSection {
  heading: string;
  text: string;
}

interface Blog {
  id?: number;
  category: string;
  title: string;
  subtitle: string;
  content: BlogSection[];
  image: File | null;
}

export default function EditBlog() {
  const [publishedBlogs, setPublishedBlogs] = useState<Blog[]>([]);
  const formRef = useRef<HTMLFormElement | null>(null); // Use useRef
  const [blogData, setBlogData] = useState<Blog>({
    category: "",
    title: "",
    subtitle: "",
    content: [{ heading: "", text: "" }],
    image: null,
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch("/api/blogs");
        const data = await res.json();
        setPublishedBlogs(data);
      } catch (err) {
        console.error("Error fetching blogs:", err);
      }
    };
    fetchBlogs();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: keyof Omit<Blog, "image">
  ) => {
    setBlogData({ ...blogData, [field]: e.target.value });
  };

  const handleSectionChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    sectionIndex: number,
    field: keyof BlogSection
  ) => {
    const updatedContent = blogData.content.map((section, index) => {
      if (index === sectionIndex) {
        return { ...section, [field]: e.target.value };
      }
      return section;
    });
    setBlogData({ ...blogData, content: updatedContent });
  };

  const addSection = () => {
    setBlogData({
      ...blogData,
      content: [...blogData.content, { heading: "", text: "" }],
    });
  };

  const removeSection = (sectionIndex: number) => {
    const updatedContent = blogData.content.filter(
      (_, index) => index !== sectionIndex
    );
    setBlogData({ ...blogData, content: updatedContent });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setBlogData({ ...blogData, image: e.target.files[0] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Disable the button and change its text
    const submitButton = e.currentTarget.querySelector('button[type="submit"]') as HTMLButtonElement | null;
    if (submitButton) {
      submitButton.textContent = "Updating...";
      submitButton.disabled = true;
    }

    const formData = new FormData();
    formData.append("category", blogData.category);
    formData.append("title", blogData.title);
    formData.append("subtitle", blogData.subtitle);
    if (blogData.image) {
      formData.append("image", blogData.image);
    }
    blogData.content.forEach((section, index) => {
      formData.append(`content[${index}][heading]`, section.heading);
      formData.append(`content[${index}][text]`, section.text);
    });

    try {
      const response = await fetch(
        isEditing ? `/api/blogs/${blogData.id}` : "/api/blogs",
        {
          method: isEditing ? "PUT" : "POST",
          body: formData,
        }
      );
      const resData = await response.json();

      if (!response.ok) {
        throw new Error(
          `Failed to ${isEditing ? "update" : "create"} blog`
        );
      }

      // Refresh the list of blogs
      const updatedBlogs = await fetch("/api/blogs").then((res) =>
        res.json()
      );
      setPublishedBlogs(updatedBlogs);

      // Reset form
      setBlogData({
        category: "",
        title: "",
        subtitle: "",
        content: [{ heading: "", text: "" }],
        image: null,
      });
      setIsEditing(false);
      if (resData.alert) {
        alert(isEditing ? "Blog updated successfully!" : "Blog Created Successfully!");
      }

    } catch (error) {
      console.error(
        `Error ${isEditing ? "updating" : "creating"} blog:`,
        error
      );
      alert(`Error ${isEditing ? "updating" : "creating"} blog!`);
    } finally {
      // Re-enable the button and reset its text in either success or error
      if (submitButton) {
        submitButton.textContent = isEditing ? "Update Blog" : "Publish Blog";
        submitButton.disabled = false;
      }
    }
  };



  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`/api/blogs/${id}`, {
        method: "DELETE",
      });
      const resData = await res.json();
      if (res.ok) {
        setPublishedBlogs(publishedBlogs.filter((blog) => blog.id !== id));
      }
      if (resData.alert){
        alert("Blog Deleted Successfully!");
      }
    } catch (err) {
      console.error("Error deleting blog:", err);
      alert("Error deleting blog!");
    }
  };

  return (
    
    <div className="min-h-screen bg-gradient-to-br from-gray-800 to-black flex md:flex-row flex-col mt-24">
     
        <EditUserSidebar />
  
      {/* Blog Content */}
      <div className="flex-grow p-6 sm:p-12">
      <div className="max-w-3xl mx-auto backdrop-blur-md bg-[#2c2f45]/70 border border-gray-600 rounded-3xl shadow-xl p-10 space-y-8 text-white">
      <h1 className="text-4xl font-extrabold text-center text-blue-700 drop-shadow-sm">
            {isEditing ? "✏️ Edit Blog" : "✍️ Create a New Blog"}
          </h1>

          <form ref={formRef} onSubmit={handleSubmit} className="space-y-6 ">
            {/* Category */}
            <div>
              <label className="block text-md font-semibold text-blue-400">
                📂 Category
              </label>
              <input
                type="text"
                value={blogData.category}
                onChange={(e) => handleInputChange(e, "category")}
                placeholder="e.g. Travel, Food, Technology"
                className="mt-2 block w-full border border-gray-300 rounded-2xl shadow-inner px-5 py-3 focus:ring-2 focus:ring-blue-400 focus:outline-none transition text-black"
                required
              />
            </div>

            {/* Title */}
            <div>
              <label className="block text-md font-semibold text-blue-400">
                📝 Title
              </label>
              <input
                type="text"
                value={blogData.title}
                onChange={(e) => handleInputChange(e, "title")}
                placeholder="Enter the main title"
                className="text-black mt-2 block w-full border border-gray-300 rounded-2xl shadow-inner px-5 py-3 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
                required
              />
            </div>

            {/* Subtitle */}
            <div>
              <label className="block text-md font-semibold text-blue-400">
                📑 Subtitle
              </label>
              <input
                type="text"
                value={blogData.subtitle}
                onChange={(e) => handleInputChange(e, "subtitle")}
                placeholder="Enter a short subtitle"
                className="text-black mt-2 block w-full border border-gray-300 rounded-2xl shadow-inner px-5 py-3 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
                required
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-md font-semibold text-blue-400">
                🖼️ Upload Image (Image size less than 500KB)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="text-black mt-2 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>

            {/* Blog Content Sections */}
            <div className="space-y-4">
              <h3 className="text-md font-semibold text-blue-400">📃 Blog Content</h3>
              {blogData.content.map((section, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-xl space-y-2">
                  <input
                    type="text"
                    placeholder="Section Heading"
                    value={section.heading}
                    onChange={(e) =>
                      handleSectionChange(e, index, "heading")
                    }
                    className="text-black w-full border border-gray-300 rounded-xl px-4 py-2"
                    required
                  />
                  <textarea
                    placeholder="Section Text"
                    value={section.text}
                    onChange={(e) =>
                      handleSectionChange(e, index, "text")
                    }
                    className="text-black w-full border border-gray-300 rounded-xl px-4 py-2"
                    rows={4}
                    required
                  ></textarea>
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => removeSection(index)}
                      className="text-red-600 hover:underline text-sm"
                    >
                      Remove Section
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addSection}
                className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium"
              >
                ➕ Add Section
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="bg-blue-700 text-white w-full py-3 rounded-2xl font-semibold hover:bg-blue-800 transition"
            >
              {isEditing ? "Update Blog" : "Publish Blog"}
            </button>
          </form>
        </div>

        {/* Published Blogs Sections*/}
        <div className="max-w-5xl mx-auto mt-12 ">
          <h2 className="text-3xl font-bold mb-6 text-blue-700 text-center">📚 Published Blogs</h2>
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            {publishedBlogs.map((blog) => (
              <div
                key={blog.id}
                className="bg-white border border-gray-200 rounded-2xl shadow-md overflow-hidden"
              >
                {/* Show thumbnail if available */}
                {blog.image && typeof blog.image === "string" && (
                  <img
                    src={`data:image/*;base64,${blog.image}`}
                    alt="Blog"
                    className="rounded-xl w-full h-48 object-cover mb-4"
                  />
                )}
                <div className="p-4 space-y-1">
                  <p className="text-sm text-blue-600">{blog.category}</p>
                  <h3 className="font-semibold text-lg">{blog.title}</h3>
                  <p className="text-gray-500 text-sm line-clamp-2">
                    {blog.subtitle}
                  </p>

                  <div className="flex gap-2 mt-3">
                    
                    <button
                      onClick={() => handleDelete(blog.id!)}
                      className="px-3 py-1 rounded-lg text-sm bg-red-100 text-red-700 hover:bg-red-200"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
