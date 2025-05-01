// src/app/(dashboard)/client/reviews/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getClientReviews } from '@/lib/api';

type Review = {
  review_id: number;
  driver_id: number;
  driver_name: string;
  rating: number;
  message: string;
  rent_id: number;
  rent_date: string;
  created_at: string;
};

export default function ClientReviews() {
  const router = useRouter();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Get user info from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      
      // Load user's reviews
      loadReviews(parsedUser.email);
    } else {
      setError('User not found. Please log in again.');
      setLoading(false);
      // Redirect to login after a short delay
      setTimeout(() => router.push('/'), 2000);
    }
  }, [router]);

  const loadReviews = async (email: string) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await getClientReviews(email);
      
      if (response.success) {
        setReviews(response.data || []);
      } else {
        setError('Failed to load reviews: ' + (response.error || ''));
        setReviews([]);
      }
    } catch (err) {
      console.error('Error loading reviews:', err);
      setError('An unexpected error occurred while loading your reviews.');
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

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

  const handleRefresh = () => {
    if (user?.email) {
      loadReviews(user.email);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="p-6 bg-white rounded-xl shadow-md">
          <div className="w-12 h-12 mx-auto mb-4 border-t-4 border-indigo-500 border-solid rounded-full animate-spin"></div>
          <p className="text-center text-gray-600">Loading your reviews...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md">
      <div className="p-6 border-b flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">My Reviews</h2>
        <div className="flex space-x-2">
          <button 
            onClick={handleRefresh}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
            aria-label="Refresh"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
          <Link href="/client/rents" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium transition-colors">
            View My Rents
          </Link>
        </div>
      </div>
      
      {error && (
        <div className="p-4 m-6 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {error}
          <button 
            onClick={handleRefresh} 
            className="ml-2 text-red-700 underline hover:text-red-900"
          >
            Try Again
          </button>
        </div>
      )}
      
      <div className="p-6">
        {reviews.length === 0 ? (
          <div className="text-center py-8">
            <div className="mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">You haven't provided any reviews yet</h3>
            <p className="text-gray-500 mb-6">After completing a ride, you can rate your driver's performance.</p>
            <Link href="/client/rents" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-md">
              Go to My Rents
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.review_id} className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-all hover:border-indigo-300">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-800">{review.driver_name}</h3>
                    <p className="text-sm text-gray-500 mt-1">Trip on {review.rent_date}</p>
                  </div>
                  <div className="flex text-lg">
                    {renderStars(review.rating)}
                  </div>
                </div>
                <p className="mt-3 text-gray-700">{review.message}</p>
                <div className="mt-3 text-right">
                  <span className="text-xs text-gray-500">Reviewed on {new Date(review.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}