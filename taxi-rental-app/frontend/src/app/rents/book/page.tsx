'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Check, ChevronDown, Loader } from 'lucide-react';

interface Address {
  road_name: string;
  number: string;
  city: string;
}

interface CreditCard {
  card_number: string;
  payment_address: Address;
}

interface CarModel {
  brand: string;
  carid: number;
  modelid: number;
  color: string;
  construction_year: number;
  transmission_type: string;
}

export default function BookRent() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [date, setDate] = useState('');
  const [availableModels, setAvailableModels] = useState<CarModel[]>([]);
  const [selectedModel, setSelectedModel] = useState<CarModel | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [creditCards, setCreditCards] = useState<CreditCard[]>([]);
  const [selectedCreditCard, setSelectedCreditCard] = useState<CreditCard | null>(null);
  
  useEffect(() => {
    // In a real app, you would fetch this from an API
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      
      // Simulating fetching client data
      setTimeout(() => {
        setAddresses([
          { road_name: 'Main St', number: '123', city: 'New York' },
          { road_name: 'Broadway Ave', number: '456', city: 'Chicago' }
        ]);
        setCreditCards([
          { 
            card_number: '4111 1111 1111 1111', 
            payment_address: { road_name: 'Main St', number: '123', city: 'New York' }
          },
          { 
            card_number: '5555 5555 5555 4444', 
            payment_address: { road_name: 'Broadway Ave', number: '456', city: 'Chicago' }
          }
        ]);
        setLoading(false);
      }, 1000);
    } else {
      router.push('/login');
    }
  }, [router]);
  
  const checkAvailability = async () => {
    if (!date) {
      setError('Please select a date');
      return;
    }
    
    setLoading(true);
    setError('');
    setSelectedModel(null);
    
    try {
      // In a real app, you would fetch this from your API
      // const response = await fetch(`/api/clients/available-models?date=${date}`);
      // const data = await response.json();
      
      // Simulating API response
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockData = [
        {
          brand: 'Toyota',
          carid: 1,
          modelid: 1,
          color: 'Red',
          construction_year: 2022,
          transmission_type: 'automatic'
        },
        {
          brand: 'Honda',
          carid: 2,
          modelid: 1,
          color: 'Blue',
          construction_year: 2021,
          transmission_type: 'manual'
        },
        {
          brand: 'Tesla',
          carid: 3,
          modelid: 1,
          color: 'White',
          construction_year: 2023,
          transmission_type: 'automatic'
        }
      ];
      
      setAvailableModels(mockData);
    } catch (error) {
      setError('Failed to fetch available models. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedModel || !selectedAddress || !selectedCreditCard || !date) {
      setError('Please fill in all required fields');
      return;
    }
    
    setSubmitting(true);
    setError('');
    setSuccess('');
    
    try {
      // In a real app, you would make an API call to your backend
      // const response = await fetch('/api/clients/rents', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     client_email: user.email,
      //     date,
      //     brand: selectedModel.brand,
      //     carid: selectedModel.carid,
      //     modelid: selectedModel.modelid,
      //     card_number: selectedCreditCard.card_number,
      //     address_road_name: selectedAddress.road_name,
      //     address_number: selectedAddress.number,
      //     address_city: selectedAddress.city
      //   }),
      // });
      
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSuccess('Your rent has been booked successfully!');
      
      // Redirect to rents page after a brief delay
      setTimeout(() => {
        router.push('/rents');
      }, 2000);
    } catch (error) {
      setError('Failed to book rent. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };
  
  if (loading && !user) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold mb-6">Book a Rent</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}
      
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <h2 className="text-lg font-semibold mb-4">Step 1: Select Date</h2>
        <div className="flex flex-col md:flex-row md:items-end space-y-4 md:space-y-0 md:space-x-4">
          <div className="w-full md:w-1/2">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="date">
              Rent Date
            </label>
            <input
              id="date"
              type="date"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]} // Set min date to today
              required
            />
          </div>
          <button
            type="button"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center justify-center"
            onClick={checkAvailability}
            disabled={loading || !date}
          >
            {loading ? (
              <>
                <Loader className="animate-spin h-5 w-5 mr-2" />
                <span>Checking...</span>
              </>
            ) : (
              <>
                <Calendar className="h-5 w-5 mr-2" />
                <span>Check Availability</span>
              </>
            )}
          </button>
        </div>
      </div>
      
      {availableModels.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <h2 className="text-lg font-semibold mb-4">Step 2: Select Car Model</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableModels.map((model) => (
              <div 
                key={`${model.brand}-${model.carid}-${model.modelid}`}
                className={`border rounded-lg p-4 cursor-pointer ${
                  selectedModel && 
                  selectedModel.brand === model.brand && 
                  selectedModel.carid === model.carid && 
                  selectedModel.modelid === model.modelid
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
                onClick={() => setSelectedModel(model)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg">{model.brand}</h3>
                    <p className="text-gray-600">
                      {model.color} • {model.construction_year} • {model.transmission_type}
                    </p>
                  </div>
                  {selectedModel && 
                   selectedModel.brand === model.brand && 
                   selectedModel.carid === model.carid && 
                   selectedModel.modelid === model.modelid && (
                    <div className="bg-blue-500 text-white p-1 rounded-full">
                      <Check className="h-4 w-4" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {selectedModel && (
        <form onSubmit={handleSubmit}>
          <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
            <h2 className="text-lg font-semibold mb-4">Step 3: Select Address</h2>
            {addresses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {addresses.map((address, index) => (
                  <div 
                    key={index}
                    className={`border rounded-lg p-4 cursor-pointer ${
                      selectedAddress && 
                      selectedAddress.road_name === address.road_name && 
                      selectedAddress.number === address.number && 
                      selectedAddress.city === address.city
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                    onClick={() => setSelectedAddress(address)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{address.road_name}, {address.number}</p>
                        <p className="text-gray-600">{address.city}</p>
                      </div>
                      {selectedAddress && 
                       selectedAddress.road_name === address.road_name && 
                       selectedAddress.number === address.number && 
                       selectedAddress.city === address.city && (
                        <div className="bg-blue-500 text-white p-1 rounded-full">
                          <Check className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No addresses found. Please add an address in your profile.</p>
            )}
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
            <h2 className="text-lg font-semibold mb-4">Step 4: Select Payment Method</h2>
            {creditCards.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {creditCards.map((card, index) => (
                  <div 
                    key={index}
                    className={`border rounded-lg p-4 cursor-pointer ${
                      selectedCreditCard && 
                      selectedCreditCard.card_number === card.card_number
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                    onClick={() => setSelectedCreditCard(card)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">Card: {card.card_number.substr(-4).padStart(card.card_number.length, '*').replace(/(.{4})/g, '$1 ').trim()}</p>
                        <p className="text-gray-600">
                          {card.payment_address.city}
                        </p>
                      </div>
                      {selectedCreditCard && 
                       selectedCreditCard.card_number === card.card_number && (
                        <div className="bg-blue-500 text-white p-1 rounded-full">
                          <Check className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No credit cards found. Please add a credit card in your profile.</p>
            )}
          </div>
          
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline"
              disabled={submitting || !selectedModel || !selectedAddress || !selectedCreditCard}
            >
              {submitting ? (
                <div className="flex items-center">
                  <Loader className="animate-spin h-5 w-5 mr-2" />
                  <span>Booking...</span>
                </div>
              ) : (
                'Book Now'
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}