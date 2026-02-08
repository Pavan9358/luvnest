import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { HeartIcon, FloatingHearts } from "@/components/ui/HeartIcon";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Users,
  FileHeart,
  DollarSign,
  TrendingUp,
  Eye,
  Shield,
  Settings,
  ArrowLeft,
  Activity,
} from "lucide-react";
import { toast } from "sonner";

interface AdminStats {
  totalUsers: number;
  totalPages: number;
  totalRevenue: number;
  totalViews: number;
}

interface UserData {
  id: string;
  email: string;
  full_name: string | null;
  created_at: string;
  pages_count: number;
}

interface PageData {
  id: string;
  title: string;
  slug: string;
  is_published: boolean;
  view_count: number;
  created_at: string;
  user_email: string;
}

export default function AdminDashboard() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalPages: 0,
    totalRevenue: 0,
    totalViews: 0,
  });
  const [users, setUsers] = useState<UserData[]>([]);
  const [pages, setPages] = useState<PageData[]>([]);

  useEffect(() => {
    const fetchAdminData = async () => {
      setLoading(true);
      try {
        const [pagesRes, profilesRes, paymentsRes] = await Promise.all([
          supabase.from("love_pages").select("id, view_count"),
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

        const { data: profilesData } = await supabase
          .from("profiles")
          .select("user_id, full_name, created_at")
          .order("created_at", { ascending: false })
          .limit(50);

        if (profilesData) {
          const usersWithCounts = await Promise.all(
            profilesData.map(async (profile) => {
              const { count } = await supabase
                .from("love_pages")
                .select("id", { count: "exact", head: true })
                .eq("user_id", profile.user_id);

              return {
                id: profile.user_id,
                email: "user@example.com",
                full_name: profile.full_name,
                created_at: profile.created_at,
                pages_count: count || 0,
              };
            })
          );
          setUsers(usersWithCounts);
        }

        const { data: pagesData } = await supabase
          .from("love_pages")
          .select("id, title, slug, is_published, view_count, created_at, user_id")
          .order("created_at", { ascending: false })
          .limit(50);

        if (pagesData) {
          setPages(
            pagesData.map((page) => ({
              id: page.id,
              title: page.title,
              slug: page.slug,
              is_published: page.is_published || false,
              view_count: page.view_count || 0,
              created_at: page.created_at,
              user_email: "—",
            }))
          );
        }
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
        await fetchAdminData();
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

  const statCards = [
    { label: "Total Users", value: stats.totalUsers, icon: Users, gradient: "from-blue-500/10 to-blue-500/5", iconBg: "bg-blue-500/10", iconColor: "text-blue-500" },
    { label: "Love Pages", value: stats.totalPages, icon: FileHeart, gradient: "from-primary/10 to-primary/5", iconBg: "bg-primary/10", iconColor: "text-primary" },
    { label: "Total Views", value: stats.totalViews, icon: Eye, gradient: "from-purple-500/10 to-purple-500/5", iconBg: "bg-purple-500/10", iconColor: "text-purple-500" },
    { label: "Revenue", value: `₹${stats.totalRevenue.toFixed(2)}`, icon: DollarSign, gradient: "from-emerald-500/10 to-emerald-500/5", iconBg: "bg-emerald-500/10", iconColor: "text-emerald-500" },
  ];

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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
            {statCards.map((stat, index) => (
              <Card
                key={stat.label}
                className="relative overflow-hidden border-0 shadow-soft animate-fade-in-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient}`} />
                <CardHeader className="relative flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </CardTitle>
                  <div className={`w-10 h-10 rounded-xl ${stat.iconBg} flex items-center justify-center`}>
                    <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
                  </div>
                </CardHeader>
                <CardContent className="relative">
                  {loading ? (
                    <Skeleton className="h-8 w-20" />
                  ) : (
                    <>
                      <div className="text-2xl font-bold">{stat.value}</div>
                      <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        All time
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Tabs */}
          <Tabs defaultValue="users" className="space-y-6">
            <TabsList className="bg-muted/50 p-1">
              <TabsTrigger value="users" className="gap-2 data-[state=active]:bg-card data-[state=active]:shadow-sm">
                <Users className="h-4 w-4" />
                Users
              </TabsTrigger>
              <TabsTrigger value="pages" className="gap-2 data-[state=active]:bg-card data-[state=active]:shadow-sm">
                <FileHeart className="h-4 w-4" />
                Pages
              </TabsTrigger>
              <TabsTrigger value="activity" className="gap-2 data-[state=active]:bg-card data-[state=active]:shadow-sm">
                <Activity className="h-4 w-4" />
                Activity
              </TabsTrigger>
              <TabsTrigger value="settings" className="gap-2 data-[state=active]:bg-card data-[state=active]:shadow-sm">
                <Settings className="h-4 w-4" />
                Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="users">
              <Card className="border-0 shadow-soft">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>User Management</CardTitle>
                      <CardDescription>View and manage registered users</CardDescription>
                    </div>
                    <Badge variant="secondary">{users.length} users</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg border border-border/50 overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/30">
                          <TableHead>Name</TableHead>
                          <TableHead>Pages</TableHead>
                          <TableHead>Joined</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {loading ? (
                          Array(5).fill(0).map((_, i) => (
                            <TableRow key={i}>
                              <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                              <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                              <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                            </TableRow>
                          ))
                        ) : users.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                              No users found
                            </TableCell>
                          </TableRow>
                        ) : (
                          users.map((user) => (
                            <TableRow key={user.id} className="hover:bg-muted/30">
                              <TableCell className="font-medium">
                                {user.full_name || "Anonymous"}
                              </TableCell>
                              <TableCell>
                                <Badge variant="secondary">{user.pages_count}</Badge>
                              </TableCell>
                              <TableCell className="text-muted-foreground">
                                {new Date(user.created_at).toLocaleDateString()}
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="pages">
              <Card className="border-0 shadow-soft">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Content Management</CardTitle>
                      <CardDescription>View and moderate love pages</CardDescription>
                    </div>
                    <Badge variant="secondary">{pages.length} pages</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg border border-border/50 overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/30">
                          <TableHead>Title</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Views</TableHead>
                          <TableHead>Created</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {loading ? (
                          Array(5).fill(0).map((_, i) => (
                            <TableRow key={i}>
                              <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                              <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                              <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                              <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                            </TableRow>
                          ))
                        ) : pages.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                              No pages found
                            </TableCell>
                          </TableRow>
                        ) : (
                          pages.map((page) => (
                            <TableRow key={page.id} className="hover:bg-muted/30">
                              <TableCell className="font-medium">{page.title}</TableCell>
                              <TableCell>
                                <Badge
                                  variant={page.is_published ? "default" : "secondary"}
                                  className={page.is_published ? "bg-emerald-500 hover:bg-emerald-500" : ""}
                                >
                                  {page.is_published ? "Published" : "Draft"}
                                </Badge>
                              </TableCell>
                              <TableCell>{page.view_count}</TableCell>
                              <TableCell className="text-muted-foreground">
                                {new Date(page.created_at).toLocaleDateString()}
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity">
              <Card className="border-0 shadow-soft">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Monitor platform activity in real-time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Activity className="h-12 w-12 text-muted-foreground/30 mb-4" />
                    <p className="text-muted-foreground">
                      Activity feed coming soon
                    </p>
                  </div>
                </CardContent>
              </Card>
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
