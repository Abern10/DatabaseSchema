// src/app/(dashboard)/client/book/page.tsx
'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

type CarModel = {
  model_id: number;
  brand: string;
  color: string;
  construction_year: number;
  transmission_type: string;
};

type CreditCard = {
  card_number: string;
  payment_address: {
    road_name: string;
    number: number;
    city: string;
  };
};

export default function BookRent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [availableModels, setAvailableModels] = useState<CarModel[]>([]);
  const [creditCards, setCreditCards] = useState<CreditCard[]>([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedModel, setSelectedModel] = useState<number | null>(null);
  const [selectedCard, setSelectedCard] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const initModelFromQuery = searchParams.get('model');
    if (initModelFromQuery) {
      setSelectedModel(parseInt(initModelFromQuery));
    }
    
    // In a real app, fetch this data from your API
    // For now, let's use mock data
    setAvailableModels([
      {
        model_id: 1,
        brand: 'Toyota',
        color: 'Silver',
        construction_year: 2023,
        transmission_type: 'automatic',
      },
      {
        model_id: 2,
        brand: 'Honda',
        color: 'Blue',
        construction_year: 2022,
        transmission_type: 'manual',
      },
      {
        model_id: 3,
        brand: 'Tesla',
        color: 'White',
        construction_year: 2025,
        transmission_type: 'automatic',
      },
      {
        model_id: 4,
        brand: 'Ford',
        color: 'Black',
        construction_year: 2024,
        transmission_type: 'manual',
      },
      {
        model_id: 5,
        brand: 'Chevrolet',
        color: 'Red',
        construction_year: 2023,
        transmission_type: 'automatic',
      },
    ]);
    
    setCreditCards([
      {
        card_number: '**** **** **** 1234',
        payment_address: {
          road_name: 'Main St',
          number: 123,
          city: 'New York',
        },
      },
      {
        card_number: '**** **** **** 5678',
        payment_address: {
          road_name: 'Broadway',
          number: 456,
          city: 'Chicago',
        },
      },
    ]);
    
    setLoading(false);
  }, [searchParams]);

  const handleDateChange = async (date: string) => {
    setSelectedDate(date);
    
    // In a real app, you would fetch available models for this date
    // setAvailableModels([...]) based on the selected date
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
      // Here you would make an API call to book the rent
      // For example:
      // const response = await fetch('/api/rents', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     date: selectedDate,
      //     model_id: selectedModel,
      //     card_number: selectedCard
      //   })
      // });
      
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirect to the rents page after successful booking
      router.push('/client/rents');
    } catch (err) {
      setError('Failed to book rent. Please try again.');
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availableModels.map((model) => (
              <div
                key={model.model_id}
                className={`border rounded-lg p-4 cursor-pointer transition-all 
                  ${selectedModel === model.model_id 
                    ? 'border-indigo-500 bg-indigo-50 shadow-md' 
                    : 'hover:border-indigo-300 hover:shadow-sm'}`}
                onClick={() => setSelectedModel(model.model_id)}
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
        </div>
        
        {/* Credit Card Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Payment Method
          </label>
          <div className="space-y-3">
            {creditCards.map((card) => (
              <div
                key={card.card_number}
                className={`border rounded-lg p-4 cursor-pointer transition-all 
                  ${selectedCard === card.card_number 
                    ? 'border-indigo-500 bg-indigo-50 shadow-md' 
                    : 'hover:border-indigo-300 hover:shadow-sm'}`}
                onClick={() => setSelectedCard(card.card_number)}
              >
                <div className="flex justify-between">
                  <div>
                    <p className="font-semibold text-gray-800">{card.card_number}</p>
                    <p className="text-sm text-gray-600">
                      {card.payment_address.road_name} {card.payment_address.number}, {card.payment_address.city}
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
        </div>
        
        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-indigo-300 transition-colors shadow-md font-medium"
            disabled={submitting}
          >
            {submitting ? 'Booking...' : 'Book Now'}
          </button>
        </div>
      </form>
    </div>
  );
}