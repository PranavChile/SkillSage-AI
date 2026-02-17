import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Brain, 
  Mail, 
  ArrowRight, 
  Github, 
  Twitter, 
  Linkedin, 
  Instagram,
  Sparkles,
  Shield,
  Zap,
  Target
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const Footer = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast({
        title: 'Subscribed!',
        description: 'Thank you for subscribing to our newsletter.',
      });
      setEmail('');
    }
  };

  const footerLinks = {
    Product: [
      { label: 'Resume Analysis', href: '#' },
      { label: 'Company Matching', href: '#' },
      { label: 'Skill Assessment', href: '#' },
      { label: 'Career Guidance', href: '#' },
    ],
    Resources: [
      { label: 'Blog', href: '#' },
      { label: 'Career Tips', href: '#' },
      { label: 'Resume Templates', href: '#' },
      { label: 'Interview Prep', href: '#' },
    ],
    Company: [
      { label: 'About Us', href: '#' },
      { label: 'Contact', href: '#' },
      { label: 'Careers', href: '#' },
      { label: 'Partners', href: '#' },
    ],
    Legal: [
      { label: 'Privacy Policy', href: '#' },
      { label: 'Terms of Service', href: '#' },
      { label: 'Cookie Policy', href: '#' },
    ],
  };

  const socialLinks = [
    { icon: Github, href: '#', label: 'GitHub' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Instagram, href: '#', label: 'Instagram' },
  ];

  return (
    <footer className="bg-[#1A1A2E] text-white">
      {/* Newsletter Section */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl sm:text-3xl font-bold mb-3">
                Stay Updated with Career Insights
              </h3>
              <p className="text-white/70">
                Get the latest resume tips, job market trends, and AI-powered career advice delivered to your inbox.
              </p>
            </div>
            <form onSubmit={handleSubscribe} className="flex gap-3">
              <div className="flex-1 relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/50" />
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-primary"
                />
              </div>
              <Button type="submit" className="group">
                Subscribe
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
          {/* Brand Column */}
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold">SkillSage AI</span>
            </div>
            <p className="text-white/70 mb-6 max-w-sm">
              AI-powered career analysis platform helping professionals unlock their potential with intelligent resume insights.
            </p>
            
            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center hover:bg-primary/20 transition-colors"
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-semibold mb-4">{title}</h4>
              <ul className="space-y-3">
                {links.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-white/70 hover:text-white transition-colors text-sm"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Features Bar */}
        <div className="mt-16 pt-8 border-t border-white/10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="font-medium">AI-Powered</div>
                <div className="text-xs text-white/50">Advanced Analysis</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                <Shield className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <div className="font-medium">Secure</div>
                <div className="text-xs text-white/50">Data Protection</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                <Zap className="h-5 w-5 text-yellow-500" />
              </div>
              <div>
                <div className="font-medium">Instant</div>
                <div className="text-xs text-white/50">Real-time Results</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <Target className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <div className="font-medium">Accurate</div>
                <div className="text-xs text-white/50">95%+ Precision</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/50">
            2026 SkillSage AI. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-white/50">
            <span className="flex items-center gap-1">
              <Sparkles className="h-4 w-4" /> Made with AI
            </span>
            <span className="flex items-center gap-1">
              <Target className="h-4 w-4" /> For Job Seekers
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
 Footer;
