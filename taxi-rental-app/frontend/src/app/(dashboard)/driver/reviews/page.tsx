// src/app/(dashboard)/driver/reviews/page.tsx
'use client';

import { useState, useEffect } from 'react';

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
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'date' | 'rating'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filter, setFilter] = useState<number | null>(null);

  useEffect(() => {
    // In a real app, fetch this data from your API
    const fetchReviews = async () => {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock data
      const mockReviews: Review[] = [
        {
          id: 1,
          client_name: 'Alice Johnson',
          client_email: 'alice.johnson@example.com',
          rating: 5,
          message: 'Excellent driver, very professional and punctual!',
          date: '2025-04-28',
          ride_id: 120,
          ride_date: '2025-04-28'
        },
        {
          id: 2,
          client_name: 'Bob Smith',
          client_email: 'bob.smith@example.com',
          rating: 4,
          message: 'Good service, pleasant conversation.',
          date: '2025-04-25',
          ride_id: 115,
          ride_date: '2025-04-25'
        },
        {
          id: 3,
          client_name: 'Emma Wilson',
          client_email: 'emma.wilson@example.com',
          rating: 5,
          message: 'One of the best drivers I\'ve had! Very safe driving and friendly service.',
          date: '2025-04-22',
          ride_id: 112,
          ride_date: '2025-04-22'
        },
        {
          id: 4,
          client_name: 'Michael Brown',
          client_email: 'michael.brown@example.com',
          rating: 3,
          message: 'Decent service but was a bit late.',
          date: '2025-04-20',
          ride_id: 108,
          ride_date: '2025-04-20'
        },
        {
          id: 5,
          client_name: 'Sophia Martinez',
          client_email: 'sophia.martinez@example.com',
          rating: 4,
          message: 'Comfortable ride, driver was helpful with my luggage.',
          date: '2025-04-18',
          ride_id: 105,
          ride_date: '2025-04-18'
        },
        {
          id: 6,
          client_name: 'James Davis',
          client_email: 'james.davis@example.com',
          rating: 5,
          message: 'Perfect ride! Driver knew all the shortcuts and got me to my destination early.',
          date: '2025-04-15',
          ride_id: 100,
          ride_date: '2025-04-15'
        },
        {
          id: 7,
          client_name: 'Olivia Taylor',
          client_email: 'olivia.taylor@example.com',
          rating: 4,
          message: 'Good driver, no complaints.',
          date: '2025-04-10',
          ride_id: 95,
          ride_date: '2025-04-10'
        }
      ];
      
      // Calculate stats
      const totalReviews = mockReviews.length;
      const totalRating = mockReviews.reduce((sum, review) => sum + review.rating, 0);
      const averageRating = totalRating / totalReviews;
      
      // Count ratings distribution
      const distribution: { [key: number]: number } = {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0
      };
      
      mockReviews.forEach(review => {
        distribution[review.rating]++;
      });
      
      setReviews(mockReviews);
      setStats({
        average_rating: averageRating,
        total_reviews: totalReviews,
        rating_distribution: distribution
      });
      
      setLoading(false);
    };
    
    fetchReviews();
  }, []);

  // Sort and filter reviews
  const displayedReviews = [...reviews]
    .filter(review => filter === null || review.rating === filter)
    .sort((a, b) => {
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

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-6 text-gray-800">My Reviews</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column - Average Rating */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-medium text-gray-700 mb-2">Average Rating</h3>
            <div className="flex items-end">
              <span className="text-4xl font-bold text-indigo-600">
                {stats?.average_rating.toFixed(1)}
              </span>
              <div className="ml-3 text-xl mb-1 text-yellow-500">
                {renderStars(Math.round(stats?.average_rating || 0))}
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Based on {stats?.total_reviews} reviews
            </p>
          </div>
          
          {/* Right Column - Rating Distribution */}
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-3">Rating Distribution</h3>
            {stats && [5, 4, 3, 2, 1].map(rating => {
              const count = stats.rating_distribution[rating] || 0;
              const percentage = Math.round((count / stats.total_reviews) * 100) || 0;
              
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
            <p className="text-gray-500">No reviews found matching your filters.</p>
            <button
              onClick={() => setFilter(null)}
              className="mt-4 text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {displayedReviews.map((review) => (
              <div key={review.id} className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-all hover:border-indigo-300">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-800">{review.client_name}</h3>
                    <p className="text-xs text-gray-500">Reviewed on {review.date}</p>
                  </div>
                  <div className="flex text-lg">
                    {renderStars(review.rating)}
                  </div>
                </div>
                <p className="mt-3 text-gray-700">{review.message}</p>
                <div className="mt-3 text-xs text-gray-500">
                  For ride #{review.ride_id} on {review.ride_date}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}