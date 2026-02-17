import { useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Building, 
  ExternalLink, 
  MapPin, 
  Users, 
  Briefcase, 
  Star, 
  TrendingUp, 
  Globe 
} from 'lucide-react';
import type { Company } from '@/types';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface CompanySuggestionsProps {
  domain: string;
  companies: Company[];
  isLoading?: boolean;
}

export const CompanySuggestions = ({
  domain,
  companies,
  isLoading = false,
}: CompanySuggestionsProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const triggersRef = useRef<ScrollTrigger[]>([]);

  useEffect(() => {
    if (!isLoading && companies.length > 0 && cardsRef.current) {
      const ctx = gsap.context(() => {
        const cards = cardsRef.current?.children;
        if (cards) {
          gsap.set(cards, {
            opacity: 0,
            y: 50,
            rotateY: -15,
          });

          const trigger = ScrollTrigger.create({
            trigger: sectionRef.current,
            start: 'top 70%',
            onEnter: () => {
              gsap.to(cards, {
                opacity: 1,
                y: 0,
                rotateY: 0,
                duration: 0.6,
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
  }, [isLoading, companies]);

  if (isLoading) {
    return (
      <section ref={sectionRef} className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Card className="border-border/50">
            <CardContent className="p-12">
              <div className="flex flex-col items-center justify-center space-y-4">
                <Building className="h-12 w-12 text-primary animate-pulse" />
                <div className="text-center">
                  <h3 className="text-lg font-semibold">Finding Companies...</h3>
                  <p className="text-sm text-muted-foreground">
                    Searching for top companies hiring in {domain}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  if (companies.length === 0) {
    return (
      <section ref={sectionRef} className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <Building className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-muted-foreground mb-2">
            No companies found
          </h3>
          <p className="text-muted-foreground">
            We couldn&apos;t find companies for this domain. Try uploading a different resume.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 rounded-full mb-4">
            <Building className="w-4 h-4 text-green-500" />
            <span className="text-sm font-medium text-green-600">Career Opportunities</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
            Top Companies Hiring
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Based on your <span className="font-semibold text-primary">{domain}</span> profile, 
            here are companies actively hiring in your field
          </p>
        </div>

        {/* Stats Summary */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <div className="flex items-center gap-2 px-4 py-2 bg-muted rounded-full">
            <Briefcase className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">{companies.reduce((acc, c) => acc + c.openRoles, 0)} Open Roles</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-muted rounded-full">
            <Building className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">{companies.length} Companies</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-muted rounded-full">
            <Globe className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Pan India</span>
          </div>
        </div>

        {/* Company Cards Grid */}
        <div 
          ref={cardsRef}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          style={{ perspective: '1000px' }}
        >
          {companies.map((company, index) => (
            <Card
              key={index}
              className="group card-hover border-border/50 overflow-hidden bg-gradient-to-br from-card to-card/50"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <CardContent className="p-5 space-y-4">
                {/* Company Header */}
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center text-xl font-bold text-primary flex-shrink-0 overflow-hidden">
                    {company.logo ? (
                      <img 
                        src={company.logo} 
                        alt={company.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      company.name.charAt(0)
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                      {company.name}
                    </h4>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span className="truncate">{company.location}</span>
                    </div>
                  </div>
                </div>

                {/* Rating */}
                {company.rating && (
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{company.rating}</span>
                    <span className="text-xs text-muted-foreground">/5</span>
                  </div>
                )}

                {/* Description */}
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {company.description}
                </p>

                {/* Company Stats */}
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="text-xs flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {company.size}
                  </Badge>
                  {company.remoteFriendly && (
                    <Badge variant="secondary" className="text-xs bg-green-500/10 text-green-600">
                      Remote
                    </Badge>
                  )}
                </div>

                {/* Open Roles */}
                {company.openRoles > 0 && (
                  <div className="flex items-center gap-2 p-2 bg-primary/5 rounded-lg">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-primary">
                      {company.openRoles} open roles
                    </span>
                  </div>
                )}

                {/* Action Button */}
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs group/btn"
                  onClick={() => window.open(company.website, '_blank')}
                >
                  <span className="flex items-center gap-1">
                    View Jobs
                    <ExternalLink className="h-3 w-3 group-hover/btn:translate-x-0.5 transition-transform" />
                  </span>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* View More Button */}
        <div className="mt-10 text-center">
          <Button variant="outline" size="lg" className="group">
            View All Companies
            <ExternalLink className="ml-2 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CompanySuggestions;
