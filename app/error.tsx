"use client";

import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="space-y-4">
          <div className="mx-auto w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-10 h-10 text-destructive" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-foreground">
              Something went wrong
            </h1>
            <p className="text-muted-foreground">
              We encountered an unexpected error. Please try again or return to
              the home page.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <Button onClick={reset} className="w-full">
            <RefreshCw className="w-4 h-4" />
            Try again
          </Button>

          <Button variant="outline" className="w-full" asChild>
            <Link href="/">
              <Home className="w-4 h-4" />
              Return home
            </Link>
          </Button>
        </div>

        {process.env.NODE_ENV === "development" && (
          <details className="mt-8 text-left">
            <summary className="cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground">
              Error details (development only)
            </summary>
            <div className="mt-2 p-4 bg-muted rounded-md text-xs font-mono break-all">
              <p className="text-destructive font-medium">{error.name}</p>
              <p className="mt-1">{error.message}</p>
              {error.digest && (
                <p className="mt-2 text-muted-foreground">
                  Error ID: {error.digest}
                </p>
              )}
            </div>
          </details>
        )}
      </div>
    </div>
  );
}
