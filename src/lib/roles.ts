import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

/** Indica si la usuaria actual tiene el rol de administradora. */
export function useIsAdmin() {
  const { user, loading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let alive = true;
    if (loading) return;
    if (!user) {
      setIsAdmin(false);
      setChecking(false);
      return;
    }
    setChecking(true);
    void supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle()
      .then(({ data }) => {
        if (!alive) return;
        setIsAdmin(Boolean(data));
        setChecking(false);
      });
    return () => {
      alive = false;
    };
  }, [user, loading]);

  return { isAdmin, checking: checking || loading };
}
