"use client";

import { useSupabase } from "@/components/providers/SupabaseProvider";
import { createClient } from "@/lib/supabase/client";
import { useQuery, useMutation } from "@tanstack/react-query";
import type { Database } from "@/util/database.types";

type Tables = Database["public"]["Tables"];

export const useProfile = (options?: { enabled?: boolean }) => {
  const supabase = useSupabase();

  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { data, error } = await supabase.from("users").select();
      if (error) throw error;
      return data as Tables["users"]["Row"][];
    },
    enabled: options?.enabled ?? true,
    staleTime: 60 * 1000,
  });
};

// Simple mutation hook for updating user profile (for sign-up form)
export const useUpdateUserProfile = () => {
  const supabase = createClient();
  return useMutation({
    mutationFn: async ({ name, phone }: { name: string; phone: string }) => {
      const { error } = await supabase
        .from("users")
        .update({ name: name, phone: phone });

      if (error) throw error;
    },
  });
};
