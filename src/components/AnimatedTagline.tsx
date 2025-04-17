
import { useEffect, useState } from "react";

export default function AnimatedTagline() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="overflow-hidden mt-4 mb-8">
      <h2 
        className={`text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto transition-all duration-700 ${
          isVisible ? "opacity-100 transform-none" : "opacity-0 translate-y-8"
        }`}
      >
        <span className="shimmer inline-block">
          Transform Your Ideas Into Production-Ready Code with AI
        </span>
      </h2>
    </div>
  );
}
