"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function CreateSessionForm({
  classId,
  studioId,
  defaultCapacity,
  defaultDuration,
}: {
  classId: number;
  studioId: string;
  defaultCapacity: number;
  defaultDuration: number;
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [showForm, setShowForm] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    const form = e.currentTarget;
    const formData = new FormData(form);

    const date = formData.get("date") as string;
    const time = formData.get("time") as string;
    const capacity = parseInt(formData.get("capacity") as string) || defaultCapacity;

    if (!date || !time) {
      setMessage("❌ Please provide both date and time.");
      setSaving(false);
      return;
    }

    const startTime = new Date(`${date}T${time}:00`);
    const endTime = new Date(
      startTime.getTime() + defaultDuration * 60 * 1000
    );

    const supabase = createClient();
    const { error } = await supabase.from("class_sessions").insert({
      class_id: classId,
      start_time: startTime.toISOString(),
      end_time: endTime.toISOString(),
      available_spots: capacity,
      status: "scheduled",
    });

    if (error) {
      setMessage("❌ " + error.message);
    } else {
      setMessage("✅ Session created!");
      setShowForm(false);
      router.refresh();
    }
    setSaving(false);
  }

  return (
    <div>
      {!showForm ? (
        <Button
          onClick={() => setShowForm(true)}
          className="bg-[#7C9082] hover:bg-[#6B7D71]"
        >
          ➕ Add Session
        </Button>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>New Session</CardTitle>
            <CardDescription>
              Schedule a date and time for this class.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date *</Label>
                  <Input id="date" name="date" type="date" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Start Time *</Label>
                  <Input id="time" name="time" type="time" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="capacity">Capacity (spots)</Label>
                <Input
                  id="capacity"
                  name="capacity"
                  type="number"
                  min={1}
                  defaultValue={defaultCapacity}
                />
              </div>

              {message && (
                <p
                  className={`text-sm p-3 rounded-md ${
                    message.startsWith("✅")
                      ? "text-green-600 bg-green-50"
                      : "text-red-500 bg-red-50"
                  }`}
                >
                  {message}
                </p>
              )}

              <div className="flex gap-2">
                <Button
                  type="submit"
                  disabled={saving}
                  className="bg-[#7C9082] hover:bg-[#6B7D71]"
                >
                  {saving ? "Creating..." : "Create Session"}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
