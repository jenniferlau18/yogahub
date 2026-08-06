"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Studio = {
  id: number;
  name: string;
  description: string;
  address: string;
  city: string;
  phone: string;
  website: string;
};

export function EditStudioForm({ studio }: { studio: Studio }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    const form = e.currentTarget;
    const formData = new FormData(form);

    const supabase = createClient();
    const { error } = await supabase
      .from("studios")
      .update({
        name: formData.get("name") as string,
        description: formData.get("description") as string,
        address: formData.get("address") as string,
        city: formData.get("city") as string,
        phone: formData.get("phone") as string,
        website: formData.get("website") as string,
        updated_at: new Date().toISOString(),
      })
      .eq("id", studio.id);

    if (error) {
      setMessage("❌ Failed to save. Try again.");
    } else {
      setMessage("✅ Studio updated!");
    }
    setSaving(false);
  }

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this studio? This cannot be undone.")) return;

    const supabase = createClient();
    await supabase.from("studios").delete().eq("id", studio.id);
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Studio Details</CardTitle>
        <CardDescription>Edit your studio information.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Studio Name *</Label>
            <Input id="name" name="name" defaultValue={studio.name} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={studio.description ?? ""}
              rows={4}
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City *</Label>
              <Input id="city" name="city" defaultValue={studio.city ?? ""} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input id="address" name="address" defaultValue={studio.address ?? ""} />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" name="phone" defaultValue={studio.phone ?? ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                name="website"
                type="url"
                defaultValue={studio.website ?? ""}
              />
            </div>
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

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={saving}
              className="bg-[#7C9082] hover:bg-[#6B7D71]"
            >
              {saving ? "Saving..." : "Save Changes"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => router.push("/dashboard")}
            >
              Cancel
            </Button>
            <div className="flex-1" />
            <Button
              type="button"
              variant="outline"
              className="text-red-500 border-red-200 hover:bg-red-50"
              onClick={handleDelete}
            >
              Delete Studio
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
