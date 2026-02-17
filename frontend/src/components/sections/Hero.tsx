import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowDown, Brain, Users, Target, Sparkles, TrendingUp, Shield } from 'lucide-react';
import gsap from 'gsap';

interface HeroProps {
  onScrollToUpload: () => void;
}

export const Hero = ({ onScrollToUpload }: HeroProps) => {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const orbsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial states
      gsap.set([titleRef.current, subtitleRef.current, ctaRef.current], {
        opacity: 0,
        y: 50,
      });
      gsap.set(featuresRef.current?.children || [], {
        opacity: 0,
        y: 30,
        scale: 0.9,
      });
      gsap.set(statsRef.current?.children || [], {
        opacity: 0,
        y: 20,
      });

      // Animation timeline
      const tl = gsap.timeline({ delay: 0.3 });

      tl.to(titleRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'expo.out',
      })
        .to(
          subtitleRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'expo.out',
          },
          '-=0.4'
        )
        .to(
          featuresRef.current?.children || [],
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.5,
            stagger: 0.1,
            ease: 'expo.out',
          },
          '-=0.3'
        )
        .to(
          ctaRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'expo.out',
          },
          '-=0.2'
        )
        .to(
          statsRef.current?.children || [],
          {
            opacity: 1,
            y: 0,
            duration: 0.4,
            stagger: 0.1,
            ease: 'expo.out',
          },
          '-=0.3'
        );

      // Floating orbs animation
      const orbs = orbsRef.current?.children;
      if (orbs) {
        gsap.to(orbs, {
          y: 'random(-20, 20)',
          x: 'random(-10, 10)',
          duration: 'random(3, 5)',
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          stagger: {
            each: 0.5,
            from: 'random',
          },
        });
      }
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const stats = [
    { value: '10K+', label: 'Resumes Analyzed', icon: TrendingUp },
    { value: '95%', label: 'Accuracy Rate', icon: Target },
    { value: '500+', label: 'Companies', icon: BuildingIcon },
  ];

  const features = [
    {
      icon: Brain,
      title: 'AI Classification',
      description: 'Automatically identify your professional domain with 90%+ accuracy',
      color: 'from-blue-400/20 to-blue-600/20',
    },
    {
      icon: Users,
      title: 'Company Matching',
      description: 'Get personalized company suggestions based on your skills',
      color: 'from-green-400/20 to-green-600/20',
    },
    {
      icon: Sparkles,
      title: 'Smart Improvements',
      description: 'AI-powered suggestions to enhance your resume quality',
      color: 'from-purple-400/20 to-purple-600/20',
    },
  ];

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#2196F3] via-[#1976D2] to-[#4CAF50] animate-gradient" />
      
      {/* Floating Orbs */}
      <div ref={orbsRef} className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-[10%] w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute top-40 right-[15%] w-48 h-48 bg-green-300/20 rounded-full blur-3xl" />
        <div className="absolute bottom-32 left-[20%] w-56 h-56 bg-blue-300/15 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-[25%] w-40 h-40 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
      </div>

      {/* Grid Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
        }}
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
            <Sparkles className="w-4 h-4 text-yellow-300" />
            <span className="text-sm text-white/90 font-medium">AI-Powered Career Analysis</span>
          </div>

          {/* Main Heading */}
          <div className="space-y-4">
            <h1
              ref={titleRef}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight"
            >
              Unlock Your{' '}
              <span className="relative inline-block">
                <span className="relative z-10">Career Potential</span>
                <span className="absolute bottom-2 left-0 w-full h-3 bg-green-400/30 -rotate-1 rounded" />
              </span>
              <br />
              <span className="text-white/90">with AI</span>
            </h1>
            <p
              ref={subtitleRef}
              className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed"
            >
              Upload your resume and get instant analysis, company matches, and personalized 
              improvement suggestions powered by advanced AI.
            </p>
          </div>

          {/* Features Grid */}
          <div
            ref={featuresRef}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto my-12"
          >
            {features.map((feature, index) => (
              <div
                key={index}
                className={`group relative p-6 rounded-2xl bg-gradient-to-br ${feature.color} backdrop-blur-sm border border-white/20 hover:border-white/40 transition-all duration-300 hover:scale-105`}
              >
                <div className="flex flex-col items-center space-y-3">
                  <div className="p-3 bg-white/20 rounded-xl">
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
                  <p className="text-sm text-white/70 text-center leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <div ref={ctaRef} className="space-y-4">
            <Button
              size="lg"
              onClick={onScrollToUpload}
              className="text-lg px-8 py-6 bg-white text-[#1976D2] hover:bg-white/90 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 font-semibold group"
            >
              Analyze Your Resume Now
              <ArrowDown className="ml-2 h-5 w-5 group-hover:translate-y-1 transition-transform" />
            </Button>
            <p className="text-sm text-white/70 flex items-center justify-center gap-4 flex-wrap">
              <span className="flex items-center gap-1">
                <Shield className="w-4 h-4" /> Secure & Private
              </span>
              <span className="flex items-center gap-1">
                <Sparkles className="w-4 h-4" /> Free Analysis
              </span>
              <span className="flex items-center gap-1">
                <Target className="w-4 h-4" /> Instant Results
              </span>
            </p>
          </div>

          {/* Stats */}
          <div
            ref={statsRef}
            className="flex flex-wrap justify-center gap-8 mt-12"
          >
            {stats.map((stat, index) => (
              <div
                key={index}
                className="flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20"
              >
                <stat.icon className="w-5 h-5 text-white/70" />
                <div className="text-left">
                  <div className="text-xl font-bold text-white">{stat.value}</div>
                  <div className="text-xs text-white/60">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

// Helper icon component
const BuildingIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

export default Hero;
