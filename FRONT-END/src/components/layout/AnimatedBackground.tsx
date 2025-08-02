export const AnimatedBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Animated Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_24px,hsl(var(--border)/0.2)_25px,hsl(var(--border)/0.2)_26px,transparent_27px,transparent_49px,hsl(var(--border)/0.2)_50px),linear-gradient(180deg,transparent_24px,hsl(var(--border)/0.2)_25px,hsl(var(--border)/0.2)_26px,transparent_27px,transparent_49px,hsl(var(--border)/0.2)_50px)] bg-[length:50px_50px] opacity-30 animate-grid-move"></div>
      
      {/* Pulsing Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_48px,hsl(var(--primary)/0.1)_49px,hsl(var(--primary)/0.1)_51px,transparent_52px,transparent_98px,hsl(var(--primary)/0.1)_100px),linear-gradient(180deg,transparent_48px,hsl(var(--primary)/0.1)_49px,hsl(var(--primary)/0.1)_51px,transparent_52px,transparent_98px,hsl(var(--primary)/0.1)_100px)] bg-[length:100px_100px] opacity-20 animate-pulse"></div>
      
      {/* Moving Grid Lines */}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,hsl(var(--primary)/0.05)_50%,transparent_100%)] animate-slide-x"></div>
      <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,hsl(var(--accent)/0.05)_50%,transparent_100%)] animate-slide-y"></div>
      
      {/* Subtle Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/3 via-transparent to-accent/3"></div>
      
      {/* Static Orbs for Depth */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-accent/5 rounded-full blur-3xl"></div>
    </div>
  );
};