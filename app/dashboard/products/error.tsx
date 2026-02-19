"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // You can hook logging here if needed.
    // console.error(error);
  }, [error]);

  return (
    <div className="p-4 sm:p-6">
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>რაღაც შეცდომა მოხდა</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            პროდუქტების გვერდმა შეცდომა გამოიწვია. გთხოვთ სცადოთ თავიდან.
          </p>

          <div className="flex flex-wrap gap-2">
            <Button onClick={reset}>სცადეთ თავიდან</Button>
            <Button
              variant="outline"
              onClick={() => {
                window.location.href = "/dashboard";
              }}
            >
              დეშბორდზე დაბრუნება
            </Button>
          </div>

          <details className="rounded-md border p-3">
            <summary className="cursor-pointer text-sm font-medium">
              შეცდომის დეტალები
            </summary>
            <pre className="mt-2 max-h-64 overflow-auto whitespace-pre-wrap text-xs text-destructive">
              {error?.message}
              {error?.digest ? `\n\ndigest: ${error.digest}` : ""}
            </pre>
          </details>
        </CardContent>
      </Card>
    </div>
  );
}
