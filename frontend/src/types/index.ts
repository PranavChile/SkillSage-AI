// Analysis Types
export interface AnalysisResult {
  domain: string;
  confidence: number;
  skills: string[];
  contact_info?: Record<string, string>;
  readability?: ReadabilityScore;
  processing_time?: number;
}

export interface ReadabilityScore {
  score: number;
  grade_level: string;
  suggestions: string[];
}

// Company Types
export interface Company {
  name: string;
  logo: string;
  website: string;
  location: string;
  size: string;
  description: string;
  openRoles: number;
  remoteFriendly?: boolean;
  rating?: number;
}

export interface CompanyResponse {
  companies: Company[];
  total_count: number;
  domain: string;
}

// Course Types
export interface Course {
  id: string;
  title: string;
  platform: string;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  link: string;
  rating?: number;
  students?: string;
  image?: string;
  price?: string;
  certificate?: boolean;
}

export interface CoursesResponse {
  free: Course[];
  paid: Course[];
}

// Resume Improvement Types
export interface ImprovementSuggestion {
  category: 'skills' | 'experience' | 'format' | 'keywords';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  suggestion: string;
  impact: string;
}

export interface ImprovementResponse {
  overall_score: number;
  suggestions: ImprovementSuggestion[];
  categories_analyzed: string[];
}

// Uniqueness Check Types
export interface UniquenessMatch {
  text: string;
  similarity: number;
  source: string;
  category: 'high' | 'medium' | 'low';
}

export interface UniquenessResult {
  overallScore: number;
  matches: UniquenessMatch[];
  totalChecked: number;
  cleanSentences: number;
  flaggedSentences: number;
  recommendations?: string[];
}

export interface PlagiarismResponse {
  overall_score: number;
  matches: UniquenessMatch[];
  total_matches: number;
  recommendations: string[];
}

// API Response Types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
  status: 'success' | 'error';
}

// Domain Types
export type Domain = 
  | 'Software Engineering'
  | 'Data Science'
  | 'Marketing'
  | 'Finance'
  | 'Healthcare'
  | 'Education'
  | 'Design'
  | 'Sales'
  | 'Operations'
  | 'HR'
  | 'Legal'
  | 'Product Management'
  | 'Customer Support'
  | 'Research'
  | 'Consulting';

// Navigation Types
export interface NavItem {
  label: string;
  href: string;
  icon?: string;
}

// Stats Types
export interface DashboardStats {
  resumesAnalyzed: number;
  accuracy: number;
  companies: number;
  satisfaction: number;
}
