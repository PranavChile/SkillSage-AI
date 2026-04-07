import { useEffect, useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Star, Clock, ExternalLink, GraduationCap, PlayCircle } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Course {
  title: string;
  platform: string;
  duration: string;
  rating: number;
  url?: string; // Optional URL from backend
}

interface RecommendedCoursesProps {
  domain?: string;
  courses?: Course[];
}

export default function RecommendedCourses({ domain = 'Software Engineering', courses: backendCourses }: RecommendedCoursesProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Smart Fallback: Generate realistic courses if backend doesn't provide them
  const getDisplayCourses = (): Course[] => {
    if (backendCourses && backendCourses.length > 0) return backendCourses;

    const lower = domain.toLowerCase();
    
    if (lower.includes('software') || lower.includes('frontend') || lower.includes('developer')) {
      return [
        { title: 'Meta Front-End Developer Professional Certificate', platform: 'Coursera', duration: '7 Months', rating: 4.8, url: 'https://www.coursera.org/professional-certificates/meta-front-end-developer' },
        { title: 'The Complete JavaScript Course 2024: From Zero to Expert!', platform: 'Udemy', duration: '69 Hours', rating: 4.7, url: 'https://www.udemy.com/course/the-complete-javascript-course/' },
        { title: 'React - The Complete Guide (incl Hooks, React Router, Redux)', platform: 'Udemy', duration: '50 Hours', rating: 4.6, url: 'https://www.udemy.com/course/react-the-complete-guide-incl-redux/' },
      ];
    }
    
    if (lower.includes('data')) {
      return [
        { title: 'IBM Data Science Professional Certificate', platform: 'Coursera', duration: '5 Months', rating: 4.8, url: 'https://www.coursera.org/professional-certificates/ibm-data-science' },
        { title: 'Machine Learning A-Z: AI, Python & R', platform: 'Udemy', duration: '42 Hours', rating: 4.7, url: 'https://www.udemy.com/course/machinelearning/' },
        { title: 'Google Data Analytics Professional Certificate', platform: 'Coursera', duration: '6 Months', rating: 4.8, url: 'https://www.coursera.org/professional-certificates/google-data-analytics' },
      ];
    }

    // Default fallback
    return [
      { title: `Advanced ${domain} Masterclass`, platform: 'Coursera', duration: '4 Weeks', rating: 4.7, url: `https://www.coursera.org/search?query=${encodeURIComponent(domain)}` },
      { title: `Complete ${domain} Bootcamp`, platform: 'Udemy', duration: '30 Hours', rating: 4.6, url: `https://www.udemy.com/courses/search/?src=ukw&q=${encodeURIComponent(domain)}` },
      { title: `${domain} for Professionals`, platform: 'edX', duration: '6 Weeks', rating: 4.8, url: `https://www.edx.org/search?q=${encodeURIComponent(domain)}` },
    ];
  };

  const displayCourses = getDisplayCourses();

  // Simulate loading delay for smooth UI transition
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, [domain]);

  // Scroll Animations
  useEffect(() => {
    if (!isLoading && cardsRef.current) {
      const ctx = gsap.context(() => {
        const cards = cardsRef.current?.children;
        if (cards && cards.length > 0) {
          gsap.set(cards, { opacity: 0, y: 40 });

          ScrollTrigger.create({
            trigger: cardsRef.current,
            start: 'top 85%',
            onEnter: () => {
              gsap.to(cards, {
                opacity: 1,
                y: 0,
                duration: 0.6,
                stagger: 0.15,
                ease: 'back.out(1.2)',
              });
            },
            once: true,
          });
        }
      }, containerRef);

      return () => ctx.revert();
    }
  }, [isLoading, displayCourses]);

  // Function to securely open the course in a new browser tab
  const handleEnrollClick = (course: Course) => {
    // If we have a specific URL, use it. Otherwise, search Coursera for the title.
    const urlToOpen = course.url || `https://www.coursera.org/search?query=${encodeURIComponent(course.title)}`;
    
    // '_blank' opens a new tab. 'noopener,noreferrer' is for security to prevent the new tab from hijacking the parent window.
    window.open(urlToOpen, '_blank', 'noopener,noreferrer');
  };

  if (isLoading) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-6xl mx-auto flex flex-col items-center justify-center space-y-4 py-20">
          <BookOpen className="w-12 h-12 text-primary animate-pulse" />
          <h3 className="text-lg font-semibold">Finding the best courses for {domain}...</h3>
        </div>
      </section>
    );
  }

  return (
    <section ref={containerRef} className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 rounded-full mb-4">
            <GraduationCap className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium text-blue-600">Upskill & Grow</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Recommended Courses
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Bridge your skill gaps with top-rated courses specifically curated for <span className="font-semibold text-primary">{domain}</span> professionals.
          </p>
        </div>

        {/* Course Grid */}
        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayCourses.map((course, index) => (
            <Card key={index} className="group border-border/50 hover:border-primary/50 hover:shadow-lg transition-all duration-300 flex flex-col h-full bg-card/50 backdrop-blur-sm relative overflow-hidden">
              
              {/* Decorative top border glow */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-secondary opacity-0 group-hover:opacity-100 transition-opacity" />

              <CardContent className="p-6 flex flex-col flex-grow">
                {/* Platform Badge */}
                <div className="flex justify-between items-start mb-4">
                  <Badge variant="outline" className="bg-background">
                    {course.platform}
                  </Badge>
                  <div className="flex items-center gap-1 text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded-md text-sm font-medium">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    {course.rating}
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold mb-4 line-clamp-2 flex-grow group-hover:text-primary transition-colors">
                  {course.title}
                </h3>

                {/* Metadata */}
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    {course.duration}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <PlayCircle className="w-4 h-4" />
                    Self-paced
                  </div>
                </div>

                {/* Apply/Enroll Button */}
                <Button 
                  onClick={() => handleEnrollClick(course)}
                  className="w-full group/btn mt-auto"
                >
                  Enroll Now
                  <ExternalLink className="w-4 h-4 ml-2 opacity-70 transition-transform group-hover/btn:-translate-y-1 group-hover/btn:translate-x-1" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

      </div>
    </section>
  );
}