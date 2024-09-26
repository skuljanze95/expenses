"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div>
      <div className="grid place-content-center px-4 pt-24">
        <div className="text-center">
          <p className="text-4xl font-bold tracking-tight text-primary">
            Uh-oh!
          </p>

          <p className="mt-4">Something went wrong!</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Error: {error.message}
          </p>

          <Button className="mt-4" onClick={() => reset()}>
            Try again
          </Button>
        </div>
      </div>
    </div>
  );
}
