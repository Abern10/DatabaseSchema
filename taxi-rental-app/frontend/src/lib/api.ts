// src/lib/api.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export type LoginCredentials = {
  email?: string; // Optional for non-client users
  name?: string;  // For drivers
};

export type RegisterData = {
  name: string;
  email: string;
  userType: 'client' | 'manager' | 'driver';
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

// Login function
export async function login(credentials: LoginCredentials): Promise<ApiResponse<any>> {
  try {
    let endpoint = '';
    
    // Determine which login endpoint to use based on credentials
    if (credentials.name && !credentials.email) {
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

// Client registration function
export async function registerClient(data: RegisterData): Promise<ApiResponse<any>> {
  try {
    const response = await fetch(`${API_URL}/clients/register`, {
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
export async function submitReview(reviewData: any): Promise<ApiResponse<any>> {
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

// Get driver's models
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