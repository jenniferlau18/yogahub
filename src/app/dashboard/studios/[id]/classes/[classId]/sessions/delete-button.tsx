"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

export function DeleteSessionButton({ sessionId }: { sessionId: number }) {
  const router = useRouter();

  async function handleCancel() {
    if (!confirm("Cancel this session? Existing bookings will remain but no new bookings will be accepted.")) return;

    const supabase = createClient();
    await supabase
      .from("class_sessions")
      .update({ status: "cancelled" })
      .eq("id", sessionId);

    router.refresh();
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className="text-red-500 hover:bg-red-50"
      onClick={handleCancel}
    >
      Cancel
    </Button>
  );
}
