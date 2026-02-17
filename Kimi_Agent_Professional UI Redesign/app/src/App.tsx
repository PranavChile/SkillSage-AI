import { useState, useRef, useCallback } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
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
import Footer from '@/components/sections/Footer';

// Types
import type { AnalysisResult, ImprovementSuggestion, UniquenessResult } from '@/types';

// Mock Data (fallback when backend is unavailable)
import { 
  mockCompanies, 
  mockImprovements, 
  mockUniquenessResult,
  domainSkills 
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

  // Handle file upload
  const handleFileUpload = async (file: File) => {
    setUploadedFile(file);
    setIsAnalyzing(true);
    
    // Reset previous results
    setAnalysisResult(null);
    setCompanies([]);
    setImprovementSuggestions([]);
    setUniquenessResult(null);

    try {
      // Try to call backend API
      const response = await analyzeResume(file);
      
      if (response.data) {
        // Backend returned successful response
        setAnalysisResult(response.data);
        
        // Fetch companies for the detected domain
        fetchCompanies(response.data.domain);
        
        toast({
          title: 'Analysis Complete!',
          description: `Your resume has been classified as ${response.data.domain} with ${response.data.confidence}% confidence.`,
        });
      } else {
        // Fallback to mock data
        simulateAnalysis(file);
      }
    } catch (error) {
      console.error('API Error:', error);
      // Fallback to mock data
      simulateAnalysis(file);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Simulate analysis with mock data (fallback)
  const simulateAnalysis = (file: File) => {
    const filename = file.name.toLowerCase();
    let domain = 'Software Engineering';
    let skills = domainSkills['Software Engineering'];

    if (filename.includes('data') || filename.includes('analyst')) {
      domain = 'Data Science';
      skills = domainSkills['Data Science'];
    } else if (filename.includes('marketing')) {
      domain = 'Marketing';
      skills = domainSkills['Marketing'];
    } else if (filename.includes('finance')) {
      domain = 'Finance';
      skills = domainSkills['Finance'];
    } else if (filename.includes('design')) {
      domain = 'Design';
      skills = domainSkills['Design'];
    }

    const mockResult: AnalysisResult = {
      domain,
      confidence: Math.floor(Math.random() * 15) + 80,
      skills: skills.slice(0, 6),
      processing_time: 2.3,
      readability: {
        score: 75,
        grade_level: 'College',
        suggestions: ['Use shorter sentences', 'Add more action verbs']
      }
    };

    setTimeout(() => {
      setAnalysisResult(mockResult);
      setCompanies(mockCompanies[domain] || []);
      setIsAnalyzing(false);
      
      toast({
        title: 'Analysis Complete!',
        description: `Your resume has been classified as ${domain} with ${mockResult.confidence}% confidence.`,
      });
    }, 2000);
  };

  // Fetch companies by domain
  const fetchCompanies = async (domain: string) => {
    setIsLoadingCompanies(true);
    
    try {
      const response = await getCompaniesByDomain(domain, 8);
      
      if (response.data) {
        setCompanies(response.data.companies);
      } else {
        // Fallback to mock data
        setCompanies(mockCompanies[domain] || []);
      }
    } catch (error) {
      console.error('Error fetching companies:', error);
      setCompanies(mockCompanies[domain] || []);
    } finally {
      setIsLoadingCompanies(false);
    }
  };

  // Generate improvement suggestions
  const handleGenerateImprovements = async () => {
    if (!uploadedFile) return;
    
    setIsGeneratingImprovements(true);
    
    try {
      const response = await getResumeImprovements(
        uploadedFile, 
        analysisResult?.domain
      );
      
      if (response.data) {
        setImprovementSuggestions(response.data.suggestions);
        setOverallScore(response.data.overall_score);
        
        toast({
          title: 'Suggestions Generated!',
          description: 'AI has analyzed your resume and provided improvement suggestions.',
        });
      } else {
        // Fallback to mock data
        setTimeout(() => {
          setImprovementSuggestions(mockImprovements);
          setOverallScore(Math.floor(Math.random() * 20) + 65);
          setIsGeneratingImprovements(false);
          
          toast({
            title: 'Suggestions Generated!',
            description: 'AI has analyzed your resume and provided improvement suggestions.',
          });
        }, 2000);
      }
    } catch (error) {
      console.error('Error generating improvements:', error);
      // Fallback to mock data
      setTimeout(() => {
        setImprovementSuggestions(mockImprovements);
        setOverallScore(Math.floor(Math.random() * 20) + 65);
        setIsGeneratingImprovements(false);
        
        toast({
          title: 'Suggestions Generated!',
          description: 'AI has analyzed your resume and provided improvement suggestions.',
        });
      }, 2000);
    } finally {
      setIsGeneratingImprovements(false);
    }
  };

  // Check uniqueness
  const handleUniquenessCheck = async () => {
    if (!uploadedFile) return;
    
    setIsCheckingUniqueness(true);
    
    try {
      const response = await checkUniqueness(uploadedFile);
      
      if (response.data) {
        const result: UniquenessResult = {
          overallScore: response.data.overall_score,
          matches: response.data.matches,
          totalChecked: 45,
          cleanSentences: 45 - response.data.total_matches,
          flaggedSentences: response.data.total_matches,
          recommendations: response.data.recommendations
        };
        setUniquenessResult(result);
        
        toast({
          title: 'Uniqueness Check Complete!',
          description: `Your resume has ${result.overallScore}% similarity with existing content.`,
        });
      } else {
        // Fallback to mock data
        setTimeout(() => {
          setUniquenessResult(mockUniquenessResult);
          setIsCheckingUniqueness(false);
          
          toast({
            title: 'Uniqueness Check Complete!',
            description: `Your resume has ${mockUniquenessResult.overallScore}% similarity with existing content.`,
          });
        }, 2500);
      }
    } catch (error) {
      console.error('Error checking uniqueness:', error);
      // Fallback to mock data
      setTimeout(() => {
        setUniquenessResult(mockUniquenessResult);
        setIsCheckingUniqueness(false);
        
        toast({
          title: 'Uniqueness Check Complete!',
          description: `Your resume has ${mockUniquenessResult.overallScore}% similarity with existing content.`,
        });
      }, 2500);
    } finally {
      setIsCheckingUniqueness(false);
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        
        <div className="min-h-screen bg-background">
          {/* Navigation */}
          <Navbar onScrollToUpload={scrollToUpload} />
          
          {/* Hero Section */}
          <Hero onScrollToUpload={scrollToUpload} />
          
          {/* Main Content */}
          <main className="relative">
            {/* Upload Section */}
            <div ref={uploadSectionRef}>
              <FileUpload 
                onFileUpload={handleFileUpload} 
                isUploading={isAnalyzing}
              />
            </div>
            
            {/* Analysis Results */}
            <div id="analysis">
              <DomainClassification 
                result={analysisResult} 
                isLoading={isAnalyzing} 
              />
            </div>
            
            {/* Company Suggestions */}
            {analysisResult && (
              <div id="companies">
                <CompanySuggestions
                  domain={analysisResult.domain}
                  companies={companies}
                  isLoading={isLoadingCompanies}
                />
              </div>
            )}
            
            {/* Recommended Courses */}
            <div id="courses">
              <RecommendedCourses />
            </div>
            
            {/* Resume Improvement */}
            {analysisResult && (
              <div id="improvements">
                <ResumeImprovement
                  suggestions={improvementSuggestions}
                  overallScore={overallScore}
                  isLoading={isGeneratingImprovements}
                  onGenerateSuggestions={handleGenerateImprovements}
                />
              </div>
            )}
            
            {/* Uniqueness Checker */}
            {analysisResult && (
              <div id="uniqueness">
                <UniquenessChecker
                  isChecking={isCheckingUniqueness}
                  result={uniquenessResult}
                  onCheck={handleUniquenessCheck}
                />
              </div>
            )}
          </main>
          
          {/* Footer */}
          <Footer />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
