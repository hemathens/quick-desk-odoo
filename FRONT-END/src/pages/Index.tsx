import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Users, TrendingUp, ArrowRight, Zap, Shield, Clock, Star, CheckCircle, Sparkles } from "lucide-react";
import { Logo } from "@/components/layout/Logo";
import { AnimatedBackground } from "@/components/layout/AnimatedBackground";
import { FeatureCard } from "@/components/layout/FeatureCard";
const Index = () => {
  const navigate = useNavigate();
  const statsRef = useRef(null);
  const [counters, setCounters] = useState([0, 0, 0, 0]);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    // Check if user is logged in and redirect to dashboard
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/dashboard');
    }
  }, [navigate]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);
            // Start counter animations
            const targets = [250, 520, 120, 12];
            const duration = 2000;
            const steps = 60;
            
            targets.forEach((target, index) => {
              let current = 0;
              const increment = target / steps;
              const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                  current = target;
                  clearInterval(timer);
                }
                setCounters(prev => {
                  const newCounters = [...prev];
                  newCounters[index] = Math.floor(current);
                  return newCounters;
                });
              }, duration / steps);
            });
          }
        });
      },
      { threshold: 0.5 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => {
      if (statsRef.current) {
        observer.unobserve(statsRef.current);
      }
    };
  }, [hasAnimated]);
  const features = [{
   icon: MessageCircle,
    title: "Submit a Ticket",
    description: "Easily submit support tickets with a user-friendly interface. Let us take care of your tech issues."
  }, {
    icon: Users,
    title: "Dedicated Support",
    description: "Our support staff is ready to assist you 24/7, ensuring all your queries are addressed promptly."
  }, {
    icon: TrendingUp,
    title: "Monitor Tickets",
    description: "Keep track of your ticket status with real-time updates and comprehensive ticket history."
  }, {
    icon: Zap,
    title: "Efficient Solutions",
    description: "Experience swift resolutions with our streamlined processes built for speed and accuracy."
  }, {
    icon: Shield,
    title: "Data Protection",
    description: "Your tickets and data are secure with our industry-grade protection protocols."
  }, {
    icon: Clock,
    title: "24/7 Availability",
    description: "Access help whenever you need it, anytime, anywhere."
  }];
  const testimonials = [{
    name: "Sarah Chen",
    role: "Frontend Developer",
    company: "TechCorp",
    content: "QuickDesk's simple interface made it so easy to submit a support ticket. The team resolved my issue quickly and professionally.",
    rating: 5
  }, {
    name: "Marcus Rodriguez",
    role: "DevOps Engineer",
    company: "CloudScale",
    content: "The support staff are incredibly knowledgeable and responsive. No unnecessary complexity - just efficient problem solving.",
    rating: 5
  }, {
    name: "Emily Johnson",
    role: "Product Manager",
    company: "InnovateTech",
    content: "Finally, a help desk solution that's actually easy to use! Our team can focus on work instead of wrestling with complicated support systems.",
    rating: 5
  }];
  const stats = [{
    label: "Tickets Resolved",
    suffix: "solved"
  }, {
    label: "Active Users", 
    suffix: "users"
  }, {
    label: "Support Staff",
    suffix: "agents"
  }, {
    label: "Avg Response Time",
    suffix: "minutes"
  }];
  return <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-card/80 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Logo animated={true} />
  
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => navigate('/login')} className="hover-scale">
                Sign In
              </Button>
              <Button className="btn-primary hover-glow" onClick={() => navigate('/register')}>
                <Sparkles className="w-4 h-4 mr-2" />
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden min-h-[90vh] flex items-center">
        <AnimatedBackground />
        
        <div className="relative max-w-7xl mx-auto text-center">
          <div className="mb-12 animate-fade-in">
            <Badge className="badge-primary mb-6 animate-bounce-in text-sm px-4 py-2 bg-slate-950">
              <Zap className="w-4 h-4 mr-2" />
              Simple Help Desk Solution
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-foreground mb-6 text-balance animate-scale-in leading-tight">
              Simple Help Desk{' '}
              <span className="relative inline-block mx-[10px] my-[10px]">
                <span className="gradient-hero bg-clip-text animate-shimmer bg-[length:200%_auto] sm:text-7xl text-justify text-5xl font-extrabold text-amber-500">Solution</span>
                
              </span>
            </h1>
            <p className="text-xl sm:text-2xl text-muted-foreground mb-10 max-w-4xl mx-auto text-balance animate-slide-up font-light leading-relaxed" style={{
            animationDelay: '0.2s'
          }}>
              Raise support tickets effortlessly and let our support staff manage and resolve them efficiently. 
              Streamlined communication without unnecessary complexity.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center gap-6 mb-16 animate-slide-up" style={{
          animationDelay: '0.4s'
        }}>
            <Button size="lg" className="btn-primary text-lg px-10 py-4 hover-glow relative overflow-hidden group" onClick={() => navigate('/register')}>
              <span className="relative z-10">Create Support Ticket</span>
              <ArrowRight className="ml-3 w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
              <div className="absolute inset-0 bg-gradient-to-r from-primary-hover to-primary opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-10 py-4 glass-effect hover-scale border-2 hover:border-primary/50 group" onClick={() => navigate('/dashboard')}>
              <span className="group-hover:text-primary transition-colors">Browse Tickets</span>
            </Button>
          </div>

          {/* Stats */}
          <div ref={statsRef} className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto animate-slide-up" style={{
          animationDelay: '0.6s'
        }}>
            {stats.map((stat, index) => <div key={index} className="text-center hover-lift group">
                <div className="backdrop-blur-sm rounded-2xl p-6 border border-border/50 group-hover:border-primary/30 transition-all duration-300 bg-card/80">
                  <div className="text-4xl lg:text-5xl font-bold text-primary mb-2 group-hover:scale-110 transition-transform">
                    {counters[index]}
                  </div>
                  <div className="text-sm font-medium text-foreground mb-1">
                    {stat.label}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {stat.suffix}
                  </div>
                </div>
              </div>)}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-muted/30 to-background relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 animate-fade-in">
            <Badge className="badge-primary mb-6 text-sm px-4 py-2">
              <Star className="w-4 h-4 mr-2" />
              Trusted by 5K+ Users
            </Badge>
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6 text-balance">
              Everything you need for{' '}
              <span className="gradient-hero bg-clip-text text-transparent">efficient support</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Simple, streamlined help desk tools designed to connect you with the support you need, when you need it.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mb-20">
            {features.map((feature, index) => <FeatureCard key={index} icon={feature.icon} title={feature.title} description={feature.description} index={index} />)}
          </div>

          {/* Testimonials */}
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-foreground mb-4">What users are saying</h3>
            <p className="text-muted-foreground">Real feedback from our satisfied customers</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => <div key={index} className="glass-morphism rounded-xl p-6 hover-lift animate-fade-in transition-all duration-300" style={{
            animationDelay: `${index * 0.2}s`
          }}>
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => <Star key={i} className="w-4 h-4 fill-warning text-warning" />)}
                </div>
                <p className="text-foreground mb-4 italic">"{testimonial.content}"</p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center mr-3">
                    <span className="text-primary font-semibold">{testimonial.name.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role} at {testimonial.company}</p>
                  </div>
                </div>
              </div>)}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-primary/5"></div>
        <div className="relative max-w-5xl mx-auto text-center">
          <div className="bg-card/80 backdrop-blur-lg rounded-3xl p-12 border border-border/50 hover-lift">
            <Badge className="badge-primary mb-6 text-sm px-4 py-2 animate-glow">
              <CheckCircle className="w-4 h-4 mr-2" />
              Free to Join
            </Badge>
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6 text-balance">
              Ready to level up your{' '}
              <span className="gradient-hero bg-clip-text text-transparent">coding skills?</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Join thousands of developers who are already getting the help they need to build better software.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Button size="lg" className="btn-primary text-lg px-10 py-4 hover-glow relative overflow-hidden group" onClick={() => navigate('/register')}>
                <span className="relative z-10">Create Free Account</span>
                <Sparkles className="ml-3 w-5 h-5 relative z-10" />
                <div className="absolute inset-0 bg-gradient-to-r from-primary-hover to-primary opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-10 py-4 glass-effect hover-scale" onClick={() => navigate('/login')}>
                Sign In
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-6">
              No credit card required • Join 5,000+ developers • Free forever
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 backdrop-blur-sm py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <Logo size="lg" />
            <p className="text-muted-foreground mt-4 max-w-md mx-auto">
              Providing simple, efficient help desk solutions that streamline communication between users and support teams.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-semibold text-foreground mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Community</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Discord</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">GitHub</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Status</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Security</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border pt-8 text-center">
            <p className="text-sm text-muted-foreground">
              © 2024 QuickDesk. Built with ❤️ for developers, by developers.
            </p>
          </div>
        </div>
      </footer>
    </div>;
};
export default Index;