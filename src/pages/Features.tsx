import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FloatingHearts } from "@/components/ui/HeartIcon";
import { 
  Heart, 
  Lock, 
  Share2, 
  Palette, 
  Sparkles, 
  Music, 
  MessageSquareHeart,
  Timer,
  FileText,
  Image,
  Mic,
  Calendar,
  Eye,
  Wand2,
  ArrowRight,
  Check
} from "lucide-react";

const mainFeatures = [
  {
    icon: Heart,
    title: "Love Page Builder",
    description: "Create stunning pages with a drag-and-drop builder. Add hero sections, love letters, photo galleries, and memories timeline.",
    highlights: ["Drag & drop sections", "Real-time preview", "Auto-save"],
    gradient: "from-primary to-pink-400",
  },
  {
    icon: Sparkles,
    title: "AI-Powered Content",
    description: "Let AI help you express your feelings. Generate romantic stories, love letters, and get writing suggestions.",
    highlights: ["Story generator", "Letter composer", "Writing assistant"],
    gradient: "from-purple-500 to-primary",
  },
  {
    icon: Palette,
    title: "Beautiful Themes",
    description: "Choose from our curated collection of romantic themes. Each theme is designed to create the perfect mood.",
    highlights: ["4 starter themes", "Premium themes", "Custom colors"],
    gradient: "from-amber-400 to-primary",
  },
  {
    icon: Lock,
    title: "Advanced Privacy",
    description: "Keep your love page secure with multiple privacy options. Control who sees your content and when.",
    highlights: ["Password protection", "Time-locked reveals", "Expiry dates"],
    gradient: "from-emerald-400 to-teal-500",
  },
];

const allFeatures = [
  { icon: Image, title: "Photo Gallery", description: "Upload multiple photos with captions and elegant layouts" },
  { icon: Music, title: "Background Music", description: "Add the perfect soundtrack from Spotify, YouTube, or upload" },
  { icon: Mic, title: "Voice Messages", description: "Record or upload personal voice notes for your loved one" },
  { icon: Timer, title: "Countdown Timer", description: "Build anticipation with countdowns to special dates" },
  { icon: Calendar, title: "Timeline", description: "Create a beautiful timeline of your relationship milestones" },
  { icon: MessageSquareHeart, title: "Love Letter", description: "Write heartfelt letters with rich text formatting" },
  { icon: Eye, title: "Surprise Reveal", description: "Hidden messages that unlock with special animations" },
  { icon: FileText, title: "PDF Magazine", description: "Export your page as a beautiful keepsake magazine" },
  { icon: Share2, title: "Easy Sharing", description: "Share via WhatsApp, Instagram, QR codes, or link" },
  { icon: Wand2, title: "AI Writing Assist", description: "Get suggestions to make your words even more romantic" },
];

export default function Features() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-hero-romantic py-20 md:py-28">
          <FloatingHearts />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.1),transparent_50%)]" />
          
          <div className="container relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6 animate-fade-in backdrop-blur-sm border border-primary/20">
                <Sparkles className="h-4 w-4" />
                <span className="text-sm font-medium">Powerful Features</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-display font-bold text-foreground mb-6 animate-fade-in-up">
                Everything You Need to{" "}
                <span className="text-gradient-romantic">Create Magic</span>
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground mb-8 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
                From AI-powered content generation to beautiful themes and privacy controls,
                we've built every feature you need to express your love.
              </p>
            </div>
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
        </section>

        {/* Main Features Grid */}
        <section className="py-20 md:py-28 relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(var(--secondary)/0.3),transparent_70%)]" />
          
          <div className="container relative z-10">
            <div className="grid md:grid-cols-2 gap-8">
              {mainFeatures.map((feature, index) => (
                <div 
                  key={feature.title}
                  className="group relative rounded-2xl overflow-hidden animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Gradient border effect */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  <div className="absolute inset-[1px] bg-card rounded-2xl" />
                  
                  <div className="relative p-8">
                    <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} text-white mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="h-7 w-7" />
                    </div>
                    
                    <h3 className="font-display text-2xl font-bold mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground mb-6">{feature.description}</p>
                    
                    <ul className="space-y-2">
                      {feature.highlights.map((highlight) => (
                        <li key={highlight} className="flex items-center gap-2 text-sm">
                          <Check className="h-4 w-4 text-primary" />
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* All Features List */}
        <section className="py-20 md:py-28 bg-muted/30">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                And So Much{" "}
                <span className="text-gradient-romantic">More</span>
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Every feature designed with love to help you create unforgettable digital experiences.
              </p>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
              {allFeatures.map((feature, index) => (
                <div 
                  key={feature.title}
                  className="card-romantic rounded-xl p-6 text-center animate-fade-in-up hover:scale-105 transition-transform duration-300"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary mb-4">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-display font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 md:py-28 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
          <FloatingHearts className="opacity-30" />
          
          <div className="container relative z-10">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                Ready to Start{" "}
                <span className="text-gradient-romantic">Creating?</span>
              </h2>
              <p className="text-muted-foreground text-lg mb-8">
                Join thousands of couples sharing their love stories with LUVNEST.
              </p>
              <Button asChild size="lg" className="btn-romantic text-white px-8 group">
                <Link to="/login">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
