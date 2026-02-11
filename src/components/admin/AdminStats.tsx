import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, Users, FileHeart, DollarSign, Eye } from "lucide-react";

interface AdminStatsProps {
    stats: {
        totalUsers: number;
        totalPages: number;
        totalRevenue: number;
        totalViews: number;
    };
    loading: boolean;
}

export function AdminStats({ stats, loading }: AdminStatsProps) {
    const statCards = [
        {
            label: "Total Users",
            value: stats.totalUsers,
            icon: Users,
            gradient: "from-blue-500/10 to-blue-500/5",
            iconBg: "bg-blue-500/10",
            iconColor: "text-blue-500"
        },
        {
            label: "Love Pages",
            value: stats.totalPages,
            icon: FileHeart,
            gradient: "from-primary/10 to-primary/5",
            iconBg: "bg-primary/10",
            iconColor: "text-primary"
        },
        {
            label: "Total Views",
            value: stats.totalViews,
            icon: Eye,
            gradient: "from-purple-500/10 to-purple-500/5",
            iconBg: "bg-purple-500/10",
            iconColor: "text-purple-500"
        },
        {
            label: "Revenue",
            value: `₹${stats.totalRevenue.toFixed(2)}`,
            icon: DollarSign,
            gradient: "from-emerald-500/10 to-emerald-500/5",
            iconBg: "bg-emerald-500/10",
            iconColor: "text-emerald-500"
        },
    ];

    return (
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
    );
}
