
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, ChevronDown, ChevronRight, RefreshCw, Smartphone, Layers, Package } from 'lucide-react';

import Logo from '@/components/Logo';
import ThemeToggle from '@/components/ThemeToggle';
import AnimatedTagline from '@/components/AnimatedTagline';
import ExampleCard from '@/components/ExampleCard';
import LanguageToggle from '@/components/LanguageToggle';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from "sonner";

const Home = () => {
  const [prompt, setPrompt] = useState('');
  const [language, setLanguage] = useState('kotlin');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleGenerateCode = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt to generate code.");
      return;
    }

    setIsLoading(true);
    
    try {
      navigate('/result', { 
        state: { 
          prompt, 
          language,
          isExample: false 
        } 
      });
    } catch (error) {
      console.error('Error generating code:', error);
      toast.error("Failed to generate code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const examples = [
    {
      title: "Todo App",
      description: "Create a simple todo application",
      icon: <Layers className="h-5 w-5 text-emerald-500" />,
      prompt: "Create a simple todo application with a list view, ability to add new items, mark items as completed, and delete items.",
      language: "kotlin",
    },
    {
      title: "RSS Feed Reader",
      description: "Build a news reader app",
      icon: <Smartphone className="h-5 w-5 text-blue-500" />,
      prompt: "Build a news reader app that fetches RSS data, displays articles in a list, and allows reading full articles in a detail view.",
      language: "swift",
    },
    {
      title: "Weather App",
      description: "Create a weather application",
      icon: <Package className="h-5 w-5 text-purple-500" />,
      prompt: "Create a weather app that shows current conditions and forecasts for a user's location with beautiful UI components and animations.",
      language: "dart",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container flex justify-between items-center py-4">
          <Logo />
          <div className="flex items-center gap-4">
            <LanguageToggle language={language} setLanguage={setLanguage} />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="py-12 text-center">
          <div className="container px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight animate-fadeIn">
              App Genesis
            </h1>
            <AnimatedTagline />
          </div>
        </section>

        <section className="container px-4 sm:px-6 lg:px-8 py-6">
          <div className="max-w-3xl mx-auto">
            <div className="bg-card border rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Describe Your App</h2>
              <Textarea 
                placeholder="Describe the app you want to create in detail... Be specific about functionality, UI components, and features." 
                className="min-h-32 mb-4 focus:ring-2 focus:ring-primary"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
              <Button 
                onClick={handleGenerateCode} 
                className="w-full py-6" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Zap className="mr-2 h-4 w-4" />
                    Generate Code
                  </>
                )}
              </Button>
            </div>
          </div>
        </section>

        <section className="container px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Examples to try</h2>
            <Button variant="ghost" className="text-muted-foreground">
              View all
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {examples.map((example, index) => (
              <ExampleCard 
                key={index} 
                {...example} 
              />
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t py-6">
        <div className="container flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Logo className="text-sm" />
            <span className="text-sm text-muted-foreground">© 2025 App Genesis. All rights reserved.</span>
          </div>
          <div className="flex gap-4">
            <Button variant="link" size="sm" className="text-muted-foreground">Terms</Button>
            <Button variant="link" size="sm" className="text-muted-foreground">Privacy</Button>
            <Button variant="link" size="sm" className="text-muted-foreground">Contact</Button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
