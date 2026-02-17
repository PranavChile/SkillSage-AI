import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowDown, Brain, Users, Target } from 'lucide-react';

export const Hero: React.FC = () => {
  const scrollToUpload = () => {
    document.getElementById('upload-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center gradient-hero text-white overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-float"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-white/10 rounded-full blur-xl animate-float" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-white/5 rounded-full blur-lg animate-float" style={{ animationDelay: '2s' }}></div>
      
      <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
        <div className="space-y-8">
          {/* Main Heading */}
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              Smart Resume
              <span className="block gradient-text bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                Analysis
              </span>
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
              Unlock your career potential with AI-powered resume analysis. Get domain classification, 
              company suggestions, improvement tips, and Uniqueness checking in seconds.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-12">
            <div className="flex flex-col items-center space-y-3 p-6 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
              <Brain className="h-12 w-12 text-blue-200" />
              <h3 className="text-lg font-semibold">AI Classification</h3>
              <p className="text-sm text-white/80 text-center">
                Automatically identify your professional domain with 90%+ accuracy
              </p>
            </div>
            <div className="flex flex-col items-center space-y-3 p-6 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
              <Users className="h-12 w-12 text-green-200" />
              <h3 className="text-lg font-semibold">Company Matching</h3>
              <p className="text-sm text-white/80 text-center">
                Get personalized company suggestions based on your skills
              </p>
            </div>
            <div className="flex flex-col items-center space-y-3 p-6 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
              <Target className="h-12 w-12 text-orange-200" />
              <h3 className="text-lg font-semibold">Smart Improvements</h3>
              <p className="text-sm text-white/80 text-center">
                AI-powered suggestions to enhance your resume quality
              </p>
            </div>
          </div>

          {/* CTA Button */}
          <div className="space-y-4">
            <Button 
              variant="secondary" 
              size="xl" 
              onClick={scrollToUpload}
              className="text-lg px-8 py-4 bg-white text-primary hover:bg-white/90 shadow-xl"
            >
              Analyze Your Resume Now
              <ArrowDown className="ml-2 h-5 w-5" />
            </Button>
            <p className="text-sm text-white/70">
              Upload PDF or Word document • Free analysis • No registration required
            </p>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <ArrowDown className="h-6 w-6 text-white/60" />
      </div>
    </section>
  );
};