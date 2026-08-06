"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Page error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAF8] px-4">
      <div className="text-center max-w-md">
        <p className="text-5xl mb-4">😅</p>
        <h1 className="text-xl font-semibold text-[#2D2D2D] mb-2">
          Something went wrong
        </h1>
        <p className="text-gray-500 mb-6">
          Don&apos;t worry — this happens sometimes. Give it another try.
        </p>
        <Button onClick={reset} className="bg-[#7C9082] hover:bg-[#6B7D71]">
          Try Again
        </Button>
      </div>
    </div>
  );
}
