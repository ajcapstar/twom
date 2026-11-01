import { createClient } from "@supabase/supabase-js";

// This client uses the Service Role Key, bypassing RLS.
// NEVER import this file into a Client Component (file with "use client").
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

