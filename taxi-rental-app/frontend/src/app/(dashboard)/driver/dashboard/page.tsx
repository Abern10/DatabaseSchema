// src/app/(dashboard)/driver/dashboard/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getDriverModels, getDriverReviews } from '@/lib/api';

export default function DriverDashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modelError, setModelError] = useState<string | null>(null);
  const [reviewError, setReviewError] = useState<string | null>(null);

  type ScheduledRide = {
    id: number;
    date: string;
    time: string;
    client_name: string;
    pickup_address: string;
    car_info: string;
    status: 'Upcoming' | 'In Progress' | 'Completed' | 'Cancelled';
  };
  
  type CarModel = {
    brand: string;
    modelid: number;
    carid: number;
    color: string;
    construction_year: number;
    transmission_type: string;
  };

  type Review = {
    id: number;
    client_name: string;
    rating: number;
    message: string;
    date: string;
  }
  
  const [todaysRides, setTodaysRides] = useState<ScheduledRide[]>([]);
  const [myModels, setMyModels] = useState<CarModel[]>([]);
  const [recentReviews, setRecentReviews] = useState<Review[]>([]);

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      
      // Load user's data
      loadDriverData(parsedUser.name);
    } else {
      setLoading(false);
      setError("User not found. Please log in again.");
    }
  }, []);

  const loadDriverData = async (driverName: string) => {
    try {
      setLoading(true);
      
      // Fetch driver's models
      try {
        const modelsResponse = await getDriverModels(driverName);
        if (modelsResponse.success && modelsResponse.data && Array.isArray(modelsResponse.data)) {
          setMyModels(modelsResponse.data);
        } else {
          setModelError('No models available for this driver.');
          setMyModels([]);
        }
      } catch (err) {
        console.error('Error loading driver models:', err);
        setModelError('Could not load driver models. Please try again later.');
        setMyModels([]);
      }
      
      // Fetch driver's reviews
      try {
        const reviewsResponse = await getDriverReviews(driverName);
        if (reviewsResponse.success && reviewsResponse.data && Array.isArray(reviewsResponse.data)) {
          // Sort by date, most recent first, and take only most recent 2
          const sortedReviews = [...reviewsResponse.data].sort((a, b) => 
            new Date(b.date).getTime() - new Date(a.date).getTime()
          ).slice(0, 2);
          
          setRecentReviews(sortedReviews);
        } else {
          setReviewError('No reviews available for this driver.');
          setRecentReviews([]);
        }
      } catch (err) {
        console.error('Error loading driver reviews:', err);
        setReviewError('Could not load driver reviews. Please try again later.');
        setRecentReviews([]);
      }
      
      // For scheduled rides, we would need an API endpoint to fetch the driver's schedule
      // This would be implemented in the backend and then called here
      // For now, we'll keep the array empty as we don't have that endpoint yet
      setTodaysRides([]);
      
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError('Failed to load dashboard data. Please try again later.');
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

  const handleRetryModels = () => {
    if (user?.name) {
      setModelError(null);
      loadDriverData(user.name);
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

  if (error) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
        <div className="mt-4 text-center">
          <Link href="/" className="text-indigo-600 hover:text-indigo-800 font-medium">
            Return to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Welcome Card */}
      <div className="bg-white p-6 rounded-xl shadow-md col-span-full">
        <h2 className="text-xl font-semibold mb-2 text-gray-800">Welcome back, {user?.name || 'Driver'}</h2>
        <p className="text-gray-600">Here's your driving schedule and performance overview</p>
      </div>

      {/* Stats Cards */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="flex items-center">
          <div className="bg-indigo-100 p-3 rounded-full mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Total Rides</h3>
            <p className="text-2xl font-bold text-gray-800">{recentReviews.length || 0}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="flex items-center">
          <div className="bg-green-100 p-3 rounded-full mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Today's Earnings</h3>
            <p className="text-2xl font-bold text-gray-800">$0.00</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="flex items-center">
          <div className="bg-indigo-100 p-3 rounded-full mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Average Rating</h3>
            <div className="flex items-center">
              <p className="text-2xl font-bold text-gray-800 mr-2">
                {recentReviews.length > 0 
                  ? (recentReviews.reduce((sum, rev) => sum + rev.rating, 0) / recentReviews.length).toFixed(1) 
                  : '0.0'}
              </p>
              <div className="flex text-sm">
                {renderStars(recentReviews.length > 0 
                  ? Math.round(recentReviews.reduce((sum, rev) => sum + rev.rating, 0) / recentReviews.length) 
                  : 0)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Today's Rides */}
      <div className="bg-white p-6 rounded-xl shadow-md col-span-full lg:col-span-2">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Today's Schedule</h3>
          <Link href="/driver/schedule" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium transition-colors">
            View Full Schedule
          </Link>
        </div>
        
        {todaysRides.length === 0 ? (
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <p className="text-gray-500">No rides scheduled for today.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {todaysRides.map((ride) => (
              <div key={ride.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all hover:border-indigo-300">
                <div className="flex justify-between">
                  <div>
                    <p className="font-semibold text-gray-800">{ride.time}</p>
                    <p className="text-sm text-gray-500 mt-1">{ride.client_name}</p>
                  </div>
                  <div>
                    <span 
                      className={`px-2 py-1 text-xs font-semibold rounded-full 
                      ${ride.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                        ride.status === 'Upcoming' ? 'bg-indigo-100 text-indigo-800' : 
                        ride.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'}`}
                    >
                      {ride.status}
                    </span>
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-sm text-gray-700"><span className="font-medium">Pickup:</span> {ride.pickup_address}</p>
                  <p className="text-sm text-gray-700"><span className="font-medium">Car:</span> {ride.car_info}</p>
                </div>
                <div className="mt-3 text-right">
                  <Link 
                    href={`/driver/schedule/${ride.id}`}
                    className="text-indigo-600 hover:text-indigo-800 text-sm font-medium transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Reviews */}
      <div className="bg-white p-6 rounded-xl shadow-md lg:col-span-1">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Recent Reviews</h3>
          <Link href="/driver/reviews" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium transition-colors">
            View All
          </Link>
        </div>
        
        {reviewError ? (
          <div className="bg-gray-50 rounded-lg p-6 text-center">
            <p className="text-gray-500 mb-2">{reviewError}</p>
            <button 
              onClick={handleRetryModels}
              className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
            >
              Retry
            </button>
          </div>
        ) : recentReviews.length === 0 ? (
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <p className="text-gray-500">No reviews yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentReviews.map((review) => (
              <div key={review.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all hover:border-indigo-300">
                <div className="flex justify-between items-start">
                  <p className="font-medium text-gray-800">{review.client_name}</p>
                  <div className="flex text-sm">
                    {renderStars(review.rating)}
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-2 italic">"{review.message}"</p>
                <p className="text-xs text-gray-500 mt-2">{review.date}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* My Cars */}
      <div className="bg-white p-6 rounded-xl shadow-md col-span-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">My Car Models</h3>
          <Link href="/driver/models" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium transition-colors">
            View All Models
          </Link>
        </div>
        
        {modelError ? (
          <div className="bg-gray-50 rounded-lg p-6 text-center">
            <p className="text-gray-500 mb-2">{modelError}</p>
            <button 
              onClick={handleRetryModels}
              className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
            >
              Retry
            </button>
          </div>
        ) : myModels.length === 0 ? (
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <p className="text-gray-500">You haven't been assigned any car models yet.</p>
            <Link href="/driver/models" className="mt-4 inline-block text-indigo-600 hover:text-indigo-800 font-medium">
              Request Car Models
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {myModels.map((car, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all hover:border-indigo-300">
                <h4 className="font-semibold text-gray-800">{car.brand}</h4>
                <div className="text-sm text-gray-600 mt-1">
                  <p>Color: {car.color}</p>
                  <p>Year: {car.construction_year}</p>
                  <p>Transmission: {car.transmission_type}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}