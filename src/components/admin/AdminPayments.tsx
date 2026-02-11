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
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { format } from "date-fns";

interface Payment {
    id: string;
    amount: number;
    currency: string;
    status: string;
    gateway: string;
    created_at: string;
    description: string | null;
    user_id: string;
}

export function AdminPayments() {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPayments = async () => {
            setLoading(true);
            try {
                const { data, error } = await supabase
                    .from("payments")
                    .select("*")
                    .order("created_at", { ascending: false })
                    .limit(50);

                if (error) throw error;
                setPayments(data || []);
            } catch (error) {
                console.error("Error fetching payments:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPayments();
    }, []);

    const getStatusBadge = (status: string) => {
        switch (status.toLowerCase()) {
            case "captured":
            case "completed":
            case "success":
                return <Badge className="bg-emerald-500 hover:bg-emerald-600">Success</Badge>;
            case "failed":
                return <Badge variant="destructive">Failed</Badge>;
            case "pending":
            case "created":
                return <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20">Pending</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <Card className="border-0 shadow-soft">
            <CardHeader>
                <CardTitle>Transaction History</CardTitle>
                <CardDescription>Recent payments and their status</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="rounded-lg border border-border/50 overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/30">
                                <TableHead>Date</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Gateway Ref</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <TableRow key={i}>
                                        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                        <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                                        <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                                        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                                        <TableCell><Skeleton className="h-4 w-24 ml-auto" /></TableCell>
                                    </TableRow>
                                ))
                            ) : payments.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                                        No transactions found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                payments.map((payment) => (
                                    <TableRow key={payment.id} className="hover:bg-muted/30">
                                        <TableCell className="text-muted-foreground text-sm">
                                            {format(new Date(payment.created_at), "MMM d, yyyy HH:mm")}
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-medium">{payment.description || "Payment"}</div>
                                            <div className="text-xs text-muted-foreground">{payment.gateway}</div>
                                        </TableCell>
                                        <TableCell className="font-mono">
                                            {payment.currency} {payment.amount}
                                        </TableCell>
                                        <TableCell>
                                            {getStatusBadge(payment.status)}
                                        </TableCell>
                                        <TableCell className="text-right font-mono text-xs text-muted-foreground">
                                            {payment.id.slice(0, 8)}...
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
