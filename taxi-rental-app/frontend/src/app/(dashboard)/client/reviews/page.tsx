// src/app/(dashboard)/client/reviews/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

type Review = {
  id: number;
  driver_id: number;
  driver_name: string;
  rent_id: number;
  rent_date: string;
  rating: number;
  message: string;
  created_at: string;
};

export default function ClientReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, fetch this data from your API
    const fetchReviews = async () => {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock data
      const mockReviews: Review[] = [
        {
          id: 1,
          driver_id: 1,
          driver_name: 'John Smith',
          rent_id: 1,
          rent_date: '2025-04-15',
          rating: 4,
          message: 'Very professional driver, arrived on time and was helpful with my luggage.',
          created_at: '2025-04-16'
        },
        {
          id: 2,
          driver_id: 3,
          driver_name: 'Michael Brown',
          rent_id: 3,
          rent_date: '2025-04-10',
          rating: 5,
          message: 'Excellent service! The driver was friendly and knew the best routes to avoid traffic.',
          created_at: '2025-04-11'
        },
        {
          id: 3,
          driver_id: 5,
          driver_name: 'Emma Wilson',
          rent_id: 5,
          rent_date: '2025-03-28',
          rating: 3,
          message: 'The ride was okay, but the driver was a bit late.',
          created_at: '2025-03-29'
        }
      ];
      
      setReviews(mockReviews);
      setLoading(false);
    };
    
    fetchReviews();
  }, []);

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

  if (loading) {
    return <div className="flex justify-center items-center h-full">Loading...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6 border-b flex justify-between items-center">
        <h2 className="text-xl font-semibold">My Reviews</h2>
        <Link href="/client/rents" className="text-blue-600 hover:underline text-sm">
          View My Rents
        </Link>
      </div>
      
      <div className="p-6">
        {reviews.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">You haven't provided any reviews yet.</p>
            <Link href="/client/rents" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Go to My Rents
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="border rounded-lg p-4 hover:shadow-sm transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{review.driver_name}</h3>
                    <p className="text-sm text-gray-500">Trip on {review.rent_date}</p>
                  </div>
                  <div className="flex">
                    {renderStars(review.rating)}
                  </div>
                </div>
                <p className="mt-2">{review.message}</p>
                <div className="mt-3 text-right">
                  <span className="text-xs text-gray-500">Reviewed on {review.created_at}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}