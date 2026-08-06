import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAF8] px-4">
      <div className="text-center max-w-md">
        <p className="text-6xl mb-4">🧘</p>
        <h1 className="text-2xl font-semibold text-[#2D2D2D] mb-2">
          Page not found
        </h1>
        <p className="text-gray-500 mb-6">
          This page doesn&apos;t exist. Maybe it&apos;s in another downward dog
          position?
        </p>
        <div className="flex gap-3 justify-center">
          <Link href="/">
            <Button className="bg-[#7C9082] hover:bg-[#6B7D71]">Go Home</Button>
          </Link>
          <Link href="/search">
            <Button variant="outline">Find Classes</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
