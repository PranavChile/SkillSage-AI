import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Bot, 
  Send, 
  User, 
  Loader2, 
  Briefcase, 
  Sparkles, 
  Trash2, 
  Mic, 
  Volume2, 
  Square 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export const CareerChatbot = () => {
  const { toast } = useToast();
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<string | null>(localStorage.getItem('skillSage_currentUser'));
  
  // Voice & Speech States
  const [isListening, setIsListening] = useState(false);
  const [speakingIndex, setSpeakingIndex] = useState<number | null>(null);

  const systemPrompt: Message = {
    role: 'system',
    content: `You are an expert Career Guidance Counselor for university students and recent graduates. 
    Your goal is to help students discover career paths, prepare for interviews, and upskill.
    Be extremely encouraging, highly practical, and concise. 
    Do not give long, generic essays. Ask probing questions to help the student figure out their true passions.
    Format your responses with clear bullet points and bold text for readability.`
  };

  const defaultGreeting: Message = {
    role: 'assistant',
    content: "Hi! I'm your personal Career Coach. Tell me a bit about what you're studying, or what kind of jobs you are aiming for!"
  };

  const [messages, setMessages] = useState<Message[]>([defaultGreeting]);

  // --- LIFECYCLE & MEMORY ---
  useEffect(() => {
    const handleAuthChange = () => setCurrentUser(localStorage.getItem('skillSage_currentUser'));
    window.addEventListener('auth_change', handleAuthChange);
    return () => window.removeEventListener('auth_change', handleAuthChange);
  }, []);

  useEffect(() => {
    if (currentUser) {
      const savedHistory = localStorage.getItem(`skillSage_chat_${currentUser}`);
      if (savedHistory) setMessages(JSON.parse(savedHistory));
      else setMessages([defaultGreeting]);
    } else {
      setMessages([defaultGreeting]);
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser && messages.length > 1) {
      localStorage.setItem(`skillSage_chat_${currentUser}`, JSON.stringify(messages));
    }
  }, [messages, currentUser]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  // Cleanup speech synthesis if component unmounts
  useEffect(() => {
    return () => window.speechSynthesis.cancel();
  }, []);


  // --- CHATGPT FEATURES (DELETE & VOICE) ---

  const deleteMessage = (indexToDelete: number) => {
    const updatedMessages = messages.filter((_, index) => index !== indexToDelete);
    setMessages(updatedMessages);
    
    // Stop speaking if the deleted message was currently being read
    if (speakingIndex === indexToDelete) {
      window.speechSynthesis.cancel();
      setSpeakingIndex(null);
    }
    
    toast({ description: 'Message deleted' });
  };

  const clearHistory = () => {
    if (currentUser) {
      localStorage.removeItem(`skillSage_chat_${currentUser}`);
      setMessages([defaultGreeting]);
      window.speechSynthesis.cancel();
      setSpeakingIndex(null);
      toast({ title: 'History Cleared', description: 'Your conversation has been reset.' });
    }
  };

  const handleVoiceInput = () => {
    // Check for browser support
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      return toast({ 
        title: 'Not Supported', 
        description: 'Voice input is not supported in your browser. Please use Chrome or Edge.', 
        variant: 'destructive' 
      });
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput((prev) => prev ? `${prev} ${transcript}` : transcript);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognition.start();
  };

  const toggleSpeech = (text: string, index: number) => {
    // If clicking the currently speaking message, stop it.
    if (speakingIndex === index) {
      window.speechSynthesis.cancel();
      setSpeakingIndex(null);
      return;
    }

    // Otherwise, cancel any ongoing speech and start this new one
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Make the voice sound a bit more natural (optional tweaking)
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    
    utterance.onend = () => setSpeakingIndex(null);
    utterance.onerror = () => setSpeakingIndex(null);
    
    setSpeakingIndex(index);
    window.speechSynthesis.speak(utterance);
  };


  // --- API LOGIC ---

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const conversationHistory = [systemPrompt, ...messages, userMessage];

      const response = await fetch('http://localhost:11434/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'mistral',
          messages: conversationHistory,
          stream: false,
          options: { temperature: 0.7 }
        }),
      });

      if (!response.ok) throw new Error('Ollama connection failed');

      const data = await response.json();
      const botMessage: Message = { role: 'assistant', content: data.message.content };

      setMessages((prev) => [...prev, botMessage]);

    } catch (error) {
      console.error('Chat Error:', error);
      toast({
        title: 'Connection Error',
        description: 'Make sure Ollama is running in the background.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 rounded-full mb-4">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-600">Always Available</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
            Career Guidance Chat
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Have a conversation with your personal AI career coach to map out your future.
          </p>
        </div>

        <Card className="border-border/50 shadow-lg flex flex-col h-[650px] overflow-hidden relative">
          
          {/* LOGIN OVERLAY */}
          {!currentUser && (
            <div className="absolute inset-0 z-10 bg-background/60 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
              <div className="bg-card border border-border/50 shadow-xl p-8 rounded-2xl max-w-md w-full">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Sign in to start chatting</h3>
                <p className="text-muted-foreground mb-6 text-sm">
                  Please log in or create an account at the top of the page to save your conversation history and get personalized advice.
                </p>
                <Button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                  Go to Login
                </Button>
              </div>
            </div>
          )}

          <CardHeader className="bg-muted/50 border-b border-border/50 py-4 flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-3 text-lg m-0">
              <div className="bg-primary/10 p-2 rounded-full">
                <Briefcase className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div>SkillSage Guide</div>
                <div className="text-xs text-green-500 font-normal flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  Online (Local AI)
                </div>
              </div>
            </CardTitle>
            
            {/* Clear Entire Chat Button */}
            {currentUser && messages.length > 1 && (
              <Button variant="ghost" size="sm" onClick={clearHistory} className="text-muted-foreground hover:text-red-500">
                <Trash2 className="w-4 h-4 mr-2" />
                Clear Chat
              </Button>
            )}
          </CardHeader>

          {/* CHAT MESSAGES AREA */}
          <CardContent className="flex-1 p-0 overflow-hidden relative">
            <div ref={scrollRef} className="h-full overflow-y-auto p-4 sm:p-6 space-y-6">
              {messages.map((msg, index) => (
                <div key={index} className={`flex group ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex gap-3 max-w-[85%] sm:max-w-[75%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    
                    {/* Avatar */}
                    <div className="flex-shrink-0 mt-1">
                      {msg.role === 'user' ? (
                        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                          <Bot className="w-5 h-5 text-primary" />
                        </div>
                      )}
                    </div>

                    {/* Message Content & Action Bar */}
                    <div className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                      <div 
                        className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                          msg.role === 'user' 
                            ? 'bg-blue-600 text-white rounded-tr-none' 
                            : 'bg-muted border border-border/50 text-foreground rounded-tl-none shadow-sm'
                        }`}
                      >
                        {msg.content}
                      </div>

                      {/* Action Bar (Hover to reveal tools) */}
                      <div className={`flex items-center gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                        
                        {/* Text-to-Speech Button (Only for AI messages) */}
                        {msg.role === 'assistant' && (
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className={`h-7 w-7 rounded-full ${speakingIndex === index ? 'text-primary bg-primary/10' : 'text-muted-foreground'}`}
                            onClick={() => toggleSpeech(msg.content, index)}
                            title={speakingIndex === index ? "Stop speaking" : "Read aloud"}
                          >
                            {speakingIndex === index ? <Square className="w-3.5 h-3.5 fill-current" /> : <Volume2 className="w-3.5 h-3.5" />}
                          </Button>
                        )}
                        
                        {/* Delete Single Message Button (Hide for the very first greeting) */}
                        {index !== 0 && (
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-7 w-7 rounded-full text-muted-foreground hover:text-red-500 hover:bg-red-500/10"
                            onClick={() => deleteMessage(index)}
                            title="Delete message"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        )}

                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Loading State */}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex gap-3 max-w-[80%]">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                        <Bot className="w-5 h-5 text-primary" />
                      </div>
                    </div>
                    <div className="px-4 py-3 rounded-2xl bg-muted border border-border/50 rounded-tl-none shadow-sm flex items-center gap-2">
                      <Loader2 className="w-4 h-4 text-primary animate-spin" />
                      <span className="text-sm text-muted-foreground">SkillSage is thinking...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>

          {/* INPUT AREA WITH MIC */}
          <div className="p-4 bg-background border-t border-border/50">
            <div className="flex gap-2 sm:gap-3 items-center">
              
              {/* Voice Input Button */}
              <Button
                variant={isListening ? "destructive" : "outline"}
                size="icon"
                onClick={handleVoiceInput}
                disabled={isLoading || !currentUser}
                className={`h-12 w-12 rounded-full flex-shrink-0 transition-all ${isListening ? 'animate-pulse bg-red-500 hover:bg-red-600' : ''}`}
                title="Dictate message"
              >
                <Mic className={`w-5 h-5 ${isListening ? 'text-white' : ''}`} />
              </Button>

              <Input
                placeholder={isListening ? "Listening..." : currentUser ? "Ask for career advice..." : "Please log in to chat..."}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                disabled={isLoading || !currentUser}
                className="flex-1 focus-visible:ring-primary h-12"
              />
              
              <Button 
                onClick={sendMessage} 
                disabled={isLoading || !input.trim() || !currentUser}
                className="h-12 w-12 rounded-full p-0 flex-shrink-0"
              >
                <Send className="w-5 h-5 ml-1" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default CareerChatbot;