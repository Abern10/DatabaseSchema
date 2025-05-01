// src/components/auth/RegisterForm.tsx
'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { registerClient, RegisterData } from '@/lib/api';

type UserType = 'client' | 'manager' | 'driver';

interface RegisterFormProps {
  onSuccessRedirect?: string;
}

// Define address and credit card types with nullable number fields
type Address = {
  road_name: string;
  number: number | null;
  city: string;
};

type CreditCard = {
  card_number: string;
  payment_address: {
    road_name: string;
    number: number | null;
    city: string;
  };
  use_existing_address?: boolean;
  selected_address_index?: number;
};

export default function RegisterForm({ onSuccessRedirect }: RegisterFormProps) {
  const router = useRouter();
  const [userType, setUserType] = useState<UserType>('client');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [ssn, setSsn] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Client specific fields
  const [currentStep, setCurrentStep] = useState(1);
  const [addresses, setAddresses] = useState<Address[]>([{ road_name: '', number: null, city: '' }]);
  const [creditCards, setCreditCards] = useState<CreditCard[]>([{
    card_number: '',
    payment_address: { road_name: '', number: null, city: '' },
    use_existing_address: false,
    selected_address_index: 0
  }]);

  // For progress bar animation
  const [progressWidth, setProgressWidth] = useState('0%');

  useEffect(() => {
    // Update progress bar based on currentStep
    if (userType === 'client') {
      setProgressWidth(`${(currentStep - 1) * 50}%`);
    } else {
      setProgressWidth('100%');
    }
  }, [currentStep, userType]);

  // Update card address when existing address selection changes
  useEffect(() => {
    creditCards.forEach((card, cardIndex) => {
      if (card.use_existing_address &&
        card.selected_address_index !== undefined &&
        addresses[card.selected_address_index]) {

        const selectedAddress = addresses[card.selected_address_index];

        // Update the credit card's payment address with the selected address
        const updatedCards = [...creditCards];
        updatedCards[cardIndex].payment_address = {
          road_name: selectedAddress.road_name,
          number: selectedAddress.number,
          city: selectedAddress.city
        };

        setCreditCards(updatedCards);
      }
    });
  }, [addresses, creditCards.map(card => card.selected_address_index).join(',')]);

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!name.trim()) newErrors.name = 'Name is required';
      if (!email.trim()) newErrors.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email is invalid';

      if (userType === 'manager' && !ssn.trim()) {
        newErrors.ssn = 'SSN is required';
      }
    } else if (step === 2 && userType === 'client') {
      // Validate addresses
      addresses.forEach((address, index) => {
        if (!address.road_name.trim()) {
          newErrors[`address_${index}_road`] = 'Road name is required';
        }
        if (address.number === null || address.number <= 0) {
          newErrors[`address_${index}_number`] = 'Valid number is required';
        }
        if (!address.city.trim()) {
          newErrors[`address_${index}_city`] = 'City is required';
        }
      });
    } else if (step === 3 && userType === 'client') {
      // Validate credit cards
      creditCards.forEach((card, index) => {
        if (!card.card_number.trim()) {
          newErrors[`card_${index}_number`] = 'Card number is required';
        } else if (!/^\d{16}$/.test(card.card_number.replace(/\s/g, ''))) {
          newErrors[`card_${index}_number`] = 'Card number must be 16 digits';
        }

        // Only validate payment address fields if not using existing address
        if (!card.use_existing_address) {
          if (!card.payment_address.road_name.trim()) {
            newErrors[`card_${index}_road`] = 'Road name is required';
          }
          if (card.payment_address.number === null || card.payment_address.number <= 0) {
            newErrors[`card_${index}_number`] = 'Valid number is required';
          }
          if (!card.payment_address.city.trim()) {
            newErrors[`card_${index}_city`] = 'City is required';
          }
        }
      });
    }

    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddAddress = () => {
    setAddresses([...addresses, { road_name: '', number: null, city: '' }]);
  };

  const handleAddressChange = (index: number, field: string, value: string | number | null) => {
    const newAddresses = [...addresses];
    newAddresses[index] = { ...newAddresses[index], [field]: value };
    setAddresses(newAddresses);

    // Clear relevant error when user types
    const errorKey = `address_${index}_${field}`;
    if (formErrors[errorKey]) {
      const newErrors = { ...formErrors };
      delete newErrors[errorKey];
      setFormErrors(newErrors);
    }
  };

  const handleAddCreditCard = () => {
    setCreditCards([
      ...creditCards,
      {
        card_number: '',
        payment_address: { road_name: '', number: null, city: '' },
        use_existing_address: false,
        selected_address_index: 0
      }
    ]);
  };

  const handleCreditCardChange = (index: number, field: string, value: string) => {
    const newCreditCards = [...creditCards];
    newCreditCards[index] = { ...newCreditCards[index], [field]: value };
    setCreditCards(newCreditCards);

    // Clear relevant error when user types
    const errorKey = `card_${index}_${field}`;
    if (formErrors[errorKey]) {
      const newErrors = { ...formErrors };
      delete newErrors[errorKey];
      setFormErrors(newErrors);
    }
  };

  const handleCreditCardAddressChange = (index: number, field: string, value: string | number | null) => {
    const newCreditCards = [...creditCards];
    newCreditCards[index].payment_address = {
      ...newCreditCards[index].payment_address,
      [field]: value
    };
    setCreditCards(newCreditCards);

    // Clear relevant error when user types
    const errorKey = `card_${index}_${field}`;
    if (formErrors[errorKey]) {
      const newErrors = { ...formErrors };
      delete newErrors[errorKey];
      setFormErrors(newErrors);
    }
  };

  const handleUseExistingAddress = (cardIndex: number, checked: boolean) => {
    const newCreditCards = [...creditCards];
    newCreditCards[cardIndex].use_existing_address = checked;

    // If enabling, copy the currently selected address
    if (checked && newCreditCards[cardIndex].selected_address_index !== undefined) {
      const addressIndex = newCreditCards[cardIndex].selected_address_index;
      if (addresses[addressIndex]) {
        const selectedAddress = addresses[addressIndex];
        newCreditCards[cardIndex].payment_address = {
          road_name: selectedAddress.road_name,
          number: selectedAddress.number,
          city: selectedAddress.city
        };
      }
    }

    setCreditCards(newCreditCards);
  };

  const handleSelectAddress = (cardIndex: number, addressIndex: number) => {
    const newCreditCards = [...creditCards];
    newCreditCards[cardIndex].selected_address_index = addressIndex;

    // Copy the selected address data
    if (newCreditCards[cardIndex].use_existing_address && addresses[addressIndex]) {
      const selectedAddress = addresses[addressIndex];
      newCreditCards[cardIndex].payment_address = {
        road_name: selectedAddress.road_name,
        number: selectedAddress.number,
        city: selectedAddress.city
      };
    }

    setCreditCards(newCreditCards);
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Final validation check
    if (userType === 'client' && !validateStep(currentStep)) {
      return;
    } else if (userType !== 'client' && !validateStep(1)) {
      return;
    }

    setLoading(true);
    setError('');

    // Convert null values to 0 for API submission
    const processedAddresses = addresses.map(addr => ({
      ...addr,
      number: addr.number ?? 0
    }));

    const processedCreditCards = creditCards.map(card => ({
      card_number: card.card_number,
      payment_address: {
        ...card.payment_address,
        number: card.payment_address.number ?? 0
      }
    }));

    const registerData: RegisterData = {
      name,
      email,
      userType,
    };

    if (userType === 'manager') {
      registerData.ssn = ssn;
    }

    if (userType === 'client') {
      registerData.addresses = processedAddresses;
      registerData.creditCards = processedCreditCards;
    }

    try {
      const response = await registerClient(registerData);

      if (response.success) {
        // Store user in localStorage (important for dashboard authorization)
        localStorage.setItem('user', JSON.stringify({
          name,
          email,
          userType
        }));

        // Redirect based on user type
        switch (userType) {
          case 'client':
            router.push('/client/dashboard');
            break;
          case 'manager':
            router.push('/manager/dashboard');
            break;
          case 'driver':
            router.push('/driver/dashboard');
            break;
          default:
            router.push(onSuccessRedirect || '/');
        }
      } else {
        setError(response.error || 'Registration failed');
      }


    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const renderInput = (
    id: string,
    label: string,
    value: string | number | null,
    onChange: (value: any) => void,
    type: string = 'text',
    placeholder: string = '',
    errorKey?: string,
    disabled: boolean = false
  ) => (
    <div className="space-y-1">
      <label className="block text-gray-700 text-sm font-medium" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={type === 'number' ? (value === null ? '' : value.toString()) : value || ''}
        onChange={(e) => {
          if (type === 'number') {
            // Only allow numeric input
            const numericValue = e.target.value.replace(/[^0-9]/g, '');

            // If empty, set to null, otherwise parse as integer
            const val = numericValue === '' ? null : parseInt(numericValue);
            onChange(val);
          } else {
            onChange(e.target.value);
          }
        }}
        disabled={disabled}
        className={`w-full px-3 py-2 border rounded-lg ${disabled ? 'bg-gray-100 text-gray-500' : 'text-gray-700'} focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${errorKey && formErrors[errorKey] ? 'border-red-300 bg-red-50' : 'border-gray-300'
          }`}
        placeholder={placeholder}
      />
      {errorKey && formErrors[errorKey] && (
        <p className="text-red-600 text-xs mt-1">{formErrors[errorKey]}</p>
      )}
    </div>
  );

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Register</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="mb-6">
        <div className="flex gap-2 justify-center p-1 bg-gray-100 rounded-lg">
          <button
            type="button"
            className={`px-4 py-2 text-sm rounded-lg transition-all duration-200 ${userType === 'client' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-700 hover:bg-gray-200'}`}
            onClick={() => { setUserType('client'); setCurrentStep(1); }}
          >
            Client
          </button>
          <button
            type="button"
            className={`px-4 py-2 text-sm rounded-lg transition-all duration-200 ${userType === 'driver' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-700 hover:bg-gray-200'}`}
            onClick={() => { setUserType('driver'); setCurrentStep(1); }}
          >
            Driver
          </button>
          <button
            type="button"
            className={`px-4 py-2 text-sm rounded-lg transition-all duration-200 ${userType === 'manager' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-700 hover:bg-gray-200'}`}
            onClick={() => { setUserType('manager'); setCurrentStep(1); }}
          >
            Manager
          </button>
        </div>
      </div>

      {userType === 'client' && (
        <div className="mb-6">
          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between gap-2">
              <div className={`text-xs font-semibold inline-flex items-center ${currentStep >= 1 ? 'text-indigo-600' : 'text-gray-500'}`}>
                <span className={`flex items-center justify-center w-5 h-5 mr-2 rounded-full ${currentStep >= 1 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'}`}>1</span>
                Basic Info
              </div>
              <div className="flex-grow border-t border-gray-200 mx-2"></div>
              <div className={`text-xs font-semibold inline-flex items-center ${currentStep >= 2 ? 'text-indigo-600' : 'text-gray-500'}`}>
                <span className={`flex items-center justify-center w-5 h-5 mr-2 rounded-full ${currentStep >= 2 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'}`}>2</span>
                Addresses
              </div>
              <div className="flex-grow border-t border-gray-200 mx-2"></div>
              <div className={`text-xs font-semibold inline-flex items-center ${currentStep >= 3 ? 'text-indigo-600' : 'text-gray-500'}`}>
                <span className={`flex items-center justify-center w-5 h-5 mr-2 rounded-full ${currentStep >= 3 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'}`}>3</span>
                Payment
              </div>
            </div>
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded-full bg-gray-200">
              <div
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500 transition-all duration-500 ease-out"
                style={{ width: progressWidth }}
              ></div>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {(userType !== 'client' || currentStep === 1) && (
          <div className="space-y-4">
            {renderInput(
              'name',
              'Name',
              name,
              setName,
              'text',
              'John Smith',
              'name',
              false
            )}

            {renderInput(
              'email',
              'Email',
              email,
              setEmail,
              'email',
              'your.email@example.com',
              'email',
              false
            )}

            {userType === 'manager' && (
              renderInput(
                'ssn',
                'SSN',
                ssn,
                setSsn,
                'text',
                'XXX-XX-XXXX',
                'ssn',
                false
              )
            )}

            {userType === 'client' && (
              <button
                type="button"
                onClick={handleNextStep}
                className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 shadow-md transition-colors duration-200"
              >
                Next: Add Addresses
              </button>
            )}
          </div>
        )}

        {userType === 'client' && currentStep === 2 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-800 mb-2">Address Information</h3>

            {addresses.map((address, index) => (
              <div key={`address-${index}`} className="p-4 border rounded-lg bg-gray-50 space-y-3">
                <h4 className="text-sm font-medium text-gray-700">Address {index + 1}</h4>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {renderInput(
                    `road_${index}`,
                    'Road Name',
                    address.road_name,
                    (value) => handleAddressChange(index, 'road_name', value),
                    'text',
                    'Main St',
                    `address_${index}_road`,
                    false
                  )}

                  {renderInput(
                    `number_${index}`,
                    'Number',
                    address.number,
                    (value) => handleAddressChange(index, 'number', value),
                    'number',
                    '123',
                    `address_${index}_number`,
                    false
                  )}

                  {renderInput(
                    `city_${index}`,
                    'City',
                    address.city,
                    (value) => handleAddressChange(index, 'city', value),
                    'text',
                    'New York',
                    `address_${index}_city`,
                    false
                  )}
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={handleAddAddress}
              className="inline-flex items-center px-3 py-2 border border-indigo-300 text-sm leading-4 font-medium rounded-md text-indigo-700 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Another Address
            </button>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={handlePrevStep}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleNextStep}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Next: Payment Info
              </button>
            </div>
          </div>
        )}

        {userType === 'client' && currentStep === 3 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-800 mb-2">Payment Information</h3>

            {creditCards.map((card, index) => (
              <div key={`card-${index}`} className="p-4 border rounded-lg bg-gray-50 space-y-3">
                <h4 className="text-sm font-medium text-gray-700">Credit Card {index + 1}</h4>

                {renderInput(
                  `card_number_${index}`,
                  'Card Number',
                  card.card_number,
                  (value) => handleCreditCardChange(index, 'card_number', value),
                  'text',
                  '1234 5678 9012 3456',
                  `card_${index}_number`,
                  false
                )}

                <div className="mt-4">
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Billing Address</h5>

                  {addresses.length > 0 && (
                    <div className="mb-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          checked={card.use_existing_address}
                          onChange={(e) => handleUseExistingAddress(index, e.target.checked)}
                        />
                        <span className="ml-2 text-sm text-gray-700">Use existing address</span>
                      </label>

                      {card.use_existing_address && (
                        <div className="mt-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Select address
                          </label>
                          <select
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            value={card.selected_address_index}
                            onChange={(e) => handleSelectAddress(index, parseInt(e.target.value))}
                          >
                            {addresses.map((address, addrIndex) => (
                              <option key={addrIndex} value={addrIndex}>
                                {address.road_name} {address.number}, {address.city}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                  )}

                  <div className={`grid grid-cols-1 gap-3 sm:grid-cols-3 ${card.use_existing_address ? 'opacity-50' : ''}`}>
                    {renderInput(
                      `card_road_${index}`,
                      'Road Name',
                      card.payment_address.road_name,
                      (value) => handleCreditCardAddressChange(index, 'road_name', value),
                      'text',
                      'Main St',
                      `card_${index}_road`,
                      card.use_existing_address
                    )}

                    {renderInput(
                      `card_number_addr_${index}`,
                      'Number',
                      card.payment_address.number,
                      (value) => handleCreditCardAddressChange(index, 'number', value),
                      'number',
                      '123',
                      `card_${index}_number`,
                      card.use_existing_address
                    )}

                    {renderInput(
                      `card_city_${index}`,
                      'City',
                      card.payment_address.city,
                      (value) => handleCreditCardAddressChange(index, 'city', value),
                      'text',
                      'New York',
                      `card_${index}_city`,
                      card.use_existing_address
                    )}
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={handleAddCreditCard}
              className="inline-flex items-center px-3 py-2 border border-indigo-300 text-sm leading-4 font-medium rounded-md text-indigo-700 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Another Credit Card
            </button>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={handlePrevStep}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Back
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300"
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
            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 shadow-md transition-colors duration-200 disabled:bg-indigo-300"
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        )}
      </form>
    </div>
  );
}