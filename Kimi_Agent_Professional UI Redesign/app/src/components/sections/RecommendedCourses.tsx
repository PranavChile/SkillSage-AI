import { useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BookOpen, 
  ExternalLink, 
  Clock, 
  Star, 
  Users, 
  Award,
  GraduationCap,
  CheckCircle,
  Sparkles,
  TrendingUp
} from 'lucide-react';
import type { Course } from '@/types';
import { freeCourses, paidCourses } from '@/data/mockData';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const RecommendedCourses = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const freeCardsRef = useRef<HTMLDivElement>(null);
  const paidCardsRef = useRef<HTMLDivElement>(null);
  const triggersRef = useRef<ScrollTrigger[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate free courses
      if (freeCardsRef.current) {
        const cards = freeCardsRef.current.children;
        gsap.set(cards, { opacity: 0, y: 40 });

        const trigger = ScrollTrigger.create({
          trigger: freeCardsRef.current,
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

      // Animate paid courses
      if (paidCardsRef.current) {
        const cards = paidCardsRef.current.children;
        gsap.set(cards, { opacity: 0, y: 40 });

        const trigger = ScrollTrigger.create({
          trigger: paidCardsRef.current,
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
  }, []);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner':
        return 'bg-green-500/10 text-green-600';
      case 'Intermediate':
        return 'bg-yellow-500/10 text-yellow-600';
      case 'Advanced':
        return 'bg-red-500/10 text-red-600';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getPlatformColor = (platform: string) => {
    const platformLower = platform.toLowerCase();
    if (platformLower.includes('coursera')) return 'text-blue-600';
    if (platformLower.includes('udemy')) return 'text-purple-600';
    if (platformLower.includes('freecodecamp')) return 'text-green-600';
    if (platformLower.includes('kaggle')) return 'text-cyan-600';
    if (platformLower.includes('google')) return 'text-red-500';
    return 'text-primary';
  };

  const CourseCard = ({ course }: { course: Course }) => (
    <Card className="group card-hover border-border/50 overflow-hidden h-full flex flex-col">
      <CardContent className="p-5 flex flex-col h-full">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-xs font-medium ${getPlatformColor(course.platform)}`}>
                {course.platform}
              </span>
              {course.certificate && (
                <Award className="h-4 w-4 text-yellow-500" />
              )}
            </div>
            <h4 className="font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
              {course.title}
            </h4>
          </div>
        </div>

        {/* Meta Info */}
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="outline" className={`text-xs ${getLevelColor(course.level)}`}>
            {course.level}
          </Badge>
          <Badge variant="outline" className="text-xs flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {course.duration}
          </Badge>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          {course.rating && (
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{course.rating}</span>
            </div>
          )}
          {course.students && (
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{course.students}</span>
            </div>
          )}
        </div>

        {/* Price (for paid courses) */}
        {course.price && (
          <div className="mb-4">
            <span className="text-lg font-bold text-primary">{course.price}</span>
          </div>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Action Button */}
        <Button
          variant="outline"
          size="sm"
          className="w-full group/btn mt-auto"
          onClick={() => window.open(course.link, '_blank')}
        >
          <span className="flex items-center gap-1">
            Enroll Now
            <ExternalLink className="h-3 w-3 group-hover/btn:translate-x-0.5 transition-transform" />
          </span>
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <section ref={sectionRef} className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 rounded-full mb-4">
            <GraduationCap className="w-4 h-4 text-purple-500" />
            <span className="text-sm font-medium text-purple-600">Skill Development</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
            Recommended Courses
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Enhance your skills with these curated courses tailored for your career growth
          </p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="free" className="w-full">
          <div className="flex justify-center mb-8">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="free" className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Free Courses
                <Badge variant="secondary" className="ml-1 text-xs">
                  {freeCourses.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="paid" className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Paid Courses
                <Badge variant="secondary" className="ml-1 text-xs">
                  {paidCourses.length}
                </Badge>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="free" className="mt-0">
            <div ref={freeCardsRef} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {freeCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="paid" className="mt-0">
            <div ref={paidCardsRef} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {paidCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Stats */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-card rounded-xl border border-border/50">
            <BookOpen className="h-6 w-6 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold">{freeCourses.length + paidCourses.length}</div>
            <div className="text-sm text-muted-foreground">Total Courses</div>
          </div>
          <div className="text-center p-4 bg-card rounded-xl border border-border/50">
            <CheckCircle className="h-6 w-6 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{freeCourses.length}</div>
            <div className="text-sm text-muted-foreground">Free Courses</div>
          </div>
          <div className="text-center p-4 bg-card rounded-xl border border-border/50">
            <Award className="h-6 w-6 text-yellow-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">
              {[...freeCourses, ...paidCourses].filter(c => c.certificate).length}
            </div>
            <div className="text-sm text-muted-foreground">With Certificate</div>
          </div>
          <div className="text-center p-4 bg-card rounded-xl border border-border/50">
            <TrendingUp className="h-6 w-6 text-purple-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">4.7</div>
            <div className="text-sm text-muted-foreground">Avg Rating</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RecommendedCourses;
