// src/app/(dashboard)/client/reviews/add/page.tsx
'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { submitReview } from '@/lib/api';

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
  const [user, setUser] = useState<any>(null);
  
  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      setError('User not found. Please log in again.');
      setTimeout(() => router.push('/'), 2000);
      return;
    }
    
    const driverName = searchParams.get('driver');
    const rentId = searchParams.get('rent');
    
    if (!driverName || !rentId) {
      setError('Missing driver or rent information');
      setLoading(false);
      return;
    }
    
    // Fetch rent details from backend in a real application
    // For now we'll use the data we have
    setDriver({
      id: 0, // We don't need the actual ID as we'll use the name
      name: driverName
    });
    
    setRent({
      id: parseInt(rentId),
      date: new Date().toISOString().split('T')[0], // Using current date as a fallback
      brand: 'Car', // These will be populated from the API in a real implementation
      color: '' 
    });
    
    setLoading(false);
  }, [searchParams, router]);

  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }
    
    if (!user?.email) {
      setError('User information not found. Please log in again.');
      setTimeout(() => router.push('/'), 2000);
      return;
    }
    
    setSubmitting(true);
    setError('');
    
    try {
      // Submit the review using our API function
      const reviewData = {
        driver_name: driver?.name,
        rating,
        message,
        client_email: user.email,
        rent_id: rent?.id
      };
      
      const response = await submitReview(reviewData);
      
      if (response.success) {
        // Redirect to reviews page on success
        router.push('/client/reviews');
      } else {
        setError(response.error || 'Failed to submit review. Please try again.');
      }
    } catch (err) {
      console.error('Error submitting review:', err);
      setError('Failed to submit review. Please try again.');
    } finally {
      setSubmitting(false);
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

  if (error && !driver && !rent) {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
        <Link href="/client/rents" className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors">
          Return to My Rents
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-6">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Rate Your Driver</h2>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}
      
      <div className="bg-gray-50 p-5 rounded-lg mb-6 border border-gray-200">
        <h3 className="font-medium text-gray-700">Trip Details</h3>
        <p className="text-sm text-gray-600 mt-2">Driver: {driver?.name}</p>
        <p className="text-sm text-gray-600">Rent ID: {rent?.id}</p>
        {rent?.brand && rent?.color && (
          <p className="text-sm text-gray-600">Car: {rent.brand} ({rent.color})</p>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Star Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rate Your Experience
          </label>
          <div className="flex space-x-1 text-3xl">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => handleRatingChange(star)}
                className="focus:outline-none transition-transform hover:scale-110"
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
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        
        {/* Submit Buttons */}
        <div className="flex justify-between">
          <Link 
            href="/client/rents" 
            className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 font-medium transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-indigo-300 shadow-md font-medium transition-colors"
            disabled={submitting || rating === 0}
          >
            {submitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </div>
      </form>
    </div>
  );
}