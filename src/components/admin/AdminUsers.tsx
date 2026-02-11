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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Search, Loader2, Pencil } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface UserWithWallet {
    id: string;
    email: string | null;
    full_name: string | null;
    created_at: string;
    plan_type: string;
    balance: number;
}

export function AdminUsers() {
    const [users, setUsers] = useState<UserWithWallet[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    // Edit Dialog State
    const [editingUser, setEditingUser] = useState<UserWithWallet | null>(null);
    const [editPlan, setEditPlan] = useState("");
    const [editBalance, setEditBalance] = useState("0");
    const [updating, setUpdating] = useState(false);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            // 1. Fetch Profiles
            const { data: profiles, error: profilesError } = await supabase
                .from("profiles")
                .select("*")
                .order("created_at", { ascending: false });

            if (profilesError) throw profilesError;

            // 2. Fetch Wallets (map by user_id)
            const { data: wallets, error: walletsError } = await supabase
                .from("wallets")
                .select("*");

            if (walletsError) throw walletsError;

            const walletMap = new Map(wallets?.map(w => [w.user_id, w]));

            // 3. Merge
            const combined = profiles?.map(p => {
                const w = walletMap.get(p.id);
                return {
                    id: p.id,
                    email: "—",
                    full_name: p.full_name || "Anonymous",
                    created_at: p.created_at,
                    plan_type: w?.plan_type || "free",
                    balance: w?.balance || 0
                };
            }) || [];

            setUsers(combined);
        } catch (error) {
            console.error("Error fetching users:", error);
            toast.error("Failed to fetch users");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleEditClick = (user: UserWithWallet) => {
        setEditingUser(user);
        setEditPlan(user.plan_type);
        setEditBalance(user.balance.toString());
    };

    const handleUpdateUser = async () => {
        if (!editingUser) return;
        setUpdating(true);

        try {
            const { data, error } = await supabase.functions.invoke('admin-actions', {
                body: {
                    action: 'update-plan',
                    payload: {
                        userId: editingUser.id,
                        planType: editPlan,
                        balance: parseInt(editBalance) || 0
                    }
                }
            });

            if (error) throw error;
            if (data && data.success === false) throw new Error(data.error || 'Operation failed');

            toast.success("User updated successfully");
            setEditingUser(null);
            fetchUsers(); // Refresh list
        } catch (error: any) {
            console.error("Error updating user:", error);
            toast.error(`Failed to update user: ${error.message || error.error || 'Unknown error'}`);
        } finally {
            setUpdating(false);
        }
    };

    const filteredUsers = users.filter(user =>
        user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.plan_type.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            <Card className="border-0 shadow-soft">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>User Management</CardTitle>
                            <CardDescription>View user plans and credits</CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="search"
                                    placeholder="Search users..."
                                    className="pl-9 w-[200px]"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <Button variant="outline" size="sm" onClick={fetchUsers}>
                                Refresh
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="rounded-lg border border-border/50 overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/30">
                                    <TableHead>User</TableHead>
                                    <TableHead>Plan</TableHead>
                                    <TableHead>Credits</TableHead>
                                    <TableHead>Joined</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    Array(5).fill(0).map((_, i) => (
                                        <TableRow key={i}>
                                            <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                                            <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                                            <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                                            <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                            <TableCell><Skeleton className="h-4 w-10 ml-auto" /></TableCell>
                                        </TableRow>
                                    ))
                                ) : filteredUsers.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                                            No users found matching "{searchTerm}"
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredUsers.map((user) => (
                                        <TableRow key={user.id} className="hover:bg-muted/30">
                                            <TableCell>
                                                <div className="font-medium">{user.full_name}</div>
                                                <div className="text-xs text-muted-foreground truncate max-w-[150px]">{user.id}</div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={user.plan_type === 'free' ? 'secondary' : 'default'} className="uppercase">
                                                    {user.plan_type.replace('-', ' ')}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="font-mono">{user.balance}</div>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {new Date(user.created_at).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="sm" onClick={() => handleEditClick(user)}>
                                                    <Pencil className="h-4 w-4 mr-1" />
                                                    Manage
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {/* Edit User Dialog */}
            <Dialog open={!!editingUser} onOpenChange={(open) => !open && setEditingUser(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Manage User</DialogTitle>
                        <DialogDescription>
                            Update plan and credits for <span className="font-medium">{editingUser?.full_name}</span>
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="plan" className="text-right">
                                Plan
                            </Label>
                            <Select value={editPlan} onValueChange={setEditPlan}>
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Select plan" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="free">Free</SelectItem>
                                    <SelectItem value="love-spark">Love Spark (5 credits)</SelectItem>
                                    <SelectItem value="romantic-date">Romantic Date (20 credits)</SelectItem>
                                    <SelectItem value="true-love">True Love (50 credits)</SelectItem>
                                    <SelectItem value="forever-valentine">Forever Valentine (Unlimited/High)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="credits" className="text-right">
                                Credits
                            </Label>
                            <Input
                                id="credits"
                                type="number"
                                value={editBalance}
                                onChange={(e) => setEditBalance(e.target.value)}
                                className="col-span-3"
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditingUser(null)} disabled={updating}>Cancel</Button>
                        <Button onClick={handleUpdateUser} disabled={updating}>
                            {updating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
