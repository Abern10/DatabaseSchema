// src/lib/api.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export type LoginCredentials = {
  email?: string; // Optional for non-client users
  ssn?: string;   // For managers
  name?: string;  // For drivers
};

export type RegisterData = {
  name: string;
  email: string;
  userType: 'client' | 'manager' | 'driver';
  ssn?: string; // For managers
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

export async function login(credentials: LoginCredentials): Promise<ApiResponse<any>> {
  try {
    let endpoint = '';
    
    // Determine which login endpoint to use based on credentials
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
    
    const data = await response.json();
    
    if (!response.ok) {
      return {
        success: false,
        error: data.error || 'Login failed',
      };
    }
    
    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      error: 'Network error, please try again later.',
    };
  }
}

export async function register(data: RegisterData): Promise<ApiResponse<any>> {
  try {
    let endpoint = '';
    
    // Determine which register endpoint to use
    switch (data.userType) {
      case 'manager':
        endpoint = '/managers/register';
        break;
      case 'driver':
        endpoint = '/drivers/register';
        break;
      default:
        endpoint = '/clients/register';
    }
    
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    const responseData = await response.json();
    
    if (!response.ok) {
      return {
        success: false,
        error: responseData.error || 'Registration failed',
      };
    }
    
    return {
      success: true,
      data: responseData,
    };
  } catch (error) {
    return {
      success: false,
      error: 'Network error, please try again later.',
    };
  }
}