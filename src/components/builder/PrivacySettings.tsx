import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  Settings, 
  Globe, 
  Lock, 
  Clock, 
  Calendar, 
  Eye,
  EyeOff,
  Copy,
  ExternalLink,
  Loader2
} from "lucide-react";

interface PrivacySettingsProps {
  pageId: string;
  slug: string;
  isPublished: boolean;
  privacyMode: string;
  unlockAt?: string | null;
  expiresAt?: string | null;
  onUpdate: (updates: Record<string, unknown>) => void;
}

export function PrivacySettings({
  pageId,
  slug,
  isPublished,
  privacyMode,
  unlockAt,
  expiresAt,
  onUpdate,
}: PrivacySettingsProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [localPrivacyMode, setLocalPrivacyMode] = useState(privacyMode);
  const [localUnlockAt, setLocalUnlockAt] = useState(unlockAt || "");
  const [localExpiresAt, setLocalExpiresAt] = useState(expiresAt || "");
  const [localIsPublished, setLocalIsPublished] = useState(isPublished);

  const pageUrl = `${window.location.origin}/love/${slug}`;

  useEffect(() => {
    setLocalPrivacyMode(privacyMode);
    setLocalUnlockAt(unlockAt || "");
    setLocalExpiresAt(expiresAt || "");
    setLocalIsPublished(isPublished);
  }, [privacyMode, unlockAt, expiresAt, isPublished]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const updates: Record<string, unknown> = {
        privacy_mode: localPrivacyMode,
        is_published: localIsPublished,
        unlock_at: localPrivacyMode === "time-locked" ? localUnlockAt : null,
        expires_at: localExpiresAt || null,
      };

      // Update the page
      const { error } = await supabase
        .from("love_pages")
        .update(updates)
        .eq("id", pageId);

      if (error) throw error;

      // Set password if provided and mode is password
      if (localPrivacyMode === "password" && password) {
        const { error: pwError } = await supabase.functions.invoke("set-page-password", {
          body: { pageId, password },
        });

        if (pwError) throw pwError;
        setPassword("");
      }

      onUpdate(updates);
      toast.success("Settings saved!");
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Failed to save settings");
    } finally {
      setLoading(false);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(pageUrl);
    toast.success("Link copied to clipboard!");
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings className="h-4 w-4 mr-2" />
          Settings
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[340px] sm:w-[450px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Page Settings
          </SheetTitle>
          <SheetDescription>
            Configure privacy, visibility, and sharing options
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 py-6">
          {/* Publish Toggle */}
          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
            <div className="flex items-center gap-3">
              {localIsPublished ? (
                <Eye className="w-5 h-5 text-green-600" />
              ) : (
                <EyeOff className="w-5 h-5 text-muted-foreground" />
              )}
              <div>
                <Label className="text-base font-medium">
                  {localIsPublished ? "Published" : "Draft"}
                </Label>
                <p className="text-sm text-muted-foreground">
                  {localIsPublished 
                    ? "Your page is visible to visitors" 
                    : "Only you can see this page"}
                </p>
              </div>
            </div>
            <Switch
              checked={localIsPublished}
              onCheckedChange={setLocalIsPublished}
            />
          </div>

          {/* Page URL */}
          {localIsPublished && (
            <div className="space-y-2">
              <Label>Page Link</Label>
              <div className="flex gap-2">
                <Input value={pageUrl} readOnly className="text-sm" />
                <Button variant="outline" size="icon" onClick={copyLink}>
                  <Copy className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" asChild>
                  <a href={pageUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>
          )}

          {/* Privacy Mode */}
          <div className="space-y-3">
            <Label>Privacy Mode</Label>
            <Select value={localPrivacyMode} onValueChange={setLocalPrivacyMode}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    <span>Public - Anyone with link</span>
                  </div>
                </SelectItem>
                <SelectItem value="password">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    <span>Password Protected</span>
                  </div>
                </SelectItem>
                <SelectItem value="time-locked">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>Time-Locked Reveal</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Password input */}
          {localPrivacyMode === "password" && (
            <div className="space-y-2">
              <Label>Set Password</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter a password..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Leave empty to keep existing password
              </p>
            </div>
          )}

          {/* Time-lock date */}
          {localPrivacyMode === "time-locked" && (
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Unlock Date & Time
              </Label>
              <Input
                type="datetime-local"
                value={localUnlockAt?.slice(0, 16) || ""}
                onChange={(e) => setLocalUnlockAt(e.target.value ? new Date(e.target.value).toISOString() : "")}
              />
              <p className="text-xs text-muted-foreground">
                Page will be hidden until this date
              </p>
            </div>
          )}

          {/* Expiry date */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Expiry Date (Optional)
            </Label>
            <Input
              type="datetime-local"
              value={localExpiresAt?.slice(0, 16) || ""}
              onChange={(e) => setLocalExpiresAt(e.target.value ? new Date(e.target.value).toISOString() : "")}
            />
            <p className="text-xs text-muted-foreground">
              Page will become unavailable after this date
            </p>
          </div>
        </div>

        {/* Save button */}
        <div className="pt-4 border-t">
          <Button 
            className="w-full btn-romantic text-white" 
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Settings"
            )}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
