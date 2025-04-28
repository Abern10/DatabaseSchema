'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Calendar, Car, Loader, Plus, Star, User } from 'lucide-react';

interface Rent {
  rentid: number;
  date: string;
  driver_name: string;
  brand: string;
  carid: number;
  modelid: number;
  color: string;
  construction_year: number;
  transmission_type: string;
}

export default function RentsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [rents, setRents] = useState<Rent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedRent, setSelectedRent] = useState<Rent | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewMessage, setReviewMessage] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  useEffect(() => {
    // In a real app, you would fetch this from an API
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      
      // Simulating fetching client's rents
      setTimeout(() => {
        const mockRents = [
          {
            rentid: 1,
            date: '2025-05-15',
            driver_name: 'John Smith',
            brand: 'Toyota',
            carid: 1,
            modelid: 1,
            color: 'Red',
            construction_year: 2022,
            transmission_type: 'automatic'
          },
          {
            rentid: 2,
            date: '2025-05-20',
            driver_name: 'Jane Doe',
            brand: 'Honda',
            carid: 2,
            modelid: 1,
            color: 'Blue',
            construction_year: 2021,
            transmission_type: 'manual'
          },
          {
            rentid: 3,
            date: '2025-04-25',
            driver_name: 'Bob Johnson',
            brand: 'Tesla',
            carid: 3,
            modelid: 1,
            color: 'White',
            construction_year: 2023,
            transmission_type: 'automatic'
          }
        ];
        
        setRents(mockRents);
        setLoading(false);
      }, 1000);
    } else {
      router.push('/login');
    }
  }, [router]);
  
  const openReviewModal = (rent: Rent) => {
    setSelectedRent(rent);
    setReviewRating(0);
    setReviewMessage('');
    setIsReviewModalOpen(true);
  };
  
  const closeReviewModal = () => {
    setIsReviewModalOpen(false);
    setSelectedRent(null);
  };
  
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedRent || reviewRating === 0) {
      return;
    }
    
    setIsSubmittingReview(true);
    
    try {
      // In a real app, you would make an API call to your backend
      // const response = await fetch('/api/clients/reviews', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     driver_name: selectedRent.driver_name,
      //     rating: reviewRating,
      //     message: reviewMessage,
      //     client_email: user.email
      //   }),
      // });
      
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      closeReviewModal();
      
      // Show success message or update UI accordingly
      alert('Review submitted successfully!');
    } catch (error) {
      alert('Failed to submit review. Please try again.');
    } finally {
      setIsSubmittingReview(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Rents</h1>
        <Link 
          href="/rents/new" 
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          <span>Book New Rent</span>
        </Link>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {rents.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-sm text-center">
          <p className="text-gray-600 mb-4">You don't have any rents yet.</p>
          <Link 
            href="/rents/new" 
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Book Your First Rent
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Car
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Driver
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {rents.map((rent) => (
                <tr key={rent.rentid}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                      <span>
                        {new Date(rent.date).toLocaleDateString()}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Car className="h-5 w-5 text-gray-400 mr-2" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {rent.brand}
                        </div>
                        <div className="text-sm text-gray-500">
                          {rent.color} • {rent.construction_year} • {rent.transmission_type}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <User className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900">{rent.driver_name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      className="text-blue-600 hover:text-blue-900 flex items-center"
                      onClick={() => openReviewModal(rent)}
                    >
                      <Star className="h-4 w-4 mr-1" />
                      Review Driver
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Review Modal */}
      {isReviewModalOpen && selectedRent && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div 
              className="fixed inset-0 transition-opacity" 
              aria-hidden="true"
              onClick={closeReviewModal}
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                      Review Driver: {selectedRent.driver_name}
                    </h3>
                    <form onSubmit={handleSubmitReview}>
                      <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                          Rating
                        </label>
                        <div className="flex space-x-1">
                          {[1, 2, 3, 4, 5].map((rating) => (
                            <button
                              key={rating}
                              type="button"
                              className="focus:outline-none"
                              onClick={() => setReviewRating(rating)}
                            >
                              <Star
                                className={`h-8 w-8 ${
                                  rating <= reviewRating
                                    ? 'text-yellow-400 fill-current'
                                    : 'text-gray-300'
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="reviewMessage">
                          Message (Optional)
                        </label>
                        <textarea
                          id="reviewMessage"
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          rows={4}
                          value={reviewMessage}
                          onChange={(e) => setReviewMessage(e.target.value)}
                          placeholder="Write your review here..."
                        ></textarea>
                      </div>
                      <div className="flex justify-end space-x-2">
                        <button
                          type="button"
                          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                          onClick={closeReviewModal}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                          disabled={isSubmittingReview || reviewRating === 0}
                        >
                          {isSubmittingReview ? (
                            <div className="flex items-center">
                              <Loader className="animate-spin h-4 w-4 mr-2" />
                              <span>Submitting...</span>
                            </div>
                          ) : (
                            'Submit Review'
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}