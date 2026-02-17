import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, Sparkles, CheckCircle, AlertCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';

interface ImprovementSuggestion {
  category: 'skills' | 'experience' | 'format' | 'keywords';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  suggestion: string;
  impact: string;
}

interface ResumeImprovementProps {
  suggestions: ImprovementSuggestion[];
  overallScore: number;
  isLoading?: boolean;
  onGenerateSuggestions: () => void;
}

export const ResumeImprovement: React.FC<ResumeImprovementProps> = ({
  suggestions,
  overallScore,
  isLoading = false,
  onGenerateSuggestions,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      case 'medium':
        return <AlertCircle className="h-4 w-4 text-warning" />;
      case 'low':
        return <CheckCircle className="h-4 w-4 text-secondary" />;
      default:
        return <CheckCircle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-l-destructive bg-destructive/5';
      case 'medium':
        return 'border-l-warning bg-warning/5';
      case 'low':
        return 'border-l-secondary bg-secondary/5';
      default:
        return 'border-l-muted-foreground bg-muted/5';
    }
  };

  const getCategoryIcon = (category: string) => {
    const iconMap: { [key: string]: string } = {
      skills: '🔧',
      experience: '💼',
      format: '📝',
      keywords: '🔍',
    };
    return iconMap[category] || '💡';
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-secondary';
    if (score >= 60) return 'text-warning';
    return 'text-destructive';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Improvement';
  };

  const filteredSuggestions =
    selectedCategory === 'all'
      ? suggestions
      : suggestions.filter((s) => s.category === selectedCategory);

  if (isLoading) {
    return (
      <Card className="w-full gradient-card shadow-medium">
        <CardContent className="p-8">
          <div className="flex items-center justify-center space-y-4 flex-col">
            <Sparkles className="h-12 w-12 text-primary animate-pulse" />
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Generating Suggestions...</h3>
              <p className="text-sm text-muted-foreground">
                AI is analyzing your resume for improvements
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full gradient-card shadow-medium">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Lightbulb className="h-6 w-6 text-primary" />
            <div>
              <CardTitle className="text-xl">Resume Improvement</CardTitle>
              <p className="text-sm text-muted-foreground">
                AI-powered suggestions to enhance your resume
              </p>
            </div>
          </div>
          <Button variant="professional" onClick={onGenerateSuggestions}>
            <Sparkles className="h-4 w-4 mr-2" />
            Get Suggestions
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Overall Score */}
        <div className="bg-card/50 rounded-lg p-4 border border-border/50">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold">Overall Resume Score</h4>
            <span className={`text-2xl font-bold ${getScoreColor(overallScore)}`}>
              {overallScore}/100
            </span>
          </div>
          <div className="space-y-2">
            <Progress value={overallScore} className="h-3" />
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Resume Quality</span>
              <span className={`font-medium ${getScoreColor(overallScore)}`}>
                {getScoreLabel(overallScore)}
              </span>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="experience">Experience</TabsTrigger>
            <TabsTrigger value="format">Format</TabsTrigger>
            <TabsTrigger value="keywords">Keywords</TabsTrigger>
          </TabsList>

          {['all', 'skills', 'experience', 'format', 'keywords'].map((category) => (
            <TabsContent key={category} value={category} className="space-y-4 mt-6">
              {filteredSuggestions.map((suggestion, index) => (
                <Card key={index} className={`border-l-4 ${getPriorityColor(suggestion.priority)}`}>
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{getCategoryIcon(suggestion.category)}</span>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          {getPriorityIcon(suggestion.priority)}
                          <h5 className="font-semibold text-sm">{suggestion.title}</h5>
                          <Badge variant="outline" className="text-xs capitalize">
                            {suggestion.category}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{suggestion.description}</p>
                        <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
                          <p className="text-sm font-medium text-primary mb-1">💡 Suggestion:</p>
                          <p className="text-sm">{suggestion.suggestion}</p>
                        </div>
                        <div className="bg-secondary/5 border border-secondary/20 rounded-lg p-2">
                          <p className="text-xs text-secondary">
                            <strong>Impact:</strong> {suggestion.impact}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          ))}
        </Tabs>

        {filteredSuggestions.length === 0 && (
          <div className="text-center py-8">
            <Lightbulb className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <h4 className="font-semibold text-muted-foreground mb-2">No suggestions yet</h4>
            <p className="text-sm text-muted-foreground">
              Click "Get Suggestions" to analyze your resume with AI
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
