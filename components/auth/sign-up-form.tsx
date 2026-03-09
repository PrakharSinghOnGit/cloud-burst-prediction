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

export function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Sign Up</CardTitle>
          <CardDescription>No authentication required.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button asChild className="w-full">
            <Link href="/protected">Go to Dashboard</Link>
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Already have access?{" "}
            <Link href="/protected" className="underline underline-offset-4">
              Open Dashboard
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
