// API client for Legal Flow frontend

// Determine API base URL based on environment
const getApiBaseUrl = () => {
  // If explicitly set, use that
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  
  // In development
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:8080';
  }
  
  // In production on Vercel, API routes are served from the same domain
  if (typeof window !== 'undefined') {
    return `${window.location.origin}/api`;
  }
  
  // Fallback for SSR
  return '/api';
};

const API_BASE_URL = getApiBaseUrl();

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface User {
  id: number;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SignupRequest {
  email: string;
  username: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface SignupResponse {
  user: User;
  token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      const token = this.getAuthToken();
      
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return {
          success: false,
          error: errorData.error || `HTTP ${response.status}: ${response.statusText}`,
        };
      }

      const data = await response.json();
      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  // Auth methods
  async signup(userData: SignupRequest): Promise<ApiResponse<SignupResponse>> {
    return this.request<SignupResponse>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    return this.request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  // User methods
  async getUserProfile(): Promise<ApiResponse<User>> {
    return this.request<User>('/users/me');
  }

  // Contact methods
  async submitContactInquiry(inquiry: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    service: string;
    message: string;
  }): Promise<ApiResponse<any>> {
    return this.request('/contact', {
      method: 'POST',
      body: JSON.stringify(inquiry),
    });
  }

  // Auth token management
  setAuthToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', token);
    }
  }

  getAuthToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('authToken');
    }
    return null;
  }

  removeAuthToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
    }
  }

  isAuthenticated(): boolean {
    return !!this.getAuthToken();
  }

  // Payment methods
  async createPaymentIntent(amount: number, currency: string = 'usd'): Promise<ApiResponse<{ client_secret: string }>> {
    return this.request<{ client_secret: string }>('/payment/create-intent', {
      method: 'POST',
      body: JSON.stringify({ amount, currency }),
    });
  }

  async sendDocument(paymentIntentId: string, documentData: any, email: string): Promise<ApiResponse<any>> {
    return this.request('/payment/send-document', {
      method: 'POST',
      body: JSON.stringify({ paymentIntentId, documentData, email }),
    });
  }

  async createDocumentOrder(paymentIntentId: string, documentData: any, email: string): Promise<ApiResponse<any>> {
    return this.request('/payment/create-order', {
      method: 'POST',
      body: JSON.stringify({ paymentIntentId, documentData, email }),
    });
  }

  async getOrderStatus(orderId: string): Promise<ApiResponse<any>> {
    return this.request(`/order/status/${orderId}`);
  }

  // Health checks
  async healthCheck(): Promise<ApiResponse<{ status: string }>> {
    return this.request<{ status: string }>('/health');
  }

  async dbHealthCheck(): Promise<ApiResponse<{ status: string; database: boolean }>> {
    return this.request<{ status: string; database: boolean }>('/health/db');
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Export class for custom instances
export { ApiClient };
