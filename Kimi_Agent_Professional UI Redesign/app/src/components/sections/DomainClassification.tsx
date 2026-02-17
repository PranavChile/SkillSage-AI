import { useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Brain, Target, Sparkles, Clock, TrendingUp, CheckCircle } from 'lucide-react';
import type { AnalysisResult } from '@/types';
import { domainIcons } from '@/data/mockData';
import gsap from 'gsap';

interface DomainClassificationProps {
  result: AnalysisResult | null;
  isLoading?: boolean;
}

export const DomainClassification = ({
  result,
  isLoading = false,
}: DomainClassificationProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const skillsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isLoading && result && cardRef.current) {
      const ctx = gsap.context(() => {
        gsap.from(cardRef.current, {
          opacity: 0,
          y: 40,
          scale: 0.95,
          duration: 0.7,
          ease: 'expo.out',
        });

        if (skillsRef.current) {
          gsap.from(skillsRef.current.children, {
            opacity: 0,
            y: 20,
            scale: 0.8,
            duration: 0.4,
            stagger: 0.05,
            ease: 'expo.out',
            delay: 0.3,
          });
        }
      }, sectionRef);

      return () => ctx.revert();
    }
  }, [isLoading, result]);

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-500';
    if (confidence >= 60) return 'text-yellow-500';
    return 'text-orange-500';
  };

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 80) return 'High Confidence';
    if (confidence >= 60) return 'Medium Confidence';
    return 'Low Confidence';
  };

  if (isLoading) {
    return (
      <section ref={sectionRef} className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Card className="border-border/50 shadow-medium">
            <CardContent className="p-12">
              <div className="flex flex-col items-center justify-center space-y-6">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                    <Brain className="h-10 w-10 text-primary animate-pulse" />
                  </div>
                  <div className="absolute inset-0 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
                </div>
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-semibold">Analyzing Your Resume...</h3>
                  <p className="text-muted-foreground">
                    Our AI is classifying your professional domain and extracting skills
                  </p>
                </div>
                <div className="w-full max-w-md space-y-2">
                  <Progress value={65} className="h-2" />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Processing</span>
                    <span>Almost there...</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  if (!result) return null;

  const icon = domainIcons[result.domain] || '🎯';

  return (
    <section ref={sectionRef} className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Analysis Complete</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
            Analysis Results
          </h2>
          <p className="text-muted-foreground">
            Here&apos;s what our AI found in your resume
          </p>
        </div>

        <Card ref={cardRef} className="border-border/50 shadow-medium overflow-hidden">
          <CardContent className="p-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Left Column - Domain & Confidence */}
              <div className="space-y-6">
                {/* Domain Badge */}
                <div className="text-center md:text-left">
                  <p className="text-sm text-muted-foreground mb-3">Identified Domain</p>
                  <div className="inline-flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl border border-primary/20">
                    <span className="text-4xl">{icon}</span>
                    <div>
                      <h3 className="text-xl font-bold text-foreground">{result.domain}</h3>
                      <p className="text-sm text-muted-foreground">Professional Category</p>
                    </div>
                  </div>
                </div>

                {/* Confidence Score */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">Confidence Score</span>
                    <span className={`text-sm font-bold ${getConfidenceColor(result.confidence)}`}>
                      {getConfidenceLabel(result.confidence)}
                    </span>
                  </div>
                  <div className="relative">
                    <Progress 
                      value={result.confidence} 
                      className="h-4"
                    />
                    <div 
                      className="absolute top-0 left-0 h-4 rounded-full bg-gradient-to-r opacity-20"
                      style={{ width: `${result.confidence}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">AI Confidence</span>
                    <span className={`font-bold text-lg ${getConfidenceColor(result.confidence)}`}>
                      {result.confidence}%
                    </span>
                  </div>
                </div>

                {/* Processing Info */}
                {result.processing_time && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>Analysis completed in {result.processing_time.toFixed(1)} seconds</span>
                  </div>
                )}
              </div>

              {/* Right Column - Skills */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  <h4 className="font-semibold">Skills Identified</h4>
                  <Badge variant="secondary" className="ml-auto">
                    {result.skills.length} skills
                  </Badge>
                </div>

                <div ref={skillsRef} className="flex flex-wrap gap-2">
                  {result.skills.map((skill, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="px-3 py-1.5 text-sm bg-primary/10 text-primary hover:bg-primary/20 transition-colors cursor-default"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>

                {/* Readability Score (if available) */}
                {result.readability && (
                  <div className="mt-6 p-4 bg-muted/50 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Readability Score</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-2xl font-bold">{result.readability.score}/100</div>
                      <div className="text-sm text-muted-foreground">
                        Grade Level: {result.readability.grade_level}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Success Message */}
        <div className="mt-6 flex items-center justify-center gap-2 text-sm text-green-600">
          <CheckCircle className="w-4 h-4" />
          <span>Analysis successful! Scroll down to see company suggestions and improvements.</span>
        </div>
      </div>
    </section>
  );
};

export default DomainClassification;
