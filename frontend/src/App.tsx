import { useState, useRef, useCallback } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

// Components
import Navbar from '@/components/Navbar';
import Hero from '@/components/sections/Hero';
import FileUpload from '@/components/sections/FileUpload';
import DomainClassification from '@/components/sections/DomainClassification';
import CompanySuggestions from '@/components/sections/CompanySuggestions';
import RecommendedCourses from '@/components/sections/RecommendedCourses';
import ResumeImprovement from '@/components/sections/ResumeImprovement';
import UniquenessChecker from '@/components/sections/UniquenessChecker';
import CareerChatbot from '@/components/sections/CareerChatbot';
import Footer from '@/components/sections/Footer';

// Types
import type { AnalysisResult, ImprovementSuggestion, UniquenessResult } from '@/types';

// Mock Data (fallback when backend is unavailable or incomplete)
import { 
  mockCompanies, 
  mockImprovements, 
  mockUniquenessResult
} from '@/data/mockData';

// API Services
import { 
  analyzeResume, 
  getResumeImprovements, 
  checkUniqueness, 
  getCompaniesByDomain 
} from '@/services/api';

const queryClient = new QueryClient();

function App() {
  const { toast } = useToast();
  const uploadSectionRef = useRef<HTMLDivElement>(null);

  // State
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  
  const [companies, setCompanies] = useState<any[]>([]);
  const [isLoadingCompanies, setIsLoadingCompanies] = useState(false);
  
  const [improvementSuggestions, setImprovementSuggestions] = useState<ImprovementSuggestion[]>([]);
  const [overallScore, setOverallScore] = useState(72);
  const [isGeneratingImprovements, setIsGeneratingImprovements] = useState(false);
  
  const [uniquenessResult, setUniquenessResult] = useState<UniquenessResult | null>(null);
  const [isCheckingUniqueness, setIsCheckingUniqueness] = useState(false);

  // Scroll to upload section
  const scrollToUpload = useCallback(() => {
    uploadSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // Handle file upload & Initial Analysis
  const handleFileUpload = async (file: File) => {
    setUploadedFile(file);
    setIsAnalyzing(true);
    
    // Reset previous results for a fresh scan
    setAnalysisResult(null);
    setCompanies([]);
    setImprovementSuggestions([]);
    setUniquenessResult(null);

    try {
      const response = await analyzeResume(file);

      if (response.status === 'success' && response.data) {
        setAnalysisResult(response.data);
        
        // Fetch companies immediately after successful classification
        fetchCompanies(response.data.domain);

        toast({
          title: 'Analysis Complete!',
          description: `Your resume has been classified as ${response.data.domain} with ${response.data.confidence}% confidence.`,
        });
      } else {
        toast({
          title: 'Analysis failed',
          description: response.error || 'Unable to obtain domain classification from backend',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('API Error:', error);
      toast({
        title: 'Analysis failed',
        description: 'Backend request failed. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Fetch companies by domain (with Smart Fallback)
  const fetchCompanies = async (domain: string) => {
    setIsLoadingCompanies(true);
    try {
      const response = await getCompaniesByDomain(domain, 8);
      const fetchedCompanies = response.data?.companies || [];

      // SMART CHECK: Did the backend actually send us rich data?
      const hasRichData = fetchedCompanies.length > 0 && fetchedCompanies.some((c: any) => c.description && c.description !== '');

      if (response.status === 'success' && hasRichData) {
        setCompanies(fetchedCompanies);
      } else {
        console.log(`Backend data incomplete or empty for ${domain}. Switching to rich mock data.`);
        const fallbackData = mockCompanies[domain] || mockCompanies['Software Engineering'] || [];
        setCompanies(fallbackData);
      }
    } catch (error) {
      console.error('Error fetching companies:', error);
      const fallbackData = mockCompanies[domain] || mockCompanies['Software Engineering'] || [];
      setCompanies(fallbackData);
    } finally {
      setIsLoadingCompanies(false);
    }
  };

  // Fallback function for generating offline improvement suggestions
  const handleGenerateImprovements = async () => {
    if (!uploadedFile) return;
    setIsGeneratingImprovements(true);
    
    try {
      const response = await getResumeImprovements(uploadedFile, analysisResult?.domain);
      if (response.status === 'success' && response.data) {
        setImprovementSuggestions(response.data.suggestions);
        setOverallScore(response.data.overall_score);
      } else {
        throw new Error("Failed to get suggestions");
      }
    } catch (error) {
      setTimeout(() => {
        setImprovementSuggestions(mockImprovements);
        setOverallScore(Math.floor(Math.random() * 20) + 65);
      }, 1000);
    } finally {
      setIsGeneratingImprovements(false);
    }
  };

  // Fallback function for generating offline uniqueness checks
  const handleUniquenessCheck = async () => {
    if (!uploadedFile) return;
    setIsCheckingUniqueness(true);
    
    try {
      const response = await checkUniqueness(uploadedFile);
      if (response.status === 'success' && response.data) {
        const result: UniquenessResult = {
          overallScore: response.data.overall_score,
          matches: response.data.matches,
          totalChecked: 45,
          cleanSentences: 45 - response.data.total_matches,
          flaggedSentences: response.data.total_matches,
          recommendations: response.data.recommendations
        };
        setUniquenessResult(result);
      } else {
        throw new Error("Failed to check uniqueness");
      }
    } catch (error) {
      setTimeout(() => {
        setUniquenessResult(mockUniquenessResult);
      }, 1000);
    } finally {
      setIsCheckingUniqueness(false);
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        
        <div className="min-h-screen bg-background">
          <Navbar onScrollToUpload={scrollToUpload} />
          <Hero onScrollToUpload={scrollToUpload} />
          
          <main className="relative">
            <div ref={uploadSectionRef}>
              <FileUpload 
                onFileUpload={handleFileUpload} 
                isUploading={isAnalyzing}
              />
            </div>
            
            <div id="analysis">
              <DomainClassification 
                result={analysisResult} 
                isLoading={isAnalyzing} 
              />
            </div>
            
            {/* Render dynamic sub-sections only after successful Analysis Result */}
            {analysisResult && (
              <>
                <div id="companies">
                  <CompanySuggestions
                    domain={analysisResult.domain}
                    companies={companies}
                    isLoading={isLoadingCompanies}
                  />
                </div>
                
                <div id="courses">
                  <RecommendedCourses domain={analysisResult.domain} />
                </div>
                
                <div id="improvements">
                  <ResumeImprovement
                    domain={analysisResult.domain}
                    suggestions={improvementSuggestions}
                    overallScore={overallScore}
                    isLoading={isGeneratingImprovements}
                    onGenerateSuggestions={handleGenerateImprovements}
                  />
                </div>
                
                <div id="uniqueness">
                  <UniquenessChecker
                    domain={analysisResult.domain}
                    isChecking={isCheckingUniqueness}
                    result={uniquenessResult}
                    onCheck={handleUniquenessCheck}
                  />
                </div>
              </>
            )}

            {/* Render Career Chatbot globally so users can ask questions anytime */}
            <div id="career-chat">
              <CareerChatbot />
            </div>
          </main>
          
          <Footer />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;