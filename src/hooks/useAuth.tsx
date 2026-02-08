import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("AuthProvider: mounting...");
    let mounted = true;

    // Safety timeout to prevent infinite loading
    const timer = setTimeout(() => {
      if (mounted && loading) {
        console.warn("AuthProvider: timed out waiting for session");
        setLoading(false);
      }
    }, 5000);

    // Set up auth state listener BEFORE getting session
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        console.log("AuthProvider: auth state change", event);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (!mounted) return;
      if (error) console.error("AuthProvider: getSession error", error);
      console.log("AuthProvider: session retrieved", !!session);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      clearTimeout(timer);
    }).catch(err => {
      console.error("AuthProvider: unexpected error", err);
      if (mounted) setLoading(false);
    });

    return () => {
      mounted = false;
      clearTimeout(timer);
      subscription.unsubscribe();
    };
  }, [loading]);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
