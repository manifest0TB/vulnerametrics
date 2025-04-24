import { getCurrentUser, fetchAuthSession } from 'aws-amplify/auth';
import type { CveDetails, CreditsResponse, ApiError } from '@/types/api';

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = '/api';
  }

  private async getAuthHeaders(): Promise<HeadersInit> {
    try {
      const session = await fetchAuthSession();
      if (!session.tokens?.accessToken) {
        throw new Error('No access token available');
      }
      return {
        'Authorization': `Bearer ${session.tokens.accessToken.toString()}`,
        'Content-Type': 'application/json'
      };
    } catch (error) {
      console.error('Error getting auth headers:', error);
      throw new Error('User not authenticated');
    }
  }

  private handleApiError(response: Response): never {
    const error: ApiError = {
      message: 'An error occurred while fetching data',
      code: response.status.toString()
    };
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
      this.handleApiError(response);
    }

    return response.json();
  }

  async getCveDetails(cveId: string): Promise<CveDetails> {
    const headers = await this.getAuthHeaders();
    const response = await fetch(`${this.baseUrl}/cve/${cveId}`, {
      method: 'GET',
      headers,
      credentials: 'include',
      mode: 'cors'
    });

    if (!response.ok) {
      this.handleApiError(response);
    }

    return response.json();
  }

  async generateReport(cveId: string): Promise<Blob> {
    const headers = await this.getAuthHeaders();
    const response = await fetch(`${this.baseUrl}/report/${cveId}`, {
      method: 'POST',
      headers,
      credentials: 'include',
      mode: 'cors'
    });

    if (!response.ok) {
      this.handleApiError(response);
    }

    return response.blob();
  }
}

export const apiService = new ApiService(); 