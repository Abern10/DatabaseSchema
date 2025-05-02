// src/app/(dashboard)/driver/reviews/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getDriverReviews } from '@/lib/api';

type Review = {
  id: number;
  client_name: string;
  client_email: string;
  rating: number;
  message: string;
  date: string;
  ride_id: number;
  ride_date: string;
};

type Stats = {
  average_rating: number;
  total_reviews: number;
  rating_distribution: {
    [key: number]: number;
  };
};

export default function DriverReviews() {
  const router = useRouter();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'date' | 'rating'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filter, setFilter] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        
        if (parsedUser.userType !== 'driver') {
          setError('Access denied. Only drivers can view this page.');
          setTimeout(() => router.push('/'), 2000);
          return;
        }
        
        setUser(parsedUser);
        
        // Fetch driver reviews
        getDriverReviews(parsedUser.name)
          .then(response => {
            if (response.success && response.data) {
              setReviews(response.data);
              calculateStats(response.data);
            } else {
              throw new Error(response.error || 'Failed to fetch reviews');
            }
          })
          .catch(err => {
            console.error('Error fetching driver reviews:', err);
            setError(err.message || 'Failed to load reviews. Please try again later.');
            setReviews([]);
          })
          .finally(() => {
            setLoading(false);
          });
      } catch (err) {
        console.error('Error parsing user data:', err);
        setError('Invalid user data. Please log in again.');
        setTimeout(() => router.push('/'), 2000);
      }
    } else {
      setError('User not found. Please log in again.');
      setLoading(false);
      setTimeout(() => router.push('/'), 2000);
    }
  }, [router]);

  const fetchDriverReviews = async (driverName: string) => {
    try {
      const response = await getDriverReviews(driverName);

      if (response.success && response.data) {
        const reviewData = response.data;
        setReviews(reviewData);

        // Calculate stats from the review data
        calculateStats(reviewData);
      } else {
        throw new Error(response.error || 'Failed to fetch reviews');
      }
    } catch (err: any) {
      console.error('Error fetching driver reviews:', err);
      setError(err.message || 'Failed to load reviews. Please try again later.');
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (reviewData: Review[]) => {
    if (!reviewData.length) {
      setStats({
        average_rating: 0,
        total_reviews: 0,
        rating_distribution: {
          1: 0,
          2: 0,
          3: 0,
          4: 0,
          5: 0
        }
      });
      return;
    }

    const totalReviews = reviewData.length;
    const totalRating = reviewData.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / totalReviews;

    // Count ratings distribution
    const distribution: { [key: number]: number } = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0
    };

    reviewData.forEach(review => {
      distribution[review.rating]++;
    });

    setStats({
      average_rating: averageRating,
      total_reviews: totalReviews,
      rating_distribution: distribution
    });
  };

  // Sort and filter reviews
  const getDisplayedReviews = () => {
    if (!reviews.length) return [];

    let filtered = [...reviews];

    // Apply rating filter
    if (filter !== null) {
      filtered = filtered.filter(review => review.rating === filter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      if (sortBy === 'date') {
        return sortOrder === 'asc'
          ? new Date(a.date).getTime() - new Date(b.date).getTime()
          : new Date(b.date).getTime() - new Date(a.date).getTime();
      } else {
        return sortOrder === 'asc'
          ? a.rating - b.rating
          : b.rating - a.rating;
      }
    });

    return filtered;
  };

  const displayedReviews = getDisplayedReviews();

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={i <= rating ? 'text-yellow-500' : 'text-gray-300'}>
          ★
        </span>
      );
    }
    return stars;
  };

  const toggleSort = (field: 'date' | 'rating') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const handleRefresh = () => {
    if (user?.name) {
      setLoading(true);
      fetchDriverReviews(user.name);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="p-6 bg-white rounded-xl shadow-md">
          <div className="w-12 h-12 mx-auto mb-4 border-t-4 border-indigo-500 border-solid rounded-full animate-spin"></div>
          <p className="text-center text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error && !stats) {
    return (
      <div className="text-center text-red-500 p-6 bg-white rounded-xl shadow-md">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg mb-4">
          {error}
          <button
            onClick={handleRefresh}
            className="ml-2 text-red-700 underline hover:text-red-900"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Stats Overview */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold mb-0 text-gray-800">My Reviews</h2>
          <button
            onClick={handleRefresh}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
            aria-label="Refresh"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column - Average Rating */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-medium text-gray-700 mb-2">Average Rating</h3>
            <div className="flex items-end">
              <span className="text-4xl font-bold text-indigo-600">
                {stats?.average_rating.toFixed(1) || '0.0'}
              </span>
              <div className="ml-3 text-xl mb-1 text-yellow-500">
                {renderStars(Math.round(stats?.average_rating || 0))}
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Based on {stats?.total_reviews || 0} reviews
            </p>
          </div>

          {/* Right Column - Rating Distribution */}
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-3">Rating Distribution</h3>
            {stats && [5, 4, 3, 2, 1].map(rating => {
              const count = stats.rating_distribution[rating] || 0;
              const percentage = stats.total_reviews ? Math.round((count / stats.total_reviews) * 100) : 0;

              return (
                <div key={rating} className="flex items-center mb-2">
                  <div className="flex items-center w-16">
                    <span className="text-yellow-500 mr-1">
                      {rating}
                    </span>
                    <span className="text-yellow-500">★</span>
                  </div>
                  <div className="flex-1 h-4 mx-2 bg-gray-200 rounded">
                    <div
                      className="h-4 bg-indigo-600 rounded"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <div className="w-16 text-sm text-gray-600">
                    {count} ({percentage}%)
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center">
            <span className="text-sm font-medium text-gray-700 mr-3">Filter by:</span>
            <div className="flex border border-gray-300 rounded-md overflow-hidden">
              <button
                className={`px-3 py-1 text-sm font-medium transition-colors ${filter === null ? 'bg-indigo-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                onClick={() => setFilter(null)}
              >
                All
              </button>
              {[5, 4, 3, 2, 1].map(rating => (
                <button
                  key={rating}
                  className={`px-3 py-1 text-sm font-medium transition-colors ${filter === rating ? 'bg-indigo-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                  onClick={() => setFilter(rating)}
                >
                  {rating} ★
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center">
            <span className="text-sm font-medium text-gray-700 mr-3">Sort by:</span>
            <div className="flex border border-gray-300 rounded-md overflow-hidden">
              <button
                className={`px-3 py-1 text-sm font-medium transition-colors flex items-center ${sortBy === 'date' ? 'bg-indigo-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                onClick={() => toggleSort('date')}
              >
                Date
                {sortBy === 'date' && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={sortOrder === 'desc' ? "M19 9l-7 7-7-7" : "M5 15l7-7 7 7"} />
                  </svg>
                )}
              </button>
              <button
                className={`px-3 py-1 text-sm font-medium transition-colors flex items-center ${sortBy === 'rating' ? 'bg-indigo-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                onClick={() => toggleSort('rating')}
              >
                Rating
                {sortBy === 'rating' && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={sortOrder === 'desc' ? "M19 9l-7 7-7-7" : "M5 15l7-7 7 7"} />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        {displayedReviews.length === 0 ? (
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <p className="text-gray-500">
              {filter !== null
                ? 'No reviews found matching your filter.'
                : 'No reviews found. Clients will rate your service after completed rides.'}
            </p>
            {filter !== null && (
              <button
                onClick={() => setFilter(null)}
                className="mt-4 text-indigo-600 hover:text-indigo-800 font-medium"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {displayedReviews.map((review) => (
              <div key={review.id} className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-all hover:border-indigo-300">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-800">{review.client_name}</h3>
                    <p className="text-xs text-gray-500">Reviewed on {new Date(review.date).toLocaleDateString()}</p>
                  </div>
                  <div className="flex text-lg">
                    {renderStars(review.rating)}
                  </div>
                </div>
                <p className="mt-3 text-gray-700">{review.message}</p>
                <div className="mt-3 text-xs text-gray-500">
                  For ride #{review.ride_id} on {new Date(review.ride_date).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}