import { useEffect, useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Target, Sparkles, BrainCircuit, CheckCircle2, Code2 } from 'lucide-react';
import type { AnalysisResult } from '@/types';
import gsap from 'gsap';

// Use Omit to safely handle the skills array
interface ExtendedAnalysisResult extends Omit<AnalysisResult, 'skills'> {
  skills?: string[] | { name: string; score?: number }[];
}

interface DomainClassificationProps {
  result: ExtendedAnalysisResult | null;
  isLoading?: boolean;
}

export default function DomainClassification({ result, isLoading = false }: DomainClassificationProps) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const scoreRef = useRef<HTMLDivElement>(null);
  const skillsRef = useRef<HTMLDivElement>(null);

  // Helper to safely format skills to just get their names
  const getDisplaySkills = (domain: string, backendSkills?: string[] | { name: string; score?: number }[]) => {
    // 1. If backend already sends objects, use them directly
    if (backendSkills && backendSkills.length > 0 && typeof backendSkills[0] !== 'string') {
      return backendSkills as { name: string }[];
    }
    
    // 2. If backend sends simple strings, map them into objects
    if (backendSkills && backendSkills.length > 0 && typeof backendSkills[0] === 'string') {
      return (backendSkills as string[]).map((skill) => ({
        name: skill
      }));
    }
    
    // 3. Fallback mock data if backend sends no skills at all
    const lower = domain.toLowerCase();
    if (lower.includes('software') || lower.includes('developer') || lower.includes('frontend') || lower.includes('backend')) {
      return [
        { name: 'JavaScript / TypeScript' },
        { name: 'React / Frontend' },
        { name: 'API Development' },
        { name: 'System Architecture' }
      ];
    }
    if (lower.includes('data')) {
      return [
        { name: 'Python' },
        { name: 'SQL & Databases' },
        { name: 'Machine Learning' },
        { name: 'Data Visualization' }
      ];
    }
    return [
      { name: 'Core Industry Knowledge' },
      { name: 'Technical Tools' },
      { name: 'Problem Solving' },
      { name: 'Project Management' }
    ];
  };

  const displaySkills = result ? getDisplaySkills(result.domain, result.skills) : [];

  // Animate the overall score counting up
  useEffect(() => {
    if (result && result.confidence > 0) {
      const targetScore = result.confidence;
      const duration = 1500;
      const steps = 60;
      const increment = targetScore / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= targetScore) {
          setAnimatedScore(Math.round(targetScore));
          clearInterval(timer);
        } else {
          setAnimatedScore(Math.floor(current));
        }
      }, duration / steps);

      return () => clearInterval(timer);
    }
  }, [result]);

  // Entrance animations
  useEffect(() => {
    if (result && containerRef.current) {
      const ctx = gsap.context(() => {
        gsap.fromTo(
          containerRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
        );

        if (skillsRef.current) {
          gsap.fromTo(
            skillsRef.current.children,
            { opacity: 0, scale: 0.95, y: 10 },
            { opacity: 1, scale: 1, y: 0, duration: 0.4, stagger: 0.05, delay: 0.3, ease: 'back.out(1.5)' }
          );
        }
      }, containerRef);

      return () => ctx.revert();
    }
  }, [result]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getStrokeColor = (score: number) => {
    if (score >= 80) return 'stroke-green-500';
    if (score >= 60) return 'stroke-yellow-500';
    return 'stroke-red-500';
  };

  if (isLoading) {
    return (
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-12 flex flex-col items-center justify-center space-y-6">
              <div className="relative">
                <BrainCircuit className="w-16 h-16 text-primary animate-pulse" />
                <div className="absolute inset-0 border-t-2 border-primary rounded-full animate-spin" />
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-xl font-semibold">Analyzing Skills & Experience...</h3>
                <p className="text-muted-foreground">Extracting keywords to determine your ideal career domain</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  if (!result) return null;

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8" ref={containerRef}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
            <Target className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Domain Detection</span>
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-3">Resume Analysis Complete</h2>
          <p className="text-muted-foreground">Based on your skills, here is your primary career trajectory.</p>
        </div>

        <Card className="border-border/50 overflow-hidden shadow-lg relative">
          <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
          
          <CardContent className="p-8 md:p-10">
            {/* Top Section: Domain & Overall Score */}
            <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
              
              {/* Left Side: Domain Result */}
              <div className="flex-1 text-center md:text-left space-y-4">
                <p className="text-sm font-medium text-muted-foreground tracking-wider uppercase">
                  Predicted Role Domain
                </p>
                <div className="flex items-center justify-center md:justify-start gap-3">
                  <h3 className="text-4xl md:text-5xl font-extrabold text-foreground bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                    {result.domain}
                  </h3>
                  <Sparkles className="w-8 h-8 text-yellow-500 animate-pulse hidden sm:block" />
                </div>
                <p className="text-lg text-muted-foreground mt-2">
                  We've successfully mapped your resume to this industry based on your core technical and soft skills.
                </p>
                
                <div className="pt-4 flex flex-wrap gap-2 justify-center md:justify-start">
                  <Badge variant="secondary" className="flex items-center gap-1.5 px-3 py-1 bg-green-500/10 text-green-600 hover:bg-green-500/20">
                    <CheckCircle2 className="w-3.5 h-3.5" /> High Alignment
                  </Badge>
                  <Badge variant="secondary" className="flex items-center gap-1.5 px-3 py-1">
                    <Code2 className="w-3.5 h-3.5 text-primary" /> {displaySkills.length} Core Skills Found
                  </Badge>
                </div>
              </div>

              {/* Right Side: Single Overall Match Score */}
              <div className="flex flex-col items-center flex-shrink-0" ref={scoreRef}>
                <div className="relative w-48 h-48 flex items-center justify-center">
                  <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                    <circle
                      cx="96" cy="96" r="84"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="12"
                      className="text-muted/20"
                    />
                    <circle
                      cx="96" cy="96" r="84"
                      fill="none"
                      strokeWidth="12"
                      strokeLinecap="round"
                      strokeDasharray={`${(animatedScore / 100) * 527.7} 527.7`}
                      className={`${getStrokeColor(animatedScore)} transition-all duration-1000 ease-out`}
                    />
                  </svg>
                  
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={`text-5xl font-black ${getScoreColor(animatedScore)} tracking-tighter`}>
                      {animatedScore}%
                    </span>
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">
                      Match
                    </span>
                  </div>
                </div>

                <div className="text-center mt-4 space-y-1">
                  <h4 className="font-semibold text-foreground flex items-center justify-center gap-2">
                    Overall Fit Score
                  </h4>
                  <p className="text-sm text-muted-foreground max-w-[200px]">
                    How well your current profile aligns with {result.domain}.
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Section: Individual Skills Breakdown (NAMES ONLY) */}
            <div className="mt-12 pt-8 border-t border-border/50">
              <h4 className="text-lg font-bold mb-6 flex items-center gap-2">
                <BrainCircuit className="w-5 h-5 text-primary" />
                Detected Core Skills
              </h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" ref={skillsRef}>
                {displaySkills.map((skill, index) => (
                  <div 
                    key={index} 
                    className="flex items-center gap-3 p-3.5 rounded-xl bg-muted/30 border border-border/50 hover:bg-muted/50 hover:border-primary/30 transition-all duration-300"
                  >
                    <div className="bg-green-500/10 p-1.5 rounded-full flex-shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    </div>
                    <span className="font-medium text-foreground">{skill.name}</span>
                  </div>
                ))}
              </div>
            </div>

          </CardContent>
        </Card>
      </div>
    </section>
  );
}