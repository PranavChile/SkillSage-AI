import React, { useState } from 'react';
import { Hero } from '@/components/Hero';
import { FileUpload } from '@/components/FileUpload';
import { DomainClassification } from '@/components/DomainClassification';
import { CompanySuggestions } from '@/components/CompanySuggestions';
import { ResumeImprovement } from '@/components/ResumeImprovement';
import { UniquenessChecker } from '@/components/UniquenessChecker';

import { mockCompanies, mockImprovements, mockUniquenessResult } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';

// Mock API function (replace with real API call)
const simulateAnalysis = (file: File): Promise<{ domain: string; confidence: number; skills: string[] }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const filename = file.name.toLowerCase();
      let domain = 'Software Engineering';
      let skills = ['JavaScript', 'React', 'Node.js', 'MongoDB'];

      if (filename.includes('data') || filename.includes('analyst')) {
        domain = 'Data Science';
        skills = ['Python', 'Machine Learning', 'SQL', 'TensorFlow'];
      } else if (filename.includes('marketing')) {
        domain = 'Marketing';
        skills = ['Digital Marketing', 'SEO', 'Google Analytics', 'Content Strategy'];
      } else if (filename.includes('finance')) {
        domain = 'Finance';
        skills = ['Financial Analysis', 'Excel', 'Bloomberg', 'Risk Management'];
      }

      resolve({
        domain,
        confidence: Math.floor(Math.random() * 20) + 80,
        skills,
      });
    }, 3000);
  });
};

const Index = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<{
    domain: string;
    confidence: number;
    skills: string[];
  } | null>(null);
  const [improvementSuggestions, setImprovementSuggestions] = useState<any[]>([]);
  const [isGeneratingImprovements, setIsGeneratingImprovements] = useState(false);
  const [uniquenessResult, setUniquenessResult] = useState<any>(null);
  const [isCheckingUniqueness, setIsCheckingUniqueness] = useState(false);

  const { toast } = useToast();

  const handleFileUpload = async (file: File) => {
    setUploadedFile(file);
    setIsAnalyzing(true);
    setAnalysisResult(null);

    try {
      const result = await simulateAnalysis(file);
      setAnalysisResult(result);
      toast({
        title: 'Analysis Complete!',
        description: `Your resume has been classified as ${result.domain} with ${result.confidence}% confidence.`,
      });
    } catch (error) {
      toast({
        title: 'Analysis Failed',
        description: 'There was an error analyzing your resume. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGenerateImprovements = () => {
    setIsGeneratingImprovements(true);
    setTimeout(() => {
      setImprovementSuggestions(mockImprovements);
      setIsGeneratingImprovements(false);
      toast({
        title: 'Suggestions Generated!',
        description: 'AI has analyzed your resume and provided improvement suggestions.',
      });
    }, 2000);
  };

  const handleUniquenessCheck = () => {
    setIsCheckingUniqueness(true);
    setTimeout(() => {
      setUniquenessResult(mockUniquenessResult);
      setIsCheckingUniqueness(false);
      toast({
        title: 'Uniqueness Check Complete!',
        description: `Your resume has ${mockUniquenessResult.overallScore}% similarity with existing content.`,
      });
    }, 3000);
  };

  const getCompaniesForDomain = (domain: string) => {
    return mockCompanies[domain as keyof typeof mockCompanies] || [];
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <Hero />

      <main className="container mx-auto px-4 py-16 space-y-16">
        {/* Upload Section */}
        <section id="upload-section" className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Upload Your Resume
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Start your career analysis by uploading your resume. Our AI will analyze it and provide comprehensive insights.
            </p>
          </div>
          <FileUpload onFileUpload={handleFileUpload} isUploading={isAnalyzing} />
        </section>

        {/* Analysis Results */}
        {(isAnalyzing || analysisResult) && (
          <section className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Analysis Results
              </h2>
            </div>
            <DomainClassification
              domain={analysisResult?.domain || ''}
              confidence={analysisResult?.confidence || 0}
              skills={analysisResult?.skills || []}
              isLoading={isAnalyzing}
            />
          </section>
        )}

        {/* Company Suggestions */}
        {analysisResult && (
          <section className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Company Suggestions
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Based on your domain classification, here are companies that actively hire in your field.
              </p>
            </div>
            <CompanySuggestions
              domain={analysisResult.domain}
              companies={getCompaniesForDomain(analysisResult.domain)}
            />
          </section>
        )}

        {/* Resume Improvement */}
        {analysisResult && (
          <section className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Resume Improvement
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Get AI-powered suggestions to enhance your resume and increase your chances of getting hired.
              </p>
            </div>
            <ResumeImprovement
              suggestions={improvementSuggestions}
              overallScore={Math.floor(Math.random() * 30) + 65}
              isLoading={isGeneratingImprovements}
              onGenerateSuggestions={handleGenerateImprovements}
            />
          </section>
        )}

        {/* Uniqueness Checker */}
        {analysisResult && (
          <section className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Uniqueness Check
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Ensure your resume content is original and stands out from the crowd.
              </p>
            </div>
            <UniquenessChecker
              isChecking={isCheckingUniqueness}
              result={uniquenessResult}
              onCheck={handleUniquenessCheck}
            />
          </section>
        )}
      </main>

      <footer className="bg-card border-t border-border py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-foreground">Ready to Boost Your Career?</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Join thousands of professionals who have improved their resumes with our AI-powered analysis.
            </p>
            <div className="flex justify-center space-x-6 text-sm text-muted-foreground">
              <span>✨ AI-Powered Analysis</span>
              <span>🔒 Secure & Private</span>
              <span>⚡ Instant Results</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
