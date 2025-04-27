import { fetchAuthSession } from 'aws-amplify/auth';
import type { CveDetails, CreditsResponse, ReportResponse, ApiError } from '@/types/api';

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = 'https://wg77sau8q5.execute-api.us-east-1.amazonaws.com/prod';
  }

  private async getAuthHeaders(): Promise<HeadersInit> {
    try {
      const session = await fetchAuthSession();
      if (!session.tokens?.idToken) {
        throw new Error('No ID token available');
      }
      return {
        'Authorization': `Bearer ${session.tokens.idToken.toString()}`,
        'Content-Type': 'application/json'
      };
    } catch (error) {
      console.error('Error getting auth headers:', error);
      throw new Error('User not authenticated');
    }
  }

  private async handleApiError(response: Response): Promise<never> {
    const error: ApiError = {
      message: 'An error occurred while fetching data',
      code: response.status.toString()
    };

    try {
      const errorData = await response.json();
      if (errorData.message) {
        error.message = errorData.message;
      }
    } catch (e) {
      // If we can't parse the error response, use the default message
    }

    throw error;
  }

  async checkCredits(): Promise<CreditsResponse> {
    const headers = await this.getAuthHeaders();
    const response = await fetch(`${this.baseUrl}/credits/check`, {
      method: 'GET',
      headers,
      credentials: 'include',
      mode: 'cors'
    });

    if (!response.ok) {
      await this.handleApiError(response);
    }

    const data = await response.json();
    return data as CreditsResponse;
  }

  async getCveDetails(cveId: string): Promise<CveDetails> {
    if (!/^CVE-\d{4}-\d{4,}$/i.test(cveId)) {
      throw {
        message: 'Invalid CVE ID format',
        code: '400'
      } as ApiError;
    }

    const headers = await this.getAuthHeaders();
    const response = await fetch(`${this.baseUrl}/cve/${cveId}`, {
      method: 'GET',
      headers,
      credentials: 'include',
      mode: 'cors'
    });

    if (!response.ok) {
      await this.handleApiError(response);
    }

    const data = await response.json();
    return data as CveDetails;
  }

  async generateReport(cveId: string): Promise<ReportResponse> {
    if (!/^CVE-\d{4}-\d{4,}$/i.test(cveId)) {
      throw {
        message: 'Invalid CVE ID format',
        code: '400'
      } as ApiError;
    }

    const headers = await this.getAuthHeaders();
    const response = await fetch(`${this.baseUrl}/report/${cveId}`, {
      method: 'POST',
      headers,
      credentials: 'include',
      mode: 'cors'
    });

    if (!response.ok) {
      await this.handleApiError(response);
    }

    const data = await response.json();
    return data as ReportResponse;
  }
}

export const apiService = new ApiService(); 