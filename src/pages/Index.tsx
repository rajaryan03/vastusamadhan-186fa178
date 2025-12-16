import { BusinessForm } from "@/components/BusinessForm";

const Index = () => {
  return (
    <div className="min-h-screen bg-background bg-pattern-ancient relative overflow-hidden">
      {/* Mandala Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Central Mandala Pattern */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150vmax] h-[150vmax] bg-pattern-mandala opacity-30 animate-spin-slow" />
        
        {/* Floating Gold Orbs */}
        <div className="absolute top-20 left-[10%] w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-40 right-[10%] w-80 h-80 bg-primary/4 rounded-full blur-3xl animate-float-slow" style={{ animationDelay: "2s" }} />
        <div className="absolute top-1/2 left-[5%] w-40 h-40 bg-accent/6 rounded-full blur-2xl animate-float" style={{ animationDelay: "4s" }} />
        
        {/* Floating Diyas */}
        <div className="absolute top-[35%] left-[8%] text-3xl animate-diya opacity-60" style={{ filter: "drop-shadow(0 0 8px hsl(38 92% 50% / 0.5))" }}>🪔</div>
        <div className="absolute top-[40%] right-[8%] text-2xl animate-diya opacity-50" style={{ animationDelay: "1.5s", filter: "drop-shadow(0 0 8px hsl(38 92% 50% / 0.5))" }}>🪔</div>
        <div className="absolute bottom-[30%] left-[15%] text-2xl animate-diya opacity-40" style={{ animationDelay: "0.8s", filter: "drop-shadow(0 0 8px hsl(38 92% 50% / 0.5))" }}>🪔</div>
        
        {/* Decorative Om Symbol */}
        <div className="absolute bottom-[20%] right-[12%] text-6xl text-primary/[0.06] font-serif animate-float-slow" style={{ animationDelay: "3s" }}>ॐ</div>
        
        {/* Corner Ornaments */}
        <div className="absolute top-8 left-8 text-2xl text-primary/20 font-serif">❋</div>
        <div className="absolute top-8 right-8 text-2xl text-primary/20 font-serif rotate-90">❋</div>
        <div className="absolute bottom-8 left-8 text-2xl text-primary/20 font-serif -rotate-90">❋</div>
        <div className="absolute bottom-8 right-8 text-2xl text-primary/20 font-serif rotate-180">❋</div>
        
        {/* Gold Dust Particles */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-primary"
            style={{
              top: `${15 + (i * 10) % 70}%`,
              left: `${8 + (i * 12) % 85}%`,
              opacity: 0.4,
              animation: `twinkle ${2 + (i % 2)}s ease-in-out infinite`,
              animationDelay: `${i * 0.4}s`,
              boxShadow: "0 0 6px hsl(38 92% 50% / 0.6)"
            }}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12 md:py-16">
        {/* Header Section */}
        <header className="text-center mb-10 md:mb-14 animate-fade-in">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <span className="text-4xl text-primary font-serif font-bold">॥</span>
            <span className="text-3xl font-serif font-semibold text-foreground">
              Vastu<span className="text-primary">Samadhan</span>
            </span>
          </div>

          {/* Decorative Top Element */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className="text-xl text-primary/40 font-serif">☙</span>
            <span className="text-xs text-primary/60">◈</span>
            <span className="text-2xl text-primary animate-pulse-glow">✾</span>
            <span className="text-xs text-primary/60">◈</span>
            <span className="text-xl text-primary/40 font-serif scale-x-[-1]">☙</span>
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 mb-6">
            <span className="text-lg">🏛️</span>
            <span className="text-sm font-medium text-foreground/80 tracking-wide uppercase">
              Pre-Testing Registration
            </span>
          </div>
          
          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-semibold text-foreground mb-3 leading-tight">
            Begin Your{" "}
            <span className="text-gradient-gold">Journey</span>
          </h1>
          
          {/* Ornate Divider */}
          <div className="flex items-center justify-center gap-3 my-6">
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
            <span className="text-primary/60 text-xs">✦</span>
            <div className="w-10 h-10 rounded-full border border-primary/30 flex items-center justify-center bg-primary/5">
              <span className="text-primary text-lg">❁</span>
            </div>
            <span className="text-primary/60 text-xs">✦</span>
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
          </div>
          
          <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Share your details with us and unlock personalized insights rooted in ancient wisdom, crafted for modern living.
          </p>
        </header>

        {/* Form Card */}
        <main className="max-w-2xl mx-auto">
          <div className="relative glass rounded-3xl shadow-card p-6 md:p-10 animate-scale-in card-hover">
            {/* Decorative Top Border Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full opacity-60" />
            
            {/* Corner Decorations */}
            <div className="absolute top-4 left-4 text-primary/20 text-sm">✦</div>
            <div className="absolute top-4 right-4 text-primary/20 text-sm">✦</div>
            <div className="absolute bottom-4 left-4 text-primary/20 text-sm">✦</div>
            <div className="absolute bottom-4 right-4 text-primary/20 text-sm">✦</div>
            
            <BusinessForm />
          </div>

          {/* Trust Indicators */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground animate-fade-in" style={{ animationDelay: "0.6s" }}>
            {[
              { icon: "🔒", text: "Secure & Private" },
              { icon: "🤝", text: "100% Confidential" },
              { icon: "✨", text: "Expert Analysis" }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-lg">{item.icon}</span>
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </main>

        {/* Footer */}
        <footer className="mt-16 text-center animate-fade-in" style={{ animationDelay: "0.7s" }}>
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="w-12 h-px bg-gradient-to-r from-transparent to-primary/30" />
            <span className="text-primary/40">❁</span>
            <div className="w-12 h-px bg-gradient-to-r from-primary/30 to-transparent" />
          </div>
          <p className="text-sm text-muted-foreground font-medium">
            Ancient wisdom meets modern precision
          </p>
          <p className="text-xs text-muted-foreground/60 mt-1">
            वास्तु शास्त्रं गृहं रक्षति
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;