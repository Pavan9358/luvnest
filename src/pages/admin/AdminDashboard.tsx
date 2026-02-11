import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HeartIcon, FloatingHearts } from "@/components/ui/HeartIcon";
import {
  Users,
  FileHeart,
  DollarSign,
  Settings,
  ArrowLeft,
  Activity,
  Shield,
} from "lucide-react";
import { toast } from "sonner";
import { AdminStats } from "@/components/admin/AdminStats";
import { AdminUsers } from "@/components/admin/AdminUsers";
import { AdminPayments } from "@/components/admin/AdminPayments";
import { AdminContent } from "@/components/admin/AdminContent";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface AdminStatsData {
  totalUsers: number;
  totalPages: number;
  totalRevenue: number;
  totalViews: number;
}

export default function AdminDashboard() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<AdminStatsData>({
    totalUsers: 0,
    totalPages: 0,
    totalRevenue: 0,
    totalViews: 0,
  });

  useEffect(() => {
    const fetchAdminStats = async () => {
      setLoading(true);
      try {
        const [pagesRes, profilesRes, paymentsRes] = await Promise.all([
          supabase.from("love_pages").select("id, view_count, is_published"),
          supabase.from("profiles").select("id"),
          supabase.from("payments").select("amount").eq("status", "completed"),
        ]);

        const totalViews = pagesRes.data?.reduce((sum, p) => sum + (p.view_count || 0), 0) || 0;
        const totalRevenue = paymentsRes.data?.reduce((sum, p) => sum + Number(p.amount), 0) || 0;

        setStats({
          totalUsers: profilesRes.data?.length || 0,
          totalPages: pagesRes.data?.length || 0,
          totalRevenue,
          totalViews,
        });

      } catch (error) {
        console.error("Error fetching admin data:", error);
        toast.error("Failed to load admin data");
      } finally {
        setLoading(false);
      }
    };

    const checkAdminRole = async () => {
      try {
        const { data } = await supabase.rpc("has_role", {
          _user_id: user!.id,
          _role: "admin",
        });

        if (!data) {
          toast.error("Access denied: Admin privileges required");
          navigate("/dashboard");
          return;
        }

        setIsAdmin(true);
        await fetchAdminStats(); // Only fetch stats here
      } catch (error) {
        console.error("Error checking admin role:", error);
        navigate("/dashboard");
      }
    };

    if (user) {
      checkAdminRole();
    }
  }, [user, navigate]);

  if (authLoading || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <HeartIcon size="xl" className="text-primary animate-heart-beat mx-auto mb-4" />
          <p className="text-muted-foreground">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-hero-romantic py-10">
          <FloatingHearts className="opacity-30" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.1),transparent_50%)]" />

          <div className="container relative z-10">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")} className="shrink-0">
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Shield className="h-7 w-7 text-primary" />
                </div>
                <div>
                  <h1 className="text-3xl font-display font-bold">Admin Dashboard</h1>
                  <p className="text-muted-foreground">Manage users, content, and platform settings</p>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-background to-transparent" />
        </div>

        <div className="container py-8">
          {/* Stats Cards */}
          <AdminStats stats={stats} loading={loading} />

          {/* Tabs */}
          <Tabs defaultValue="users" className="space-y-6">
            <TabsList className="bg-muted/50 p-1">
              <TabsTrigger value="users" className="gap-2 data-[state=active]:bg-card data-[state=active]:shadow-sm">
                <Users className="h-4 w-4" />
                Users
              </TabsTrigger>
              <TabsTrigger value="payments" className="gap-2 data-[state=active]:bg-card data-[state=active]:shadow-sm">
                <DollarSign className="h-4 w-4" />
                Payments
              </TabsTrigger>
              <TabsTrigger value="pages" className="gap-2 data-[state=active]:bg-card data-[state=active]:shadow-sm">
                <FileHeart className="h-4 w-4" />
                Content
              </TabsTrigger>
              <TabsTrigger value="settings" className="gap-2 data-[state=active]:bg-card data-[state=active]:shadow-sm">
                <Settings className="h-4 w-4" />
                Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="users">
              <AdminUsers />
            </TabsContent>

            <TabsContent value="payments">
              <AdminPayments />
            </TabsContent>

            <TabsContent value="pages">
              <AdminContent />
            </TabsContent>

            <TabsContent value="settings">
              <Card className="border-0 shadow-soft">
                <CardHeader>
                  <CardTitle>Platform Settings</CardTitle>
                  <CardDescription>Configure platform-wide settings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Settings className="h-12 w-12 text-muted-foreground/30 mb-4" />
                    <p className="text-muted-foreground mb-4">
                      Settings configuration coming soon
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Contact support for urgent changes
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}




