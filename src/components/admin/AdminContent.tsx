import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Eye, ExternalLink, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";

interface LovePage {
    id: string;
    title: string;
    slug: string;
    is_published: boolean;
    view_count: number;
    created_at: string;
    user_id: string;
}

export function AdminContent() {
    const [pages, setPages] = useState<LovePage[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchPages = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from("love_pages")
                .select("id, title, slug, is_published, view_count, created_at, user_id")
                .order("created_at", { ascending: false })
                .limit(50);

            if (error) throw error;
            setPages(data || []);
        } catch (error) {
            console.error("Error fetching pages:", error);
            toast.error("Failed to fetch content");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPages();
    }, []);

    const handleDelete = async (id: string, title: string) => {
        // Logic for deleting would go here. 
        // Safe to prompt user first.
        if (!confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) return;

        try {
            const { error } = await supabase.functions.invoke('admin-actions', {
                body: {
                    action: 'delete-page',
                    payload: { pageId: id }
                }
            });

            if (error) throw error;

            toast.success("Page deleted successfully");
            fetchPages(); // Refresh
        } catch (err) {
            console.error("Error deleting page:", err);
            toast.error("Failed to delete page");
        }
    };

    return (
        <Card className="border-0 shadow-soft">
            <CardHeader>
                <CardTitle>Content Moderation</CardTitle>
                <CardDescription>View and manage all published love pages</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="rounded-lg border border-border/50 overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/30">
                                <TableHead>Title</TableHead>
                                <TableHead>Slug</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Views</TableHead>
                                <TableHead>Created</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <TableRow key={i}>
                                        <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                                        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                                        <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                                        <TableCell><Skeleton className="h-4 w-10" /></TableCell>
                                        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                        <TableCell><Skeleton className="h-4 w-20 ml-auto" /></TableCell>
                                    </TableRow>
                                ))
                            ) : pages.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                                        No pages found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                pages.map((page) => (
                                    <TableRow key={page.id} className="hover:bg-muted/30">
                                        <TableCell className="font-medium">{page.title}</TableCell>
                                        <TableCell>
                                            <code className="text-xs bg-muted px-1.5 py-0.5 rounded">{page.slug}</code>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={page.is_published ? "default" : "secondary"}
                                                className={page.is_published ? "bg-emerald-500 hover:bg-emerald-600" : ""}
                                            >
                                                {page.is_published ? "Published" : "Draft"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1">
                                                <Eye className="h-3 w-3 text-muted-foreground" />
                                                {page.view_count}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-muted-foreground text-sm">
                                            {new Date(page.created_at).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {page.is_published && (
                                                    <Button variant="ghost" size="icon" asChild>
                                                        <Link to={`/love/${page.slug}`} target="_blank">
                                                            <ExternalLink className="h-4 w-4 text-blue-500" />
                                                        </Link>
                                                    </Button>
                                                )}
                                                <Button variant="ghost" size="icon" onClick={() => handleDelete(page.id, page.title)}>
                                                    <Trash2 className="h-4 w-4 text-red-500" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}
