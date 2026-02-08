import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { HeartIcon, FloatingHearts } from "@/components/ui/HeartIcon";
import { ShareDialog } from "@/components/sharing/ShareDialog";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Heart,
  Eye,
  Settings,
  Wallet,
  Sparkles,
  Clock,
  ArrowRight,
  TrendingUp,
  Calendar
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface LovePage {
  id: string;
  slug: string;
  title: string;
  is_published: boolean;
  view_count: number;
  created_at: string;
  updated_at: string;
}

interface WalletData {
  balance: number;
  currency: string;
  plan_type: string;
  templates_used: number;
}

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const [pages, setPages] = useState<LovePage[]>([]);
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: pagesData } = await supabase
          .from("love_pages")
          .select("*")
          .eq("user_id", user!.id)
          .order("created_at", { ascending: false });

        if (pagesData) {
          setPages(pagesData);
        }

        const { data: walletData } = await supabase
          .from("wallets")
          .select("balance, currency, plan_type, templates_used")
          .eq("user_id", user!.id)
          .single();

        if (walletData) {
          setWallet(walletData as WalletData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

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

      <main className="flex-1 py-8">
        {/* Hero Banner */}
        <div className="relative overflow-hidden bg-hero-romantic py-12 mb-8">
          <FloatingHearts className="opacity-50" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.1),transparent_50%)]" />

          <div className="container relative z-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">
                  Welcome back{user?.user_metadata?.full_name ? `, ${user.user_metadata.full_name}` : ""} 💕
                </h1>
                <p className="text-muted-foreground text-lg">
                  Manage your love pages and create new romantic experiences.
                </p>
              </div>
              <Button asChild size="lg" className="btn-romantic text-white shadow-romantic group w-fit">
                <Link to="/create">
                  <Plus className="mr-2 h-5 w-5" />
                  Create New Page
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent" />
        </div>

        <div className="container">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <Card className="relative overflow-hidden border-0 shadow-soft">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10" />
              <CardHeader className="relative flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Pages
                </CardTitle>
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Heart className="h-5 w-5 text-primary" />
                </div>
              </CardHeader>
              <CardContent className="relative">
                {loading ? (
                  <Skeleton className="h-10 w-16" />
                ) : (
                  <>
                    <div className="text-3xl font-bold">{pages.length}</div>
                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      Love pages created
                    </p>
                  </>
                )}
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-0 shadow-soft">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-purple-500/10" />
              <CardHeader className="relative flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Views
                </CardTitle>
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                  <Eye className="h-5 w-5 text-purple-500" />
                </div>
              </CardHeader>
              <CardContent className="relative">
                {loading ? (
                  <Skeleton className="h-10 w-16" />
                ) : (
                  <>
                    <div className="text-3xl font-bold">
                      {pages.reduce((sum, page) => sum + (page.view_count || 0), 0)}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      People reached
                    </p>
                  </>
                )}
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-0 shadow-soft">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-emerald-500/10" />
              <CardHeader className="relative flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Remaining Templates
                </CardTitle>
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                  <Wallet className="h-5 w-5 text-emerald-500" />
                </div>
              </CardHeader>
              <CardContent className="relative">
                {loading ? (
                  <Skeleton className="h-10 w-24" />
                ) : (
                  <>
                    <div className="text-3xl font-bold">
                      {(() => {
                        const planType = wallet?.plan_type || "free";
                        const used = wallet?.templates_used || 0;
                        const max = planType === "first-crush" ? 5 : planType === "true-love" ? 10 : planType === "forever-valentine" ? 999 : 0;
                        const remaining = Math.max(0, max - used);
                        return planType === "forever-valentine" ? "∞" : remaining;
                      })()}
                      {" "}
                      <span className="text-lg font-normal text-muted-foreground">
                        {wallet?.plan_type === "forever-valentine" ? "unlimited" : "left"}
                      </span>
                    </div>
                    <Link to="/wallet" className="text-xs text-primary hover:underline mt-1 flex items-center gap-1">
                      {wallet?.plan_type === "free" ? "Get a plan" : "Upgrade plan"}
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-3 mb-10">
            <Button variant="outline" asChild className="h-11 border-2 hover:bg-secondary/50">
              <Link to="/wallet">
                <Wallet className="mr-2 h-4 w-4" />
                Add Templates
              </Link>
            </Button>
            <Button variant="outline" asChild className="h-11 border-2 hover:bg-secondary/50">
              <Link to="/themes">
                <Sparkles className="mr-2 h-4 w-4" />
                Browse Themes
              </Link>
            </Button>
          </div>

          {/* Love Pages List */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-display font-bold">Your Love Pages</h2>
              {pages.length > 0 && (
                <Badge variant="secondary" className="text-sm">
                  {pages.length} {pages.length === 1 ? "page" : "pages"}
                </Badge>
              )}
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="overflow-hidden">
                    <div className="h-32 bg-muted animate-pulse" />
                    <CardHeader>
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </CardHeader>
                  </Card>
                ))}
              </div>
            ) : pages.length === 0 ? (
              <Card className="border-2 border-dashed border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
                <CardContent className="py-16 text-center">
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                    <HeartIcon size="xl" className="text-primary" />
                  </div>
                  <h3 className="text-xl font-display font-semibold mb-3">
                    No love pages yet
                  </h3>
                  <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                    Create your first love page and share it with someone special!
                    Add photos, write love letters, and make it magical.
                  </p>
                  <Button asChild size="lg" className="btn-romantic text-white shadow-romantic group">
                    <Link to="/create">
                      <Plus className="mr-2 h-5 w-5" />
                      Create Your First Page
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pages.map((page, index) => (
                  <Card
                    key={page.id}
                    className="group overflow-hidden border-0 shadow-soft hover:shadow-romantic transition-all duration-500 animate-fade-in-up"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    {/* Decorative header */}
                    <div className="h-24 bg-gradient-to-br from-primary/20 via-primary/10 to-accent/20 relative overflow-hidden">
                      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(var(--primary)/0.3),transparent_60%)]" />
                      <div className="absolute top-3 right-3">
                        <Badge
                          variant={page.is_published ? "default" : "secondary"}
                          className={page.is_published ? "bg-emerald-500 hover:bg-emerald-500" : ""}
                        >
                          {page.is_published ? "Published" : "Draft"}
                        </Badge>
                      </div>
                      <div className="absolute bottom-3 left-3">
                        <HeartIcon size="lg" className="text-primary/40" />
                      </div>
                    </div>

                    <CardHeader className="pb-3">
                      <CardTitle className="font-display text-lg group-hover:text-primary transition-colors">
                        {page.title}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(page.updated_at).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {page.view_count} views
                        </span>
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="pt-0">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild className="flex-1">
                          <Link to={`/edit/${page.id}`}>
                            <Settings className="mr-1.5 h-3.5 w-3.5" />
                            Edit
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm" asChild className="flex-1">
                          <Link to={`/love/${page.slug}`}>
                            <Eye className="mr-1.5 h-3.5 w-3.5" />
                            View
                          </Link>
                        </Button>
                        {page.is_published && (
                          <ShareDialog slug={page.slug} title={page.title} />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
