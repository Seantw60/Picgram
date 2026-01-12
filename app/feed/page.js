'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function FeedPage() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchFeed = async (pageNum = 1) => {
    setLoading(true);
    setError('');

    try {
      console.log('📥 Fetching feed page:', pageNum);
      
      const response = await fetch(`/api/feed?page=${pageNum}&limit=10`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch feed');
      }

      console.log('✅ Feed fetched:', data.images.length, 'images');
      
      setImages(data.images);
      setTotal(data.total);
      setTotalPages(data.totalPages);
      setPage(data.page);
    } catch (err) {
      console.error('❌ Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch feed on component mount
  useEffect(() => {
    fetchFeed(1);
  }, []);

  const handleHeart = async (id, currentHearts) => {
    const newHearts = currentHearts + 1;

    console.log('💝 Updating hearts for image', id, 'to', newHearts);

    // Optimistic update - show change immediately
    setImages((prevImages) =>
      prevImages.map((img) =>
        img.id === id ? { ...img, hearts: newHearts } : img
      )
    );

    try {
      const response = await fetch('/api/feed', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, hearts: newHearts }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update hearts');
      }

      console.log('✅ Hearts updated successfully');

      // Update with server response (in case of any differences)
      setImages((prevImages) =>
        prevImages.map((img) => (img.id === id ? data : img))
      );
    } catch (err) {
      console.error('❌ Error updating hearts:', err);
      
      // Revert optimistic update on error
      setImages((prevImages) =>
        prevImages.map((img) =>
          img.id === id ? { ...img, hearts: currentHearts } : img
        )
      );
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      fetchFeed(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800">📸 Feed</h1>
            <p className="text-gray-600 mt-2">
              {total} AI-generated {total === 1 ? 'image' : 'images'}
            </p>
          </div>
          <Link
            href="/"
            className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition"
          >
            ✨ Generate New
          </Link>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">❌ {error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <svg
              className="animate-spin h-12 w-12 text-purple-500"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
        ) : images.length === 0 ? (
          /* Empty State */
          <div className="text-center py-20">
            <p className="text-gray-500 text-xl mb-4">
              No images yet. Be the first to generate one! 🎨
            </p>
            <Link
              href="/"
              className="inline-block px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition"
            >
              Generate Image
            </Link>
          </div>
        ) : (
          <>
            {/* Image Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {images.map((image) => (
                <div
                  key={image.id}
                  className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition"
                >
                  <img
                    src={image.imageUrl}
                    alt={image.prompt}
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-4">
                    <p className="text-gray-700 mb-3 line-clamp-2">
                      {image.prompt}
                    </p>
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => handleHeart(image.id, image.hearts)}
                        className="flex items-center space-x-2 px-4 py-2 bg-red-50 hover:bg-red-100 rounded-lg transition group"
                      >
                        <span className="text-2xl group-hover:scale-110 transition-transform">
                          ❤️
                        </span>
                        <span className="font-semibold text-gray-700">
                          {image.hearts}
                        </span>
                      </button>
                      <span className="text-sm text-gray-500">
                        {formatDate(image.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-4">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  className="px-4 py-2 bg-white rounded-lg shadow hover:shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ← Previous
                </button>
                <span className="text-gray-700">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages}
                  className="px-4 py-2 bg-white rounded-lg shadow hover:shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}