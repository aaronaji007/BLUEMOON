"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

interface BlogSection {
  heading: string;
  text: string;
}

interface Blog {
  id: number;
  category: string;
  title: string;
  subtitle: string;
  content: BlogSection[];
  image: string;
}

export default function Blog() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [blogContent, setBlogContent] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true); // Added loading state

  const categories = [
    "All",
    "Food",
    "Seasonal",
    "Dessert",
    "Restaurant History",
    "Recipes",
    "Cooking Tips",
  ];

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true); // Set loading to true when fetching starts
      try {
        const response = await fetch("/api/blogs");
        if (!response.ok) {
          throw new Error("Failed to fetch blogs");
        }
        const data = await response.json();
        setBlogContent(data);
      } catch (error) {
        console.error("Error fetching blogs:", error);
        // Optionally set an error state here
      } finally {
        setLoading(false); // Set loading to false when fetching completes
      }
    };

    fetchBlogs();
  }, []);

  const filteredContent = blogContent.filter((blog) => {
    const searchLower = search.toLowerCase();
    const matchesCategory = category === "All" || blog.category === category;

    const isTypedCategory = categories
      .filter((c) => c !== "All")
      .some((c) => c.toLowerCase() === searchLower);

    if (isTypedCategory) {
      return blog.category.toLowerCase() === searchLower;
    }

    const matchesSearch =
      search === "" ||
      blog.title.toLowerCase().includes(searchLower) ||
      blog.subtitle.toLowerCase().includes(searchLower) ||
      blog.content.some(
        (section) =>
          section.heading.toLowerCase().includes(searchLower) ||
          section.text.toLowerCase().includes(searchLower)
      );

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="relative min-h-screen flex justify-center p-6 text-white bg-cover bg-center bg-[url('/base.jpg')]">
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/70 to-black/70"></div>
      <div className="relative max-w-6xl w-full">
        <motion.h1
          className="text-center text-4xl font-bold mt-32 mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          BLOGS
        </motion.h1>

        <div className="flex flex-col md:flex-row justify-between items-center bg-gradient-to-b from-blue-800 to-blue-900 p-4 rounded-lg shadow-lg gap-4">
          <input
            type="text"
            placeholder=" Search blog..."
            className="p-2 rounded-full text-black w-full md:w-1/2 border border-gray-300 outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            disabled={loading} // Disable search input while loading
          />
          <select
            className="p-2 rounded-full text-blue-800 bg-white border border-gray-300 outline-none cursor-pointer"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            disabled={loading} // Disable category select while loading
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="flex justify-center items-center mt-6">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white-500"></div>
            <span className="ml-3 text-white font-semibold">Loading blogs...</span>
          </div>
        ) : filteredContent.length > 0 ? (
          filteredContent.map((blog, index) => (
            <motion.div
              key={index}
              className="mt-6 bg-white text-black p-6 rounded-lg shadow-lg flex flex-col md:flex-row gap-6 items-stretch"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: index * 0.2 }}
            >
              <div className="md:w-[65%] flex flex-col flex-1 h-full">
                <span className="bg-blue-300 text-blue-900 px-3 py-1 rounded-lg font-bold text-lg w-[28%] min-w-[120px]">
                  Category: {blog.category}
                </span>

                <h2 className="text-3xl font-bold mt-4">{blog.title}</h2>
                <h3 className="text-xl font-semibold text-gray-700">
                  {blog.subtitle}
                </h3>

                <div className="bg-[#3a4aa1] text-white p-6 rounded-xl shadow-lg mt-4 flex-1 h-full flex flex-col justify-center">
                  {blog.content.map((section, i) => (
                    <div key={i}>
                      <h2 className="mt-4 font-semibold text-lg">
                        {section.heading}
                      </h2>
                      <p>{section.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              <motion.div
                className="md:w-[35%] flex items-center overflow-hidden rounded-lg"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <img
                  src={`data:image/jpeg;base64,${blog.image}`}
                  alt={blog.category}
                  className="w-full mt-20 h-[65%] object-cover rounded-lg shadow-md transition duration-300 hover:shadow-2xl"
                />
              </motion.div>
            </motion.div>
          ))
        ) : (
          <motion.p
            className="text-center text-gray-300 mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            No results found.
          </motion.p>
        )}
        <div className="w-full flex justify-center mt-6">
          <Link
            href="/"
            className="px-6 py-3 bg-blue-800 text-white font-semibold text-lg rounded-full shadow-lg hover:bg-[#253b9c] hover:scale-105 transition-all duration-300 z-10"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}