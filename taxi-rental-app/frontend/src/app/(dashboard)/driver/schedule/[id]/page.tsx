// src/app/(dashboard)/driver/schedule/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

type RideDetail = {
  id: number;
  date: string;
  time: string;
  client_name: string;
  client_phone: string;
  pickup_address: string;
  dropoff_address: string;
  car_info: string;
  status: 'Upcoming' | 'In Progress' | 'Completed' | 'Cancelled';
  payment: {
    amount: number;
    method: string;
    status: 'Pending' | 'Completed' | 'Refunded';
  };
  notes: string;
  distance: string;
  duration: string;
  route_info?: {
    start_lat: number;
    start_lng: number;
    end_lat: number;
    end_lng: number;
  };
};

export default function ScheduleDetail() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;
  
  const [ride, setRide] = useState<RideDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    const fetchRideDetails = async () => {
      try {
        // In a real app, fetch this data from your API
        // Mock API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Mock data
        const mockRide: RideDetail = {
          id: parseInt(id as string),
          date: '2025-04-30',
          time: '09:30 AM',
          client_name: 'Alice Johnson',
          client_phone: '+1 (555) 123-4567',
          pickup_address: '123 Main St, New York, NY 10001',
          dropoff_address: '789 Broadway, New York, NY 10003',
          car_info: 'Toyota Camry (Silver) - ABC 1234',
          status: 'Upcoming',
          payment: {
            amount: 35.50,
            method: 'Credit Card',
            status: 'Pending'
          },
          notes: 'Client requested help with luggage. Airport pickup.',
          distance: '3.2 miles',
          duration: '15 minutes',
          route_info: {
            start_lat: 40.7128,
            start_lng: -74.0060,
            end_lat: 40.7308,
            end_lng: -73.9973
          }
        };
        
        setRide(mockRide);
      } catch (err) {
        setError('Failed to load ride details');
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchRideDetails();
    }
  }, [id]);

  const handleStartRide = async () => {
    try {
      // In a real app, make an API call to start the ride
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (ride) {
        setRide({
          ...ride,
          status: 'In Progress'
        });
      }
      
      // Show success message or redirect
    } catch (err) {
      setError('Failed to start ride. Please try again.');
    }
  };

  const handleCompleteRide = async () => {
    try {
      // In a real app, make an API call to complete the ride
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (ride) {
        setRide({
          ...ride,
          status: 'Completed',
          payment: {
            ...ride.payment,
            status: 'Completed'
          }
        });
      }
      
      // Show success message or redirect
    } catch (err) {
      setError('Failed to complete ride. Please try again.');
    }
  };

  const handleCancelRide = async () => {
    setCancelling(true);
    
    try {
      // In a real app, make an API call to cancel the ride
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (ride) {
        setRide({
          ...ride,
          status: 'Cancelled'
        });
      }
      
      setShowCancelConfirm(false);
      // Show success message or redirect
    } catch (err) {
      setError('Failed to cancel ride. Please try again.');
    } finally {
      setCancelling(false);
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

  if (error || !ride) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="text-center py-8">
          <p className="text-red-500 mb-4">{error || 'Ride not found'}</p>
          <Link 
            href="/driver/schedule"
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Back to Schedule
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-md">
        <div className="p-6 border-b flex justify-between items-center">
          <div>
            <div className="flex items-center">
              <span 
                className={`px-2 py-1 text-xs font-semibold rounded-full mr-2
                ${ride.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                  ride.status === 'Upcoming' ? 'bg-indigo-100 text-indigo-800' : 
                  ride.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' : 
                  'bg-red-100 text-red-800'}`}
              >
                {ride.status}
              </span>
              <h2 className="text-xl font-semibold text-gray-800">
                Ride #{ride.id}
              </h2>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {ride.date} - {ride.time}
            </p>
          </div>
          
          <Link 
            href="/driver/schedule"
            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium transition-colors"
          >
            Back to Schedule
          </Link>
        </div>
        
        {showCancelConfirm && (
          <div className="p-4 border-b bg-red-50">
            <p className="text-red-700 mb-2">Are you sure you want to cancel this ride?</p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowCancelConfirm(false)}
                className="px-3 py-1 text-sm font-medium bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                No, keep ride
              </button>
              <button
                onClick={handleCancelRide}
                disabled={cancelling}
                className="px-3 py-1 text-sm font-medium bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:bg-red-300"
              >
                {cancelling ? 'Cancelling...' : 'Yes, cancel ride'}
              </button>
            </div>
          </div>
        )}
        
        {/* Ride Actions */}
        <div className="p-4 flex justify-end space-x-2">
          {ride.status === 'Upcoming' && (
            <>
              <button
                onClick={() => setShowCancelConfirm(true)}
                className="px-3 py-1 text-sm font-medium bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel Ride
              </button>
              <button
                onClick={handleStartRide}
                className="px-3 py-1 text-sm font-medium bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              >
                Start Ride
              </button>
            </>
          )}
          
          {ride.status === 'In Progress' && (
            <button
              onClick={handleCompleteRide}
              className="px-3 py-1 text-sm font-medium bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Complete Ride
            </button>
          )}
        </div>
      </div>
      
      {/* Client Information */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Client Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">Name</h4>
            <p className="text-gray-800">{ride.client_name}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">Phone</h4>
            <p className="text-gray-800">{ride.client_phone}</p>
          </div>
        </div>
      </div>
      
      {/* Ride Details */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Ride Details</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">Pickup Location</h4>
            <p className="text-gray-800">{ride.pickup_address}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">Dropoff Location</h4>
            <p className="text-gray-800">{ride.dropoff_address}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">Distance</h4>
            <p className="text-gray-800">{ride.distance}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">Est. Duration</h4>
            <p className="text-gray-800">{ride.duration}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">Car</h4>
            <p className="text-gray-800">{ride.car_info}</p>
          </div>
        </div>
        
        {ride.notes && (
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-500 mb-1">Special Notes</h4>
            <p className="text-gray-800 bg-yellow-50 p-3 rounded-md border border-yellow-200">{ride.notes}</p>
          </div>
        )}
        
        {/* Map Placeholder - In a real app, you would integrate with a maps API */}
        <div className="rounded-lg overflow-hidden border border-gray-200 h-64 bg-gray-100 flex items-center justify-center">
          <div className="text-gray-500 text-center p-4">
            <p>Map View</p>
            <p className="text-xs">(Map integration would be implemented here)</p>
          </div>
        </div>
      </div>
      
      {/* Payment Information */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Payment Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">Amount</h4>
            <p className="text-xl font-semibold text-gray-800">${ride.payment.amount.toFixed(2)}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">Method</h4>
            <p className="text-gray-800">{ride.payment.method}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">Status</h4>
            <span 
              className={`px-2 py-1 text-xs font-semibold rounded-full
              ${ride.payment.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                ride.payment.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                'bg-red-100 text-red-800'}`}
            >
              {ride.payment.status}
            </span>
          </div>
        </div>
      </div>
      
      {/* Driver Instructions */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Driver Instructions</h3>
        
        {ride.status === 'Upcoming' && (
          <div className="space-y-4">
            <div className="bg-indigo-50 border border-indigo-200 rounded-md p-4">
              <h4 className="font-medium text-indigo-800 mb-2">Before the ride</h4>
              <ul className="list-disc pl-5 text-gray-700 space-y-2">
                <li>Ensure your vehicle is clean and presentable</li>
                <li>Check that you have enough fuel</li>
                <li>Arrive at the pickup location 5 minutes early</li>
                <li>Contact the client if you encounter any delays</li>
              </ul>
            </div>
            
            <div className="bg-indigo-50 border border-indigo-200 rounded-md p-4">
              <h4 className="font-medium text-indigo-800 mb-2">Starting the ride</h4>
              <ul className="list-disc pl-5 text-gray-700 space-y-2">
                <li>Greet the client professionally</li>
                <li>Confirm the dropoff location</li>
                <li>Press the "Start Ride" button when the client is in the vehicle</li>
                <li>Follow the suggested route or discuss alternatives with the client</li>
              </ul>
            </div>
          </div>
        )}
        
        {ride.status === 'In Progress' && (
          <div className="space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
              <h4 className="font-medium text-yellow-800 mb-2">During the ride</h4>
              <ul className="list-disc pl-5 text-gray-700 space-y-2">
                <li>Drive safely and follow all traffic rules</li>
                <li>Maintain a professional demeanor</li>
                <li>Avoid unnecessary conversation if the client seems busy</li>
                <li>If the route changes, explain the reason to the client</li>
              </ul>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
              <h4 className="font-medium text-yellow-800 mb-2">Completing the ride</h4>
              <ul className="list-disc pl-5 text-gray-700 space-y-2">
                <li>Thank the client for riding with you</li>
                <li>Ensure the client has all their belongings</li>
                <li>Press the "Complete Ride" button once the client has exited the vehicle</li>
                <li>Rate your experience with the client</li>
              </ul>
            </div>
          </div>
        )}
        
        {ride.status === 'Completed' && (
          <div className="bg-green-50 border border-green-200 rounded-md p-4">
            <h4 className="font-medium text-green-800 mb-2">Ride completed</h4>
            <p className="text-gray-700">
              This ride has been successfully completed. Thank you for your service!
            </p>
          </div>
        )}
        
        {ride.status === 'Cancelled' && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <h4 className="font-medium text-red-800 mb-2">Ride cancelled</h4>
            <p className="text-gray-700">
              This ride has been cancelled. Please check your schedule for other upcoming rides.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}