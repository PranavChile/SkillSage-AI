import axios from 'axios';
import type { AnalysisResult, ImprovementResponse, PlagiarismResponse, CompanyResponse, ApiResponse } from '@/types';

// API Base URL - Change this to your backend URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
  timeout: 60000, // 60 second timeout
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.data);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

/**
 * Analyze resume file
 * @param file - Resume file (PDF, DOC, DOCX)
 * @returns Analysis result with domain, confidence, and skills
 */
export const analyzeResume = async (file: File): Promise<ApiResponse<AnalysisResult>> => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post<AnalysisResult>('/api/analyze-resume', formData);
    
    return {
      data: response.data,
      status: 'success',
    };
  } catch (error: any) {
    return {
      error: error.response?.data?.detail || 'Failed to analyze resume',
      status: 'error',
    };
  }
};

/**
 * Get resume improvement suggestions
 * @param file - Resume file
 * @param domain - Optional domain for targeted suggestions
 * @returns Improvement suggestions and overall score
 */
export const getResumeImprovements = async (
  file: File,
  domain?: string
): Promise<ApiResponse<ImprovementResponse>> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    if (domain) {
      formData.append('domain', domain);
    }

    const response = await api.post<ImprovementResponse>('/api/improve-resume', formData);
    
    return {
      data: response.data,
      status: 'success',
    };
  } catch (error: any) {
    return {
      error: error.response?.data?.detail || 'Failed to get improvement suggestions',
      status: 'error',
    };
  }
};

/**
 * Check resume uniqueness/plagiarism
 * @param file - Resume file
 * @returns Uniqueness check result
 */
export const checkUniqueness = async (file: File): Promise<ApiResponse<PlagiarismResponse>> => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post<PlagiarismResponse>('/api/check-plagiarism', formData);
    
    return {
      data: response.data,
      status: 'success',
    };
  } catch (error: any) {
    return {
      error: error.response?.data?.detail || 'Failed to check uniqueness',
      status: 'error',
    };
  }
};

/**
 * Get companies by domain
 * @param domain - Professional domain
 * @param limit - Maximum number of companies to return
 * @returns List of companies hiring in the domain
 */
export const getCompaniesByDomain = async (
  domain: string,
  limit: number = 10
): Promise<ApiResponse<CompanyResponse>> => {
  try {
    const response = await api.get<CompanyResponse>(`/api/companies/${encodeURIComponent(domain)}`, {
      params: { limit },
    });
    
    return {
      data: response.data,
      status: 'success',
    };
  } catch (error: any) {
    return {
      error: error.response?.data?.detail || 'Failed to fetch companies',
      status: 'error',
    };
  }
};

/**
 * Get available domains
 * @returns List of available domains
 */
export const getAvailableDomains = async (): Promise<ApiResponse<string[]>> => {
  try {
    const response = await api.get<{ domains: string[] }>('/api/domains');
    
    return {
      data: response.data.domains,
      status: 'success',
    };
  } catch (error: any) {
    return {
      error: error.response?.data?.detail || 'Failed to fetch domains',
      status: 'error',
    };
  }
};

/**
 * Health check
 * @returns API health status
 */
export const healthCheck = async (): Promise<ApiResponse<any>> => {
  try {
    const response = await api.get('/health');
    
    return {
      data: response.data,
      status: 'success',
    };
  } catch (error: any) {
    return {
      error: error.response?.data?.detail || 'API is not available',
      status: 'error',
    };
  }
};

export default api;
