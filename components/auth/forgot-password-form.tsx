"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">No Password Reset Needed</CardTitle>
          <CardDescription>Authentication is disabled.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button asChild className="w-full">
            <Link href="/protected">Go to Dashboard</Link>
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            <Link href="/protected" className="underline underline-offset-4">
              Open Dashboard
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
