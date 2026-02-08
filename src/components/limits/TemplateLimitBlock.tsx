import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { HeartIcon } from "@/components/ui/HeartIcon";
import { Lock, ArrowRight, Sparkles } from "lucide-react";

interface TemplateLimitBlockProps {
  type: "create" | "edit";
  planType?: string;
  templatesUsed?: number;
  maxTemplates?: number;
  editCount?: number;
  maxEdits?: number;
}

export function TemplateLimitBlock({
  type,
  planType = "free",
  templatesUsed = 0,
  maxTemplates = 0,
  editCount = 0,
  maxEdits = 3,
}: TemplateLimitBlockProps) {
  const getPlanDisplayName = (plan: string) => {
    switch (plan) {
      case "first-crush":
        return "First Crush";
      case "true-love":
        return "True Love";
      case "forever-valentine":
        return "Forever Valentine";
      default:
        return "Free";
    }
  };

  if (type === "create") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
        <Card className="max-w-md w-full border-0 shadow-romantic">
          <CardHeader className="text-center pb-4">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Lock className="h-10 w-10 text-primary" />
            </div>
            <CardTitle className="font-display text-2xl">Template Limit Reached</CardTitle>
            <CardDescription className="text-base mt-2">
              {planType === "free" ? (
                "You need a plan to create love pages. Upgrade to start creating!"
              ) : (
                <>
                  You've used all <strong>{maxTemplates}</strong> templates in your{" "}
                  <strong>{getPlanDisplayName(planType)}</strong> plan.
                </>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-secondary/50 rounded-lg p-4 text-center">
              <p className="text-sm text-muted-foreground">
                Templates used: <strong>{templatesUsed} / {maxTemplates}</strong>
              </p>
            </div>
            
            <div className="space-y-3">
              <Button asChild className="w-full btn-romantic text-white group">
                <Link to="/wallet">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Upgrade Your Plan
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button variant="outline" asChild className="w-full">
                <Link to="/dashboard">
                  Back to Dashboard
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <div className="mt-8 text-center">
          <HeartIcon size="lg" className="text-primary/30 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">
            Upgrade to create more beautiful love pages 💕
          </p>
        </div>
      </div>
    );
  }

  // Edit limit block
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <Card className="max-w-md w-full border-0 shadow-romantic">
        <CardHeader className="text-center pb-4">
          <div className="w-20 h-20 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto mb-4">
            <Lock className="h-10 w-10 text-amber-500" />
          </div>
          <CardTitle className="font-display text-2xl">Edit Limit Reached</CardTitle>
          <CardDescription className="text-base mt-2">
            This template has reached its maximum of <strong>{maxEdits} edits</strong>. 
            The content is now locked and cannot be modified.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-secondary/50 rounded-lg p-4 text-center">
            <p className="text-sm text-muted-foreground">
              Edits used: <strong>{editCount} / {maxEdits}</strong>
            </p>
          </div>
          
          <div className="space-y-3">
            <Button variant="outline" asChild className="w-full">
              <Link to="/dashboard">
                Back to Dashboard
              </Link>
            </Button>
          </div>
          
          <p className="text-xs text-center text-muted-foreground">
            Want to make changes? Create a new template instead.
          </p>
        </CardContent>
      </Card>
      
      <div className="mt-8 text-center">
        <HeartIcon size="lg" className="text-amber-500/30 mx-auto mb-2" />
        <p className="text-sm text-muted-foreground">
          Your love page is preserved forever 💕
        </p>
      </div>
    </div>
  );
}
