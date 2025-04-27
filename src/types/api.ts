export interface CveDetails {
  // This will contain the raw NVD API response structure
  [key: string]: any;
}

export interface CreditsResponse {
  creditBalance: number;
}

export interface ReportResponse {
  message: string;
  reportKey: string;
  cveId: string;
  timestamp: string;
}

export interface ApiError {
  message: string;
  code: string;
} 