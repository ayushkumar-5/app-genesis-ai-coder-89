
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
}

export default function Logo({ className }: LogoProps) {
  return (
    <div className={cn("flex items-center", className)}>
      <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
        <rect width="38" height="38" rx="8" fill="hsl(var(--primary))" />
        <path d="M13 25V13L25 19L13 25Z" fill="white" />
      </svg>
      <span className="font-bold text-xl text-foreground">App Genesis</span>
    </div>
  );
}
