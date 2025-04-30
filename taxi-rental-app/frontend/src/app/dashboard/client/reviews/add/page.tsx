// src/app/(dashboard)/client/reviews/add/page.tsx
'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

type Driver = {
  id: number;
  name: string;
};

type Rent = {
  id: number;
  date: string;
  brand: string;
  color: string;
};

export default function AddReview() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [driver, setDriver] = useState<Driver | null>(null);
  const [rent, setRent] = useState<Rent | null>(null);
  const [rating, setRating] = useState<number>(0);
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const driverId = searchParams.get('driver');
    const rentId = searchParams.get('rent');
    
    if (!driverId || !rentId) {
      setError('Missing driver or rent information');
      setLoading(false);
      return;
    }
    
    // In a real app, fetch this data from your API
    const fetchData = async () => {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock data
      setDriver({
        id: parseInt(driverId),
        name: 'John Smith' // This would come from your API
      });
      
      setRent({
        id: parseInt(rentId),
        date: '2025-04-15',
        brand: 'Toyota',
        color: 'Silver'
      });
      
      setLoading(false);
    };
    
    fetchData();
  }, [searchParams]);

  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }
    
    setSubmitting(true);
    setError('');
    
    try {
      // Here you would make an API call to submit the review
      // For example:
      // const response = await fetch('/api/reviews', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     driver_id: driver?.id,
      //     rent_id: rent?.id,
      //     rating,
      //     message
      //   })
      // });
      
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirect to the reviews page after successful submission
      router.push('/client/reviews');
    } catch (err) {
      setError('Failed to submit review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-full">Loading...</div>;
  }

  if (error && !driver && !rent) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
        <Link href="/client/rents" className="text-blue-600 hover:underline">
          Return to My Rents
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-2xl font-semibold mb-6">Rate Your Driver</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h3 className="font-semibold">Trip Details</h3>
        <p className="text-sm text-gray-600 mt-1">Driver: {driver?.name}</p>
        <p className="text-sm text-gray-600">Date: {rent?.date}</p>
        <p className="text-sm text-gray-600">Car: {rent?.brand} ({rent?.color})</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Star Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rate Your Experience
          </label>
          <div className="flex space-x-1 text-2xl">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => handleRatingChange(star)}
                className="focus:outline-none"
              >
                <span className={star <= rating ? 'text-yellow-500' : 'text-gray-300'}>
                  ★
                </span>
              </button>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {rating === 1 ? 'Poor' : 
             rating === 2 ? 'Fair' : 
             rating === 3 ? 'Good' : 
             rating === 4 ? 'Very Good' : 
             rating === 5 ? 'Excellent' : 'Select a rating'}
          </p>
        </div>
        
        {/* Review Message */}
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
            Your Review
          </label>
          <textarea
            id="message"
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Share details of your experience with this driver..."
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        {/* Submit Buttons */}
        <div className="flex justify-between">
          <Link 
            href="/client/rents" 
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-300"
            disabled={submitting || rating === 0}
          >
            {submitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </div>
      </form>
    </div>
  );
}