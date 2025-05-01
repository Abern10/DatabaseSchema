// src/lib/api.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

export type LoginCredentials = {
  email?: string;
  name?: string;
  ssn?: string;
};

export type RegisterData = {
  name: string;
  email: string;
  userType: 'client' | 'manager' | 'driver';
  ssn?: string;
  addresses?: {
    road_name: string;
    number: number;
    city: string;
  }[];
  creditCards?: {
    card_number: string;
    payment_address: {
      road_name: string;
      number: number;
      city: string;
    };
  }[];
};

export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

// Helper to handle API responses
const handleResponse = async (response: Response): Promise<ApiResponse<any>> => {
  const data = await response.json();
  
  if (!response.ok) {
    return {
      success: false,
      error: data.error || `Request failed with status ${response.status}`
    };
  }
  
  return {
    success: true,
    data
  };
};

// Login function for all user types
export async function login(credentials: LoginCredentials): Promise<ApiResponse<any>> {
  try {
    let endpoint = '';
    
    if (credentials.ssn) {
      endpoint = '/managers/login';
    } else if (credentials.name && !credentials.email) {
      endpoint = '/drivers/login';
    } else {
      endpoint = '/clients/login';
    }
    
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    
    return handleResponse(response);
  } catch (error) {
    return {
      success: false,
      error: 'Network error, please try again later.',
    };
  }
}

// Client registration
export async function registerClient(data: RegisterData): Promise<ApiResponse<any>> {
  try {
    // Determine endpoint based on userType
    let endpoint = '';
    
    switch (data.userType) {
      case 'client':
        endpoint = '/clients/register';
        break;
      case 'driver':
        endpoint = '/drivers/register';
        break;
      case 'manager':
        endpoint = '/managers/register';
        break;
      default:
        throw new Error('Invalid user type');
    }
    
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    return handleResponse(response);
  } catch (error) {
    return {
      success: false,
      error: 'Network error, please try again later.',
    };
  }
}

// Register driver specifically
export async function registerDriver(data: Omit<RegisterData, 'userType'>): Promise<ApiResponse<any>> {
  try {
    const response = await fetch(`${API_URL}/drivers/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    return handleResponse(response);
  } catch (error) {
    return {
      success: false,
      error: 'Network error, please try again later.',
    };
  }
}

// Register manager specifically
export async function registerManager(data: Omit<RegisterData, 'userType'>): Promise<ApiResponse<any>> {
  try {
    const response = await fetch(`${API_URL}/managers/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    return handleResponse(response);
  } catch (error) {
    return {
      success: false,
      error: 'Network error, please try again later.',
    };
  }
}

// Get all cars
export async function getAllCars(): Promise<ApiResponse<any>> {
  try {
    const response = await fetch(`${API_URL}/cars`);
    return handleResponse(response);
  } catch (error) {
    return {
      success: false,
      error: 'Network error, please try again later.',
    };
  }
}

// Get all car models
export async function getAllCarModels(): Promise<ApiResponse<any>> {
  try {
    const response = await fetch(`${API_URL}/cars/models`);
    return handleResponse(response);
  } catch (error) {
    return {
      success: false,
      error: 'Network error, please try again later.',
    };
  }
}

// Get available models for a specific date
export async function getAvailableModels(date: string): Promise<ApiResponse<any>> {
  try {
    const response = await fetch(`${API_URL}/clients/available-models?date=${date}`);
    return handleResponse(response);
  } catch (error) {
    return {
      success: false,
      error: 'Network error, please try again later.',
    };
  }
}

// Get client's rents
export async function getClientRents(email: string): Promise<ApiResponse<any>> {
  try {
    const response = await fetch(`${API_URL}/clients/${email}/rents`);
    return handleResponse(response);
  } catch (error) {
    return {
      success: false,
      error: 'Network error, please try again later.',
    };
  }
}

// Get client's addresses
export async function getClientAddresses(email: string): Promise<ApiResponse<any>> {
  try {
    const response = await fetch(`${API_URL}/clients/${email}/addresses`);
    return handleResponse(response);
  } catch (error) {
    return {
      success: false,
      error: 'Network error, please try again later.',
    };
  }
}

// Get client's credit cards
export async function getClientCreditCards(email: string): Promise<ApiResponse<any>> {
  try {
    const response = await fetch(`${API_URL}/clients/${email}/credit-cards`);
    return handleResponse(response);
  } catch (error) {
    return {
      success: false,
      error: 'Network error, please try again later.',
    };
  }
}

// Get client's reviews
export async function getClientReviews(email: string): Promise<ApiResponse<any>> {
  try {
    const response = await fetch(`${API_URL}/clients/${email}/reviews`);
    return handleResponse(response);
  } catch (error) {
    return {
      success: false,
      error: 'Network error, please try again later.',
    };
  }
}

// Book a rent
export async function bookRent(rentData: any): Promise<ApiResponse<any>> {
  try {
    const response = await fetch(`${API_URL}/clients/rents`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(rentData),
    });
    
    return handleResponse(response);
  } catch (error) {
    return {
      success: false,
      error: 'Network error, please try again later.',
    };
  }
}

