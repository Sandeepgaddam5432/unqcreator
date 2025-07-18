import { toast } from '@/components/ui/use-toast';

// API request timeout in milliseconds
const DEFAULT_TIMEOUT = 30000;
const MAX_RETRIES = 2;
const RETRY_DELAY = 1000;

// Error types for better handling
export enum ApiErrorType {
  NETWORK = 'network',
  TIMEOUT = 'timeout',
  SERVER = 'server',
  AUTHENTICATION = 'authentication',
  VALIDATION = 'validation',
  UNKNOWN = 'unknown',
  CORS = 'cors',
}

export class ApiError extends Error {
  public type: ApiErrorType;
  public status?: number;
  public data?: any;

  constructor(message: string, type: ApiErrorType, status?: number, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.type = type;
    this.status = status;
    this.data = data;
  }
}

// Request options interface
interface RequestOptions {
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  headers?: Record<string, string>;
  silentError?: boolean; // If true, don't show toast notifications for errors
}

// Main API service class
export class ApiService {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
  }

  // Update the base URL (e.g., when the endpoint changes)
  public setBaseUrl(url: string): void {
    this.baseUrl = url;
  }

  // Get the current base URL
  public getBaseUrl(): string {
    return this.baseUrl;
  }

  // Add custom default headers
  public setDefaultHeader(key: string, value: string): void {
    this.defaultHeaders[key] = value;
  }

  // Generic request method with retries and timeout
  private async request<T>(
    method: string,
    endpoint: string,
    data?: any,
    options: RequestOptions = {}
  ): Promise<T> {
    const {
      timeout = DEFAULT_TIMEOUT,
      retries = MAX_RETRIES,
      retryDelay = RETRY_DELAY,
      headers = {},
      silentError = false,
    } = options;

    // Combine default and custom headers
    const requestHeaders = { ...this.defaultHeaders, ...headers };
    
    // Build the full URL
    const url = `${this.baseUrl}${endpoint}`;
    
    // Create the request options
    const requestOptions: RequestInit = {
      method,
      headers: requestHeaders,
      credentials: 'include', // Include cookies for CORS requests if needed
    };

    // Add body for non-GET requests
    if (data && method !== 'GET') {
      requestOptions.body = JSON.stringify(data);
    }

    // Add query params for GET requests
    let finalUrl = url;
    if (data && method === 'GET') {
      const queryParams = new URLSearchParams();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
      
      const queryString = queryParams.toString();
      if (queryString) {
        finalUrl = `${url}${url.includes('?') ? '&' : '?'}${queryString}`;
      }
    }

    // Function to perform the fetch with timeout
    const fetchWithTimeout = async (): Promise<Response> => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);
      
      try {
        const response = await fetch(finalUrl, {
          ...requestOptions,
          signal: controller.signal,
        });
        
        clearTimeout(timeoutId);
        return response;
      } catch (error) {
        clearTimeout(timeoutId);
        
        if (error instanceof DOMException && error.name === 'AbortError') {
          throw new ApiError('Request timed out', ApiErrorType.TIMEOUT);
        }
        
        if (error instanceof TypeError && error.message.includes('CORS')) {
          throw new ApiError(
            'CORS error: The server may not allow requests from this origin',
            ApiErrorType.CORS
          );
        }
        
        throw new ApiError(
          error instanceof Error ? error.message : 'Network error',
          ApiErrorType.NETWORK
        );
      }
    };

    // Retry logic
    let lastError: Error | null = null;
    
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        // Wait before retrying (except for the first attempt)
        if (attempt > 0) {
          await new Promise(resolve => setTimeout(resolve, retryDelay * attempt));
        }
        
        const response = await fetchWithTimeout();
        
        // Handle different response statuses
        if (response.ok) {
          // Check if the response is JSON
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            return await response.json() as T;
          } else {
            // For non-JSON responses (like binary data)
            return await response.text() as unknown as T;
          }
        }
        
        // Handle specific HTTP error codes
        let errorType = ApiErrorType.SERVER;
        let errorMessage = `Server error: ${response.status} ${response.statusText}`;
        
        switch (response.status) {
          case 401:
            errorType = ApiErrorType.AUTHENTICATION;
            errorMessage = 'Authentication failed. Please log in again.';
            break;
          case 403:
            errorType = ApiErrorType.AUTHENTICATION;
            errorMessage = 'You do not have permission to perform this action.';
            break;
          case 400:
          case 422:
            errorType = ApiErrorType.VALIDATION;
            errorMessage = 'Invalid request data.';
            break;
          case 404:
            errorMessage = 'Resource not found.';
            break;
          case 429:
            errorMessage = 'Too many requests. Please try again later.';
            break;
          case 500:
          case 502:
          case 503:
          case 504:
            errorMessage = 'Server error. Please try again later.';
            break;
        }
        
        // Try to parse error response body for more details
        let errorData;
        try {
          errorData = await response.json();
        } catch (e) {
          // Ignore parsing errors
        }
        
        throw new ApiError(errorMessage, errorType, response.status, errorData);
      } catch (error) {
        lastError = error as Error;
        
        // Don't retry if it's not a network error or timeout
        if (
          error instanceof ApiError && 
          error.type !== ApiErrorType.NETWORK && 
          error.type !== ApiErrorType.TIMEOUT
        ) {
          break;
        }
        
        // Last attempt failed, propagate the error
        if (attempt === retries) {
          break;
        }
      }
    }

    // Handle the final error
    if (lastError) {
      // Show error toast unless silentError is true
      if (!silentError) {
        const errorMessage = lastError instanceof ApiError 
          ? lastError.message 
          : 'An unknown error occurred';
          
        toast({
          title: 'API Error',
          description: errorMessage,
          variant: 'destructive',
        });
      }
      
      throw lastError;
    }
    
    // This should never happen, but TypeScript needs it
    throw new ApiError('Unknown error', ApiErrorType.UNKNOWN);
  }

  // HTTP method wrappers
  public async get<T>(endpoint: string, params?: any, options?: RequestOptions): Promise<T> {
    return this.request<T>('GET', endpoint, params, options);
  }

  public async post<T>(endpoint: string, data?: any, options?: RequestOptions): Promise<T> {
    return this.request<T>('POST', endpoint, data, options);
  }

  public async put<T>(endpoint: string, data?: any, options?: RequestOptions): Promise<T> {
    return this.request<T>('PUT', endpoint, data, options);
  }

  public async delete<T>(endpoint: string, data?: any, options?: RequestOptions): Promise<T> {
    return this.request<T>('DELETE', endpoint, data, options);
  }

  // Specialized methods for the UnQCreator Engine API
  
  // Check system stats (used for connection validation)
  public async checkSystemStats(): Promise<any> {
    return this.get('/system_stats', undefined, { silentError: true });
  }
  
  // Submit a workflow prompt
  public async submitPrompt(workflow: any): Promise<any> {
    return this.post('/prompt', workflow);
  }
  
  // Get queue status
  public async getQueueStatus(): Promise<any> {
    return this.get('/queue', undefined, { silentError: true });
  }
  
  // Interrupt current execution
  public async interruptExecution(): Promise<any> {
    return this.post('/interrupt');
  }
  
  // Get history
  public async getHistory(): Promise<any> {
    return this.get('/history');
  }
  
  // Get specific history item
  public async getHistoryItem(promptId: string): Promise<any> {
    return this.get(`/history/${promptId}`);
  }
}

// Create a singleton instance
let apiServiceInstance: ApiService | null = null;

export const getApiService = (baseUrl?: string): ApiService => {
  if (!apiServiceInstance && baseUrl) {
    apiServiceInstance = new ApiService(baseUrl);
  } else if (baseUrl && apiServiceInstance) {
    apiServiceInstance.setBaseUrl(baseUrl);
  } else if (!apiServiceInstance && !baseUrl) {
    throw new Error('API service not initialized. Please provide a base URL.');
  }
  
  return apiServiceInstance as ApiService;
};

export const resetApiService = (): void => {
  apiServiceInstance = null;
}; 