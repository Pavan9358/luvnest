import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

export default function AuthCallback() {
    const navigate = useNavigate();

    useEffect(() => {
        // The supabase client automatically handles the hash parsing 
        // when it initializes. We just need to wait for the session.

        const checkSession = async () => {
            try {
                const { data: { session }, error } = await supabase.auth.getSession();

                if (error) {
                    console.error("Auth callback error:", error);
                    navigate("/login?error=auth_callback_failed");
                    return;
                }

                if (session) {
                    console.log("Session found, redirecting to dashboard");
                    navigate("/dashboard");
                } else {
                    // Give it a moment, sometimes the session isn't immediately available
                    // after the code exchange
                    const { data: { session: newSession } } = await supabase.auth.getSession();
                    if (newSession) {
                        navigate("/dashboard");
                    } else {
                        console.warn("No session found after callback");
                        navigate("/login");
                    }
                }
            } catch (e) {
                console.error("Unexpected error in auth callback:", e);
                navigate("/login?error=unexpected");
            }
        };

        checkSession();
    }, [navigate]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background">
            <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
            <h2 className="text-xl font-semibold text-foreground">Verifying secure login...</h2>
            <p className="text-muted-foreground mt-2">Please wait while we log you in.</p>
        </div>
    );
}
