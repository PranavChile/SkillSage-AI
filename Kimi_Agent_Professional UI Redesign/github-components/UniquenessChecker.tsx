import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Shield, AlertTriangle, CheckCircle, Search, Eye } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface UniquenessResult {
  overallScore: number;
  matches: Array<{
    text: string;
    similarity: number;
    source: string;
    category: 'high' | 'medium' | 'low';
  }>;
  totalChecked: number;
  cleanSentences: number;
  flaggedSentences: number;
}

interface UniquenessCheckerProps {
  isChecking?: boolean;
  result?: UniquenessResult;
  onCheck: () => void;
}

export const UniquenessChecker: React.FC<UniquenessCheckerProps> = ({ 
  isChecking = false, 
  result,
  onCheck 
}) => {
  const [showDetails, setShowDetails] = useState(false);

  const getScoreColor = (score: number) => {
    if (score < 20) return 'text-secondary';
    if (score < 50) return 'text-warning';
    return 'text-destructive';
  };

  const getScoreBackground = (score: number) => {
    if (score < 20) return 'bg-secondary/10 border-secondary/20';
    if (score < 50) return 'bg-warning/10 border-warning/20';
    return 'bg-destructive/10 border-destructive/20';
  };

  const getScoreLabel = (score: number) => {
    if (score < 20) return 'Original Content';
    if (score < 50) return 'Some Similarities';
    return 'High Similarity';
  };

  const getMatchColor = (category: string) => {
    switch (category) {
      case 'high': return 'border-l-destructive bg-destructive/5';
      case 'medium': return 'border-l-warning bg-warning/5';
      case 'low': return 'border-l-secondary bg-secondary/5';
      default: return 'border-l-muted bg-muted/5';
    }
  };

  const getMatchIcon = (category: string) => {
    switch (category) {
      case 'high': return <AlertTriangle className="h-4 w-4 text-destructive" />;
      case 'medium': return <AlertTriangle className="h-4 w-4 text-warning" />;
      case 'low': return <CheckCircle className="h-4 w-4 text-secondary" />;
      default: return <CheckCircle className="h-4 w-4 text-muted-foreground" />;
    }
  };

if (isChecking) {
  return (
    <Card className="w-full gradient-card shadow-medium">
      <CardContent className="p-8">
        <div className="flex items-center justify-center space-y-4 flex-col">
          <Shield className="h-12 w-12 text-primary animate-pulse" />
          <div className="text-center space-y-2">
            <h3 className="text-lg font-semibold">Checking for Uniqueness...</h3>
            <p className="text-sm text-muted-foreground">
              Analyzing your resume content using AI
            </p>
            <div className="w-full max-w-sm">
              <Progress value={65} className="h-2" />
            </div>
            <p className="text-xs text-muted-foreground">This may take a few moments</p>
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
            <Shield className="h-6 w-6 text-primary" />
            <div>
              <CardTitle className="text-xl">Uniqueness Checker</CardTitle>
              <p className="text-sm text-muted-foreground">Verify originality of your resume content</p>
            </div>
          </div>
          <Button variant="professional" onClick={onCheck}>
            <Search className="h-4 w-4 mr-2" />
            Check Uniqueness
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {result ? (
          <>
            {/* Overall Score */}
            <div className={`rounded-lg p-6 border-2 ${getScoreBackground(result.overallScore)}`}>
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full border-8 border-current opacity-20"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className={`text-3xl font-bold ${getScoreColor(result.overallScore)}`}>
                        {result.overallScore}%
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className={`text-xl font-bold ${getScoreColor(result.overallScore)}`}>
                    {getScoreLabel(result.overallScore)}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Similarity percentage with existing content
                  </p>
                </div>
              </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-card/50 rounded-lg border border-border/50">
                <div className="text-2xl font-bold text-primary">{result.totalChecked}</div>
                <div className="text-sm text-muted-foreground">Sentences Checked</div>
              </div>
              <div className="text-center p-4 bg-card/50 rounded-lg border border-border/50">
                <div className="text-2xl font-bold text-secondary">{result.cleanSentences}</div>
                <div className="text-sm text-muted-foreground">Original Content</div>
              </div>
              <div className="text-center p-4 bg-card/50 rounded-lg border border-border/50">
                <div className="text-2xl font-bold text-warning">{result.flaggedSentences}</div>
                <div className="text-sm text-muted-foreground">Similar Content</div>
              </div>
            </div>

            {/* Recommendations */}
            {result.overallScore > 20 && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  {result.overallScore > 50 
                    ? "High similarity detected. Consider rewriting highlighted sections to improve originality."
                    : "Some similarities found. Review the flagged content and consider rephrasing."
                  }
                </AlertDescription>
              </Alert>
            )}

            {/* Detailed Results */}
            {result.matches.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">Detailed Analysis</h4>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setShowDetails(!showDetails)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    {showDetails ? 'Hide' : 'Show'} Details
                  </Button>
                </div>

                {showDetails && (
                  <div className="space-y-3">
                    {result.matches.map((match, index) => (
                      <Card key={index} className={`border-l-4 ${getMatchColor(match.category)}`}>
                        <CardContent className="p-4 space-y-3">
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 mt-1">
                              {getMatchIcon(match.category)}
                            </div>
                            <div className="flex-1 space-y-2">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs">
                                  {match.similarity}% similarity
                                </Badge>
                                <Badge variant="secondary" className="text-xs capitalize">
                                  {match.category} risk
                                </Badge>
                              </div>
                              <div className="bg-muted/50 rounded p-3 text-sm">
                                "{match.text}"
                              </div>
                              <p className="text-xs text-muted-foreground">
                                <strong>Similar to:</strong> {match.source}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <Shield className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-muted-foreground mb-2">Uniqueness Check Ready</h4>
            <p className="text-sm text-muted-foreground mb-6">
              Click "Check Uniqueness" to analyze your resume for original content
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="p-4 bg-primary/5 rounded-lg">
                <CheckCircle className="h-6 w-6 text-primary mx-auto mb-2" />
                <div className="font-medium">AI-Powered</div>
                <div className="text-muted-foreground text-xs">Advanced similarity detection</div>
              </div>
              <div className="p-4 bg-secondary/5 rounded-lg">
                <Search className="h-6 w-6 text-secondary mx-auto mb-2" />
                <div className="font-medium">Comprehensive</div>
                <div className="text-muted-foreground text-xs">Checks against multiple sources</div>
              </div>
              <div className="p-4 bg-accent/5 rounded-lg">
                <Shield className="h-6 w-6 text-accent mx-auto mb-2" />
                <div className="font-medium">Secure</div>
                <div className="text-muted-foreground text-xs">Your data remains private</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};