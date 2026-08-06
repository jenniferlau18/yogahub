"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type YogaStyle = { id: number; name: string };

export function NewClassForm({
  studioId,
  styles,
}: {
  studioId: number;
  styles: YogaStyle[];
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [difficulty, setDifficulty] = useState("beginner");
  const [styleId, setStyleId] = useState<string>("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const form = e.currentTarget;
    const formData = new FormData(form);

    const supabase = createClient();

    const { error: insertError } = await supabase.from("classes").insert({
      studio_id: studioId,
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      instructor_name: formData.get("instructor_name") as string,
      style_id: styleId ? parseInt(styleId) : null,
      difficulty,
      capacity: parseInt(formData.get("capacity") as string) || 15,
      duration_minutes:
        parseInt(formData.get("duration_minutes") as string) || 60,
      price: parseFloat(formData.get("price") as string) || 0,
    });

    if (insertError) {
      setError(insertError.message);
      setSaving(false);
      return;
    }

    router.push(`/dashboard/studios/${studioId}/classes`);
    router.refresh();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Class Details</CardTitle>
        <CardDescription>
          Describe the class so students know what to expect.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Class Title *</Label>
            <Input
              id="title"
              name="title"
              placeholder="e.g. Morning Vinyasa Flow"
              required
            />
          </div>

          {/* Style + Difficulty */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Yoga Style</Label>
              <Select value={styleId} onValueChange={(val) => setStyleId(val || "")}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a style" />
                </SelectTrigger>
                <SelectContent>
                  {styles.map((s) => (
                    <SelectItem key={s.id} value={String(s.id)}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Difficulty</Label>
              <Select value={difficulty} onValueChange={(val) => setDifficulty(val || "beginner")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">🌱 Beginner</SelectItem>
                  <SelectItem value="intermediate">🌿 Intermediate</SelectItem>
                  <SelectItem value="advanced">🌳 Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Instructor */}
          <div className="space-y-2">
            <Label htmlFor="instructor_name">Instructor Name</Label>
            <Input
              id="instructor_name"
              name="instructor_name"
              placeholder="e.g. Sarah Chen"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Describe the class — what students will learn, the pace, any prerequisites..."
              rows={3}
            />
          </div>

          {/* Duration, Capacity, Price */}
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration_minutes">Duration (minutes)</Label>
              <Input
                id="duration_minutes"
                name="duration_minutes"
                type="number"
                min={15}
                defaultValue={60}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="capacity">Capacity</Label>
              <Input
                id="capacity"
                name="capacity"
                type="number"
                min={1}
                defaultValue={15}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price ($)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                min={0}
                step="0.01"
                defaultValue={0}
                placeholder="0 = Free"
              />
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-500 bg-red-50 p-3 rounded-md">
              {error}
            </p>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={saving}
              className="bg-[#7C9082] hover:bg-[#6B7D71]"
            >
              {saving ? "Creating..." : "Create Class"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
