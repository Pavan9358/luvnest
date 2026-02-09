import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { HeartIcon, FloatingHearts } from "@/components/ui/HeartIcon";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Wallet,
  CreditCard,
  TrendingUp,
  ArrowLeft,
  Sparkles,
  Crown,
  Gift,
  Check,
  Zap,
  ArrowRight,
  Lock,
  FileText,
} from "lucide-react";
import { toast } from "sonner";
import { loadRazorpay, openRazorpay } from "@/lib/razorpay";

interface WalletData {
  balance: number;
  currency: string;
  plan_type: string;
  templates_used: number;
}

interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

const TEMPLATE_PLANS = [
  { id: "first-crush", name: "First Crush", templates: 5, price: 199, popular: false, description: "Perfect for your first love letter" },
  { id: "true-love", name: "True Love", templates: 10, price: 499, popular: true, description: "For those who want to express more" },
  { id: "forever-valentine", name: "Forever Valentine", templates: "Unlimited", price: 999, popular: false, description: "Unlimited love, unlimited pages" },
];

const PREMIUM_FEATURES = [
  { name: "Premium Themes", icon: Crown, description: "Exclusive romantic themes" },
  { name: "AI Story Generation", icon: Sparkles, description: "AI-powered love stories" },
  { name: "AI Love Letter", icon: Gift, description: "Personalized letters" },
  { name: "Password Protection", icon: Lock, description: "Keep pages private" },
  { name: "My Valentine", icon: Zap, description: "Interactive proposal" },
  { name: "PDF Magazine", icon: FileText, description: "Keepsake export" },
];

