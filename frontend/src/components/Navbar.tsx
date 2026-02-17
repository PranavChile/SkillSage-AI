import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Brain, Menu, X, ArrowUp } from 'lucide-react';

interface NavbarProps {
  onScrollToUpload: () => void;
}

export const Navbar = ({ onScrollToUpload }: NavbarProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Dashboard', href: '#' },
    { label: 'Analysis', href: '#analysis' },
    { label: 'Companies', href: '#companies' },
    { label: 'Courses', href: '#courses' },
    { label: 'Improvements', href: '#improvements' },
  ];

  const scrollToSection = (href: string) => {
    if (href === '#') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#1A1A2E]/95 backdrop-blur-lg shadow-lg py-3'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); scrollToSection('#'); }}
              className="flex items-center gap-2 group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center transition-transform group-hover:scale-110">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">
                SkillSage AI
              </span>
            </a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => { e.preventDefault(); scrollToSection(item.href); }}
                  className="px-4 py-2 text-sm font-medium rounded-lg transition-all hover:bg-white/10 text-white/80 hover:text-white"
                >
                  {item.label}
                </a>
              ))}
            </div>

            {/* CTA Button */}
            <div className="hidden md:block">
              <Button
                onClick={onScrollToUpload}
                className="bg-white text-primary hover:bg-white/90 font-semibold"
              >
                Upload Resume
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-lg bg-white/10 text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-[#1A1A2E]/95 backdrop-blur-lg border-t border-white/10">
            <div className="px-4 py-4 space-y-2">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => { e.preventDefault(); scrollToSection(item.href); }}
                  className="block px-4 py-3 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  {item.label}
                </a>
              ))}
              <Button
                onClick={() => {
                  onScrollToUpload();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full bg-white text-primary hover:bg-white/90 font-semibold mt-4"
              >
                Upload Resume
              </Button>
            </div>
          </div>
        )}
      </nav>

      {/* Scroll to Top Button */}
      {isScrolled && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-primary text-white shadow-lg hover:bg-primary/90 transition-all hover:scale-110 flex items-center justify-center"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}
    </>
  );
};

export default Navbar;
