import { Skeleton } from "@/components/ui/skeleton";

export default function ClassLoading() {
  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <div className="h-14 border-b" />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Skeleton className="h-4 w-32 mb-6" />
        <div className="bg-white rounded-xl p-6 space-y-6">
          <div className="flex justify-between">
            <div className="space-y-2">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-4 w-40" />
            </div>
            <Skeleton className="h-6 w-24 rounded-full" />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-20 rounded-lg" />
            ))}
          </div>
          <Skeleton className="h-24 w-full" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-40" />
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
