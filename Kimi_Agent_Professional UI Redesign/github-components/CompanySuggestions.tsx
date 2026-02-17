import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building, ExternalLink, MapPin, Users } from 'lucide-react';

interface Company {
  name: string;
  logo: string;
  website: string;
  location: string;
  size: string;
  description: string;
  openRoles: number;
}

interface CompanySuggestionsProps {
  domain: string;
  companies: Company[];
  isLoading?: boolean;
}

export const CompanySuggestions: React.FC<CompanySuggestionsProps> = ({ 
  domain, 
  companies, 
  isLoading = false 
}) => {
  if (isLoading) {
    return (
      <Card className="w-full gradient-card shadow-medium">
        <CardContent className="p-8">
          <div className="flex items-center justify-center space-y-4 flex-col">
            <Building className="h-12 w-12 text-primary animate-pulse" />
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Finding Companies...</h3>
              <p className="text-sm text-muted-foreground">Searching for companies in {domain}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full gradient-card shadow-medium">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Building className="h-6 w-6 text-primary" />
          <div>
            <CardTitle className="text-xl">Company Suggestions</CardTitle>
            <p className="text-sm text-muted-foreground">Top companies hiring in {domain}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {companies.map((company, index) => (
            <Card key={index} className="card-hover bg-card/50 border-border/50">
              <CardContent className="p-4 space-y-3">
                {/* Company Header */}
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg flex items-center justify-center text-xl font-bold text-primary">
                    {company.logo || company.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm truncate">{company.name}</h4>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      {company.location}
                    </div>
                  </div>
                </div>

                {/* Company Info */}
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {company.description}
                </p>

                {/* Company Stats */}
                <div className="flex items-center gap-2 text-xs">
                  <Badge variant="outline" className="text-xs">
                    <Users className="h-3 w-3 mr-1" />
                    {company.size}
                  </Badge>
                  {company.openRoles > 0 && (
                    <Badge variant="secondary" className="text-xs bg-secondary/20 text-secondary">
                      {company.openRoles} open roles
                    </Badge>
                  )}
                </div>

                {/* Action Button */}
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full text-xs"
                  onClick={() => window.open(company.website, '_blank')}
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  View Jobs
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {companies.length === 0 && (
          <div className="text-center py-8">
            <Building className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <h4 className="font-semibold text-muted-foreground mb-2">No companies found</h4>
            <p className="text-sm text-muted-foreground">
              We couldn't find companies for this domain. Try uploading a different resume.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};