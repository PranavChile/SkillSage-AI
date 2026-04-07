import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Brain, Menu, X, ArrowUp, LogIn, UserPlus, LogOut, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface NavbarProps {
  onScrollToUpload: () => void;
}

export const Navbar = ({ onScrollToUpload }: NavbarProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { toast } = useToast();

  // --- AUTHENTICATION STATE ---
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [authModal, setAuthModal] = useState<'login' | 'signup' | null>(null);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });

  // 1. Check for logged-in user on load
  useEffect(() => {
    const savedUser = localStorage.getItem('skillSage_currentUser');
    if (savedUser) {
      setCurrentUser(savedUser);
    }
    
    // Scroll listener
    const handleScroll = () => setIsScrolled(window.scrollY > 100);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 2. Navigation Helpers
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

  // --- AUTHENTICATION LOGIC ---
  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.password) {
      return toast({ title: 'Error', description: 'Please fill all fields', variant: 'destructive' });
    }

    // Get existing users or create empty array
    const existingUsers = JSON.parse(localStorage.getItem('skillSage_users') || '[]');
    
    // Check if email already exists
    if (existingUsers.some((u: any) => u.email === formData.email)) {
      return toast({ title: 'Error', description: 'Email already exists! Please login.', variant: 'destructive' });
    }

    // Save new user
    existingUsers.push(formData);
    localStorage.setItem('skillSage_users', JSON.stringify(existingUsers));
    
    // Auto-login after signup
    localStorage.setItem('skillSage_currentUser', formData.username);
    setCurrentUser(formData.username);
    
    toast({ title: 'Welcome!', description: `Account created successfully for ${formData.username}!` });
    setAuthModal(null);
    setFormData({ username: '', email: '', password: '' }); // Clear form
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      return toast({ title: 'Error', description: 'Please enter email and password', variant: 'destructive' });
    }

    const existingUsers = JSON.parse(localStorage.getItem('skillSage_users') || '[]');
    const user = existingUsers.find((u: any) => u.email === formData.email && u.password === formData.password);

    if (user) {
      localStorage.setItem('skillSage_currentUser', user.username);
      setCurrentUser(user.username);
      toast({ title: 'Welcome back!', description: `Successfully logged in as ${user.username}` });
      setAuthModal(null);
      setFormData({ username: '', email: '', password: '' });
    } else {
      toast({ title: 'Login Failed', description: 'Invalid email or password', variant: 'destructive' });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('skillSage_currentUser');
    setCurrentUser(null);
    toast({ title: 'Logged Out', description: 'You have been successfully logged out.' });
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
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
            <div className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => { e.preventDefault(); scrollToSection(item.href); }}
                  className="px-3 py-2 text-sm font-medium rounded-lg transition-all hover:bg-white/10 text-white/80 hover:text-white"
                >
                  {item.label}
                </a>
              ))}
            </div>

            {/* Desktop Actions (Auth + CTA) */}
            <div className="hidden md:flex items-center gap-3">
              {currentUser ? (
                // LOGGED IN VIEW
                <div className="flex items-center gap-4 bg-white/5 pl-3 pr-1 py-1 rounded-full border border-white/10">
                  <div className="flex items-center gap-2">
                    <div className="bg-primary/20 p-1.5 rounded-full">
                      <User className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-sm font-semibold text-white mr-2">Hi, {currentUser}</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleLogout}
                    className="text-white hover:bg-red-500/20 hover:text-red-400 rounded-full px-3 h-8"
                  >
                    <LogOut className="w-4 h-4 mr-1.5" />
                    Logout
                  </Button>
                </div>
              ) : (
                // LOGGED OUT VIEW
                <>
                  <Button
                    variant="ghost"
                    onClick={() => setAuthModal('login')}
                    className="text-white hover:bg-white/10 hover:text-white font-medium flex items-center gap-2"
                  >
                    <LogIn className="w-4 h-4" />
                    Login
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setAuthModal('signup')}
                    className="bg-transparent border-white/20 text-white hover:bg-white/10 hover:text-white font-medium flex items-center gap-2"
                  >
                    <UserPlus className="w-4 h-4" />
                    Sign Up
                  </Button>
                </>
              )}
              
              <Button
                onClick={onScrollToUpload}
                className="bg-white text-primary hover:bg-white/90 font-semibold ml-2"
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
          <div className="md:hidden absolute top-full left-0 right-0 bg-[#1A1A2E]/95 backdrop-blur-lg border-t border-white/10 shadow-xl pb-4">
            <div className="px-4 py-4 space-y-1">
              
              {/* Mobile Logged In User Greeting */}
              {currentUser && (
                <div className="flex items-center gap-3 px-4 py-3 mb-2 bg-white/5 rounded-lg border border-white/10">
                   <div className="bg-primary/20 p-2 rounded-full">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <span className="font-semibold text-white">Welcome, {currentUser}</span>
                </div>
              )}

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
              
              <div className="h-px bg-white/10 my-4" />
              
              <div className="space-y-3 px-2">
                {currentUser ? (
                  <Button
                    variant="ghost"
                    onClick={handleLogout}
                    className="w-full justify-start text-red-400 hover:bg-red-500/20 hover:text-red-400"
                  >
                    <LogOut className="w-4 h-4 mr-3" />
                    Logout
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="ghost"
                      onClick={() => { setAuthModal('login'); setIsMobileMenuOpen(false); }}
                      className="w-full justify-start text-white hover:bg-white/10 hover:text-white"
                    >
                      <LogIn className="w-4 h-4 mr-3" />
                      Login
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => { setAuthModal('signup'); setIsMobileMenuOpen(false); }}
                      className="w-full justify-start bg-transparent border-white/20 text-white hover:bg-white/10 hover:text-white"
                    >
                      <UserPlus className="w-4 h-4 mr-3" />
                      Sign Up
                    </Button>
                  </>
                )}
                
                <Button
                  onClick={() => {
                    onScrollToUpload();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full bg-white text-primary hover:bg-white/90 font-semibold mt-2"
                >
                  Upload Resume
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* --- AUTHENTICATION MODALS --- */}
      {authModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-[#1A1A2E] border border-white/10 p-6 md:p-8 rounded-2xl w-full max-w-md shadow-2xl relative">
            
            {/* Close Button */}
            <button 
              onClick={() => setAuthModal(null)}
              className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-4">
                <Brain className="h-7 w-7 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">
                {authModal === 'login' ? 'Welcome Back' : 'Create an Account'}
              </h2>
              <p className="text-sm text-white/60 mt-2">
                {authModal === 'login' 
                  ? 'Enter your details to access your dashboard' 
                  : 'Start your journey with SkillSage AI today'}
              </p>
            </div>

            <form onSubmit={authModal === 'login' ? handleLogin : handleSignUp} className="space-y-4">
              
              {authModal === 'signup' && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/80">Username</label>
                  <Input 
                    type="text" 
                    placeholder="JohnDoe"
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30 h-11"
                  />
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80">Email</label>
                <Input 
                  type="email" 
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30 h-11"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80">Password</label>
                <Input 
                  type="password" 
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30 h-11"
                />
              </div>

              <Button type="submit" className="w-full h-11 text-base font-semibold mt-6">
                {authModal === 'login' ? 'Sign In' : 'Sign Up'}
              </Button>
            </form>

            <div className="text-center mt-6 text-sm text-white/60">
              {authModal === 'login' ? "Don't have an account? " : "Already have an account? "}
              <button 
                onClick={() => {
                  setAuthModal(authModal === 'login' ? 'signup' : 'login');
                  setFormData({ username: '', email: '', password: '' });
                }}
                className="text-primary font-semibold hover:underline"
              >
                {authModal === 'login' ? 'Sign Up' : 'Log In'}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Scroll to Top Button */}
      {isScrolled && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-30 w-12 h-12 rounded-full bg-primary text-white shadow-lg hover:bg-primary/90 transition-all hover:scale-110 flex items-center justify-center"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}
    </>
  );
};

export default Navbar;