export default function WalletPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchWallet = useCallback(async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from("wallets")
        .select("balance, currency, plan_type, templates_used")
        .eq("user_id", user.id)
        .single();

      if (error) throw error;
      setWallet(data as WalletData);
    } catch (error) {
      console.error("Error fetching wallet:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchWallet();
    }
  }, [user, fetchWallet]);

  const getPlanLimits = () => {
    const planType = wallet?.plan_type || "free";
    const used = wallet?.templates_used || 0;
    const max = planType === "first-crush" ? 5 : planType === "true-love" ? 10 : planType === "forever-valentine" ? 999999 : 0;
    return { planType, used, max, remaining: Math.max(0, max - used) };
  };

  const handlePurchase = async (planId: string) => {
    const plan = TEMPLATE_PLANS.find(p => p.id === planId);
    if (!plan) return;

    setLoading(true);
    try {
      const isLoaded = await loadRazorpay();
      if (!isLoaded) {
        toast.error("Failed to load payment gateway");
        return;
      }

      // Create Razorpay order via backend or mock
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "";
      let orderData;

      try {
        const orderResponse = await fetch(`${apiBaseUrl}/api/payments/create-order`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: plan.price,
            planId: plan.id,
            userId: user?.id,
          }),
        });

        if (!orderResponse.ok) {
          throw new Error("Backend not available");
        }
        orderData = await orderResponse.json();
      } catch (error) {
        console.warn("Backend API failed, falling back to mock mode", error);
        toast.info("Using Mock Payment Mode (Backend unavailable)");

        // Mock Data
        orderData = {
          amount: plan.price * 100, // Razorpay expects amount in paise
          currency: "INR",
          id: `order_mock_${Date.now()}`,
        };
      }

      console.log("Debug: Razorpay Key present?", !!import.meta.env.VITE_RAZORPAY_KEY_ID);
      console.log("Debug: Order Data", orderData);

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "LUVNEST",
        description: `Purchase ${plan.name} Plan`,
        image: "/icons/icon-192.png",
        // Only include order_id if it's a real order from the backend
        // Razorpay SDK will fail if we pass a mock/invalid order_id
        ...(orderData.id.startsWith("order_mock_") ? {} : { order_id: orderData.id }),
        prefill: {
          name: user?.user_metadata?.full_name || "",
          email: user?.email || "",
        },
        theme: {
          color: "#e11d48",
        },
        handler: async (response: RazorpayResponse) => {


          try {
            // Only try to verify if it's not a mock order
            if (!orderData.id.startsWith("order_mock_")) {
              const verifyResponse = await fetch(`${apiBaseUrl}/api/payments/verify-payment`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  planId: plan.id,
                  userId: user?.id,
                }),
              });

              if (!verifyResponse.ok) {
                throw new Error("Payment verification failed");
              }

              toast.success(`Successfully purchased ${plan.name} plan!`);
              fetchWallet(); // Refresh wallet data
            } else {
              // Mock success
              toast.success(`Mock Purchase Successful: ${plan.name} plan!`);
              // Provide visual feedback even without DB update
              const mockWallet = { ...wallet, plan_type: plan.id };
              // We can't easily update state here without full restart potentially, 
              // but toast is enough for UI testing.
            }
          } catch (error) {
            console.error("Verification error:", error);
            toast.error("Payment was successful but verification failed. Please contact support.");
          }
        },
      };

      if (!options.key) {
        toast.error("Payment configuration missing. Please check your .env file or server restart.");
        console.error("Razorpay Key ID is missing in environment variables. Current value:", import.meta.env.VITE_RAZORPAY_KEY_ID);
        return;
      }

      console.log("Debug: Opening Razorpay with options", { ...options, key: "***" });
      openRazorpay(options);
    } catch (error) {
      console.error("Payment error full object:", error);
      // Improve error message if it's an object with description or message
      const msg = error instanceof Error ? error.message : "Payment initialization failed";
      toast.error(`Error: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  const { planType, used, max, remaining } = getPlanLimits();

  const getPlanDisplayName = (plan: string) => {
    switch (plan) {
      case "first-crush": return "First Crush";
      case "true-love": return "True Love";
      case "forever-valentine": return "Forever Valentine";
      default: return "Free";
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <HeartIcon size="xl" className="text-primary animate-heart-beat mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-hero-romantic py-12">
          <FloatingHearts className="opacity-40" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.1),transparent_50%)]" />

          <div className="container relative z-10">
            <div className="flex items-center gap-4 mb-6">
              <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")} className="shrink-0">
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-3xl md:text-4xl font-display font-bold flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Wallet className="h-6 w-6 text-primary" />
                  </div>
                  Wallet & Templates
                </h1>
                <p className="text-muted-foreground mt-1">Unlock premium features with templates</p>
              </div>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent" />
        </div>

        <div className="container py-8 max-w-5xl">
          {/* Balance Card */}
          <Card className="relative overflow-hidden border-0 shadow-romantic mb-10">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10" />
            <CardContent className="relative p-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Remaining Templates
                    </p>
                    {planType !== "free" && (
                      <Badge variant="outline" className="text-xs">
                        {getPlanDisplayName(planType)} Plan
                      </Badge>
                    )}
                  </div>
                  {loading ? (
                    <Skeleton className="h-16 w-40" />
                  ) : (
                    <div className="text-5xl font-bold text-foreground">
                      {planType === "forever-valentine" ? "∞" : remaining}
                      <span className="text-2xl font-normal text-muted-foreground ml-2">
                        {planType === "forever-valentine" ? "unlimited" : `of ${max}`}
                      </span>
                    </div>
                  )}
                  <p className="text-sm text-muted-foreground mt-3">
                    {planType === "free"
                      ? "Get a plan to start creating beautiful love pages"
                      : `You've used ${used} template${used !== 1 ? "s" : ""} • Each template allows 3 edits`}
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button className="btn-romantic text-white shadow-romantic" onClick={() => document.getElementById('packages')?.scrollIntoView({ behavior: 'smooth' })}>
                    <CreditCard className="mr-2 h-4 w-4" />
                    {planType === "free" ? "Get a Plan" : "Upgrade Plan"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Template Plans */}
          <div id="packages" className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-display font-bold">Plans to Create</h2>
              <Badge variant="secondary">Valid for 1 year</Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {TEMPLATE_PLANS.map((plan, index) => (
                <Card
                  key={plan.id}
                  className={`relative overflow-hidden border-2 transition-all duration-300 hover:shadow-romantic animate-fade-in-up ${plan.popular ? "border-primary shadow-romantic" : "border-border/50 hover:border-primary/30"
                    }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {plan.popular && (
                    <div className="absolute -top-px left-0 right-0 h-1 bg-gradient-to-r from-primary via-pink-400 to-primary" />
                  )}
                  {plan.popular && (
                    <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground">
                      Most Popular
                    </Badge>
                  )}
                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-6">
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-bold">₹{plan.price}</span>
                      </div>
                      <p className="text-primary font-semibold mt-1">
                        {plan.templates === "Unlimited" ? "Unlimited" : plan.templates} Templates
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Valid for 1 year from purchase
                      </p>
                    </div>
                    <Button
                      className={`w-full h-11 ${plan.popular ? "btn-romantic text-white" : ""}`}
                      variant={plan.popular ? "default" : "outline"}
                      onClick={() => handlePurchase(plan.id)}
                    >
                      <CreditCard className="mr-2 h-4 w-4" />
                      Choose Plan
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Premium Features */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-display font-bold">Premium Features</h2>
              <p className="text-sm text-muted-foreground">What you can unlock</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {PREMIUM_FEATURES.map((feature, index) => (
                <Card
                  key={feature.name}
                  className="group hover:shadow-soft transition-all duration-300 border-border/50 hover:border-primary/20 animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <CardContent className="flex items-center gap-4 p-5">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{feature.name}</h3>
                      <p className="text-sm text-muted-foreground truncate">{feature.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
