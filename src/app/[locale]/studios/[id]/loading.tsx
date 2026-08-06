import { Skeleton } from "@/components/ui/skeleton";

export default function StudioLoading() {
  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <div className="h-14 border-b" />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Skeleton className="h-4 w-32 mb-4" />
        <Skeleton className="h-10 w-72 mb-4" />
        <Skeleton className="h-4 w-48 mb-8" />
        <Skeleton className="h-32 w-full rounded-xl mb-8" />
        <Skeleton className="h-8 w-40 mb-4" />
        <div className="grid sm:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