// Submit a review
export async function submitReview(reviewData: {
  driver_name: string;
  rating: number;
  message: string;
  client_email: string;
  rent_id?: number;
}): Promise<ApiResponse<any>> {
  try {
    const response = await fetch(`${API_URL}/clients/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reviewData),
    });
    
    return handleResponse(response);
  } catch (error) {
    return {
      success: false,
      error: 'Network error, please try again later.',
    };
  }
}

// Get all reviews for a driver
export async function getDriverReviews(driverName: string): Promise<ApiResponse<any>> {
  try {
    const response = await fetch(`${API_URL}/drivers/${driverName}/reviews`);
    return handleResponse(response);
  } catch (error) {
    return {
      success: false,
      error: 'Network error, please try again later.',
    };
  }
}

// Get driver's drivable models
export async function getDriverModels(name: string): Promise<ApiResponse<any>> {
  try {
    const response = await fetch(`${API_URL}/drivers/${name}/drivable-models`);
    return handleResponse(response);
  } catch (error) {
    return {
      success: false,
      error: 'Network error, please try again later.',
    };
  }
}

// Get all car models a driver can choose from
export async function getAllDriverCarModels(): Promise<ApiResponse<any>> {
  try {
    const response = await fetch(`${API_URL}/drivers/car-models`);
    return handleResponse(response);
  } catch (error) {
    return {
      success: false,
      error: 'Network error, please try again later.',
    };
  }
}

// Add a new address for a client
export async function addClientAddress(email: string, address: {
  road_name: string;
  number: number;
  city: string;
}): Promise<ApiResponse<any>> {
  try {
    const response = await fetch(`${API_URL}/clients/${email}/addresses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(address),
    });
    
    return handleResponse(response);
  } catch (error) {
    return {
      success: false,
      error: 'Network error, please try again later.',
    };
  }
}

// Remove an address for a client
export async function removeClientAddress(email: string, address: {
  road_name: string;
  number: number;
  city: string;
}): Promise<ApiResponse<any>> {
  try {
    const response = await fetch(`${API_URL}/clients/${email}/addresses`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(address),
    });
    
    return handleResponse(response);
  } catch (error) {
    return {
      success: false,
      error: 'Network error, please try again later.',
    };
  }
}

// Update driver's address
export async function updateDriverAddress(name: string, addressData: any): Promise<ApiResponse<any>> {
  try {
    const response = await fetch(`${API_URL}/drivers/${name}/address`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(addressData),
    });
    
    return handleResponse(response);
  } catch (error) {
    return {
      success: false,
      error: 'Network error, please try again later.',
    };
  }
}

// Add a new credit card for a client
export async function addClientCreditCard(email: string, card: {
  card_number: string;
  payment_address: {
    road_name: string;
    number: number;
    city: string;
  };
}): Promise<ApiResponse<any>> {
  try {
    const response = await fetch(`${API_URL}/clients/${email}/credit-cards`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(card),
    });
    
    return handleResponse(response);
  } catch (error) {
    return {
      success: false,
      error: 'Network error, please try again later.',
    };
  }
}

// Remove a credit card for a client
export async function removeClientCreditCard(email: string, cardNumber: string): Promise<ApiResponse<any>> {
  try {
    const response = await fetch(`${API_URL}/clients/${email}/credit-cards`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ card_number: cardNumber }),
    });
    
    return handleResponse(response);
  } catch (error) {
    return {
      success: false,
      error: 'Network error, please try again later.',
    };
  }
}

