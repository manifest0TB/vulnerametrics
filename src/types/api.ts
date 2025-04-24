export interface CveDetails {
  id: string;
  description: string;
  published: string;
  modified: string;
  severity?: string;
  cvss?: number;
  references?: string[];
  // Add any other fields that the API returns
}

export interface CreditsResponse {
  credits: number;
}

export interface ApiError {
  message: string;
  code?: string;
} 