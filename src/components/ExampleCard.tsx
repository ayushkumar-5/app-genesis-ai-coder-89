
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

interface ExampleCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  prompt: string;
  language: string;
}

export default function ExampleCard({ title, description, icon, prompt, language }: ExampleCardProps) {
  const navigate = useNavigate();

  const handleTryExample = () => {
    navigate('/result', { 
      state: { 
        prompt, 
        language,
        isExample: true 
      } 
    });
  };

  return (
    <Card className="hover:shadow-md transition-all duration-200 h-full">
      <CardHeader>
        <div className="flex items-center gap-2 mb-2">
          {icon}
          <CardTitle>{title}</CardTitle>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-3">
          {prompt}
        </p>
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          className="w-full" 
          onClick={handleTryExample}
        >
          Try Example
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
