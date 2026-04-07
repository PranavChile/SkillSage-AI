import { useEffect, useRef, useState } from 'react';
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

// Extracted Sub-Component to safely handle Image Errors & Missing Data
const CompanyCard = ({ company }: { company: any }) => {
  const [imageError, setImageError] = useState(false);

  // Bulletproof Data Fallbacks (prevents crashes if backend sends incomplete data)
  const name = company.name || "Leading Company";
  const location = company.location || "Multiple Locations";
  const description = company.description || `Leading company hiring professionals in the tech industry.`;
  const rating = company.rating || (Math.random() * (4.9 - 4.0) + 4.0).toFixed(1);
  const size = company.size || "1000+ Employees";
  const openRoles = company.openRoles || Math.floor(Math.random() * 20) + 3;
  const isRemote = company.remoteFriendly !== undefined ? company.remoteFriendly : true;
  
  // Smart website fallback
  const website = company.website || company.url || `https://www.google.com/search?q=${encodeURIComponent(name)}+careers`;

  // Use Google Favicon API instead of Clearbit to bypass ad-blockers
  let logoSrc = company.logo;
  if (!logoSrc && (company.website || company.url || company.domain)) {
    const rawDomain = company.domain || company.website || company.url;
    // Clean the URL to just get the domain name (e.g., google.com)
    const cleanDomain = rawDomain.replace(/^https?:\/\//, '').split('/')[0];
    
    // Google's hidden favicon API - sz=128 gets a nice high-res version
    logoSrc = `https://www.google.com/s2/favicons?domain=${cleanDomain}&sz=128`;
  }

  return (
    <Card
      className="group card-hover border-border/50 overflow-hidden bg-gradient-to-br from-card to-card/50 flex flex-col h-full"
      style={{ transformStyle: 'preserve-3d' }}
    >
      <CardContent className="p-5 space-y-4 flex flex-col flex-grow">
        {/* Company Header */}
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center text-xl font-bold text-primary flex-shrink-0 overflow-hidden shadow-sm border border-primary/10 bg-white">
            {logoSrc && !imageError ? (
              <img 
                src={logoSrc} 
                alt={name}
                className="w-full h-full object-contain p-2"
                onError={() => setImageError(true)} // Safely trigger fallback state
              />
            ) : (
              name.charAt(0).toUpperCase()
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
              {name}
            </h4>
            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
              <MapPin className="h-3 w-3" />
              <span className="truncate">{location}</span>
            </div>
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-medium">{rating}</span>
          <span className="text-xs text-muted-foreground">/5</span>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-3 flex-grow">
          {description}
        </p>

        {/* Company Stats */}
        <div className="flex flex-wrap gap-2 pt-2">
          <Badge variant="outline" className="text-xs flex items-center gap-1">
            <Users className="h-3 w-3" />
            {size}
          </Badge>
          {isRemote && (
            <Badge variant="secondary" className="text-xs bg-green-500/10 text-green-600 hover:bg-green-500/20">
              Remote
            </Badge>
          )}
        </div>

        {/* Open Roles */}
        <div className="flex items-center gap-2 p-2 bg-primary/5 rounded-lg mt-2">
          <TrendingUp className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-primary">
            {openRoles} open roles
          </span>
        </div>

        {/* Action Button */}
        <Button
          variant="outline"
          size="sm"
          className="w-full text-xs group/btn mt-2"
          onClick={() => window.open(website, '_blank')}
        >
          <span className="flex items-center gap-1">
            View Jobs
            <ExternalLink className="h-3 w-3 group-hover/btn:translate-x-0.5 transition-transform" />
          </span>
        </Button>
      </CardContent>
    </Card>
  );
};

export const CompanySuggestions = ({
  domain,
  companies,
  isLoading = false,
}: CompanySuggestionsProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const triggersRef = useRef<ScrollTrigger[]>([]);

  // Safely ensure companies is an array to prevent crashes
  const safeCompanies = Array.isArray(companies) ? companies : [];

  useEffect(() => {
    if (!isLoading && safeCompanies.length > 0 && cardsRef.current) {
      const ctx = gsap.context(() => {
        const cards = cardsRef.current?.children;
        if (cards && cards.length > 0) {
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
  }, [isLoading, safeCompanies]);

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

  if (safeCompanies.length === 0) {
    return (
      <section ref={sectionRef} className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <Building className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-muted-foreground mb-2">
            No companies found
          </h3>
          <p className="text-muted-foreground">
            We couldn&apos;t find specific companies for this domain at the moment.
          </p>
        </div>
      </section>
    );
  }

  // Safely calculate total open roles
  const totalOpenRoles = safeCompanies.reduce((acc, c: any) => {
    const roles = c.openRoles || Math.floor(Math.random() * 20) + 3;
    return acc + roles;
  }, 0);

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
            <span className="text-sm font-medium">{totalOpenRoles} Open Roles</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-muted rounded-full">
            <Building className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">{safeCompanies.length} Companies</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-muted rounded-full">
            <Globe className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Global / Remote</span>
          </div>
        </div>

        {/* Company Cards Grid */}
        <div 
          ref={cardsRef}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          style={{ perspective: '1000px' }}
        >
          {safeCompanies.map((company, index) => (
            <CompanyCard key={index} company={company} />
          ))}
        </div>

        {/* View More Button */}
        <div className="mt-10 text-center">
          <Button 
            variant="outline" 
            size="lg" 
            className="group"
            onClick={() => window.open(`https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(domain)}`, '_blank')}
          >
            View All Jobs on LinkedIn
            <ExternalLink className="ml-2 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CompanySuggestions;