// Add drivable model to driver
export async function addDriverModel(name: string, modelData: any): Promise<ApiResponse<any>> {
  try {
    const response = await fetch(`${API_URL}/drivers/${name}/drivable-models`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(modelData),
    });
    
    return handleResponse(response);
  } catch (error) {
    return {
      success: false,
      error: 'Network error, please try again later.',
    };
  }
}

// Remove drivable model from driver
export async function removeDriverModel(name: string, brand: string, carId: number, modelId: number): Promise<ApiResponse<any>> {
  try {
    const response = await fetch(`${API_URL}/drivers/${name}/drivable-models/${brand}/${carId}/${modelId}`, {
      method: 'DELETE',
    });
    
    return handleResponse(response);
  } catch (error) {
    return {
      success: false,
      error: 'Network error, please try again later.',
    };
  }
}

// Get all rents
export async function getAllRents(): Promise<ApiResponse<any>> {
  try {
    const response = await fetch(`${API_URL}/rents`);
    return handleResponse(response);
  } catch (error) {
    return {
      success: false,
      error: 'Network error, please try again later.',
    };
  }
}

// Get manager reports - top clients
export async function getTopClients(limit: number): Promise<ApiResponse<any>> {
  try {
    const response = await fetch(`${API_URL}/managers/reports/top-clients?limit=${limit}`);
    return handleResponse(response);
  } catch (error) {
    return {
      success: false,
      error: 'Network error, please try again later.',
    };
  }
}

// Get manager reports - car model usage
export async function getCarModelUsage(): Promise<ApiResponse<any>> {
  try {
    const response = await fetch(`${API_URL}/managers/reports/car-model-usage`);
    return handleResponse(response);
  } catch (error) {
    return {
      success: false,
      error: 'Network error, please try again later.',
    };
  }
}

// Get manager reports - driver performance
export async function getDriverPerformance(): Promise<ApiResponse<any>> {
  try {
    const response = await fetch(`${API_URL}/managers/reports/driver-performance`);
    return handleResponse(response);
  } catch (error) {
    return {
      success: false,
      error: 'Network error, please try again later.',
    };
  }
}

// Get manager reports - city cross reference
export async function getCityCrossReference(city1: string, city2: string): Promise<ApiResponse<any>> {
  try {
    const response = await fetch(`${API_URL}/managers/reports/city-cross?city1=${city1}&city2=${city2}`);
    return handleResponse(response);
  } catch (error) {
    return {
      success: false,
      error: 'Network error, please try again later.',
    };
  }
}

// Add a car
export async function addCar(carData: any): Promise<ApiResponse<any>> {
  try {
    const response = await fetch(`${API_URL}/managers/cars`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(carData),
    });
    
    return handleResponse(response);
  } catch (error) {
    return {
      success: false,
      error: 'Network error, please try again later.',
    };
  }
}

// Add a model
export async function addModel(modelData: any): Promise<ApiResponse<any>> {
  try {
    const response = await fetch(`${API_URL}/managers/models`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(modelData),
    });
    
    return handleResponse(response);
  } catch (error) {
    return {
      success: false,
      error: 'Network error, please try again later.',
    };
  }
}

// Add a driver
export async function addDriver(driverData: any): Promise<ApiResponse<any>> {
  try {
    const response = await fetch(`${API_URL}/managers/drivers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(driverData),
    });
    
    return handleResponse(response);
  } catch (error) {
    return {
      success: false,
      error: 'Network error, please try again later.',
    };
  }
}

// Delete a car
export async function deleteCar(carId: number): Promise<ApiResponse<any>> {
  try {
    const response = await fetch(`${API_URL}/managers/cars/${carId}`, {
      method: 'DELETE',
    });
    
    return handleResponse(response);
  } catch (error) {
    return {
      success: false,
      error: 'Network error, please try again later.',
    };
  }
}

// Delete a model
export async function deleteModel(modelId: number): Promise<ApiResponse<any>> {
  try {
    const response = await fetch(`${API_URL}/managers/models/${modelId}`, {
      method: 'DELETE',
    });
    
    return handleResponse(response);
  } catch (error) {
    return {
      success: false,
      error: 'Network error, please try again later.',
    };
  }
}

// Delete a driver
export async function deleteDriver(driverId: number): Promise<ApiResponse<any>> {
  try {
    const response = await fetch(`${API_URL}/managers/drivers/${driverId}`, {
      method: 'DELETE',
    });
    
    return handleResponse(response);
  } catch (error) {
    return {
      success: false,
      error: 'Network error, please try again later.',
    };
  }
}