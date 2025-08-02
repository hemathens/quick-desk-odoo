import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { useRef, useEffect } from "react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  index: number;
}

export const FeatureCard = ({ icon: Icon, title, description, index }: FeatureCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / 10;
      const rotateY = (centerX - x) / 10;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(0)`;
    };

    const handleMouseLeave = () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0)';
    };

    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <Card 
      ref={cardRef}
      className="glass-morphism hover-lift animate-scale-in group relative overflow-hidden transition-all duration-300" 
      style={{ 
        animationDelay: `${index * 0.1}s`,
        transformStyle: 'preserve-3d'
      }}
    >
      {/* Glassmorphism background */}
      <div className="absolute inset-0 bg-card/70 backdrop-blur-xl border border-border/50"></div>
      
      {/* Hover glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <CardHeader className="text-center relative z-10">
        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary/20 to-primary-hover/20 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-primary/20">
          <Icon className="w-8 h-8 text-primary" />
        </div>
        <CardTitle className="text-xl group-hover:text-primary transition-colors duration-300">{title}</CardTitle>
      </CardHeader>
      <CardContent className="relative z-10">
        <CardDescription className="text-center text-base group-hover:text-foreground transition-colors duration-300">
          {description}
        </CardDescription>
      </CardContent>
    </Card>
  );
};