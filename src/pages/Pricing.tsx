import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FloatingHearts } from "@/components/ui/HeartIcon";
import { Badge } from "@/components/ui/badge";
import { 
  Check, 
  Sparkles, 
  Crown,
  Heart,
  ArrowRight,
  Zap,
  Star
} from "lucide-react";

const plans = [
  {
    name: "First Crush",
    price: 199,
    templates: 5,
    popular: false,
    description: "Perfect for your first love letter",
  },
  {
    name: "True Love",
    price: 499,
    templates: 10,
    popular: true,
    description: "For those who want to express more",
  },
  {
    name: "Forever Valentine",
    price: 999,
    templates: "Unlimited",
    popular: false,
    description: "Unlimited love, unlimited pages",
  },
];

const features = {
  premium: [
    "Premium themes",
    "AI love story generator",
    "AI letter composer",
    "Password protection",
    "My Valentine",
    "Countdown timer",
    "PDF magazine export",
    "Advanced animations",
    "Priority support",
  ],
};

const featurePricing = [
  { name: "Premium Theme", icon: Crown },
  { name: "AI Story Generation", icon: Sparkles },
  { name: "AI Love Letter", icon: Heart },
  { name: "Password Protection", icon: Check },
  { name: "My Valentine", icon: Star },
  { name: "PDF Magazine Export", icon: Check },
];

export default function Pricing() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-hero-romantic py-20 md:py-28">
          <FloatingHearts />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,hsl(var(--accent)/0.2),transparent_60%)]" />
          
          <div className="container relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6 animate-fade-in backdrop-blur-sm border border-primary/20">
                <Heart className="h-4 w-4" />
                <span className="text-sm font-medium">Made for Real Love</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-display font-bold text-foreground mb-6 animate-fade-in-up">
                Love Shouldn't Be{" "}
                <span className="text-gradient-romantic">Free Trial</span>
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground mb-8 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
                Sure, you could use free tools… but if she's truly special, 
                maybe she deserves more than a copy-paste template? 💕
              </p>
            </div>
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
        </section>

        {/* Free vs Premium */}
        <section className="py-20 md:py-28">
          <div className="container">
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {/* Free Tier - Sarcastic Teaser Only */}
              <div className="card-romantic rounded-2xl p-8 animate-fade-in-up flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                      <Heart className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="font-display text-2xl font-bold">Free Forever</h3>
                      <p className="text-muted-foreground">₹0</p>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground mb-8 italic border-l-2 border-primary/30 pl-4 leading-relaxed">
                    "Free is great for pizza samples and trial gym memberships. 
                    But when it comes to telling someone they're your whole world? 
                    Maybe skip the budget version, Romeo." 😏
                    <br /><br />
                    Your love story deserves more than basic templates. 
                    She notices the effort. Trust us.
                  </p>
                </div>
                
                <Button asChild variant="outline" className="w-full">
                  <Link to="/login">
                    Start Free
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
              
              {/* Premium Features */}
              <div className="relative rounded-2xl p-8 animate-fade-in-up overflow-hidden" style={{ animationDelay: "0.1s" }}>
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10" />
                <div className="absolute inset-[1px] bg-card rounded-2xl" />
                
                <div className="relative">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-pink-400 flex items-center justify-center">
                      <Crown className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-display text-2xl font-bold">Premium Features</h3>
                      <p className="text-muted-foreground">Because she's worth it</p>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground mb-6">
                    Unlock powerful features to make your love page truly unforgettable.
                  </p>
                  
                  <ul className="space-y-3 mb-8">
                    {features.premium.map((feature) => (
                      <li key={feature} className="flex items-center gap-3">
                        <Sparkles className="h-5 w-5 text-primary shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button asChild className="w-full btn-romantic text-white">
                    <Link to="/login">
                      Make It Happen
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Plans Section */}
        <section className="py-20 md:py-28 bg-muted/30">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                Plans to{" "}
                <span className="text-gradient-romantic">Create</span>
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Choose the plan that matches how much love you want to express. 
                All plans are valid for 1 year from purchase.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {plans.map((plan, index) => (
                <div 
                  key={plan.name}
                  className={`relative rounded-2xl p-8 animate-fade-in-up ${
                    plan.popular 
                      ? 'border-2 border-primary shadow-romantic' 
                      : 'border border-border/50'
                  } bg-card`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {plan.popular && (
                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground">
                      Most Popular
                    </Badge>
                  )}
                  
                  <div className="text-center mb-6">
                    <h3 className="font-display text-xl font-bold mb-2">{plan.name}</h3>
                    <div className="flex items-baseline justify-center gap-1 mb-2">
                      <span className="text-4xl font-bold">₹{plan.price}</span>
                    </div>
                    <p className="text-primary font-semibold">
                      {plan.templates === "Unlimited" ? "Unlimited" : plan.templates} Templates
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Valid for 1 year
                    </p>
                  </div>
                  
                  <p className="text-muted-foreground text-sm text-center mb-6">
                    {plan.description}
                  </p>
                  
                  <Button 
                    asChild 
                    className={`w-full ${plan.popular ? 'btn-romantic text-white' : ''}`}
                    variant={plan.popular ? "default" : "outline"}
                  >
                    <Link to="/login">
                      Choose Plan
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Feature List */}
        <section className="py-20 md:py-28">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                What You{" "}
                <span className="text-gradient-romantic">Get</span>
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Premium features that make your love page extraordinary.
              </p>
            </div>
            
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
              {featurePricing.map((feature, index) => (
                <div 
                  key={feature.name}
                  className="card-romantic rounded-xl p-4 flex items-center gap-3 animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                  <span className="font-medium">{feature.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
