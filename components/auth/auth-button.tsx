"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/providers/AuthProvider";

export function AuthButton() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Button size="sm" disabled>
        Loading...
      </Button>
    );
  }

  return user ? (
    <div className="flex items-center gap-4">
      Hey, {user.email}!
      <Link href="/protected">
        <Button size="sm" variant={"default"}>
          Go to Dashboard
        </Button>
      </Link>
    </div>
  ) : (
    <div className="flex gap-2">
      <Button asChild size="sm" variant={"outline"}>
        <Link href="/auth/login">Sign in</Link>
      </Button>
      <Button asChild size="sm" variant={"default"}>
        <Link href="/auth/signup">Sign up</Link>
      </Button>
    </div>
  );
}
