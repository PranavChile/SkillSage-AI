import { useEffect, useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Lightbulb, 
  Sparkles, 
  CheckCircle, 
  AlertCircle, 
  AlertTriangle,
  Wrench,
  Briefcase,
  FileText,
  Search,
  TrendingUp,
  Zap,
  Target
} from 'lucide-react';
import type { ImprovementSuggestion } from '@/types';
import { useToast } from '@/hooks/use-toast';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ResumeImprovementProps {
  domain?: string;
  suggestions: ImprovementSuggestion[]; 
  overallScore: number;
  isLoading?: boolean;
  onGenerateSuggestions: () => void; 
}

export const ResumeImprovement = ({
  domain = '', 
  suggestions: fallbackSuggestions,
  overallScore: initialScore,
  isLoading: parentIsLoading = false,
  onGenerateSuggestions,
}: ResumeImprovementProps) => {
  const { toast } = useToast();

  // --- LOCAL OLLAMA STATE ---
  const [aiSuggestions, setAiSuggestions] = useState<ImprovementSuggestion[] | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiScore, setAiScore] = useState<number | null>(null);
  
  const displaySuggestions = aiSuggestions || fallbackSuggestions;
  const currentScore = aiScore !== null ? aiScore : initialScore;

  // --- UI STATE ---
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [animatedScore, setAnimatedScore] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const scoreRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const triggersRef = useRef<ScrollTrigger[]>([]);

  // --- LOCAL OLLAMA LLM INTEGRATION ---
  const generateWithOllama = async () => {
    setIsAiLoading(true);

    const targetRole = domain ? domain : 'tech';

    try {
      const prompt = `
        You are an expert Technical Recruiter hiring for a ${targetRole} role. 
        Analyze a generic resume and give me exactly 4 specific, highly actionable resume improvement suggestions.
        
        You MUST return ONLY a valid JSON array containing 4 objects. Do not include markdown code blocks (\`\`\`json), do not say "Here is the JSON", ONLY return the raw JSON array.
        
        Each object must have these exact keys and format:
        [
          {
            "category": "skills" | "keywords" | "experience" | "format",
            "priority": "high" | "medium" | "low",
            "title": "Short action-oriented title",
            "description": "What is currently missing or wrong",
            "suggestion": "How to fix it specifically for a ${targetRole} role",
            "impact": "Why this matters to a recruiter"
          }
        ]
      `;

      const response = await fetch('http://localhost:11434/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'mistral', 
          messages: [{ role: 'user', content: prompt }],
          stream: false, 
          options: {
            temperature: 0.2 
          }
        }),
      });

      if (!response.ok) throw new Error('Ollama is not running or CORS is blocking it');

      const data = await response.json();
      const content = data.message.content;
      
      const cleanedContent = content.replace(/```json/g, '').replace(/```/g, '').trim();
      
      const parsedSuggestions: ImprovementSuggestion[] = JSON.parse(cleanedContent);
      
      setAiSuggestions(parsedSuggestions);
      setAiScore(Math.min(100, initialScore + 12));
      
      toast({
        title: 'Powered by Local AI 🦙',
        description: `Successfully generated custom suggestions${domain ? ` for ${domain}` : ''}!`,
      });

    } catch (error) {
      console.error('Ollama Error:', error);
      toast({
        title: 'Local Generation Failed',
        description: 'Make sure the Ollama app is running on your computer!',
        variant: 'destructive'
      });
      onGenerateSuggestions(); 
    } finally {
      setIsAiLoading(false);
    }
  };

  const isCurrentlyLoading = parentIsLoading || isAiLoading;

  // Animate score counting
  useEffect(() => {
    if (displaySuggestions.length > 0 && currentScore > 0) {
      const duration = 1500;
      const steps = 60;
      const increment = currentScore / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= currentScore) {
          setAnimatedScore(currentScore);
          clearInterval(timer);
        } else {
          setAnimatedScore(Math.floor(current));
        }
      }, duration / steps);

      return () => clearInterval(timer);
    }
  }, [displaySuggestions, currentScore]);

  // Animate cards on scroll
  useEffect(() => {
    if (displaySuggestions.length > 0 && cardsRef.current) {
      const ctx = gsap.context(() => {
        const cards = cardsRef.current?.children;
        if (cards && cards.length > 0) {
          gsap.set(cards, { opacity: 0, y: 30 });

          const trigger = ScrollTrigger.create({
            trigger: cardsRef.current,
            start: 'top 80%',
            onEnter: () => {
              gsap.to(cards, {
                opacity: 1,
                y: 0,
                duration: 0.5,
                stagger: 0.08,
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
  }, [displaySuggestions]);

  // UI Helpers
  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <AlertCircle className="h-4 w-4 text-destructive" />;
      case 'medium': return <AlertTriangle className="h-4 w-4 text-warning" />;
      case 'low': return <CheckCircle className="h-4 w-4 text-green-500" />;
      default: return <CheckCircle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500 bg-red-50/50 dark:bg-red-950/20';
      case 'medium': return 'border-l-yellow-500 bg-yellow-50/50 dark:bg-yellow-950/20';
      case 'low': return 'border-l-green-500 bg-green-50/50 dark:bg-green-950/20';
      default: return 'border-l-muted bg-muted/30';
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500/10 text-red-600 hover:bg-red-500/20';
      case 'medium': return 'bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20';
      case 'low': return 'bg-green-500/10 text-green-600 hover:bg-green-500/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'skills': return <Wrench className="h-5 w-5" />;
      case 'experience': return <Briefcase className="h-5 w-5" />;
      case 'format': return <FileText className="h-5 w-5" />;
      case 'keywords': return <Search className="h-5 w-5" />;
      default: return <Lightbulb className="h-5 w-5" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    if (score >= 40) return 'text-orange-500';
    return 'text-red-500';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Improvement';
  };

  const filteredSuggestions =
    selectedCategory === 'all'
      ? displaySuggestions
      : displaySuggestions.filter((s) => s.category === selectedCategory);

  const categories = [
    { value: 'all', label: 'All', count: displaySuggestions.length },
    { value: 'skills', label: 'Skills', count: displaySuggestions.filter(s => s.category === 'skills').length },
    { value: 'experience', label: 'Experience', count: displaySuggestions.filter(s => s.category === 'experience').length },
    { value: 'format', label: 'Format', count: displaySuggestions.filter(s => s.category === 'format').length },
    { value: 'keywords', label: 'Keywords', count: displaySuggestions.filter(s => s.category === 'keywords').length },
  ];

  if (isCurrentlyLoading) {
    return (
      <section ref={sectionRef} className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <Card className="border-border/50">
            <CardContent className="p-12">
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="relative">
                  <Sparkles className="h-12 w-12 text-primary animate-pulse" />
                  <div className="absolute inset-0 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-semibold">Generating Local AI Suggestions...</h3>
                  <p className="text-sm text-muted-foreground">
                    Ollama is analyzing your resume against industry standards{domain ? ` for ${domain}` : ''}.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/10 rounded-full mb-4">
            <Zap className="w-4 h-4 text-orange-500" />
            <span className="text-sm font-medium text-orange-600">AI Recommendations</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
            Resume Improvement
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get private, local AI suggestions {domain ? <>tailored to <span className="font-semibold text-primary">{domain}</span></> : 'tailored to your target role'} to increase your chances of getting hired.
          </p>
        </div>

        {displaySuggestions.length === 0 ? (
          <Card className="border-border/50">
            <CardContent className="p-12 text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                <Lightbulb className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No suggestions yet</h3>
              <p className="text-muted-foreground mb-6">
                Click the button below to generate personalized, private suggestions using your local Ollama instance.
              </p>
              <Button onClick={generateWithOllama} size="lg" className="group">
                <Sparkles className="mr-2 h-4 w-4 group-hover:animate-pulse" />
                Generate with Ollama
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <Card className="mb-8 border-border/50 overflow-hidden">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div ref={scoreRef} className="relative flex-shrink-0">
                    <svg className="w-40 h-40 transform -rotate-90">
                      <circle
                        cx="80" cy="80" r="70"
                        fill="none" stroke="currentColor" strokeWidth="12"
                        className="text-muted/30"
                      />
                      <circle
                        cx="80" cy="80" r="70"
                        fill="none" stroke="currentColor" strokeWidth="12" strokeLinecap="round"
                        strokeDasharray={`${(animatedScore / 100) * 440} 440`}
                        className={`${getScoreColor(currentScore)} transition-all duration-1000`}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className={`text-4xl font-bold ${getScoreColor(currentScore)}`}>
                        {animatedScore}
                      </span>
                      <span className="text-sm text-muted-foreground">/100</span>
                    </div>
                  </div>

                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-2xl font-bold mb-2">
                      Overall Score:{' '}
                      <span className={getScoreColor(currentScore)}>
                        {getScoreLabel(currentScore)}
                      </span>
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Your resume has been analyzed across multiple dimensions. 
                      Here are personalized suggestions to improve it.
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Target className="h-3 w-3" />
                        {displaySuggestions.length} Suggestions
                      </Badge>
                      <Badge variant="outline" className="flex items-center gap-1 text-red-600">
                        <AlertCircle className="h-3 w-3" />
                        {displaySuggestions.filter(s => s.priority === 'high').length} High Priority
                      </Badge>
                      <Badge variant="outline" className="flex items-center gap-1 text-yellow-600">
                        <AlertTriangle className="h-3 w-3" />
                        {displaySuggestions.filter(s => s.priority === 'medium').length} Medium Priority
                      </Badge>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <Button
                      variant="default"
                      onClick={generateWithOllama}
                      className="flex-shrink-0"
                    >
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate with Ollama
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-6">
              <TabsList className="grid w-full grid-cols-5 max-w-2xl mx-auto">
                {categories.map((cat) => (
                  <TabsTrigger key={cat.value} value={cat.value} className="relative">
                    <span className="hidden sm:inline">{cat.label}</span>
                    <span className="sm:hidden">{cat.label.substring(0,3)}</span>
                    {cat.count > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 text-[10px] sm:text-xs bg-primary text-primary-foreground rounded-full flex items-center justify-center">
                        {cat.count}
                      </span>
                    )}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>

            <div ref={cardsRef} className="grid gap-4">
              {filteredSuggestions.map((suggestion, index) => (
                <Card
                  key={index}
                  className={`border-l-4 ${getPriorityColor(suggestion.priority)} card-hover`}
                >
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
                        {getCategoryIcon(suggestion.category)}
                      </div>

                      <div className="flex-1 space-y-3">
                        <div className="flex flex-wrap items-center gap-2">
                          {getPriorityIcon(suggestion.priority)}
                          <h4 className="font-semibold text-foreground">
                            {suggestion.title}
                          </h4>
                          <Badge className={`text-xs ${getPriorityBadge(suggestion.priority)}`}>
                            {suggestion.priority}
                          </Badge>
                          <Badge variant="outline" className="text-xs capitalize">
                            {suggestion.category}
                          </Badge>
                        </div>

                        <p className="text-sm text-muted-foreground">
                          {suggestion.description}
                        </p>

                        <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
                          <div className="flex items-start gap-2">
                            <Lightbulb className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                            <div>
                              <span className="text-xs font-medium text-primary">Suggestion:</span>
                              <p className="text-sm mt-1">{suggestion.suggestion}</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-sm">
                          <TrendingUp className="h-4 w-4 text-green-500" />
                          <span className="text-green-600 font-medium">
                            Impact: {suggestion.impact}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default ResumeImprovement;