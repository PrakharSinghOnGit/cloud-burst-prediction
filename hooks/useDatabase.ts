"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import type { Database } from "@/util/database.types";

type Tables = Database["public"]["Tables"];

export const useProfile = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      return [
        {
          id: "local-user",
          name: "User",
          email: null,
          phone: null,
          created_at: new Date().toISOString(),
        },
      ] as Tables["users"]["Row"][];
    },
    enabled: options?.enabled ?? true,
    staleTime: 60 * 1000,
  });
};

// Simple mutation hook for updating user profile (for sign-up form)
export const useUpdateUserProfile = () => {
  return useMutation({
    mutationFn: async () => {
      return;
    },
  });
};
