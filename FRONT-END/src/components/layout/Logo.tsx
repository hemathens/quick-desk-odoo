import { HelpCircle } from "lucide-react";
import logoImage from "@/assets/quickdesk-logo.png";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  animated?: boolean;
}

export const Logo = ({ size = "md", showText = true, animated = false }: LogoProps) => {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8", 
    lg: "w-12 h-12"
  };

  const textSizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl"
  };

  return (
    <div className={`flex items-center space-x-2 ${animated ? 'hover-scale' : ''}`}>
      <div className={`${sizeClasses[size]} flex items-center justify-center relative overflow-hidden rounded-lg`}>
        <img 
          src={logoImage} 
          alt="QuickDesk Logo" 
          className={`${sizeClasses[size]} object-contain ${animated ? 'transition-transform duration-300 hover:rotate-12' : ''}`}
        />
      </div>
      {showText && (
        <span className={`${textSizeClasses[size]} font-bold text-foreground`}>
          QuickDesk
        </span>
      )}
    </div>
  );
};