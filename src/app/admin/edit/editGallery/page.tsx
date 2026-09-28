'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';

import EditUserSidebar from "@/app/components/editSidebar";

interface GalleryItem {
  id: number;
  src: string;
  alt: string;
  title: string;
  category: string;
  type: 'image' | 'video';
  created_at: string;
}

export default function EditGalleryPage() {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [alt, setAlt] = useState('');
  const [message, setMessage] = useState('');
  const [videos, setVideos] = useState<GalleryItem[]>([]);
  const [, setLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get('/api/gallery/events');
        if (response.status === 200) {
          setVideos(response.data);
        } else {
          setError('Failed to fetch videos.');
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message || 'An error occurred.');
        } else {
          setError('An unexpected error occurred.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!url.includes('youtube.com') && !url.includes('youtu.be')) {
      setMessage('Please enter a valid YouTube URL');
      return;
    }

    setIsAdding(true);
    setMessage('Adding video...');
    setError(null);

    try {
      const res = await axios.post('/api/gallery/add', {
        src: url,
        alt,
        title,
        category: 'event',
        type: 'video',
      });

      if (res.status === 200) {
        setMessage('YouTube video added successfully!');
        setUrl('');
        setTitle('');
        setAlt('');
        const newVideo = res.data.data;
        setVideos(prevVideos => [newVideo, ...prevVideos]);
      } else {
        setMessage('Failed to add video. Try again.');
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err);
        setMessage('Error adding video.');
      } else {
        console.error('Unknown error');
        setMessage('Error adding video.');
      }
      setError('Failed to add video.');
    } finally {
      setIsAdding(false);
    }
  };
  const convertToEmbedUrl = (url: string): string => {
    const youtubeRegex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/;
    const match = url.match(youtubeRegex);
    if (match && match[1]) {
      return `https://www.youtube.com/embed/${match[1]}`;
    }
    return url; // fallback (not ideal)
  };
  

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-gray-800 to-black text-white mt-24">
      <EditUserSidebar />
      <div className="flex-grow ">
        <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-center text-blue-600 mt-12">
          Add and Manage Event Videos
        </h1>

        {/* Add Video Form */}
        <div className="bg-white text-black rounded-xl p-8 shadow-xl max-w-3xl mx-auto ">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="url" className="text-blue-700 text-lg font-medium">YouTube Video URL</label>
              <input
                id="url"
                type="text"
                placeholder="Enter YouTube Video URL ONLY (NO Youtube Shorts)"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
                className="w-full border p-3 rounded-lg bg-gray-100  text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="title" className="text-blue-700 text-lg font-medium">Title</label>
              <input
                id="title"
                type="text"
                placeholder="Enter Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full border p-3 rounded-lg bg-gray-100 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="alt" className="text-blue-700 text-lg font-medium">Alt Text</label>
              <input
                id="alt"
                type="text"
                placeholder="Enter Alt Text"
                value={alt}
                onChange={(e) => setAlt(e.target.value)}
                required
                className="w-full border p-3 rounded-lg bg-gray-100 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <Button
              type="submit"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
              disabled={isAdding}
            >
              {isAdding ? 'Adding...' : 'Add Video'}
            </Button>
          </form>
          {message && <p className={`mt-4 text-sm text-center ${message.includes('successfully') ? 'text-green-500' : 'text-white'}`}>{message}</p>}
          {error && <p className="mt-4 text-sm text-center text-red-500">{error}</p>}
        </div>

        {/* Display Added Videos */}
        {videos.length > 0 && (
          <div className="mt-12 bg-white text-black rounded-xl p-8 shadow-xl max-w-3xl mx-auto">
            <h2 className="text-2xl font-semibold mb-4 text-blue-700">Recently Added Videos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video) => (
                <div key={video.id} className="rounded-lg overflow-hidden shadow-md">
                  <div className="aspect-w-16 aspect-h-9">
                  <iframe
  src={convertToEmbedUrl(video.src)}
  title={video.title}
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
  allowFullScreen
  className="w-full h-56"
></iframe>

                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg">{video.title}</h3>
                    <p className="text-sm text-gray-600">{video.alt}</p>
                    <p className="text-xs text-gray-500 mt-1">Added on: {new Date(video.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
