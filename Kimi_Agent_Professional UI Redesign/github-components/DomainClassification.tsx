import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Brain, Target, Star } from 'lucide-react';

interface DomainClassificationProps {
  domain: string;
  confidence: number;
  skills: string[];
  isLoading?: boolean;
}

export const DomainClassification: React.FC<DomainClassificationProps> = ({ 
  domain, 
  confidence, 
  skills, 
  isLoading = false 
}) => {
  if (isLoading) {
    return (
      <Card className="w-full max-w-2xl mx-auto gradient-card shadow-medium">
        <CardContent className="p-8">
          <div className="flex items-center justify-center space-y-4 flex-col">
            <Brain className="h-12 w-12 text-primary animate-pulse" />
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Analyzing Your Resume...</h3>
              <p className="text-sm text-muted-foreground">Our AI is classifying your professional domain</p>
            </div>
            <div className="w-full max-w-sm">
              <Progress value={75} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getDomainIcon = (domain: string) => {
     const iconMap: Record<string, string> = {
    'Software Engineering': '💻',
    'Data Science': '📊',
    'Marketing': '📈',
    'Finance': '💰',
    'Healthcare': '🏥',
    'Education': '🎓',
    'Design': '🎨',
    'Sales': '💼',
    'Operations': '⚙️',
    'HR': '👥',
    'Legal': '⚖️',
    'Product Management': '📦',
    'Customer Support': '🎧',
    'Research': '🔬',
    'Consulting': '📝',
  };
  return iconMap[domain] || '🎯';
};

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-secondary';
    if (confidence >= 60) return 'text-warning';
    return 'text-accent';
  };

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 80) return 'High Confidence';
    if (confidence >= 60) return 'Medium Confidence';
    return 'Low Confidence';
  };

  return (
    <Card className="w-full max-w-2xl mx-auto gradient-card shadow-medium card-hover">
      <CardHeader className="text-center pb-4">
        <div className="flex items-center justify-center gap-3">
          <Target className="h-6 w-6 text-primary" />
          <CardTitle className="text-xl">Domain Classification</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Domain Result */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-3 bg-primary/10 rounded-full px-6 py-3">
            <span className="text-3xl">{getDomainIcon(domain)}</span>
            <div className="text-left">
              <h3 className="text-xl font-bold text-primary">{domain}</h3>
              <p className="text-sm text-muted-foreground">Identified Domain</p>
            </div>
          </div>
          
          {/* Confidence Score */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Confidence Score</span>
              <span className={`text-sm font-bold ${getConfidenceColor(confidence)}`}>
                {confidence}% - {getConfidenceLabel(confidence)}
              </span>
            </div>
            <Progress value={confidence} className="h-3" />
          </div>
        </div>

        {/* Skills */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-accent" />
            <h4 className="font-semibold text-sm">Relevant Skills Identified</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {skills.slice(0, 8).map((skill, index) => (
              <Badge 
                key={index} 
                variant="secondary" 
                className="bg-primary/10 text-primary hover:bg-primary/20"
              >
                {skill}
              </Badge>
            ))}
            {skills.length > 8 && (
              <Badge variant="outline" className="text-muted-foreground">
                +{skills.length - 8} more
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};