"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

export function ClassActions({
  studioId,
  classId,
}: {
  studioId: string;
  classId: number;
}) {
  const router = useRouter();

  async function handleDelete() {
    if (!confirm("Delete this class? All sessions and bookings will also be removed.")) return;

    const supabase = createClient();
    await supabase.from("classes").delete().eq("id", classId);
    router.refresh();
  }

  return (
    <div className="flex gap-1">
      <Link href={`/dashboard/studios/${studioId}/classes/${classId}/sessions`}>
        <Button variant="ghost" size="sm">
          📅 Sessions
        </Button>
      </Link>
      <Button
        variant="ghost"
        size="sm"
        className="text-red-500 hover:bg-red-50"
        onClick={handleDelete}
      >
        Delete
      </Button>
    </div>
  );
}
