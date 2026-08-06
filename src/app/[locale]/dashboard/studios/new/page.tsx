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

export default function NewStudioPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const form = e.currentTarget;
    const formData = new FormData(form);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("You must be logged in.");
      setSaving(false);
      return;
    }

    const { data: studio, error: insertError } = await supabase
      .from("studios")
      .insert({
        owner_id: user.id,
        name: formData.get("name") as string,
        description: formData.get("description") as string,
        address: formData.get("address") as string,
        city: formData.get("city") as string,
        phone: formData.get("phone") as string,
        website: formData.get("website") as string,
        amenities: [],
        photos: [],
      })
      .select()
      .single();

    if (insertError) {
      setError(insertError.message);
      setSaving(false);
      return;
    }

    router.push(`/dashboard/studios/${studio.id}/classes`);
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold text-[#2D2D2D] mb-2">
        List Your Studio
      </h1>
      <p className="text-gray-500 mb-8">
        Fill in the details below. You can add classes after creating your
        studio.
      </p>

      <Card>
        <CardHeader>
          <CardTitle>Studio Details</CardTitle>
          <CardDescription>
            Make your studio stand out — be specific about what you offer.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Studio Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Studio Name *</Label>
              <Input
                id="name"
                name="name"
                placeholder="e.g. Serenity Yoga Studio"
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Tell students what makes your studio special — the atmosphere, philosophy, what to expect..."
                rows={4}
              />
            </div>

            {/* City */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  name="city"
                  placeholder="e.g. Singapore"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  placeholder="Street address"
                />
              </div>
            </div>

            {/* Phone + Website */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  placeholder="+65 9123 4567"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  name="website"
                  type="url"
                  placeholder="https://yourstudio.com"
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <p className="text-sm text-red-500 bg-red-50 p-3 rounded-md">
                {error}
              </p>
            )}

            {/* Submit */}
            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={saving}
                className="bg-[#7C9082] hover:bg-[#6B7D71]"
              >
                {saving ? "Creating..." : "Create Studio & Add Classes →"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => router.push("/dashboard")}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
