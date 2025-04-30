// src/components/auth/RegisterForm.tsx
'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { register, RegisterData } from '@/lib/api';

type UserType = 'client' | 'manager' | 'driver';

interface RegisterFormProps {
  onSuccessRedirect?: string;
}

export default function RegisterForm({ onSuccessRedirect }: RegisterFormProps) {
  const router = useRouter();
  const [userType, setUserType] = useState<UserType>('client');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [ssn, setSsn] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Client specific fields
  const [currentStep, setCurrentStep] = useState(1);
  const [addresses, setAddresses] = useState([{ road_name: '', number: 0, city: '' }]);
  const [creditCards, setCreditCards] = useState([{
    card_number: '',
    payment_address: { road_name: '', number: 0, city: '' }
  }]);
  
  const handleAddAddress = () => {
    setAddresses([...addresses, { road_name: '', number: 0, city: '' }]);
  };
  
  const handleAddressChange = (index: number, field: string, value: string | number) => {
    const newAddresses = [...addresses];
    newAddresses[index] = { ...newAddresses[index], [field]: value };
    setAddresses(newAddresses);
  };
  
  const handleAddCreditCard = () => {
    setCreditCards([
      ...creditCards,
      { card_number: '', payment_address: { road_name: '', number: 0, city: '' } }
    ]);
  };
  
  const handleCreditCardChange = (index: number, field: string, value: string) => {
    const newCreditCards = [...creditCards];
    newCreditCards[index] = { ...newCreditCards[index], [field]: value };
    setCreditCards(newCreditCards);
  };
  
  const handleCreditCardAddressChange = (index: number, field: string, value: string | number) => {
    const newCreditCards = [...creditCards];
    newCreditCards[index].payment_address = {
      ...newCreditCards[index].payment_address,
      [field]: value
    };
    setCreditCards(newCreditCards);
  };
  
  const handleNextStep = () => {
    setCurrentStep(currentStep + 1);
  };
  
  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1);
  };
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const registerData: RegisterData = {
      name,
      email,
      userType,
    };
    
    if (userType === 'manager') {
      registerData.ssn = ssn;
    }
    
    if (userType === 'client') {
      registerData.addresses = addresses;
      registerData.creditCards = creditCards;
    }
    
    try {
      const response = await register(registerData);
      
      if (response.success) {
        router.push(onSuccessRedirect || '/login');
      } else {
        setError(response.error || 'Registration failed');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-5">
      <h2 className="text-xl font-bold mb-4 text-center">Register</h2>
      
      {error && (
        <div className="mb-3 p-2 bg-red-100 text-red-700 rounded text-sm">
          {error}
        </div>
      )}
      
      <div className="mb-4">
        <div className="flex gap-2 justify-center">
          <button
            type="button"
            className={`px-3 py-1 text-sm rounded ${userType === 'client' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            onClick={() => {setUserType('client'); setCurrentStep(1);}}
          >
            Client
          </button>
          <button
            type="button"
            className={`px-3 py-1 text-sm rounded ${userType === 'driver' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            onClick={() => {setUserType('driver'); setCurrentStep(1);}}
          >
            Driver
          </button>
          <button
            type="button"
            className={`px-3 py-1 text-sm rounded ${userType === 'manager' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            onClick={() => {setUserType('manager'); setCurrentStep(1);}}
          >
            Manager
          </button>
        </div>
      </div>
      
      {userType === 'client' && (
        <div className="flex justify-between items-center mb-2 text-xs text-gray-500">
          <span className={currentStep >= 1 ? 'font-bold text-blue-600' : ''}>Basic Info</span>
          <span>→</span>
          <span className={currentStep >= 2 ? 'font-bold text-blue-600' : ''}>Addresses</span>
          <span>→</span>
          <span className={currentStep >= 3 ? 'font-bold text-blue-600' : ''}>Payment</span>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-3">
        {(userType !== 'client' || currentStep === 1) && (
          <div className="space-y-3">
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-1" htmlFor="name">
                Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-1" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>
            
            {userType === 'manager' && (
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-1" htmlFor="ssn">
                  SSN
                </label>
                <input
                  id="ssn"
                  type="text"
                  value={ssn}
                  onChange={(e) => setSsn(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>
            )}
            
            {userType === 'client' && (
              <div className="pt-3">
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded text-sm hover:bg-blue-700 focus:outline-none"
                >
                  Next: Add Addresses
                </button>
              </div>
            )}
          </div>
        )}
        
        {userType === 'client' && currentStep === 2 && (
          <div>
            <h3 className="text-md font-semibold mb-2">Address</h3>
            
            {addresses.map((address, index) => (
              <div key={`address-${index}`} className="mb-3 p-2 border rounded bg-gray-50">
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-gray-700 text-xs font-semibold mb-1">
                      Road
                    </label>
                    <input
                      type="text"
                      value={address.road_name}
                      onChange={(e) => handleAddressChange(index, 'road_name', e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-xs font-semibold mb-1">
                      Number
                    </label>
                    <input
                      type="number"
                      value={address.number}
                      onChange={(e) => handleAddressChange(index, 'number', parseInt(e.target.value, 10) || 0)}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-xs font-semibold mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      value={address.city}
                      onChange={(e) => handleAddressChange(index, 'city', e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      required
                    />
                  </div>
                </div>
              </div>
            ))}
            
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={handleAddAddress}
                className="text-xs bg-gray-200 text-gray-800 py-1 px-2 rounded hover:bg-gray-300"
              >
                + Add Address
              </button>
            </div>
            
            <div className="flex justify-between pt-3">
              <button
                type="button"
                onClick={handlePrevStep}
                className="bg-gray-200 text-gray-800 py-2 px-4 rounded text-sm hover:bg-gray-300 focus:outline-none"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleNextStep}
                className="bg-blue-600 text-white py-2 px-4 rounded text-sm hover:bg-blue-700 focus:outline-none"
              >
                Next: Payment Info
              </button>
            </div>
          </div>
        )}
        
        {userType === 'client' && currentStep === 3 && (
          <div>
            <h3 className="text-md font-semibold mb-2">Credit Card</h3>
            
            {creditCards.map((card, index) => (
              <div key={`card-${index}`} className="mb-3 p-2 border rounded bg-gray-50">
                <div className="mb-2">
                  <label className="block text-gray-700 text-xs font-semibold mb-1">
                    Card Number
                  </label>
                  <input
                    type="text"
                    value={card.card_number}
                    onChange={(e) => handleCreditCardChange(index, 'card_number', e.target.value)}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    required
                  />
                </div>
                
                <div>
                  <h5 className="font-medium text-xs mb-1">Payment Address</h5>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-gray-700 text-xs font-semibold mb-1">
                        Road
                      </label>
                      <input
                        type="text"
                        value={card.payment_address.road_name}
                        onChange={(e) => handleCreditCardAddressChange(index, 'road_name', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 text-xs font-semibold mb-1">
                        Number
                      </label>
                      <input
                        type="number"
                        value={card.payment_address.number}
                        onChange={(e) => handleCreditCardAddressChange(index, 'number', parseInt(e.target.value, 10) || 0)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 text-xs font-semibold mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        value={card.payment_address.city}
                        onChange={(e) => handleCreditCardAddressChange(index, 'city', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={handleAddCreditCard}
                className="text-xs bg-gray-200 text-gray-800 py-1 px-2 rounded hover:bg-gray-300"
              >
                + Add Credit Card
              </button>
            </div>
            
            <div className="flex justify-between pt-3">
              <button
                type="button"
                onClick={handlePrevStep}
                className="bg-gray-200 text-gray-800 py-2 px-4 rounded text-sm hover:bg-gray-300 focus:outline-none"
              >
                Back
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white py-2 px-4 rounded text-sm hover:bg-blue-700 focus:outline-none disabled:bg-blue-300"
                disabled={loading}
              >
                {loading ? 'Registering...' : 'Register'}
              </button>
            </div>
          </div>
        )}
        
        {userType !== 'client' && (
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded text-sm hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-blue-300"
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        )}
      </form>
    </div>
  );
}