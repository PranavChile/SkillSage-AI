import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Search, 
  Eye, 
  EyeOff,
  FileText,
  Sparkles,
  RefreshCw,
  Info
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { UniquenessResult } from '@/types';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface UniquenessCheckerProps {
  isChecking?: boolean;
  result?: UniquenessResult | null;
  onCheck: () => void;
}

export const UniquenessChecker = ({
  isChecking = false,
  result,
  onCheck,
}: UniquenessCheckerProps) => {
  const [showDetails, setShowDetails] = useState(false);
  const [animatedScore, setAnimatedScore] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const gaugeRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const triggersRef = useRef<ScrollTrigger[]>([]);

  // Animate score on result change
  useEffect(() => {
    if (result) {
      const duration = 1200;
      const steps = 40;
      const targetScore = result.overallScore;
      const increment = targetScore / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= targetScore) {
          setAnimatedScore(targetScore);
          clearInterval(timer);
        } else {
          setAnimatedScore(Math.floor(current));
        }
      }, duration / steps);

      return () => clearInterval(timer);
    }
  }, [result]);

  // Animate on scroll
  useEffect(() => {
    if (result) {
      const ctx = gsap.context(() => {
        if (gaugeRef.current) {
          gsap.set(gaugeRef.current, { opacity: 0, scale: 0.9 });
          const trigger = ScrollTrigger.create({
            trigger: gaugeRef.current,
            start: 'top 80%',
            onEnter: () => {
              gsap.to(gaugeRef.current, {
                opacity: 1,
                scale: 1,
                duration: 0.6,
                ease: 'expo.out',
              });
            },
            once: true,
          });
          triggersRef.current.push(trigger);
        }

        if (statsRef.current) {
          const stats = statsRef.current.children;
          gsap.set(stats, { opacity: 0, y: 20 });
          const trigger = ScrollTrigger.create({
            trigger: statsRef.current,
            start: 'top 85%',
            onEnter: () => {
              gsap.to(stats, {
                opacity: 1,
                y: 0,
                duration: 0.5,
                stagger: 0.1,
                ease: 'expo.out',
              });
            },
            once: true,
          });
          triggersRef.current.push(trigger);
        }
      }, sectionRef);

      return () => {
        triggersRef.current.forEach(trigger => trigger.kill());
        triggersRef.current = [];
        ctx.revert();
      };
    }
  }, [result]);

  const getScoreColor = (score: number) => {
    if (score < 20) return 'text-green-500';
    if (score < 50) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreLabel = (score: number) => {
    if (score < 20) return 'Original Content';
    if (score < 50) return 'Some Similarities';
    return 'High Similarity';
  };

  const getScoreDescription = (score: number) => {
    if (score < 20) return 'Your resume content is highly original and unique.';
    if (score < 50) return 'Some phrases in your resume are similar to common templates.';
    return 'Significant portions of your resume match existing content.';
  };

  const getMatchColor = (category: string) => {
    switch (category) {
      case 'high':
        return 'border-l-red-500 bg-red-50/50 dark:bg-red-950/20';
      case 'medium':
        return 'border-l-yellow-500 bg-yellow-50/50 dark:bg-yellow-950/20';
      case 'low':
        return 'border-l-green-500 bg-green-50/50 dark:bg-green-950/20';
      default:
        return 'border-l-muted bg-muted/30';
    }
  };

  const getMatchIcon = (category: string) => {
    switch (category) {
      case 'high':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'medium':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'low':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <CheckCircle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getMatchBadge = (category: string) => {
    switch (category) {
      case 'high':
        return 'bg-red-500/10 text-red-600';
      case 'medium':
        return 'bg-yellow-500/10 text-yellow-600';
      case 'low':
        return 'bg-green-500/10 text-green-600';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  if (isChecking) {
    return (
      <section ref={sectionRef} className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <Card className="border-border/50">
            <CardContent className="p-12">
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="relative">
                  <Shield className="h-12 w-12 text-primary animate-pulse" />
                  <div className="absolute inset-0 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
                </div>
                <div className="text-center space-y-2">
                  <h3 className="text-lg font-semibold">Checking for Uniqueness...</h3>
                  <p className="text-sm text-muted-foreground">
                    Analyzing your resume content using AI
                  </p>
                </div>
                <div className="w-full max-w-md">
                  <Progress value={65} className="h-2" />
                </div>
                <p className="text-xs text-muted-foreground">This may take a few moments</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 rounded-full mb-4">
            <Shield className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium text-blue-600">Content Verification</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
            Uniqueness Check
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Ensure your resume content is original and stands out from the crowd
          </p>
        </div>

        {!result ? (
          <Card className="border-border/50">
            <CardContent className="p-12 text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                <Shield className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Uniqueness Check Ready</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Click the button below to analyze your resume for original content and 
                check for similarities with existing templates
              </p>
              <Button onClick={onCheck} size="lg" className="group">
                <Search className="mr-2 h-4 w-4" />
                Check Uniqueness
              </Button>

              {/* Features */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-10">
                <div className="p-4 bg-muted rounded-xl">
                  <Sparkles className="h-6 w-6 text-primary mx-auto mb-2" />
                  <div className="font-medium text-sm">AI-Powered</div>
                  <div className="text-xs text-muted-foreground">Advanced similarity detection</div>
                </div>
                <div className="p-4 bg-muted rounded-xl">
                  <Search className="h-6 w-6 text-primary mx-auto mb-2" />
                  <div className="font-medium text-sm">Comprehensive</div>
                  <div className="text-xs text-muted-foreground">Checks multiple sources</div>
                </div>
                <div className="p-4 bg-muted rounded-xl">
                  <Shield className="h-6 w-6 text-primary mx-auto mb-2" />
                  <div className="font-medium text-sm">Secure</div>
                  <div className="text-xs text-muted-foreground">Your data remains private</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Score Card */}
            <Card ref={gaugeRef} className="mb-6 border-border/50 overflow-hidden">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  {/* Circular Score */}
                  <div className="relative flex-shrink-0">
                    <svg className="w-48 h-48 transform -rotate-90">
                      <circle
                        cx="96"
                        cy="96"
                        r="80"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="16"
                        className="text-muted/30"
                      />
                      <circle
                        cx="96"
                        cy="96"
                        r="80"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="16"
                        strokeLinecap="round"
                        strokeDasharray={`${(animatedScore / 100) * 502} 502`}
                        className={`${getScoreColor(result.overallScore)} transition-all duration-1000`}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className={`text-5xl font-bold ${getScoreColor(result.overallScore)}`}>
                        {animatedScore}%
                      </span>
                      <span className="text-sm text-muted-foreground mt-1">Similarity</span>
                    </div>
                  </div>

                  {/* Score Details */}
                  <div className="flex-1 text-center md:text-left">
                    <h3 className={`text-2xl font-bold mb-2 ${getScoreColor(result.overallScore)}`}>
                      {getScoreLabel(result.overallScore)}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {getScoreDescription(result.overallScore)}
                    </p>
                    
                    {/* Recommendation Alert */}
                    {result.overallScore > 20 && (
                      <Alert className={result.overallScore > 50 ? 'border-red-500/50 bg-red-50/50' : 'border-yellow-500/50 bg-yellow-50/50'}>
                        <AlertTriangle className={`h-4 w-4 ${result.overallScore > 50 ? 'text-red-500' : 'text-yellow-500'}`} />
                        <AlertDescription>
                          {result.overallScore > 50
                            ? 'High similarity detected. Consider rewriting highlighted sections to improve originality.'
                            : 'Some similarities found. Review the flagged content and consider rephrasing.'}
                        </AlertDescription>
                      </Alert>
                    )}

                    {/* Recheck Button */}
                    <Button
                      variant="outline"
                      onClick={onCheck}
                      className="mt-4"
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Check Again
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Statistics Grid */}
            <div ref={statsRef} className="grid grid-cols-3 gap-4 mb-6">
              <Card className="border-border/50">
                <CardContent className="p-4 text-center">
                  <FileText className="h-6 w-6 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold">{result.totalChecked}</div>
                  <div className="text-sm text-muted-foreground">Sentences Checked</div>
                </CardContent>
              </Card>
              <Card className="border-border/50">
                <CardContent className="p-4 text-center">
                  <CheckCircle className="h-6 w-6 text-green-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-600">{result.cleanSentences}</div>
                  <div className="text-sm text-muted-foreground">Original Content</div>
                </CardContent>
              </Card>
              <Card className="border-border/50">
                <CardContent className="p-4 text-center">
                  <AlertTriangle className="h-6 w-6 text-yellow-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-yellow-600">{result.flaggedSentences}</div>
                  <div className="text-sm text-muted-foreground">Similar Content</div>
                </CardContent>
              </Card>
            </div>

            {/* Recommendations */}
            {result.recommendations && result.recommendations.length > 0 && (
              <Card className="mb-6 border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Info className="h-5 w-5 text-primary" />
                    Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {result.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Detailed Matches */}
            {result.matches.length > 0 && (
              <Card className="border-border/50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Search className="h-5 w-5 text-primary" />
                      Detailed Analysis
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowDetails(!showDetails)}
                    >
                      {showDetails ? (
                        <>
                          <EyeOff className="h-4 w-4 mr-2" />
                          Hide Details
                        </>
                      ) : (
                        <>
                          <Eye className="h-4 w-4 mr-2" />
                          Show Details
                        </>
                      )}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {showDetails && (
                    <div className="space-y-3">
                      {result.matches.map((match, index) => (
                        <Card
                          key={index}
                          className={`border-l-4 ${getMatchColor(match.category)}`}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              <div className="flex-shrink-0 mt-1">
                                {getMatchIcon(match.category)}
                              </div>
                              <div className="flex-1 space-y-2">
                                <div className="flex flex-wrap items-center gap-2">
                                  <Badge variant="outline" className="text-xs">
                                    {match.similarity}% similarity
                                  </Badge>
                                  <Badge className={`text-xs ${getMatchBadge(match.category)}`}>
                                    {match.category} risk
                                  </Badge>
                                </div>
                                <blockquote className="text-sm italic text-muted-foreground border-l-2 border-muted pl-3">
                                  &ldquo;{match.text}&rdquo;
                                </blockquote>
                                <p className="text-xs text-muted-foreground">
                                  <span className="font-medium">Similar to:</span> {match.source}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default UniquenessChecker;
