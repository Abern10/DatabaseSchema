// src/app/(dashboard)/client/book/page.tsx
'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getAvailableModels, getClientCreditCards, bookRent } from '@/lib/api';

type CarModel = {
  brand: string;
  carid: number;
  modelid: number;
  color: string;
  construction_year: number;
  transmission_type: string;
};

type CreditCard = {
  card_number: string;
  address_road_name: string;
  address_number: number;
  address_city: string;
};

export default function BookRent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [availableModels, setAvailableModels] = useState<CarModel[]>([]);
  const [creditCards, setCreditCards] = useState<CreditCard[]>([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedModel, setSelectedModel] = useState<{brand: string, carid: number, modelid: number} | null>(null);
  const [selectedCard, setSelectedCard] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [loadingModels, setLoadingModels] = useState(false);
  const [loadingCards, setLoadingCards] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState<any>(null);
  
  useEffect(() => {
    // Get user info from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
      
      // Load credit cards
      loadCreditCards(JSON.parse(userData).email);
    } else {
      router.push('/'); // Redirect to login if not logged in
    }
    
    // Check for model ID in query params
    const initModelFromQuery = searchParams.get('model');
    if (initModelFromQuery) {
      // We'll set the selected model after loading available models
      const modelId = parseInt(initModelFromQuery);
    }
  }, [searchParams, router]);

  const loadCreditCards = async (email: string) => {
    setLoadingCards(true);
    try {
      const response = await getClientCreditCards(email);
      if (response.success) {
        setCreditCards(response.data || []);
      } else {
        console.error('Failed to load credit cards:', response.error);
        setError(`Failed to load credit cards: ${response.error}`);
      }
    } catch (err) {
      console.error('Error loading credit cards:', err);
      setError('An unexpected error occurred while loading credit cards.');
    } finally {
      setLoadingCards(false);
    }
  };

  const handleDateChange = async (date: string) => {
    setSelectedDate(date);
    
    // Only load available models if a date is selected
    if (date) {
      setLoadingModels(true);
      setError('');
      
      try {
        const response = await getAvailableModels(date);
        if (response.success) {
          setAvailableModels(response.data || []);
          
          // Check if we need to preselect a model from query params
          const modelIdParam = searchParams.get('model');
          if (modelIdParam) {
            const modelId = parseInt(modelIdParam);
            const foundModel = response.data?.find((m: any) => m.modelid === modelId);
            if (foundModel) {
              setSelectedModel({
                brand: foundModel.brand,
                carid: foundModel.carid,
                modelid: foundModel.modelid
              });
            }
          }
        } else {
          setError('Failed to load available models. ' + (response.error || ''));
          setAvailableModels([]);
        }
      } catch (err) {
        console.error('Error loading available models:', err);
        setError('An unexpected error occurred while loading available models.');
      } finally {
        setLoadingModels(false);
      }
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!selectedDate || !selectedModel || !selectedCard) {
      setError('Please select all required fields');
      return;
    }
    
    setSubmitting(true);
    setError('');
    
    try {
      // Find the selected card's payment address
      const card = creditCards.find(c => c.card_number === selectedCard);
      if (!card) {
        throw new Error('Selected card not found');
      }
      
      // Prepare rent data
      const rentData = {
        client_email: user.email,
        date: selectedDate,
        brand: selectedModel.brand,
        carid: selectedModel.carid,
        modelid: selectedModel.modelid,
        card_number: selectedCard,
        address_road_name: card.address_road_name,
        address_number: card.address_number,
        address_city: card.address_city
      };
      
      const response = await bookRent(rentData);
      
      if (response.success) {
        // Redirect to the rents page after successful booking
        router.push('/client/rents');
      } else {
        setError(response.error || 'Failed to book rent');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to book rent. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Get min date (today) for the date picker
  const today = new Date();
  const minDate = today.toISOString().split('T')[0];

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-6">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Book a Rent</h2>
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Date Selection */}
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
            Rent Date
          </label>
          <input
            type="date"
            id="date"
            min={minDate}
            value={selectedDate}
            onChange={(e) => handleDateChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            required
          />
        </div>
        
        {/* Car Model Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Car Model
          </label>
          
          {loadingModels ? (
            <div className="flex justify-center items-center p-6">
              <div className="w-8 h-8 border-t-4 border-indigo-500 border-solid rounded-full animate-spin"></div>
              <p className="ml-2 text-gray-600">Loading available models...</p>
            </div>
          ) : availableModels.length === 0 ? (
            <div className="bg-gray-50 p-6 rounded-lg text-center">
              {selectedDate ? (
                <p className="text-gray-500">No available car models found for this date.</p>
              ) : (
                <p className="text-gray-500">Please select a date to see available car models.</p>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availableModels.map((model) => (
                <div
                  key={`${model.brand}-${model.carid}-${model.modelid}`}
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    selectedModel && 
                    selectedModel.brand === model.brand && 
                    selectedModel.carid === model.carid && 
                    selectedModel.modelid === model.modelid
                      ? 'border-indigo-500 bg-indigo-50 shadow-md'
                      : 'hover:border-indigo-300 hover:shadow-sm'
                  }`}
                  onClick={() => setSelectedModel({
                    brand: model.brand,
                    carid: model.carid,
                    modelid: model.modelid
                  })}
                >
                  <h4 className="font-semibold text-gray-800">{model.brand}</h4>
                  <div className="text-sm text-gray-600 mt-1">
                    <p>Color: {model.color}</p>
                    <p>Year: {model.construction_year}</p>
                    <p>Transmission: {model.transmission_type}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Credit Card Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Payment Method
          </label>
          
          {loadingCards ? (
            <div className="flex justify-center items-center p-6">
              <div className="w-8 h-8 border-t-4 border-indigo-500 border-solid rounded-full animate-spin"></div>
              <p className="ml-2 text-gray-600">Loading payment methods...</p>
            </div>
          ) : creditCards.length === 0 ? (
            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <p className="text-gray-500">No payment methods found. Please add a credit card in your profile.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {creditCards.map((card) => (
                <div
                  key={card.card_number}
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    selectedCard === card.card_number
                      ? 'border-indigo-500 bg-indigo-50 shadow-md'
                      : 'hover:border-indigo-300 hover:shadow-sm'
                  }`}
                  onClick={() => setSelectedCard(card.card_number)}
                >
                  <div className="flex justify-between">
                    <div>
                      <p className="font-semibold text-gray-800">{card.card_number}</p>
                      <p className="text-sm text-gray-600">
                        {card.address_road_name} {card.address_number}, {card.address_city}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-indigo-300 transition-colors shadow-md font-medium"
            disabled={submitting || loadingModels || loadingCards || !selectedDate || !selectedModel || !selectedCard}
          >
            {submitting ? 'Booking...' : 'Book Now'}
          </button>
        </div>
      </form>
    </div>
  );
}